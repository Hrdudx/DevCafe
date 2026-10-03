import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import type { Pedido } from "../types/Pedido";
import { obterUsuarioLogado } from "../services/auth";
import StatusBadge from "../components/StatusBadge";

function ehHoje(dataHora: string) {
    const data = new Date(dataHora);
    const hoje = new Date();
    return data.toDateString() === hoje.toDateString();
}

function InicioPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const usuario = obterUsuarioLogado();

    useEffect(() => {
        api.get<Pedido[]>("/pedidos").then((resposta) => setPedidos(resposta.data)).catch(() => {});
    }, []);

    const pedidosHoje = pedidos.filter((pedido) => ehHoje(pedido.dataHora));
    const faturamentoHoje = pedidosHoje.reduce((soma, pedido) => soma + pedido.total, 0);
    const itensVendidosHoje = pedidosHoje.reduce(
        (soma, pedido) => soma + pedido.itens.reduce((s, item) => s + item.quantidade, 0),
        0
    );
    const recentes = pedidos.slice(-6).reverse();

    return (
        <div>
            <h1 className="page-title">Olá, {usuario}!</h1>
            <p className="page-subtitle">Que tal um café hoje? ☕</p>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-icon">🛒</span>
                    <span className="stat-label">Pedidos hoje</span>
                    <span className="stat-value">{pedidosHoje.length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">💰</span>
                    <span className="stat-label">Faturamento hoje</span>
                    <span className="stat-value">R$ {faturamentoHoje.toFixed(2)}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">☕</span>
                    <span className="stat-label">Itens vendidos hoje</span>
                    <span className="stat-value">{itensVendidosHoje}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">📦</span>
                    <span className="stat-label">Pedidos no total</span>
                    <span className="stat-value">{pedidos.length}</span>
                </div>
            </div>

            <div className="panel">
                <div className="panel-header-row">
                    <h2 className="panel-title">Pedidos recentes</h2>
                    <Link className="login-link" to="/pedidos">Ver todos</Link>
                </div>
                {recentes.length === 0 ? (
                    <p className="state-message">Nenhum pedido feito ainda. Que tal passar pelo cardápio?</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Itens</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Horário</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentes.map((pedido) => (
                                <tr key={pedido.id}>
                                    <td>#{pedido.id}</td>
                                    <td>{pedido.itens.map((item) => item.produto.nome).join(", ")}</td>
                                    <td>R$ {pedido.total.toFixed(2)}</td>
                                    <td><StatusBadge status={pedido.status} /></td>
                                    <td>{new Date(pedido.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default InicioPage;
