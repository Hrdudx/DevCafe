import type { Usuario } from "../types/Usuario";

const CHAVE_TOKEN = "devcafe_token";
const CHAVE_USUARIO = "devcafe_usuario_logado";

// Resposta do POST /api/auth/login.
export interface RespostaLogin {
    token: string;
    usuario: Usuario;
}

// Guarda no navegador o token JWT e os dados do usuário que entrou (nunca a senha).
export function salvarSessao({ token, usuario }: RespostaLogin) {
    try {
        localStorage.setItem(CHAVE_TOKEN, token);
        localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
    } catch {
        // Sem localStorage o login só não sobrevive a um recarregamento.
    }
}

export function obterToken(): string | null {
    try {
        return localStorage.getItem(CHAVE_TOKEN);
    } catch {
        return null;
    }
}

export function obterUsuario(): Usuario | null {
    try {
        const salvo = localStorage.getItem(CHAVE_USUARIO);
        return salvo ? JSON.parse(salvo) : null;
    } catch {
        return null;
    }
}

export function sair() {
    try {
        localStorage.removeItem(CHAVE_TOKEN);
        localStorage.removeItem(CHAVE_USUARIO);
    } catch {
        // Nada a limpar.
    }
}

// Primeiro nome do usuário logado, usado nas saudações.
export function obterUsuarioLogado(): string {
    const usuario = obterUsuario();
    return usuario?.nome.split(" ")[0] || "Visitante";
}

export function obterEmailLogado(): string {
    return obterUsuario()?.email ?? "";
}
