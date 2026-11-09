package br.ueg.trindade.artifact.Web_2_fullstack.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

// N2 — novo modelo: cliente da cafeteria.
// Relacionamento: 1 cliente → N avaliações (lado "um" do @OneToMany).
@Entity
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Informe o nome do cliente")
    @Size(max = 100, message = "O nome pode ter no máximo 100 caracteres")
    private String nome;

    @NotBlank(message = "Informe o e-mail do cliente")
    @Email(message = "Informe um e-mail válido")
    @Column(unique = true)
    private String email;

    @Size(max = 20, message = "O telefone pode ter no máximo 20 caracteres")
    private String telefone;

    // CEP com 8 números ("74000-000" ou "74000000"; o Service guarda só os números). Opcional; quando informado, o endereço pode ser
    // preenchido automaticamente pela API externa ViaCEP (ver CepService).
    @Pattern(regexp = "^$|^\\d{5}-?\\d{3}$", message = "Informe o CEP com 8 números (ex.: 74000-000)")
    private String cep;

    @Size(max = 200, message = "O endereço pode ter no máximo 200 caracteres")
    private String endereco;

    private LocalDate dataCadastro;

    // Lado inverso: quem guarda a chave estrangeira é a Avaliacao (coluna cliente_id).
    // @JsonIgnore evita o laço infinito Cliente → Avaliacao → Cliente no JSON.
    @JsonIgnore
    @OneToMany(mappedBy = "cliente")
    private List<Avaliacao> avaliacoes = new ArrayList<>();

    public Cliente() {
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public LocalDate getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDate dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public List<Avaliacao> getAvaliacoes() {
        return avaliacoes;
    }

    public void setAvaliacoes(List<Avaliacao> avaliacoes) {
        this.avaliacoes = avaliacoes;
    }
}
