import { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";
import type { Permissao } from "../types/Permissao";
import PermissaoForm from "../components/PermissaoForm";
import PermissaoLista from "../components/PermissaoLista";

function PermissoesPage() {
    const [permissoes, setPermissoes] = useState<Permissao[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [erroExclusao, setErroExclusao] = useState<string | null>(null);
    const [editando, setEditando] = useState<Permissao | null>(null);

    function carregarPermissoes() {
        api.get<Permissao[]>("/permissoes")
            .then((resposta) => {
                setPermissoes(resposta.data);
                setErro(null);
            })
            .catch(() => {
                setErro("Não foi possível carregar as permissões. Verifique se o back-end está rodando.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        carregarPermissoes();
    }, []);

    async function excluir(id: number) {
        if (!window.confirm("Tem certeza que deseja excluir?")) return;
        try {
            await api.delete(`/permissoes/${id}`);
            setErroExclusao(null);
            if (editando?.id === id) setEditando(null);
        } catch (e) {
            const mensagem = axios.isAxiosError(e) ? e.response?.data?.message : null;
            setErroExclusao(mensagem || "Não foi possível excluir a permissão.");
        }
        carregarPermissoes();
    }

    if (loading) {
        return <p className="state-message">Carregando...</p>;
    }

    if (erro) {
        return <p className="state-error">{erro}</p>;
    }

    return (
        <>
            <PermissaoForm
                permissaoEditando={editando}
                onCancelar={() => setEditando(null)}
                onPermissaoSalva={() => {
                    carregarPermissoes();
                    setEditando(null);
                }}
            />

            {erroExclusao && <p className="state-error">{erroExclusao}</p>}

            <PermissaoLista permissoes={permissoes} onEditar={setEditando} onExcluir={excluir} />
        </>
    );
}

export default PermissoesPage;
