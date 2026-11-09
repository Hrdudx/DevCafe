package br.ueg.trindade.artifact.Web_2_fullstack.controller;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Avaliacao;
import br.ueg.trindade.artifact.Web_2_fullstack.service.AvaliacaoService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
@CrossOrigin(originPatterns = "http://localhost:*")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    @GetMapping
    public List<Avaliacao> getAvaliacoes() {
        return avaliacaoService.listarTodas();
    }

    @GetMapping("/{id}")
    public Avaliacao getAvaliacaoById(@PathVariable Long id) {
        return avaliacaoService.buscarPorId(id);
    }

    @PostMapping
    public Avaliacao createAvaliacao(@Valid @RequestBody Avaliacao avaliacao) {
        return avaliacaoService.criar(avaliacao);
    }

    @PutMapping("/{id}")
    public Avaliacao updateAvaliacao(@PathVariable Long id, @Valid @RequestBody Avaliacao avaliacaoAtualizada) {
        return avaliacaoService.atualizar(id, avaliacaoAtualizada);
    }

    @DeleteMapping("/{id}")
    public void deleteAvaliacao(@PathVariable Long id) {
        avaliacaoService.excluir(id);
    }
}
