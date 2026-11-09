package br.ueg.trindade.artifact.Web_2_fullstack.controller;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Avaliacao;
import br.ueg.trindade.artifact.Web_2_fullstack.model.Cliente;
import br.ueg.trindade.artifact.Web_2_fullstack.service.AvaliacaoService;
import br.ueg.trindade.artifact.Web_2_fullstack.service.ClienteService;

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
@RequestMapping("/api/clientes")
@CrossOrigin(originPatterns = "http://localhost:*")
public class ClienteController {

    private final ClienteService clienteService;
    private final AvaliacaoService avaliacaoService;

    public ClienteController(ClienteService clienteService, AvaliacaoService avaliacaoService) {
        this.clienteService = clienteService;
        this.avaliacaoService = avaliacaoService;
    }

    @GetMapping
    public List<Cliente> getClientes() {
        return clienteService.listarTodos();
    }

    @GetMapping("/{id}")
    public Cliente getClienteById(@PathVariable Long id) {
        return clienteService.buscarPorId(id);
    }

    // Avaliações de um cliente (navega pelo relacionamento 1 → N).
    @GetMapping("/{id}/avaliacoes")
    public List<Avaliacao> getAvaliacoesDoCliente(@PathVariable Long id) {
        return avaliacaoService.listarPorCliente(id);
    }

    @PostMapping
    public Cliente createCliente(@Valid @RequestBody Cliente cliente) {
        return clienteService.criar(cliente);
    }

    @PutMapping("/{id}")
    public Cliente updateCliente(@PathVariable Long id, @Valid @RequestBody Cliente clienteAtualizado) {
        return clienteService.atualizar(id, clienteAtualizado);
    }

    @DeleteMapping("/{id}")
    public void deleteCliente(@PathVariable Long id) {
        clienteService.excluir(id);
    }
}
