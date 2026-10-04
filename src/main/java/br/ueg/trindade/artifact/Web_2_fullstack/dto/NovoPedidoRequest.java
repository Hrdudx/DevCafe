package br.ueg.trindade.artifact.Web_2_fullstack.dto;

import java.util.Map;

// Dados enviados pelo front-end ao finalizar um pedido.
// "itens" relaciona o id de cada produto com a quantidade pedida.
public class NovoPedidoRequest {

    private Map<Long, Integer> itens;
    private String cliente;
    private String telefone;
    private String email;
    private String observacoes;
    private String formaPagamento;

    public Map<Long, Integer> getItens() {
        return itens;
    }

    public void setItens(Map<Long, Integer> itens) {
        this.itens = itens;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public String getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }
}
