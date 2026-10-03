import { useEffect, useState } from "react";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import type { Permissao } from "../types/Permissao";
import type { Produto } from "../types/Produto";
import type { Pedido } from "../types/Pedido";

function ehHoje(dataHora: string) {
    const data = new Date(dataHora);
    const hoje = new Date();
    return data.toDateString() === hoje.toDateString();
}

function InicioPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [permissoes, setPermissoes] = useState<Permissao[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        api.get<Usuario[]>("/usuarios").then((resposta) => setUsuarios(resposta.data)).catch(() => {});
        api.get<Permissao[]>("/permissoes").then((resposta) => setPermissoes(resposta.data)).catch(() => {});
        api.get<Produto[]>("/produtos").then((resposta) => setProdutos(resposta.data)).catch(() => {});
        api.get<Pedido[]>("/pedidos").then((resposta) => setPedidos(resposta.data)).catch(() => {});
    }, []);

    const pedidosHoje = pedidos.filter((pedido) => ehHoje(pedido.dataHora));
    const faturamentoHoje = pedidosHoje.reduce((soma, pedido) => soma + pedido.total, 0);

    return (
        <div>
            <h1 className="page-title">Olá! 👋</h1>
            <p className="page-subtitle">Bem-vindo ao painel do DevCafé.</p>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Pedidos hoje</span>
                    <span className="stat-value">{pedidosHoje.length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Faturamento hoje</span>
                    <span className="stat-value">R$ {faturamentoHoje.toFixed(2)}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Produtos no cardápio</span>
                    <span className="stat-value">{produtos.length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Usuários cadastrados</span>
                    <span className="stat-value">{usuarios.length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Permissões cadastradas</span>
                    <span className="stat-value">{permissoes.length}</span>
                </div>
            </div>

            <div className="panel">
                <h2 className="panel-title">Últimos pedidos</h2>
                {pedidos.length === 0 ? (
                    <p className="state-message">Nenhum pedido feito ainda.</p>
                ) : (
                    <ul className="list">
                        {pedidos.slice(-5).reverse().map((pedido) => (
                            <li className="list-item" key={pedido.id}>
                                <span className="list-item-info">
                                    <strong>Pedido #{pedido.id}</strong> — {pedido.itens.length} item(ns)
                                </span>
                                <span className="menu-card-price">R$ {pedido.total.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="panel">
                <h2 className="panel-title">Produtos recentes</h2>
                {produtos.length === 0 ? (
                    <p className="state-message">Nenhum produto cadastrado ainda.</p>
                ) : (
                    <ul className="list">
                        {produtos.slice(-5).reverse().map((produto) => (
                            <li className="list-item" key={produto.id}>
                                <span className="list-item-info">
                                    <strong>{produto.nome}</strong> — {produto.descricao}
                                </span>
                                <span className="menu-card-price">R$ {produto.preco.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default InicioPage;
