const CHAVE = "devcafe_usuario";
const CHAVE_EMAIL = "devcafe_email";

export function salvarUsuarioLogado(email: string) {
    const nome = email.split("@")[0] || "Visitante";
    const nomeFormatado = nome.charAt(0).toUpperCase() + nome.slice(1);
    try {
        localStorage.setItem(CHAVE, nomeFormatado);
        localStorage.setItem(CHAVE_EMAIL, email.includes("@") ? email : "");
    } catch {
        // Sem localStorage o nome só não fica salvo.
    }
}

export function obterUsuarioLogado(): string {
    try {
        return localStorage.getItem(CHAVE) ?? "Visitante";
    } catch {
        return "Visitante";
    }
}

export function obterEmailLogado(): string {
    try {
        return localStorage.getItem(CHAVE_EMAIL) ?? "";
    } catch {
        return "";
    }
}
