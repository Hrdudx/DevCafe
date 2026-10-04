package br.ueg.trindade.artifact.Web_2_fullstack.controller;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Produto;
import br.ueg.trindade.artifact.Web_2_fullstack.service.ProdutoService;

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
@CrossOrigin(origins = "http://localhost:5173")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping("/produtos")
    public List<Produto> getProdutos() {
        return produtoService.listarTodos();
    }

    @GetMapping("/produtos/{id}")
    public Produto getProdutoById(@PathVariable Long id) {
        return produtoService.buscarPorId(id);
    }

    @PostMapping("/produtos")
    public Produto createProduto(@RequestBody Produto produto) {
        return produtoService.criar(produto);
    }

    @PutMapping("/produtos/{id}")
    public Produto updateProduto(@PathVariable Long id, @RequestBody Produto produtoAtualizado) {
        return produtoService.atualizar(id, produtoAtualizado);
    }

    @DeleteMapping("/produtos/{id}")
    public void deleteProduto(@PathVariable Long id) {
        produtoService.excluir(id);
    }
}
