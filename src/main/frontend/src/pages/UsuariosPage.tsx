import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import UsuarioForm from "../components/UsuarioForm";
import UsuarioLista from "../components/UsuarioLista";

function UsuariosPage() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
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

    // Vindo do detalhe (botão "Editar"), /usuarios?editar=2 já abre o formulário preenchido.
    useEffect(() => {
        const id = Number(params.get("editar"));
        if (id) setEditando(usuarios.find((u) => u.id === id) ?? null);
    }, [params, usuarios]);

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
                onCancelar={() => {
                    setEditando(null);
                    navigate("/usuarios");
                }}
                onUsuarioSalvo={() => {
                    carregarUsuarios();
                    setEditando(null);
                }}
            />

            {erroExclusao && <p className="state-error">{erroExclusao}</p>}

            <UsuarioLista
                usuarios={usuarios}
                onEditar={setEditando}
                onExcluir={excluir}
                onPermissoes={(id) => navigate(`/atribuir-permissoes?usuario=${id}`)}
            />
        </>
    );
}

export default UsuariosPage;
