import { useEffect, useState } from "react";
import api from "../services/api";
import type { Cliente } from "../types/Cliente";
import ClienteForm from "../components/ClienteForm";
import ClienteLista from "../components/ClienteLista";
import { lerErroApi } from "../utils/erros";

// N2 — tela nova: CRUD de clientes (cadastrar → listar → editar → excluir).
function ClientesPage() {
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

            <ClienteLista clientes={clientes} onEditar={setEditando} onExcluir={excluir} />
        </>
    );
}

export default ClientesPage;
