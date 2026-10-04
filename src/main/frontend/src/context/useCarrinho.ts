import { createContext, useContext } from "react";

// Quantidade de cada produto no carrinho, indexada pelo id do produto.
export type Carrinho = Record<number, number>;

interface CarrinhoContextValue {
    carrinho: Carrinho;
    quantidadeTotal: number;
    adicionar: (produtoId: number) => void;
    remover: (produtoId: number) => void;
    removerTudo: (produtoId: number) => void;
    limpar: () => void;
}

export const CarrinhoContext = createContext<CarrinhoContextValue | null>(null);

export function useCarrinho() {
    const contexto = useContext(CarrinhoContext);
    if (!contexto) {
        throw new Error("useCarrinho precisa estar dentro de <CarrinhoProvider>");
    }
    return contexto;
}
