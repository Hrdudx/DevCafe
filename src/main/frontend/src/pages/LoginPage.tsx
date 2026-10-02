import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [lembrar, setLembrar] = useState(true);
    const navigate = useNavigate();

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        // Login ainda não valida credenciais de verdade — autenticação real
        // (Spring Security + JWT) é um próximo passo do projeto.
        navigate("/");
    }

    return (
        <div className="login-page">
            <div className="login-hero">
                <div className="login-hero-brand">
                    <span className="login-hero-icon">☕</span>
                    <h1>Devcafé</h1>
                </div>
            </div>

            <div className="login-form-side">
                <div className="login-card">
                    <h2 className="login-title">Bem-vindo(a) de volta!</h2>
                    <p className="page-subtitle">Acesse sua conta para continuar</p>

                    <form className="form-stacked" onSubmit={handleSubmit}>
                        <label className="form-label">
                            E-mail
                            <span className="input-icon-wrap">
                                <span className="input-icon">✉️</span>
                                <input
                                    className="input input-with-icon"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seuemail@exemplo.com"
                                />
                            </span>
                        </label>
                        <label className="form-label">
                            Senha
                            <span className="input-icon-wrap">
                                <span className="input-icon">🔒</span>
                                <input
                                    className="input input-with-icon"
                                    type={mostrarSenha ? "text" : "password"}
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Sua senha"
                                />
                                <button
                                    type="button"
                                    className="input-icon-toggle"
                                    onClick={() => setMostrarSenha((v) => !v)}
                                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {mostrarSenha ? "🙈" : "👁️"}
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
                            <a
                                className="login-link"
                                href="#"
                                onClick={(e) => e.preventDefault()}
                            >
                                Esqueceu a senha?
                            </a>
                        </div>

                        <button className="btn btn-primary btn-block" type="submit">
                            Entrar
                        </button>
                    </form>

                    <div className="login-divider">ou continue com</div>
                    <button className="btn btn-google btn-block" type="button" onClick={handleSubmit}>
                        <span className="google-icon">G</span>
                        Entrar com Google
                    </button>

                    <p className="login-note">
                        Tela de demonstração — login ainda não valida credenciais reais.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
