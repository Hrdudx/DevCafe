import { useEffect, useState } from "react";
import api from "../services/api";
import type { Pedido } from "../types/Pedido";

const STATUS_LABEL: Record<string, string> = {
    RECEBIDO: "Recebido",
    EM_PREPARO: "Em preparo",
    PRONTO: "Pronto",
    ENTREGUE: "Entregue",
};

function formatarData(dataHora: string) {
    return new Date(dataHora).toLocaleString("pt-BR");
}

function PedidosPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        api.get<Pedido[]>("/pedidos")
            .then((resposta) => {
                setPedidos(resposta.data.slice().reverse());
                setErro(null);
            })
            .catch(() => setErro("Não foi possível carregar os pedidos."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1 className="page-title">Pedidos</h1>
            <p className="page-subtitle">Acompanhe os pedidos feitos no DevCafé.</p>

            {loading && <p className="state-message">Carregando pedidos...</p>}
            {erro && <p className="state-error">{erro}</p>}

            {!loading && !erro && pedidos.length === 0 && (
                <p className="state-message">Nenhum pedido feito ainda. Que tal passar pelo cardápio?</p>
            )}

            {!loading && !erro && pedidos.map((pedido) => (
                <div className="panel" key={pedido.id}>
                    <div className="order-header">
                        <div>
                            <h2 className="panel-title">Pedido #{pedido.id}</h2>
                            <span className="state-message" style={{ padding: 0 }}>{formatarData(pedido.dataHora)}</span>
                        </div>
                        <span className="order-status">{STATUS_LABEL[pedido.status] ?? pedido.status}</span>
                    </div>
                    <ul className="list">
                        {pedido.itens.map((item) => (
                            <li className="list-item" key={item.id}>
                                <span className="list-item-info">
                                    {item.quantidade}x {item.produto.nome}
                                </span>
                                <span className="menu-card-price">R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="order-total">Total: R$ {pedido.total.toFixed(2)}</p>
                </div>
            ))}
        </div>
    );
}

export default PedidosPage;
