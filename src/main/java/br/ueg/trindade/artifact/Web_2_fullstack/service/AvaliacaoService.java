package br.ueg.trindade.artifact.Web_2_fullstack.service;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Avaliacao;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.AvaliacaoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final ClienteService clienteService;
    private final ProdutoService produtoService;

    public AvaliacaoService(AvaliacaoRepository avaliacaoRepository, ClienteService clienteService,
                            ProdutoService produtoService) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.clienteService = clienteService;
        this.produtoService = produtoService;
    }

    public List<Avaliacao> listarTodas() {
        return avaliacaoRepository.findAllByOrderByDataHoraDesc();
    }

    public List<Avaliacao> listarPorCliente(Long clienteId) {
        clienteService.buscarPorId(clienteId);
        return avaliacaoRepository.findByClienteIdOrderByDataHoraDesc(clienteId);
    }

    public Avaliacao buscarPorId(Long id) {
        return avaliacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Avaliação não encontrada"));
    }

    public Avaliacao criar(Avaliacao avaliacao) {
        Long clienteId = idObrigatorio(avaliacao.getCliente().getId(), "Escolha o cliente");
        Long produtoId = idObrigatorio(avaliacao.getProduto().getId(), "Escolha o produto avaliado");
        // Regra: cada cliente avalia um mesmo produto uma única vez (depois, só edita).
        if (avaliacaoRepository.existsByClienteIdAndProdutoId(clienteId, produtoId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Este cliente já avaliou esse produto. Edite a avaliação existente");
        }
        preencher(avaliacao, avaliacao);
        avaliacao.setDataHora(LocalDateTime.now());
        return avaliacaoRepository.save(avaliacao);
    }

    public Avaliacao atualizar(Long id, Avaliacao avaliacaoAtualizada) {
        Avaliacao avaliacao = buscarPorId(id);
        Long clienteId = idObrigatorio(avaliacaoAtualizada.getCliente().getId(), "Escolha o cliente");
        Long produtoId = idObrigatorio(avaliacaoAtualizada.getProduto().getId(), "Escolha o produto avaliado");
        if (avaliacaoRepository.existsByClienteIdAndProdutoIdAndIdNot(clienteId, produtoId, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Este cliente já avaliou esse produto. Edite a avaliação existente");
        }
        preencher(avaliacao, avaliacaoAtualizada);
        return avaliacaoRepository.save(avaliacao);
    }

    public void excluir(Long id) {
        buscarPorId(id);
        avaliacaoRepository.deleteById(id);
    }

    // Copia os dados enviados para a entidade, buscando cliente e produto de verdade no banco.
    private void preencher(Avaliacao destino, Avaliacao dados) {
        String comentario = dados.getComentario() == null ? "" : dados.getComentario().trim();
        // Regra: nota baixa (1 ou 2) precisa de comentário, para a cafeteria saber o que melhorar.
        if (dados.getNota() <= 2 && comentario.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Para notas 1 ou 2, conte no comentário o que não agradou");
        }
        destino.setNota(dados.getNota());
        destino.setComentario(comentario);
        destino.setCliente(clienteService.buscarPorId(dados.getCliente().getId()));
        destino.setProduto(produtoService.buscarPorId(dados.getProduto().getId()));
    }

    private Long idObrigatorio(Long id, String mensagem) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, mensagem);
        }
        return id;
    }
}
