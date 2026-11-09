import axios from "axios";
import { obterToken, sair } from "./auth";

// Endereço da API. Pode ser trocado pela variável VITE_API_URL (ex.: no Docker);
// sem ela, usa o back-end rodando na própria máquina.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
});

// Envia o token JWT em todas as requisições: "Authorization: Bearer <token>".
api.interceptors.request.use((config) => {
    const token = obterToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Se o back-end responder 401 (token vencido ou inválido), volta para o login.
// Um 401 no próprio /auth/login é só senha errada, e a tela de login trata.
api.interceptors.response.use(
    (resposta) => resposta,
    (erro) => {
        const url: string = erro?.config?.url ?? "";
        if (erro?.response?.status === 401 && !url.includes("/auth/login")) {
            sair();
            window.location.href = "/login";
        }
        return Promise.reject(erro);
    }
);

export default api;
