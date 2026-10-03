import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import type { Pedido } from "../types/Pedido";
import StatusBadge from "../components/StatusBadge";

const STATUS_OPCOES = ["RECEBIDO", "EM_PREPARO", "PRONTO", "ENTREGUE", "CANCELADO"];

function formatarData(dataHora: string) {
    return new Date(dataHora).toLocaleString("pt-BR");
}

function PedidoDetailPage() {
    const { id } = useParams();
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        api.get<Pedido>(`/pedidos/${id}`)
            .then((resposta) => setPedido(resposta.data))
            .catch(() => setErro("Pedido não encontrado."));
    }, [id]);

    function atualizarStatus(novoStatus: string) {
        if (!pedido) return;
        setSalvando(true);
        api.put<Pedido>(`/pedidos/${pedido.id}/status`, { status: novoStatus })
            .then((resposta) => setPedido(resposta.data))
            .catch(() => setErro("Não foi possível atualizar o status."))
            .finally(() => setSalvando(false));
    }

    if (erro) return <p className="state-error">{erro}</p>;
    if (!pedido) return <p className="state-message">Carregando pedido...</p>;

    return (
        <div>
            <p className="breadcrumb">
                <Link to="/pedidos">Meus Pedidos</Link> &gt; Pedido #{pedido.id}
            </p>

            <div className="order-header">
                <div>
                    <h1 className="page-title">Pedido #{pedido.id}</h1>
                    <p className="page-subtitle" style={{ margin: 0 }}>Realizado em {formatarData(pedido.dataHora)}</p>
                </div>
                <StatusBadge status={pedido.status} />
            </div>

            <div className="detail-grid">
                <div className="panel">
                    <h2 className="panel-title">Atualizar status</h2>
                    <div className="status-options">
                        {STATUS_OPCOES.map((s) => (
                            <button
                                key={s}
                                className={"category-tab" + (pedido.status === s ? " active" : "")}
                                onClick={() => atualizarStatus(s)}
                                disabled={salvando}
                            >
                                <StatusBadge status={s} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="panel">
                    <h2 className="panel-title">Forma de pagamento</h2>
                    <p className="state-message" style={{ padding: 0, textAlign: "left" }}>Retirada no balcão — pagamento no local.</p>
                </div>
            </div>

            <div className="panel">
                <h2 className="panel-title">Itens do pedido</h2>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Qtd</th>
                            <th>Valor unitário</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedido.itens.map((item) => (
                            <tr key={item.id}>
                                <td>{item.produto.nome}</td>
                                <td>{item.quantidade}</td>
                                <td>R$ {item.precoUnitario.toFixed(2)}</td>
                                <td>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="order-total">Total: R$ {pedido.total.toFixed(2)}</p>
            </div>
        </div>
    );
}

export default PedidoDetailPage;
