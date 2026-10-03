const CHAVE = "devcafe_usuario";

export function salvarUsuarioLogado(email: string) {
    const nome = email.split("@")[0] || "Visitante";
    const nomeFormatado = nome.charAt(0).toUpperCase() + nome.slice(1);
    localStorage.setItem(CHAVE, nomeFormatado);
}

export function obterUsuarioLogado(): string {
    try {
        return localStorage.getItem(CHAVE) ?? "Visitante";
    } catch {
        return "Visitante";
    }
}
