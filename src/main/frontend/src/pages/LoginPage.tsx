import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee, Eye, EyeOff, Lock, Mail } from "lucide-react";
import axios from "axios";
import api from "../services/api";
import { salvarUsuarioLogado } from "../services/auth";
import type { Usuario } from "../types/Usuario";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [lembrar, setLembrar] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [entrando, setEntrando] = useState(false);
    const navigate = useNavigate();

    function entrar(event: FormEvent) {
        event.preventDefault();
        if (!email || !senha) {
            setErro("Informe e-mail e senha.");
            return;
        }
        setEntrando(true);
        setErro(null);
        // Confere e-mail e senha com os usuários cadastrados no back-end.
        api.post<Usuario>("/auth/login", { email, senha })
            .then((resposta) => {
                salvarUsuarioLogado(resposta.data);
                navigate("/");
            })
            .catch((e) => {
                if (axios.isAxiosError(e) && e.response?.status === 401) {
                    setErro("E-mail ou senha inválidos.");
                } else {
                    setErro("Não foi possível entrar. Verifique se o back-end está rodando.");
                }
            })
            .finally(() => setEntrando(false));
    }

    return (
        <div className="login-page">
            <section className="login-hero">
                <div className="login-hero-brand">
                    <Coffee size={64} strokeWidth={1.6} />
                    <h1>Devcafé</h1>
                    <p>
                        Mais que café,
                        <br />
                        boas ideias.
                    </p>
                </div>
            </section>

            <section className="login-form-side">
                <div className="login-card">
                    <h2 className="login-title">Bem-vindo(a)!</h2>
                    <p className="page-subtitle">Acesse sua conta para continuar</p>

                    <form className="login-form" onSubmit={entrar}>
                        <label className="field">
                            <span className="field-label">E-mail</span>
                            <span className="field-control">
                                <Mail size={17} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seuemail@exemplo.com"
                                />
                            </span>
                        </label>
                        <label className="field">
                            <span className="field-label">Senha</span>
                            <span className="field-control">
                                <Lock size={17} />
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Sua senha"
                                />
                                <button
                                    type="button"
                                    className="field-toggle"
                                    onClick={() => setMostrarSenha((v) => !v)}
                                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {mostrarSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </span>
                        </label>

                        <div className="login-row">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={lembrar}
                                    onChange={(e) => setLembrar(e.target.checked)}
                                />
                                Lembrar de mim
                            </label>
                            <a className="link" href="#" onClick={(e) => e.preventDefault()}>
                                Esqueceu sua senha?
                            </a>
                        </div>

                        {erro && <p className="state-error">{erro}</p>}

                        <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={entrando}>
                            {entrando ? "Entrando..." : "Entrar"}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default LoginPage;
