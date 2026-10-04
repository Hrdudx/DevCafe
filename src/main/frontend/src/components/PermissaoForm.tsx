import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Permissao } from "../types/Permissao";

interface PermissaoFormProps {
    onPermissaoSalva: () => void;
    onCancelar: () => void;
    permissaoEditando?: Permissao | null;
}

function PermissaoForm({ onPermissaoSalva, onCancelar, permissaoEditando }: PermissaoFormProps) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [erro, setErro] = useState<string | null>(null);

    // Quando o usuário clica em "Editar", preenche o formulário com os dados do item.
    useEffect(() => {
        setNome(permissaoEditando?.nome ?? "");
        setDescricao(permissaoEditando?.descricao ?? "");
        setErro(null);
    }, [permissaoEditando]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!nome.trim()) {
            setErro("Informe o nome da permissão.");
            return;
        }

        const dados = { nome, descricao };

        try {
            if (permissaoEditando) {
                await api.put(`/permissoes/${permissaoEditando.id}`, dados);
            } else {
                await api.post("/permissoes", dados);
                setNome("");
                setDescricao("");
            }
            setErro(null);
            onPermissaoSalva();
        } catch {
            setErro("Não foi possível salvar a permissão. Verifique os dados e tente novamente.");
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <input
                className="input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
            />
            <input
                className="input"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição"
            />
            {erro && <p className="form-error">{erro}</p>}
            <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                    {permissaoEditando ? "Salvar alterações" : "Cadastrar"}
                </button>
                {permissaoEditando && (
                    <button className="btn btn-outline" type="button" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default PermissaoForm;
