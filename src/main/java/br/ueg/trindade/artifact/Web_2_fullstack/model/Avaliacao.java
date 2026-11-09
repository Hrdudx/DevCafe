package br.ueg.trindade.artifact.Web_2_fullstack.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

// N2 — novo modelo: avaliação que um cliente faz de um produto do cardápio.
// Relacionamentos: N avaliações → 1 cliente e N avaliações → 1 produto (@ManyToOne).
@Entity
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Informe a nota")
    @Min(value = 1, message = "A nota deve ser de 1 a 5")
    @Max(value = 5, message = "A nota deve ser de 1 a 5")
    private Integer nota;

    @Size(max = 500, message = "O comentário pode ter no máximo 500 caracteres")
    private String comentario;

    private LocalDateTime dataHora;

    // Lado dono do relacionamento: a tabela avaliacao tem a coluna cliente_id.
    @NotNull(message = "Escolha o cliente")
    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @NotNull(message = "Escolha o produto avaliado")
    @ManyToOne(optional = false)
    @JoinColumn(name = "produto_id")
    private Produto produto;

    public Avaliacao() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }
}
