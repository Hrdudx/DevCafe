import type { Usuario } from "../types/Usuario";

const CHAVE = "devcafe_usuario_logado";

// Guarda no navegador o usuário que entrou (só nome e contato, nunca a senha).
export function salvarUsuarioLogado(usuario: Usuario) {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(usuario));
    } catch {
        // Sem localStorage o login só não sobrevive a um recarregamento.
    }
}

export function obterUsuario(): Usuario | null {
    try {
        const salvo = localStorage.getItem(CHAVE);
        return salvo ? JSON.parse(salvo) : null;
    } catch {
        return null;
    }
}

export function sair() {
    try {
        localStorage.removeItem(CHAVE);
    } catch {
        // Nada a limpar.
    }
}

// Primeiro nome do usuário logado, usado nas saudações.
export function obterUsuarioLogado(): string {
    const usuario = obterUsuario();
    return usuario?.nome.split(" ")[0] || "Visitante";
}

// Perfil exibido no topo da tela, a partir das permissões do usuário logado.
export function obterPerfilLogado(): string {
    const permissoes = obterUsuario()?.permissoes ?? [];
    if (permissoes.some((p) => p.nome === "ADMIN")) return "Administrador";
    if (permissoes.length === 0) return "Equipe";
    const nome = permissoes[0].nome.toLowerCase();
    return nome.charAt(0).toUpperCase() + nome.slice(1);
}

export function obterEmailLogado(): string {
    return obterUsuario()?.email ?? "";
}
