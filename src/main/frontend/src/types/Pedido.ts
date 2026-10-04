import type { Produto } from "./Produto";

export interface ItemPedido {
    id: number;
    produto: Produto;
    quantidade: number;
    precoUnitario: number;
}

export interface Pedido {
    id: number;
    dataHora: string;
    status: string;
    total: number;
    cliente?: string;
    telefone?: string;
    email?: string;
    observacoes?: string;
    formaPagamento?: string;
    itens: ItemPedido[];
}
