package br.ueg.trindade.artifact.Web_2_fullstack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    // Cliente HTTP usado para consumir APIs externas (ViaCEP).
    // Com tempo limite, para a tela não ficar travada se a API externa demorar.
    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory fabrica = new SimpleClientHttpRequestFactory();
        fabrica.setConnectTimeout(5000);
        fabrica.setReadTimeout(5000);
        return new RestTemplate(fabrica);
    }
}
