import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarDays, Eye, Search, Trash2 } from "lucide-react";
import api from "../services/api";
import type { Pedido } from "../types/Pedido";
import Breadcrumb from "../components/Breadcrumb";
import StatusBadge from "../components/StatusBadge";
import CategoriaTabs from "../components/CategoriaTabs";
import { formatarDataHora, formatarMoeda, resumirItens } from "../utils/formatar";

const ABAS = [
    { valor: "TODOS", label: "Todos" },
    { valor: "ANDAMENTO", label: "Em andamento" },
    { valor: "CONCLUIDO", label: "Concluídos" },
    { valor: "CANCELADO", label: "Cancelados" },
];

function pertenceAba(status: string, aba: string) {
    if (aba === "ANDAMENTO") return ["RECEBIDO", "EM_PREPARO", "PRONTO"].includes(status);
    if (aba === "CONCLUIDO") return status === "ENTREGUE";
    if (aba === "CANCELADO") return status === "CANCELADO";
    return true;
}

// "2026-10-04T10:24:00" -> "2026-10-04", no mesmo formato do <input type="date">.
function diaDoPedido(dataHora: string) {
    const data = new Date(dataHora);
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${data.getFullYear()}-${mes}-${dia}`;
}

function diaRelativo(diasAtras: number) {
    const data = new Date();
    data.setDate(data.getDate() - diasAtras);
    return diaDoPedido(data.toISOString());
}

function PedidosPage() {
    const [params] = useSearchParams();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [aba, setAba] = useState(params.get("aba") ?? "TODOS");
    const [busca, setBusca] = useState(params.get("busca") ?? "");
    // Por padrão mostra os pedidos de ontem e de hoje (quando a busca vem do topo, mostra todos).
    const [dataInicio, setDataInicio] = useState(params.get("busca") ? "" : diaRelativo(1));
    const [dataFim, setDataFim] = useState(params.get("busca") ? "" : diaRelativo(0));

    function carregarPedidos() {
        api.get<Pedido[]>("/pedidos")
            .then((resposta) => {
                setPedidos([...resposta.data].sort((a, b) => b.dataHora.localeCompare(a.dataHora)));
                setErro(null);
            })
            .catch(() => setErro("Não foi possível carregar os pedidos. Verifique se o back-end está rodando."))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        carregarPedidos();
    }, []);

    async function excluir(id: number) {
        if (!window.confirm(`Excluir o pedido #${id}?`)) return;
        try {
            await api.delete(`/pedidos/${id}`);
        } catch {
            setErro("Não foi possível excluir o pedido.");
        }
        carregarPedidos();
    }

    const pedidosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase().replace("#", "");
        return pedidos.filter((pedido) => {
            const dia = diaDoPedido(pedido.dataHora);
            const bateBusca =
                termo === "" ||
                String(pedido.id).includes(termo) ||
                (pedido.cliente ?? "").toLowerCase().includes(termo);
            return (
                pertenceAba(pedido.status, aba) &&
                bateBusca &&
                (dataInicio === "" || dia >= dataInicio) &&
                (dataFim === "" || dia <= dataFim)
            );
        });
    }, [pedidos, aba, busca, dataInicio, dataFim]);

    return (
        <div>
            <Breadcrumb voltarPara="/" itens={[{ label: "Meus Pedidos" }]} />
            <h1 className="page-title">Meus Pedidos</h1>
            <p className="page-subtitle">Acompanhe todos os seus pedidos realizados.</p>

            <section className="panel">
                <div className="toolbar">
                    <CategoriaTabs opcoes={ABAS} selecionada={aba} onSelecionar={setAba} />
                    <div className="toolbar-actions">
                        <div className="date-range">
                            <CalendarDays size={16} />
                            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} aria-label="Data inicial" />
                            <span>-</span>
                            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} aria-label="Data final" />
                        </div>
                        <label className="search-field">
                            <Search size={16} />
                            <input
                                type="search"
                                placeholder="Buscar por número ou cliente..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                            />
                        </label>
                    </div>
                </div>

                {loading && <p className="state-message">Carregando pedidos...</p>}
                {erro && <p className="state-error">{erro}</p>}
                {!loading && !erro && pedidosFiltrados.length === 0 && (
                    <p className="state-message">Nenhum pedido encontrado.</p>
                )}

                {!loading && !erro && pedidosFiltrados.length > 0 && (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Data</th>
                                    <th>Cliente</th>
                                    <th>Itens</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th className="col-acoes">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidosFiltrados.map((pedido) => (
                                    <tr key={pedido.id}>
                                        <td className="col-id">#{pedido.id}</td>
                                        <td className="col-muted">{formatarDataHora(pedido.dataHora)}</td>
                                        <td>{pedido.cliente ?? "—"}</td>
                                        <td className="col-itens">{resumirItens(pedido.itens)}</td>
                                        <td>{formatarMoeda(pedido.total)}</td>
                                        <td><StatusBadge status={pedido.status} /></td>
                                        <td className="col-acoes">
                                            <span className="acoes">
                                                <Link className="btn-icon" to={`/pedidos/${pedido.id}`} aria-label={`Ver pedido #${pedido.id}`}>
                                                    <Eye size={17} />
                                                </Link>
                                                <button className="btn-icon btn-icon-danger" onClick={() => excluir(pedido.id)} aria-label={`Excluir pedido #${pedido.id}`}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default PedidosPage;
