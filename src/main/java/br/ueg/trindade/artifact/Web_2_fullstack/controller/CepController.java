package br.ueg.trindade.artifact.Web_2_fullstack.controller;

import br.ueg.trindade.artifact.Web_2_fullstack.dto.EnderecoCep;
import br.ueg.trindade.artifact.Web_2_fullstack.service.CepService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cep")
@CrossOrigin(originPatterns = "http://localhost:*")
public class CepController {

    private final CepService cepService;

    public CepController(CepService cepService) {
        this.cepService = cepService;
    }

    // O front-end chama o nosso back-end, e o back-end chama a ViaCEP.
    @GetMapping("/{cep}")
    public EnderecoCep buscar(@PathVariable String cep) {
        return cepService.buscar(cep);
    }
}
