package br.ueg.trindade.artifact.Web_2_fullstack.service;

import br.ueg.trindade.artifact.Web_2_fullstack.dto.EnderecoCep;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

// N2 (extra) — consumo de API externa com RestTemplate: busca o endereço de um CEP na ViaCEP.
@Service
public class CepService {

    static final String URL_VIACEP = "https://viacep.com.br/ws/{cep}/json/";

    private final RestTemplate restTemplate;

    public CepService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public EnderecoCep buscar(String cep) {
        // Regra: aceita "74000-000" ou "74000000", mas precisa ter exatamente 8 números.
        String somenteNumeros = cep == null ? "" : cep.replaceAll("\\D", "");
        if (somenteNumeros.length() != 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O CEP deve ter 8 números");
        }

        EnderecoCep endereco;
        try {
            endereco = restTemplate.getForObject(URL_VIACEP, EnderecoCep.class, somenteNumeros);
        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Não foi possível consultar o CEP agora. Preencha o endereço manualmente");
        }

        if (endereco == null || Boolean.TRUE.equals(endereco.erro())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "CEP não encontrado");
        }
        return endereco;
    }
}
