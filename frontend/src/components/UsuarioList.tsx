import { useEffect, useState } from "react";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import UsuarioItem from "./UsuarioItem";
import UsuarioForm from "./UsuarioForm";

function UsuarioList() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [editando, setEditando] = useState<Usuario | null>(null);

    function carregarUsuarios() {
        setLoading(true);
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
        await api.delete(`/usuarios/${id}`);
        carregarUsuarios();
    }

    if (loading) {
        return <p>Carregando usuários...</p>;
    }

    if (erro) {
        return <p>{erro}</p>;
    }

    return (
        <>
            <UsuarioForm
                key={editando?.id ?? "novo"}
                usuarioEditando={editando}
                onUsuarioSalvo={() => {
                    carregarUsuarios();
                    setEditando(null);
                }}
            />

            <ul>
                {usuarios.map((usuario) => (
                    <UsuarioItem
                        key={usuario.id}
                        usuario={usuario}
                        onEditar={() => setEditando(usuario)}
                        onExcluir={() => excluir(usuario.id)}
                    />
                ))}
            </ul>
        </>
    );
}

export default UsuarioList;
