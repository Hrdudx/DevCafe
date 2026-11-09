import type { Cliente } from "./Cliente";
import type { Produto } from "./Produto";

export interface Avaliacao {
    id: number;
    nota: number;
    comentario?: string;
    dataHora: string;
    cliente: Cliente;
    produto: Produto;
}
