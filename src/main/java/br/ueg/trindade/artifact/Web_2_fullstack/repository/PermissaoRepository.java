package br.ueg.trindade.artifact.Web_2_fullstack.repository;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Permissao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {
}