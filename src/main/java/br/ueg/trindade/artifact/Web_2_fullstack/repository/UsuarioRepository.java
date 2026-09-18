package br.ueg.trindade.artifact.Web_2_fullstack.repository;

import br.ueg.trindade.artifact.Web_2_fullstack.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

}