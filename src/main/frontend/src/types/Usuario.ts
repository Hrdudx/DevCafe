import type { Permissao } from "./Permissao";

export interface Usuario {
    id: number;
    nome: string;
    username: string;
    email: string;
    // Só vem preenchido nas respostas que trazem o relacionamento (ex.: GET /usuarios/{id}/permissoes).
    permissoes?: Permissao[];
}
