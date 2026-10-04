import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Search } from "lucide-react";
import api from "../services/api";
import type { Pedido } from "../types/Pedido";
import Breadcrumb from "../components/Breadcrumb";
import { formatarData, formatarMoeda } from "../utils/formatar";

interface Cliente {
    nome: string;
    telefone?: string;
    email?: string;
    pedidos: number;
    totalGasto: number;
    ultimoPedido: Pedido;
}

// Os clientes saem dos próprios pedidos: cada nome diferente vira um cliente.
function agruparClientes(pedidos: Pedido[]) {
    const porNome = new Map<string, Cliente>();
    for (const pedido of pedidos) {
        if (!pedido.cliente) continue;
        const atual = porNome.get(pedido.cliente);
        const valido = pedido.status !== "CANCELADO";
        if (!atual) {
            porNome.set(pedido.cliente, {
                nome: pedido.cliente,
                telefone: pedido.telefone,
                email: pedido.email,
                pedidos: 1,
                totalGasto: valido ? pedido.total : 0,
                ultimoPedido: pedido,
            });
        } else {
            atual.pedidos += 1;
            atual.totalGasto += valido ? pedido.total : 0;
            atual.telefone ??= pedido.telefone;
            atual.email ??= pedido.email;
            if (pedido.dataHora > atual.ultimoPedido.dataHora) atual.ultimoPedido = pedido;
        }
    }
    return [...porNome.values()].sort((a, b) => b.ultimoPedido.dataHora.localeCompare(a.ultimoPedido.dataHora));
}

function ClientesPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [busca, setBusca] = useState("");

    useEffect(() => {
        api.get<Pedido[]>("/pedidos")
            .then((resposta) => setPedidos(resposta.data))
            .catch(() => setErro("Não foi possível carregar os clientes. Verifique se o back-end está rodando."))
            .finally(() => setLoading(false));
    }, []);

    const clientes = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return agruparClientes(pedidos).filter((c) => termo === "" || c.nome.toLowerCase().includes(termo));
    }, [pedidos, busca]);

    return (
        <div>
            <Breadcrumb voltarPara="/" itens={[{ label: "Clientes" }]} />
            <div className="page-header">
                <div>
                    <h1 className="page-title">Clientes</h1>
                    <p className="page-subtitle">Quem já fez pedidos na cafeteria.</p>
                </div>
                <label className="search-field">
                    <Search size={16} />
                    <input type="search" placeholder="Buscar cliente..." value={busca} onChange={(e) => setBusca(e.target.value)} />
                </label>
            </div>

            <section className="panel">
                {loading && <p className="state-message">Carregando clientes...</p>}
                {erro && <p className="state-error">{erro}</p>}
                {!loading && !erro && clientes.length === 0 && <p className="state-message">Nenhum cliente encontrado.</p>}
                {!loading && !erro && clientes.length > 0 && (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Telefone</th>
                                    <th>E-mail</th>
                                    <th>Pedidos</th>
                                    <th>Total gasto</th>
                                    <th>Último pedido</th>
                                    <th className="col-acoes">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map((cliente) => (
                                    <tr key={cliente.nome}>
                                        <td>
                                            <span className="produto-cell">
                                                <span className="avatar-sm">{cliente.nome.charAt(0)}</span>
                                                {cliente.nome}
                                            </span>
                                        </td>
                                        <td className="col-muted">{cliente.telefone ?? "—"}</td>
                                        <td className="col-muted">{cliente.email ?? "—"}</td>
                                        <td>{cliente.pedidos}</td>
                                        <td>{formatarMoeda(cliente.totalGasto)}</td>
                                        <td className="col-muted">{formatarData(cliente.ultimoPedido.dataHora)}</td>
                                        <td className="col-acoes">
                                            <Link
                                                className="btn-icon"
                                                to={`/pedidos?busca=${encodeURIComponent(cliente.nome)}`}
                                                aria-label={`Ver pedidos de ${cliente.nome}`}
                                            >
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

export default ClientesPage;
