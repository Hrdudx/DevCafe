import { useState } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";

interface UsuarioFormProps {
    onUsuarioSalvo: () => void;
    usuarioEditando?: Usuario | null;
}

function UsuarioForm({ onUsuarioSalvo, usuarioEditando }: UsuarioFormProps) {
    const [nome, setNome] = useState(usuarioEditando?.nome ?? "");
    const [username, setUsername] = useState(usuarioEditando?.username ?? "");
    const [email, setEmail] = useState(usuarioEditando?.email ?? "");

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const dados = { nome, username, email };

        if (usuarioEditando) {
            await api.put(`/usuarios/${usuarioEditando.id}`, dados);
        } else {
            await api.post("/usuarios", dados);
        }

        onUsuarioSalvo();
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
            />
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
            />
            <button type="submit">
                {usuarioEditando ? "Salvar alterações" : "Cadastrar"}
            </button>
        </form>
    );
}

export default UsuarioForm;
