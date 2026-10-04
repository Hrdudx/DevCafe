import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee, Eye, EyeOff, Lock, Mail } from "lucide-react";
import axios from "axios";
import api from "../services/api";
import { salvarUsuarioLogado } from "../services/auth";
import type { Usuario } from "../types/Usuario";

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
    );
}

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

                    <div className="login-divider">ou entre com</div>
                    <button className="btn btn-google btn-lg btn-block" type="button" onClick={() => setErro("Entrar com Google ainda não está disponível. Use e-mail e senha.")}>
                        <GoogleIcon />
                        Entrar com Google
                    </button>

                    <p className="login-signup">
                        Ainda não tem uma conta?{" "}
                        <a
                            className="link"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setErro("Peça a um administrador para criar sua conta em Usuários.");
                            }}
                        >
                            Cadastre-se
                        </a>
                    </p>
                </div>
            </section>
        </div>
    );
}

export default LoginPage;
