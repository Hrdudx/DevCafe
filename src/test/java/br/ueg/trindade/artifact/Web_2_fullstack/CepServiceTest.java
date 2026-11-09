package br.ueg.trindade.artifact.Web_2_fullstack;

import br.ueg.trindade.artifact.Web_2_fullstack.dto.EnderecoCep;
import br.ueg.trindade.artifact.Web_2_fullstack.service.CepService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

// Teste unitário do consumo da API externa: o MockRestServiceServer finge ser a ViaCEP,
// então o teste roda sem internet e sempre com a mesma resposta.
class CepServiceTest {

    private MockRestServiceServer viaCep;
    private CepService cepService;

    @BeforeEach
    void preparar() {
        RestTemplate restTemplate = new RestTemplate();
        viaCep = MockRestServiceServer.bindTo(restTemplate).build();
        cepService = new CepService(restTemplate);
    }

    @Test
    void buscaOEnderecoNaViaCep() {
        viaCep.expect(requestTo("https://viacep.com.br/ws/74000000/json/"))
                .andRespond(withSuccess("""
                        {"cep":"74000-000","logradouro":"Rua 1","bairro":"Centro","localidade":"Goiânia","uf":"GO","ddd":"62"}
                        """, MediaType.APPLICATION_JSON));

        EnderecoCep endereco = cepService.buscar("74000-000");

        assertEquals("Goiânia", endereco.localidade());
        assertEquals("Rua 1, Centro - Goiânia/GO", endereco.getEnderecoFormatado());
        viaCep.verify();
    }

    @Test
    void cepComFormatoErradoNemChamaAViaCep() {
        ResponseStatusException erro = assertThrows(ResponseStatusException.class, () -> cepService.buscar("123"));
        assertEquals(HttpStatus.BAD_REQUEST, erro.getStatusCode());
        viaCep.verify();
    }

    @Test
    void cepQueNaoExisteRespondeNaoEncontrado() {
        viaCep.expect(requestTo("https://viacep.com.br/ws/99999999/json/"))
                .andRespond(withSuccess("{\"erro\": true}", MediaType.APPLICATION_JSON));

        ResponseStatusException erro = assertThrows(ResponseStatusException.class, () -> cepService.buscar("99999999"));
        assertEquals(HttpStatus.NOT_FOUND, erro.getStatusCode());
    }

    @Test
    void viaCepForaDoArRespondeServicoIndisponivel() {
        viaCep.expect(requestTo("https://viacep.com.br/ws/74000000/json/")).andRespond(withServerError());

        ResponseStatusException erro = assertThrows(ResponseStatusException.class, () -> cepService.buscar("74000000"));
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, erro.getStatusCode());
    }
}
