package br.ueg.trindade.artifact.Web_2_fullstack.controller;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Permissao;
import br.ueg.trindade.artifact.Web_2_fullstack.service.PermissaoService;

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
@RequestMapping("/api")
@CrossOrigin(originPatterns = "http://localhost:*")
public class PermissaoController {

    private final PermissaoService permissaoService;

    public PermissaoController(PermissaoService permissaoService) {
        this.permissaoService = permissaoService;
    }

    @GetMapping("/permissoes")
    public List<Permissao> getAllPermissoes() {
        return permissaoService.listarTodos();
    }

    @GetMapping("/permissoes/{id}")
    public Permissao getPermissaoById(@PathVariable Long id) {
        return permissaoService.buscarPorId(id);
    }

    @PostMapping("/permissoes")
    public Permissao createPermissao(@RequestBody Permissao permissao) {
        return permissaoService.criar(permissao);
    }

    @PutMapping("/permissoes/{id}")
    public Permissao updatePermissao(@PathVariable Long id, @RequestBody Permissao permissaoAtualizada) {
        return permissaoService.atualizar(id, permissaoAtualizada);
    }

    @DeleteMapping("/permissoes/{id}")
    public void deletePermissao(@PathVariable Long id) {
        permissaoService.excluir(id);
    }
}
