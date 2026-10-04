import { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import UsuarioForm from "../components/UsuarioForm";
import UsuarioLista from "../components/UsuarioLista";

function UsuariosPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [erroExclusao, setErroExclusao] = useState<string | null>(null);
    const [editando, setEditando] = useState<Usuario | null>(null);

    function carregarUsuarios() {
        api.get<Usuario[]>("/usuarios")
            .then((resposta) => {
                setUsuarios(resposta.data);
                setErro(null);
            })
            .catch(() => {
                setErro("Não foi possível carregar os usuários. Verifique se o back-end está rodando.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    async function excluir(id: number) {
        if (!window.confirm("Tem certeza que deseja excluir?")) return;
        try {
            await api.delete(`/usuarios/${id}`);
            setErroExclusao(null);
            if (editando?.id === id) setEditando(null);
        } catch (e) {
            const mensagem = axios.isAxiosError(e) ? e.response?.data?.message : null;
            setErroExclusao(mensagem || "Não foi possível excluir o usuário.");
        }
        carregarUsuarios();
    }

    if (loading) {
        return <p className="state-message">Carregando...</p>;
    }

    if (erro) {
        return <p className="state-error">{erro}</p>;
    }

    return (
        <>
            <UsuarioForm
                usuarioEditando={editando}
                usuariosExistentes={usuarios}
                onCancelar={() => setEditando(null)}
                onUsuarioSalvo={() => {
                    carregarUsuarios();
                    setEditando(null);
                }}
            />

            {erroExclusao && <p className="state-error">{erroExclusao}</p>}

            <UsuarioLista usuarios={usuarios} onEditar={setEditando} onExcluir={excluir} />
        </>
    );
}

export default UsuariosPage;
