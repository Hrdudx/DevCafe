package br.ueg.trindade.artifact.Web_2_fullstack.repository;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Permissao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {

    Optional<Permissao> findByNome(String nome);

}