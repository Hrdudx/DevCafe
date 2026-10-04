import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";

interface UsuarioFormProps {
    onUsuarioSalvo: () => void;
    onCancelar: () => void;
    usuarioEditando?: Usuario | null;
    usuariosExistentes: Usuario[];
}

function UsuarioForm({ onUsuarioSalvo, onCancelar, usuarioEditando, usuariosExistentes }: UsuarioFormProps) {
    const [nome, setNome] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState<string | null>(null);

    // Quando o usuário clica em "Editar", preenche o formulário com os dados do item.
    // A senha nunca vem do back-end, então começa sempre em branco.
    useEffect(() => {
        setNome(usuarioEditando?.nome ?? "");
        setUsername(usuarioEditando?.username ?? "");
        setEmail(usuarioEditando?.email ?? "");
        setSenha("");
        setErro(null);
    }, [usuarioEditando]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!nome.trim() || !username.trim() || !email.trim()) {
            setErro("Preencha nome, username e e-mail.");
            return;
        }

        const emailDuplicado = usuariosExistentes.some(
            (usuario) =>
                usuario.email.toLowerCase() === email.toLowerCase() &&
                usuario.id !== usuarioEditando?.id
        );

        if (emailDuplicado) {
            setErro("Já existe um usuário cadastrado com esse e-mail.");
            return;
        }

        if (!usuarioEditando && senha.length < 4) {
            setErro("A senha precisa ter ao menos 4 caracteres.");
            return;
        }

        // Na edição, senha em branco mantém a senha atual.
        const dados = { nome, username, email, senha: senha || null };

        try {
            if (usuarioEditando) {
                await api.put(`/usuarios/${usuarioEditando.id}`, dados);
            } else {
                await api.post("/usuarios", dados);
                setNome("");
                setUsername("");
                setEmail("");
                setSenha("");
            }
            setErro(null);
            onUsuarioSalvo();
        } catch (e) {
            const mensagem = axios.isAxiosError(e) ? e.response?.data?.message : null;
            setErro(mensagem || "Não foi possível salvar o usuário. Verifique os dados e tente novamente.");
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
            />
            <input
                className="input"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder={usuarioEditando ? "Nova senha (opcional)" : "Senha"}
                autoComplete="new-password"
            />
            {erro && <p className="form-error">{erro}</p>}
            <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                    {usuarioEditando ? "Salvar alterações" : "Cadastrar"}
                </button>
                {usuarioEditando && (
                    <button className="btn btn-outline" type="button" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default UsuarioForm;
