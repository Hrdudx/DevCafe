import { useState } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Permissao } from "../types/Permissao";

interface PermissaoFormProps {
    onPermissaoSalva: () => void;
    permissaoEditando?: Permissao | null;
}

function PermissaoForm({ onPermissaoSalva, permissaoEditando }: PermissaoFormProps) {
    const [nome, setNome] = useState(permissaoEditando?.nome ?? "");
    const [descricao, setDescricao] = useState(permissaoEditando?.descricao ?? "");

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const dados = { nome, descricao };

        if (permissaoEditando) {
            await api.put(`/permissoes/${permissaoEditando.id}`, dados);
        } else {
            await api.post("/permissoes", dados);
        }

        onPermissaoSalva();
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
            <button className="btn btn-primary" type="submit">
                {permissaoEditando ? "Salvar alterações" : "Cadastrar"}
            </button>
        </form>
    );
}

export default PermissaoForm;
