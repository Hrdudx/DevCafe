import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import type { Permissao } from "../types/Permissao";
import Botao from "../components/Botao";

// Aula 07: tela de atribuição de permissões (relacionamento muitos-para-muitos).
// Escolhe um usuário, marca/desmarca as permissões e salva a lista de ids
// com PUT /usuarios/{id}/permissoes.
function UsuarioPermissoesPage() {
    const [parametros] = useSearchParams();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [permissoes, setPermissoes] = useState<Permissao[]>([]);
    const [usuarioId, setUsuarioId] = useState<number | null>(null);
    const [idsSelecionados, setIdsSelecionados] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        Promise.all([api.get<Usuario[]>("/usuarios"), api.get<Permissao[]>("/permissoes")])
            .then(([respostaUsuarios, respostaPermissoes]) => {
                setUsuarios(respostaUsuarios.data);
                setPermissoes(respostaPermissoes.data);
            })
            .catch(() => setErro("Não foi possível carregar os dados. Verifique se o back-end está rodando."))
            .finally(() => setLoading(false));
    }, []);

    function selecionarUsuario(id: number) {
        setSucesso(null);
        setErro(null);
        if (!id) {
            setUsuarioId(null);
            setIdsSelecionados([]);
            return;
        }
        setUsuarioId(id);
        api.get<Usuario>(`/usuarios/${id}/permissoes`)
            .then((resposta) => setIdsSelecionados(resposta.data.permissoes?.map((p) => p.id) ?? []))
            .catch(() => setErro("Não foi possível carregar as permissões do usuário."));
    }

    // Vindo da tela de detalhe (/atribuir-permissoes?usuario=id), já abre com o usuário escolhido.
    const usuarioDaUrl = Number(parametros.get("usuario"));
    useEffect(() => {
        if (usuarioDaUrl) selecionarUsuario(usuarioDaUrl);
    }, [usuarioDaUrl]);

    function alternarPermissao(id: number) {
        setSucesso(null);
        setIdsSelecionados((anteriores) =>
            anteriores.includes(id) ? anteriores.filter((p) => p !== id) : [...anteriores, id]
        );
    }

    async function salvar() {
        if (usuarioId === null) return;
        setSalvando(true);
        try {
            await api.put(`/usuarios/${usuarioId}/permissoes`, idsSelecionados);
            setErro(null);
            setSucesso("Permissões salvas!");
        } catch (e) {
            const mensagem = axios.isAxiosError(e) ? e.response?.data?.message : null;
            setErro(mensagem || "Não foi possível salvar as permissões.");
        } finally {
            setSalvando(false);
        }
    }

    if (loading) return <p className="state-message">Carregando...</p>;

    return (
        <div className="max-w-2xl">
            <label htmlFor="usuario" className="mb-1 block text-sm font-semibold text-texto">
                Usuário
            </label>
            <select
                id="usuario"
                className="mb-5 w-full rounded-lg border border-borda-forte bg-white px-3 py-2 text-sm text-texto focus:border-primary focus:outline-none"
                value={usuarioId ?? ""}
                onChange={(e) => selecionarUsuario(Number(e.target.value))}
            >
                <option value="">Selecione...</option>
                {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.nome} ({u.username})
                    </option>
                ))}
            </select>

            <fieldset className="m-0 mb-5 rounded-lg border border-borda-forte p-4" disabled={usuarioId === null}>
                <legend className="px-2 text-sm font-semibold text-texto">Permissões</legend>
                {permissoes.length === 0 && (
                    <p className="m-0 text-sm text-texto-suave">Nenhuma permissão cadastrada. Cadastre em Permissões.</p>
                )}
                {permissoes.map((p) => (
                    <label
                        key={p.id}
                        className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm ${
                            usuarioId === null ? "opacity-50" : "cursor-pointer hover:bg-primary-soft"
                        }`}
                    >
                        <input
                            type="checkbox"
                            className="h-4 w-4 shrink-0 accent-primary"
                            checked={idsSelecionados.includes(p.id)}
                            onChange={() => alternarPermissao(p.id)}
                        />
                        <span className="text-texto">
                            <strong>{p.nome}</strong>
                            {p.descricao && <span className="text-texto-suave"> — {p.descricao}</span>}
                        </span>
                    </label>
                ))}
            </fieldset>

            {erro && <p className="mt-0 mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>}
            {sucesso && <p className="mt-0 mb-4 rounded-lg bg-green-100 px-4 py-2 text-sm text-green-800">{sucesso}</p>}

            <Botao variante="sucesso" onClick={salvar} disabled={usuarioId === null || salvando}>
                {salvando ? "Salvando..." : "Salvar permissões"}
            </Botao>
        </div>
    );
}

export default UsuarioPermissoesPage;
