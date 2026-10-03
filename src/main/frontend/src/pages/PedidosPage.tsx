import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import type { Pedido } from "../types/Pedido";
import StatusBadge from "../components/StatusBadge";

const ABAS = [
    { chave: "TODOS", label: "Todos" },
    { chave: "ANDAMENTO", label: "Em andamento" },
    { chave: "CONCLUIDO", label: "Concluídos" },
    { chave: "CANCELADO", label: "Cancelados" },
];

function pertenceAba(status: string, aba: string) {
    if (aba === "TODOS") return true;
    if (aba === "ANDAMENTO") return ["RECEBIDO", "EM_PREPARO", "PRONTO"].includes(status);
    if (aba === "CONCLUIDO") return status === "ENTREGUE";
    if (aba === "CANCELADO") return status === "CANCELADO";
    return true;
}

function formatarData(dataHora: string) {
    return new Date(dataHora).toLocaleString("pt-BR");
}

function PedidosPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [aba, setAba] = useState("TODOS");
    const [busca, setBusca] = useState("");

    useEffect(() => {
        api.get<Pedido[]>("/pedidos")
            .then((resposta) => {
                setPedidos(resposta.data.slice().reverse());
                setErro(null);
            })
            .catch(() => setErro("Não foi possível carregar os pedidos."))
            .finally(() => setLoading(false));
    }, []);

    const pedidosFiltrados = useMemo(() => {
        return pedidos.filter((pedido) => {
            const bateAba = pertenceAba(pedido.status, aba);
            const bateBusca = busca === "" || String(pedido.id).includes(busca);
            return bateAba && bateBusca;
        });
    }, [pedidos, aba, busca]);

    return (
        <div>
            <h1 className="page-title">Meus Pedidos</h1>
            <p className="page-subtitle">Acompanhe todos os pedidos realizados.</p>

            <div className="toolbar toolbar-row">
                <div className="category-tabs">
                    {ABAS.map((a) => (
                        <button
                            key={a.chave}
                            className={"category-tab" + (aba === a.chave ? " active" : "")}
                            onClick={() => setAba(a.chave)}
                        >
                            {a.label}
                        </button>
                    ))}
                </div>
                <input
                    className="topbar-search"
                    type="search"
                    placeholder="Buscar por número do pedido..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
            </div>

            {loading && <p className="state-message">Carregando pedidos...</p>}
            {erro && <p className="state-error">{erro}</p>}

            {!loading && !erro && pedidosFiltrados.length === 0 && (
                <p className="state-message">Nenhum pedido encontrado.</p>
            )}

            {!loading && !erro && pedidosFiltrados.length > 0 && (
                <div className="panel">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Data</th>
                                <th>Itens</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidosFiltrados.map((pedido) => (
                                <tr key={pedido.id}>
                                    <td>#{pedido.id}</td>
                                    <td>{formatarData(pedido.dataHora)}</td>
                                    <td>{pedido.itens.map((item) => item.produto.nome).join(", ")}</td>
                                    <td>R$ {pedido.total.toFixed(2)}</td>
                                    <td><StatusBadge status={pedido.status} /></td>
                                    <td>
                                        <Link className="btn-icon" to={`/pedidos/${pedido.id}`} aria-label="Ver pedido">👁️</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PedidosPage;
