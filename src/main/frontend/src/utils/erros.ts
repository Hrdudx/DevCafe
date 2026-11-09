import axios from "axios";

export interface ErroApi {
    mensagem: string;
    // Erros por campo vindos do Bean Validation, ex.: { email: "Informe um e-mail válido" }.
    campos: Record<string, string>;
}

// Lê a resposta de erro do back-end (ResponseStatusException ou @Valid).
export function lerErroApi(e: unknown, mensagemPadrao: string): ErroApi {
    if (axios.isAxiosError(e)) {
        const dados = e.response?.data;
        return {
            mensagem: dados?.message || mensagemPadrao,
            campos: dados?.erros ?? {},
        };
    }
    return { mensagem: mensagemPadrao, campos: {} };
}
