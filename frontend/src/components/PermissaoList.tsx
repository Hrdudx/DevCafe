import { useEffect, useState } from "react";
import api from "../services/api";
import type { Permissao } from "../types/Permissao";
import PermissaoItem from "./PermissaoItem";
import PermissaoForm from "./PermissaoForm";

function PermissaoList() {
    const [permissoes, setPermissoes] = useState<Permissao[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [editando, setEditando] = useState<Permissao | null>(null);

    function carregarPermissoes() {
        setLoading(true);
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
        await api.delete(`/permissoes/${id}`);
        carregarPermissoes();
    }

    if (loading) {
        return <p>Carregando permissões...</p>;
    }

    if (erro) {
        return <p>{erro}</p>;
    }

    return (
        <>
            <PermissaoForm
                key={editando?.id ?? "novo"}
                permissaoEditando={editando}
                onPermissaoSalva={() => {
                    carregarPermissoes();
                    setEditando(null);
                }}
            />

            <ul>
                {permissoes.map((permissao) => (
                    <PermissaoItem
                        key={permissao.id}
                        permissao={permissao}
                        onEditar={() => setEditando(permissao)}
                        onExcluir={() => excluir(permissao.id)}
                    />
                ))}
            </ul>
        </>
    );
}

export default PermissaoList;
