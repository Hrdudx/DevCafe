package br.ueg.trindade.artifact.Web_2_fullstack.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// Resposta da API externa ViaCEP (https://viacep.com.br/ws/{cep}/json/).
// Só os campos usados no sistema; os outros que a ViaCEP manda são ignorados.
// "erro" vem true quando o CEP tem formato válido mas não existe.
@JsonIgnoreProperties(ignoreUnknown = true)
public record EnderecoCep(String cep, String logradouro, String bairro, String localidade, String uf, Boolean erro) {

    // Endereço pronto para o campo do formulário: "Rua X, Bairro Y - Cidade/UF".
    public String getEnderecoFormatado() {
        StringBuilder texto = new StringBuilder();
        if (logradouro != null && !logradouro.isBlank()) texto.append(logradouro).append(", ");
        if (bairro != null && !bairro.isBlank()) texto.append(bairro).append(" - ");
        texto.append(localidade).append("/").append(uf);
        return texto.toString();
    }
}
