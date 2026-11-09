package br.ueg.trindade.artifact.Web_2_fullstack;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultMatcher;

import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Testes de integração (JUnit + MockMvc): sobem a aplicação com banco em memória
// e chamam a API como o front-end faria, incluindo o token JWT.
@SpringBootTest
@AutoConfigureMockMvc
class ClienteAvaliacaoApiTest {

    @Autowired
    private MockMvc mvc;

    private final ObjectMapper json = new ObjectMapper();

    private String token;

    @BeforeEach
    void entrar() throws Exception {
        MvcResult resposta = mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@devcafe.com\",\"senha\":\"admin123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.usuario.senha").doesNotExist())
                .andReturn();
        token = "Bearer " + ler(resposta).get("token").asText();
    }

    @Test
    void semTokenAApiRespondeNaoAutorizado() throws Exception {
        mvc.perform(get("/api/clientes")).andExpect(status().isUnauthorized());
    }

    @Test
    void tokenInvalidoRespondeNaoAutorizado() throws Exception {
        mvc.perform(get("/api/clientes").header("Authorization", "Bearer token-falso"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void senhaErradaNaoEntra() throws Exception {
        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@devcafe.com\",\"senha\":\"errada\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void crudCompletoDeCliente() throws Exception {
        // cadastrar
        MvcResult criado = mvc.perform(post("/api/clientes").header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Cliente Teste\",\"email\":\"CRUD@Teste.com\",\"cep\":\"74000-000\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("crud@teste.com"))
                .andExpect(jsonPath("$.cep").value("74000000"))
                .andExpect(jsonPath("$.dataCadastro").isNotEmpty())
                .andReturn();
        long id = ler(criado).get("id").asLong();

        // listar e buscar por id
        mvc.perform(get("/api/clientes").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + id + ")].nome").value("Cliente Teste"));

        // editar
        mvc.perform(put("/api/clientes/" + id).header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Cliente Editado\",\"email\":\"crud@teste.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Cliente Editado"));

        // excluir
        mvc.perform(delete("/api/clientes/" + id).header("Authorization", token)).andExpect(status().isOk());
        mvc.perform(get("/api/clientes/" + id).header("Authorization", token)).andExpect(status().isNotFound());
    }

    @Test
    void beanValidationDevolveOErroDeCadaCampo() throws Exception {
        mvc.perform(post("/api/clientes").header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"\",\"email\":\"nao-e-email\",\"cep\":\"123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erros.nome").value("Informe o nome do cliente"))
                .andExpect(jsonPath("$.erros.email").value("Informe um e-mail válido"))
                .andExpect(jsonPath("$.erros.cep").exists());
    }

    @Test
    void naoAceitaDoisClientesComOMesmoEmail() throws Exception {
        mvc.perform(post("/api/clientes").header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Outro Felipe\",\"email\":\"FELIPE@exemplo.com\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void regrasDeNegocioDaAvaliacao() throws Exception {
        long clienteId = criarCliente("regras@teste.com");
        String avaliacao = "{\"nota\":%d,\"comentario\":\"%s\",\"cliente\":{\"id\":%d},\"produto\":{\"id\":1}}";

        // nota 1 ou 2 exige comentário
        mvc.perform(post("/api/avaliacoes").header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(avaliacao.formatted(2, "", clienteId)))
                .andExpect(status().isBadRequest())
                .andExpect(mensagemDeErro("notas 1 ou 2"));

        // nota fora de 1 a 5 (Bean Validation)
        mvc.perform(post("/api/avaliacoes").header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(avaliacao.formatted(9, "x", clienteId)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erros.nota").value("A nota deve ser de 1 a 5"));

        // avaliação válida
        MvcResult criada = mvc.perform(post("/api/avaliacoes").header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(avaliacao.formatted(5, "Muito bom", clienteId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cliente.id").value(clienteId))
                .andReturn();
        long avaliacaoId = ler(criada).get("id").asLong();

        // o mesmo cliente não avalia o mesmo produto duas vezes
        mvc.perform(post("/api/avaliacoes").header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(avaliacao.formatted(4, "De novo", clienteId)))
                .andExpect(status().isConflict());

        // relacionamento 1 → N: avaliações do cliente
        mvc.perform(get("/api/clientes/" + clienteId + "/avaliacoes").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        // cliente com avaliação não pode ser excluído
        mvc.perform(delete("/api/clientes/" + clienteId).header("Authorization", token))
                .andExpect(status().isConflict());

        // depois de excluir a avaliação, o cliente pode ser excluído
        mvc.perform(delete("/api/avaliacoes/" + avaliacaoId).header("Authorization", token)).andExpect(status().isOk());
        mvc.perform(delete("/api/clientes/" + clienteId).header("Authorization", token)).andExpect(status().isOk());
    }

    @Test
    void uploadDaFotoDoProduto() throws Exception {
        MockMultipartFile foto = new MockMultipartFile("arquivo", "foto.png", "image/png", new byte[]{1, 2, 3});
        mvc.perform(multipart("/api/produtos/1/imagem").file(foto).header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.imagemUrl", startsWith("http://localhost/uploads/produtos/produto-1-")));

        MockMultipartFile texto = new MockMultipartFile("arquivo", "nota.txt", "text/plain", "oi".getBytes());
        mvc.perform(multipart("/api/produtos/1/imagem").file(texto).header("Authorization", token))
                .andExpect(status().isBadRequest())
                .andExpect(mensagemDeErro("PNG, JPG"));
    }

    private long criarCliente(String email) throws Exception {
        MvcResult resposta = mvc.perform(post("/api/clientes").header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Teste\",\"email\":\"" + email + "\"}"))
                .andExpect(status().isOk())
                .andReturn();
        return ler(resposta).get("id").asLong();
    }

    // O MockMvc não monta o JSON de erro do Spring, então confere a mensagem da exceção lançada no Service.
    private ResultMatcher mensagemDeErro(String trecho) {
        return resultado -> {
            String mensagem = String.valueOf(resultado.getResolvedException().getMessage());
            if (!mensagem.contains(trecho)) {
                throw new AssertionError("Mensagem esperada com \"" + trecho + "\", mas veio: " + mensagem);
            }
        };
    }

    private JsonNode ler(MvcResult resposta) throws Exception {
        return json.readTree(resposta.getResponse().getContentAsString());
    }
}
