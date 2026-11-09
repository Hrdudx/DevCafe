import { useEffect, useState } from "react";
import api from "../services/api";
import type { Avaliacao } from "../types/Avaliacao";
import type { Cliente } from "../types/Cliente";
import type { Produto } from "../types/Produto";
import AvaliacaoForm from "../components/AvaliacaoForm";
import AvaliacaoLista from "../components/AvaliacaoLista";
import Estrelas from "../components/Estrelas";
import { lerErroApi } from "../utils/erros";

// N2 — tela nova: CRUD de avaliações. Cada avaliação liga um Cliente a um Produto.
function AvaliacoesPage() {
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [filtroCliente, setFiltroCliente] = useState("");
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [erroExclusao, setErroExclusao] = useState<string | null>(null);
    const [editando, setEditando] = useState<Avaliacao | null>(null);

    // Com um cliente escolhido no filtro, usa a rota do relacionamento: /clientes/{id}/avaliacoes.
    function carregarAvaliacoes() {
        const url = filtroCliente ? `/clientes/${filtroCliente}/avaliacoes` : "/avaliacoes";
        api.get<Avaliacao[]>(url)
            .then((resposta) => {
                setAvaliacoes(resposta.data);
                setErro(null);
            })
            .catch(() => {
                setErro("Não foi possível carregar as avaliações. Verifique se o back-end está rodando.");
            })
            .finally(() => setLoading(false));
    }

    // Clientes e produtos preenchem os selects do formulário.
    useEffect(() => {
        api.get<Cliente[]>("/clientes").then((r) => setClientes(r.data)).catch(() => {});
        api.get<Produto[]>("/produtos").then((r) => setProdutos(r.data)).catch(() => {});
    }, []);

    useEffect(() => {
        carregarAvaliacoes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtroCliente]);

    async function excluir(id: number) {
        if (!window.confirm("Tem certeza que deseja excluir esta avaliação?")) return;
        try {
            await api.delete(`/avaliacoes/${id}`);
            setErroExclusao(null);
            if (editando?.id === id) setEditando(null);
        } catch (e) {
            setErroExclusao(lerErroApi(e, "Não foi possível excluir a avaliação.").mensagem);
        }
        carregarAvaliacoes();
    }

    if (loading) {
        return <p className="state-message">Carregando...</p>;
    }

    if (erro) {
        return <p className="state-error">{erro}</p>;
    }

    const media = avaliacoes.length
        ? avaliacoes.reduce((soma, a) => soma + a.nota, 0) / avaliacoes.length
        : 0;

    return (
        <>
            <AvaliacaoForm
                clientes={clientes}
                produtos={produtos}
                avaliacaoEditando={editando}
                onCancelar={() => setEditando(null)}
                onAvaliacaoSalva={() => {
                    carregarAvaliacoes();
                    setEditando(null);
                }}
            />

            <div className="avaliacoes-barra">
                <span className="avaliacoes-media">
                    {avaliacoes.length > 0 ? (
                        <>
                            <Estrelas nota={Math.round(media)} /> <strong>{media.toFixed(1)}</strong> de média em{" "}
                            {avaliacoes.length} avaliação(ões)
                        </>
                    ) : (
                        "Sem avaliações para mostrar"
                    )}
                </span>
                <select
                    className="input input-sm"
                    value={filtroCliente}
                    onChange={(e) => setFiltroCliente(e.target.value)}
                    aria-label="Filtrar por cliente"
                >
                    <option value="">Todos os clientes</option>
                    {clientes.map((c) => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                </select>
            </div>

            {erroExclusao && <p className="state-error">{erroExclusao}</p>}

            <AvaliacaoLista avaliacoes={avaliacoes} onEditar={setEditando} onExcluir={excluir} />
        </>
    );
}

export default AvaliacoesPage;
