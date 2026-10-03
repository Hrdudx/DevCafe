package br.ueg.trindade.artifact.Web_2_fullstack.service;

import br.ueg.trindade.artifact.Web_2_fullstack.model.ItemPedido;
import br.ueg.trindade.artifact.Web_2_fullstack.model.Pedido;
import br.ueg.trindade.artifact.Web_2_fullstack.model.Produto;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.PedidoRepository;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.ProdutoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
    }

    public Pedido criar(Map<Long, Integer> quantidadePorProdutoId) {
        if (quantidadePorProdutoId == null || quantidadePorProdutoId.isEmpty()) {
            throw new RuntimeException("O pedido precisa ter ao menos um item");
        }

        Pedido pedido = new Pedido();
        pedido.setDataHora(LocalDateTime.now());
        pedido.setStatus("RECEBIDO");

        double total = 0.0;
        for (Map.Entry<Long, Integer> entrada : quantidadePorProdutoId.entrySet()) {
            Produto produto = produtoRepository.findById(entrada.getKey())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
            Integer quantidade = entrada.getValue();
            if (quantidade == null || quantidade <= 0) {
                throw new RuntimeException("A quantidade de cada item deve ser maior que zero");
            }

            ItemPedido item = new ItemPedido(produto, quantidade, produto.getPreco());
            item.setPedido(pedido);
            pedido.getItens().add(item);
            total += produto.getPreco() * quantidade;
        }

        pedido.setTotal(total);
        return pedidoRepository.save(pedido);
    }

    public Pedido atualizarStatus(Long id, String status) {
        Pedido pedido = buscarPorId(id);
        pedido.setStatus(status);
        return pedidoRepository.save(pedido);
    }

    public void excluir(Long id) {
        pedidoRepository.deleteById(id);
    }
}
