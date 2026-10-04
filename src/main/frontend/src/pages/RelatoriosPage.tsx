import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import type { Pedido } from "../types/Pedido";
import Breadcrumb from "../components/Breadcrumb";
import { formatarMoeda } from "../utils/formatar";

const DIAS = 7;

function RelatoriosPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        api.get<Pedido[]>("/pedidos")
            .then((resposta) => setPedidos(resposta.data))
            .catch(() => setErro("Não foi possível carregar os relatórios. Verifique se o back-end está rodando."));
    }, []);

    const validos = pedidos.filter((p) => p.status !== "CANCELADO");

    // Faturamento de cada um dos últimos 7 dias (o mais antigo primeiro).
    const porDia = useMemo(() => {
        return Array.from({ length: DIAS }, (_, i) => {
            const dia = new Date();
            dia.setDate(dia.getDate() - (DIAS - 1 - i));
            const total = validos
                .filter((p) => new Date(p.dataHora).toDateString() === dia.toDateString())
                .reduce((soma, p) => soma + p.total, 0);
            return {
                label: dia.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" }),
                total,
            };
        });
    }, [validos]);

    const maisVendidos = useMemo(() => {
        const quantidades = new Map<string, number>();
        for (const pedido of validos) {
            for (const item of pedido.itens) {
                quantidades.set(item.produto.nome, (quantidades.get(item.produto.nome) ?? 0) + item.quantidade);
            }
        }
        return [...quantidades.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    }, [validos]);

    const faturamento = validos.reduce((soma, p) => soma + p.total, 0);
    const ticketMedio = validos.length > 0 ? faturamento / validos.length : 0;
    const cancelados = pedidos.length - validos.length;
    const maiorDia = Math.max(...porDia.map((d) => d.total), 1);
    const maiorProduto = maisVendidos[0]?.[1] ?? 1;

    return (
        <div>
            <Breadcrumb voltarPara="/" itens={[{ label: "Relatórios" }]} />
            <h1 className="page-title">Relatórios</h1>
            <p className="page-subtitle">Resumo das vendas da cafeteria.</p>

            {erro && <p className="state-error">{erro}</p>}

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-body">
                        <span className="stat-label">Faturamento total</span>
                        <span className="stat-value">{formatarMoeda(faturamento)}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-body">
                        <span className="stat-label">Pedidos concluídos ou em andamento</span>
                        <span className="stat-value">{validos.length}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-body">
                        <span className="stat-label">Ticket médio</span>
                        <span className="stat-value">{formatarMoeda(ticketMedio)}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-body">
                        <span className="stat-label">Pedidos cancelados</span>
                        <span className="stat-value">{cancelados}</span>
                    </div>
                </div>
            </div>

            <div className="relatorio-grid">
                <section className="panel">
                    <h2 className="panel-title">Faturamento dos últimos {DIAS} dias</h2>
                    <div className="bar-chart">
                        {porDia.map((dia) => (
                            <div className="bar-col" key={dia.label}>
                                <span className="bar-valor">{dia.total > 0 ? formatarMoeda(dia.total) : ""}</span>
                                <span className="bar" style={{ height: `${(dia.total / maiorDia) * 100}%` }} />
                                <span className="bar-label">{dia.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="panel">
                    <h2 className="panel-title">Produtos mais vendidos</h2>
                    {maisVendidos.length === 0 && <p className="state-message">Nenhuma venda ainda.</p>}
                    <ul className="ranking">
                        {maisVendidos.map(([nome, quantidade]) => (
                            <li key={nome}>
                                <div className="ranking-linha">
                                    <span>{nome}</span>
                                    <strong>{quantidade}</strong>
                                </div>
                                <span className="ranking-barra">
                                    <span style={{ width: `${(quantidade / maiorProduto) * 100}%` }} />
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default RelatoriosPage;
