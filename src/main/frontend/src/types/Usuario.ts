import type { Permissao } from "./Permissao";

export interface Usuario {
    id: number;
    nome: string;
    username: string;
    email: string;
    // Aula 07: permissões do usuário (relacionamento muitos-para-muitos).
    permissoes?: Permissao[];
}
