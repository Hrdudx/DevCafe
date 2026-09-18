package br.ueg.trindade.artifact.Web_2_fullstack.repository;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
