import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, CreditCard, Mail, MapPin, Printer, UserRound } from "lucide-react";
import api from "../services/api";
import type { Pedido } from "../types/Pedido";
import Breadcrumb from "../components/Breadcrumb";
import { STATUS_INFO } from "../components/StatusBadge";
import { formatarData, formatarHora, formatarMoeda } from "../utils/formatar";

// Por enquanto todo pedido é retirado no balcão da loja.
const ENDERECO_LOJA = ["Retirada na loja", "Av. das Tecnologias, 123", "Goiânia - GO"];

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

    const subtotal = pedido.itens.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0);
    const taxaEntrega = Math.max(0, Math.round((pedido.total - subtotal) * 100) / 100);

    return (
        <div>
            <Breadcrumb
                voltarPara="/pedidos"
                itens={[{ label: "Meus Pedidos", to: "/pedidos" }, { label: `Pedido #${pedido.id}` }]}
            />

            <div className="page-header">
                <div>
                    <h1 className="page-title page-title-badge">
                        Pedido #{pedido.id}
                        {/* O próprio selo de status é um seletor para alterar o status. */}
                        <label className={"status-select status-badge " + (STATUS_INFO[pedido.status]?.className ?? "badge-info")}>
                            <select
                                value={pedido.status}
                                onChange={(e) => atualizarStatus(e.target.value)}
                                disabled={salvando}
                                aria-label="Alterar status do pedido"
                            >
                                {Object.entries(STATUS_INFO).map(([valor, info]) => (
                                    <option key={valor} value={valor}>{info.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={12} strokeWidth={2.5} className="no-print" />
                        </label>
                    </h1>
                    <p className="page-subtitle">
                        Realizado em {formatarData(pedido.dataHora)} às {formatarHora(pedido.dataHora)}
                    </p>
                </div>
                <div className="toolbar-actions no-print">
                    <button className="btn btn-outline" onClick={() => window.print()}>
                        <Printer size={16} /> Imprimir
                    </button>
                </div>
            </div>

            <div className="info-grid">
                <div className="info-card">
                    <span className="info-icon"><UserRound size={20} /></span>
                    <div>
                        <h3>Cliente</h3>
                        <p>{pedido.cliente ?? "Não informado"}</p>
                        {pedido.telefone && <p>{pedido.telefone}</p>}
                        {pedido.email && (
                            <p className="info-email"><Mail size={12} /> {pedido.email}</p>
                        )}
                        {pedido.observacoes && <p className="info-obs">Obs.: {pedido.observacoes}</p>}
                    </div>
                </div>
                <div className="info-card">
                    <span className="info-icon"><MapPin size={20} /></span>
                    <div>
                        <h3>Endereço</h3>
                        {ENDERECO_LOJA.map((linha) => (
                            <p key={linha}>{linha}</p>
                        ))}
                    </div>
                </div>
                <div className="info-card">
                    <span className="info-icon"><CreditCard size={20} /></span>
                    <div>
                        <h3>Forma de pagamento</h3>
                        <p>{pedido.formaPagamento ?? "Pagamento na retirada"}</p>
                    </div>
                </div>
            </div>

            <div className="detail-grid">
                <section className="panel">
                    <h2 className="panel-title">Itens do pedido</h2>
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Qtd</th>
                                    <th>Valor unitário</th>
                                    <th className="col-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedido.itens.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <span className="produto-cell">
                                                {item.produto.imagemUrl ? (
                                                    <img src={item.produto.imagemUrl} alt="" />
                                                ) : (
                                                    <span className="produto-cell-sem-img" />
                                                )}
                                                {item.produto.nome}
                                            </span>
                                        </td>
                                        <td>{item.quantidade}</td>
                                        <td>{formatarMoeda(item.precoUnitario)}</td>
                                        <td className="col-right">{formatarMoeda(item.precoUnitario * item.quantidade)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="panel totals">
                    <div className="totals-row">
                        <span>Subtotal</span>
                        <strong>{formatarMoeda(subtotal)}</strong>
                    </div>
                    <div className="totals-row">
                        <span>Taxa de entrega</span>
                        <span>{formatarMoeda(taxaEntrega)}</span>
                    </div>
                    <div className="totals-row totals-total">
                        <span>Total</span>
                        <span>{formatarMoeda(pedido.total)}</span>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default PedidoDetailPage;
