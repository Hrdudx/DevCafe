package br.ueg.trindade.artifact.Web_2_fullstack.service;

import br.ueg.trindade.artifact.Web_2_fullstack.dto.NovoPedidoRequest;
import br.ueg.trindade.artifact.Web_2_fullstack.model.ItemPedido;
import br.ueg.trindade.artifact.Web_2_fullstack.model.Pedido;
import br.ueg.trindade.artifact.Web_2_fullstack.model.Produto;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.PedidoRepository;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.ProdutoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.Map;

@Service
public class PedidoService {

    private static final Set<String> STATUS_VALIDOS =
            Set.of("RECEBIDO", "EM_PREPARO", "PRONTO", "ENTREGUE", "CANCELADO");

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(PedidoRepository pedidoRepository, ProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
    }

    public Pedido criar(NovoPedidoRequest dados) {
        Map<Long, Integer> quantidadePorProdutoId = dados.getItens();
        if (quantidadePorProdutoId == null || quantidadePorProdutoId.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O pedido precisa ter ao menos um item");
        }

        Pedido pedido = new Pedido();
        pedido.setDataHora(LocalDateTime.now());
        pedido.setStatus("RECEBIDO");
        pedido.setCliente(dados.getCliente());
        pedido.setTelefone(dados.getTelefone());
        pedido.setEmail(dados.getEmail());
        pedido.setObservacoes(dados.getObservacoes());
        pedido.setFormaPagamento(dados.getFormaPagamento());

        double total = 0.0;
        for (Map.Entry<Long, Integer> entrada : quantidadePorProdutoId.entrySet()) {
            Produto produto = produtoRepository.findById(entrada.getKey())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
            Integer quantidade = entrada.getValue();
            if (quantidade == null || quantidade <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A quantidade de cada item deve ser maior que zero");
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
        if (!STATUS_VALIDOS.contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status de pedido inválido");
        }
        Pedido pedido = buscarPorId(id);
        pedido.setStatus(status);
        return pedidoRepository.save(pedido);
    }

    public void excluir(Long id) {
        buscarPorId(id);
        pedidoRepository.deleteById(id);
    }
}
