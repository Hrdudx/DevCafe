import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import type { Permissao } from "../types/Permissao";

// Tela de atribuição muitos-para-muitos: escolhe um usuário e marca os perfis dele.
function UsuarioPermissoesPage() {
    const [params] = useSearchParams();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [permissoes, setPermissoes] = useState<Permissao[]>([]);
    const [usuarioId, setUsuarioId] = useState<number | null>(null);
    const [idsSelecionados, setIdsSelecionados] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [mensagem, setMensagem] = useState<string | null>(null);
    const [erroSalvar, setErroSalvar] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([api.get<Usuario[]>("/usuarios"), api.get<Permissao[]>("/permissoes")])
            .then(([respUsuarios, respPermissoes]) => {
                setUsuarios(respUsuarios.data);
                setPermissoes(respPermissoes.data);
                setErro(null);
            })
            .catch(() => {
                setErro("Não foi possível carregar usuários e permissões. Verifique se o back-end está rodando.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Vindo da tela de Usuários (botão "Permissões"), já abre com o usuário escolhido.
    useEffect(() => {
        const id = Number(params.get("usuario"));
        if (id) selecionarUsuario(id);
    }, [params]);

    function selecionarUsuario(id: number) {
        setMensagem(null);
        setErroSalvar(null);
        if (!id) {
            setUsuarioId(null);
            setIdsSelecionados([]);
            return;
        }
        setUsuarioId(id);
        api.get<Usuario>(`/usuarios/${id}/permissoes`)
            .then((r) => setIdsSelecionados(r.data.permissoes?.map((p) => p.id) ?? []))
            .catch(() => setErroSalvar("Não foi possível carregar as permissões deste usuário."));
    }

    function alternarPermissao(id: number) {
        setMensagem(null);
        setIdsSelecionados((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
    }

    async function salvar() {
        if (usuarioId === null) return;
        try {
            await api.put(`/usuarios/${usuarioId}/permissoes`, idsSelecionados);
            setErroSalvar(null);
            setMensagem("Permissões salvas!");
        } catch (e) {
            const texto = axios.isAxiosError(e) ? e.response?.data?.message : null;
            setMensagem(null);
            setErroSalvar(texto || "Não foi possível salvar as permissões.");
        }
    }

    if (loading) {
        return <p className="state-message">Carregando...</p>;
    }

    if (erro) {
        return <p className="state-error">{erro}</p>;
    }

    return (
        <div className="atribuir-permissoes">
            <label className="field">
                <span className="field-label">Usuário</span>
                <select
                    className="input"
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
            </label>

            <fieldset className="permissoes-opcoes" disabled={usuarioId === null}>
                <legend className="field-label">Permissões</legend>
                {permissoes.length === 0 && (
                    <p className="state-message">Nenhuma permissão cadastrada. Cadastre em Configurações → Permissões.</p>
                )}
                {permissoes.map((p) => (
                    <label key={p.id} className="permissao-opcao">
                        <input
                            type="checkbox"
                            checked={idsSelecionados.includes(p.id)}
                            onChange={() => alternarPermissao(p.id)}
                        />
                        <span>
                            <strong>{p.nome}</strong>
                            {p.descricao && <small>{p.descricao}</small>}
                        </span>
                    </label>
                ))}
            </fieldset>

            {erroSalvar && <p className="state-error">{erroSalvar}</p>}
            {mensagem && <p className="state-success">{mensagem}</p>}

            <div className="form-actions">
                <button className="btn btn-primary" onClick={salvar} disabled={usuarioId === null}>
                    Salvar permissões
                </button>
            </div>
        </div>
    );
}

export default UsuarioPermissoesPage;
