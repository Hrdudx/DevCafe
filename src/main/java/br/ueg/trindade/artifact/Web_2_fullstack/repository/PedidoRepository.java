package br.ueg.trindade.artifact.Web_2_fullstack.repository;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}
