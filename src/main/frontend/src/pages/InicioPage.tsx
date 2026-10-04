import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, CalendarDays, ClipboardCheck, Eye, Package, Receipt, UserRound } from "lucide-react";
import api from "../services/api";
import type { Pedido } from "../types/Pedido";
import { obterUsuarioLogado } from "../services/auth";
import StatusBadge from "../components/StatusBadge";
import { formatarDataPorExtenso, formatarHora, formatarMoeda, resumirItens } from "../utils/formatar";

function mesmoDia(dataHora: string, dia: Date) {
    return new Date(dataHora).toDateString() === dia.toDateString();
}

// Números de um dia, ignorando pedidos cancelados (exceto na contagem de pedidos).
function resumoDoDia(pedidos: Pedido[], dia: Date) {
    const doDia = pedidos.filter((pedido) => mesmoDia(pedido.dataHora, dia));
    const validos = doDia.filter((pedido) => pedido.status !== "CANCELADO");
    return {
        pedidos: doDia.length,
        faturamento: validos.reduce((soma, pedido) => soma + pedido.total, 0),
        produtos: validos.reduce((soma, pedido) => soma + pedido.itens.reduce((s, item) => s + item.quantidade, 0), 0),
        clientes: new Set(validos.map((pedido) => pedido.cliente).filter(Boolean)).size,
    };
}

function Variacao({ hoje, ontem }: { hoje: number; ontem: number }) {
    if (ontem === 0) return <span className="stat-trend neutro">sem dados de ontem</span>;
    const percentual = Math.round(((hoje - ontem) / ontem) * 100);
    const subiu = percentual >= 0;
    return (
        <span className={"stat-trend " + (subiu ? "positivo" : "negativo")} title="Em relação a ontem">
            {subiu ? <ArrowUp size={13} strokeWidth={2.5} /> : <ArrowDown size={13} strokeWidth={2.5} />}
            {Math.abs(percentual)}%
        </span>
    );
}

interface StatCardProps {
    icon: ReactNode;
    label: string;
    valor: string;
    hoje: number;
    ontem: number;
}

function StatCard({ icon, label, valor, hoje, ontem }: StatCardProps) {
    return (
        <div className="stat-card">
            <span className="stat-icon">{icon}</span>
            <div className="stat-body">
                <span className="stat-label">{label}</span>
                <span className="stat-value">{valor}</span>
                <Variacao hoje={hoje} ontem={ontem} />
            </div>
        </div>
    );
}

function InicioPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [erro, setErro] = useState(false);
    const usuario = obterUsuarioLogado();

    useEffect(() => {
        api.get<Pedido[]>("/pedidos")
            .then((resposta) => setPedidos(resposta.data))
            .catch(() => setErro(true));
    }, []);

    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    const resumoHoje = resumoDoDia(pedidos, hoje);
    const resumoOntem = resumoDoDia(pedidos, ontem);

    const recentes = [...pedidos]
        .sort((a, b) => b.dataHora.localeCompare(a.dataHora))
        .slice(0, 5);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Olá, {usuario}!</h1>
                    <p className="page-subtitle">Que tal um café hoje? ☕</p>
                </div>
                <span className="page-date">
                    <CalendarDays size={16} />
                    {formatarDataPorExtenso(hoje)}
                </span>
            </div>

            <div className="stats-grid">
                <StatCard
                    icon={<ClipboardCheck size={20} />}
                    label="Pedidos hoje"
                    valor={String(resumoHoje.pedidos)}
                    hoje={resumoHoje.pedidos}
                    ontem={resumoOntem.pedidos}
                />
                <StatCard
                    icon={<Receipt size={20} />}
                    label="Faturamento hoje"
                    valor={formatarMoeda(resumoHoje.faturamento)}
                    hoje={resumoHoje.faturamento}
                    ontem={resumoOntem.faturamento}
                />
                <StatCard
                    icon={<Package size={20} />}
                    label="Produtos vendidos"
                    valor={String(resumoHoje.produtos)}
                    hoje={resumoHoje.produtos}
                    ontem={resumoOntem.produtos}
                />
                <StatCard
                    icon={<UserRound size={20} />}
                    label="Clientes atendidos"
                    valor={String(resumoHoje.clientes)}
                    hoje={resumoHoje.clientes}
                    ontem={resumoOntem.clientes}
                />
            </div>

            <section className="promo-banner">
                <div className="promo-banner-text">
                    <span className="promo-tag">Novidade!</span>
                    <h2>Latte Gelado</h2>
                    <p>Refrescância e muito sabor.</p>
                    <Link className="btn btn-primary btn-sm" to="/cardapio?categoria=Bebidas%20Geladas">
                        Ver no cardápio
                    </Link>
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <h2 className="panel-title">Pedidos recentes</h2>
                    <Link className="link" to="/pedidos">Ver todos</Link>
                </div>
                {erro && <p className="state-error">Não foi possível carregar os pedidos. Verifique se o back-end está rodando.</p>}
                {!erro && recentes.length === 0 && (
                    <p className="state-message">Nenhum pedido feito ainda. Que tal passar pelo cardápio?</p>
                )}
                {recentes.length > 0 && (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Cliente</th>
                                    <th>Itens</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Horário</th>
                                    <th className="col-acoes">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentes.map((pedido) => (
                                    <tr key={pedido.id}>
                                        <td className="col-id">#{pedido.id}</td>
                                        <td>{pedido.cliente ?? "—"}</td>
                                        <td className="col-itens">{resumirItens(pedido.itens)}</td>
                                        <td>{formatarMoeda(pedido.total)}</td>
                                        <td><StatusBadge status={pedido.status} /></td>
                                        <td className="col-muted">{formatarHora(pedido.dataHora)}</td>
                                        <td className="col-acoes">
                                            <Link className="btn-icon" to={`/pedidos/${pedido.id}`} aria-label={`Ver pedido #${pedido.id}`}>
                                                <Eye size={17} />
                                            </Link>
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

export default InicioPage;
