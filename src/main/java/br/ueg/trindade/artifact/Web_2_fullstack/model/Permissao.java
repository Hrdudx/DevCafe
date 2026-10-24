package br.ueg.trindade.artifact.Web_2_fullstack.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Permissao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String descricao;

    // Lado inverso do relacionamento (quem manda é Usuario.permissoes).
    // @JsonIgnore tira este lado do JSON e evita a recursão infinita
    // (Usuario -> permissoes -> usuarios -> Usuario -> ...).
    // O slide usa @JsonManagedReference/@JsonBackReference, mas o Jackson não aceita
    // @JsonBackReference em coleção ao ler JSON: o POST/PUT de usuário dava erro 500.
    @ManyToMany(mappedBy = "permissoes")
    @JsonIgnore
    private Set<Usuario> usuarios = new HashSet<>();

    public Permissao() {
    }

    public Permissao(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Set<Usuario> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(Set<Usuario> usuarios) {
        this.usuarios = usuarios;
    }
}
