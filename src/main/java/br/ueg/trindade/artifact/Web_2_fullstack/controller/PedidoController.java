package br.ueg.trindade.artifact.Web_2_fullstack.controller;

import br.ueg.trindade.artifact.Web_2_fullstack.dto.NovoPedidoRequest;
import br.ueg.trindade.artifact.Web_2_fullstack.model.Pedido;
import br.ueg.trindade.artifact.Web_2_fullstack.service.PedidoService;

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
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(originPatterns = "http://localhost:*")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping("/pedidos")
    public List<Pedido> getPedidos() {
        return pedidoService.listarTodos();
    }

    @GetMapping("/pedidos/{id}")
    public Pedido getPedidoById(@PathVariable Long id) {
        return pedidoService.buscarPorId(id);
    }

    @PostMapping("/pedidos")
    public Pedido createPedido(@RequestBody NovoPedidoRequest dados) {
        return pedidoService.criar(dados);
    }

    @PutMapping("/pedidos/{id}/status")
    public Pedido updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return pedidoService.atualizarStatus(id, body.get("status"));
    }

    @DeleteMapping("/pedidos/{id}")
    public void deletePedido(@PathVariable Long id) {
        pedidoService.excluir(id);
    }
}
