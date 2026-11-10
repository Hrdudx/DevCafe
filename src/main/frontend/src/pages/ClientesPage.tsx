import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../services/api";
import type { Cliente } from "../types/Cliente";
import ClienteForm from "../components/ClienteForm";
import ClienteLista from "../components/ClienteLista";
import { lerErroApi } from "../utils/erros";

// N2 — tela nova: CRUD de clientes (cadastrar → listar → editar → excluir).
function ClientesPage() {
    const [params] = useSearchParams();
    const [busca, setBusca] = useState(params.get("busca") ?? "");
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [erroExclusao, setErroExclusao] = useState<string | null>(null);
    const [editando, setEditando] = useState<Cliente | null>(null);

    function carregarClientes() {
        api.get<Cliente[]>("/clientes")
            .then((resposta) => {
                setClientes(resposta.data);
                setErro(null);
            })
            .catch(() => {
                setErro("Não foi possível carregar os clientes. Verifique se o back-end está rodando.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        carregarClientes();
    }, []);

    // Busca do topo com esta tela já aberta: acompanha o endereço (?busca=...).
    useEffect(() => {
        const buscaNova = params.get("busca");
        if (buscaNova !== null) setBusca(buscaNova);
    }, [params]);

    // Filtra pelo nome ou e-mail, sem diferenciar maiúsculas.
    const clientesVisiveis = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return clientes;
        return clientes.filter((c) => `${c.nome} ${c.email}`.toLowerCase().includes(termo));
    }, [clientes, busca]);

    async function excluir(id: number) {
        if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;
        try {
            await api.delete(`/clientes/${id}`);
            setErroExclusao(null);
            if (editando?.id === id) setEditando(null);
        } catch (e) {
            setErroExclusao(lerErroApi(e, "Não foi possível excluir o cliente.").mensagem);
        }
        carregarClientes();
    }

    if (loading) {
        return <p className="state-message">Carregando...</p>;
    }

    if (erro) {
        return <p className="state-error">{erro}</p>;
    }

    return (
        <>
            <ClienteForm
                clienteEditando={editando}
                onCancelar={() => setEditando(null)}
                onClienteSalvo={() => {
                    carregarClientes();
                    setEditando(null);
                }}
            />

            {erroExclusao && <p className="state-error">{erroExclusao}</p>}

            <label className="search-field search-field-full">
                <Search size={16} />
                <input
                    type="search"
                    placeholder="Buscar cliente por nome ou e-mail..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
            </label>

            {busca.trim() && clientesVisiveis.length === 0 ? (
                <p className="state-message">Nenhum cliente encontrado para "{busca}".</p>
            ) : (
                <ClienteLista clientes={clientesVisiveis} onEditar={setEditando} onExcluir={excluir} />
            )}
        </>
    );
}

export default ClientesPage;
