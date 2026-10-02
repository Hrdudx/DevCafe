import { useState } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";

interface UsuarioFormProps {
    onUsuarioSalvo: () => void;
    usuarioEditando?: Usuario | null;
    usuariosExistentes: Usuario[];
}

function UsuarioForm({ onUsuarioSalvo, usuarioEditando, usuariosExistentes }: UsuarioFormProps) {
    const [nome, setNome] = useState(usuarioEditando?.nome ?? "");
    const [username, setUsername] = useState(usuarioEditando?.username ?? "");
    const [email, setEmail] = useState(usuarioEditando?.email ?? "");
    const [erro, setErro] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const emailDuplicado = usuariosExistentes.some(
            (usuario) =>
                usuario.email.toLowerCase() === email.toLowerCase() &&
                usuario.id !== usuarioEditando?.id
        );

        if (emailDuplicado) {
            setErro("Já existe um usuário cadastrado com esse e-mail.");
            return;
        }

        setErro(null);
        const dados = { nome, username, email };

        try {
            if (usuarioEditando) {
                await api.put(`/usuarios/${usuarioEditando.id}`, dados);
            } else {
                await api.post("/usuarios", dados);
            }
            onUsuarioSalvo();
        } catch {
            setErro("Não foi possível salvar o usuário. Verifique os dados e tente novamente.");
        }
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
            {erro && <p>{erro}</p>}
            <button type="submit">
                {usuarioEditando ? "Salvar alterações" : "Cadastrar"}
            </button>
        </form>
    );
}

export default UsuarioForm;
