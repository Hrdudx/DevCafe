package br.ueg.trindade.artifact.Web_2_fullstack.repository;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    List<Avaliacao> findAllByOrderByDataHoraDesc();

    List<Avaliacao> findByClienteIdOrderByDataHoraDesc(Long clienteId);

    long countByClienteId(Long clienteId);

    boolean existsByProdutoId(Long produtoId);

    boolean existsByClienteIdAndProdutoIdAndIdNot(Long clienteId, Long produtoId, Long id);

    boolean existsByClienteIdAndProdutoId(Long clienteId, Long produtoId);
}
