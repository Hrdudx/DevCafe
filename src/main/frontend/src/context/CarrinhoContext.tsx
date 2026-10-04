import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CarrinhoContext } from "./useCarrinho";
import type { Carrinho } from "./useCarrinho";

const CHAVE = "devcafe_carrinho";


function carregarCarrinho(): Carrinho {
    try {
        return JSON.parse(localStorage.getItem(CHAVE) ?? "{}");
    } catch {
        return {};
    }
}

export function CarrinhoProvider({ children }: { children: ReactNode }) {
    const [carrinho, setCarrinho] = useState<Carrinho>(carregarCarrinho);

    useEffect(() => {
        try {
            localStorage.setItem(CHAVE, JSON.stringify(carrinho));
        } catch {
            // Sem localStorage o carrinho só não sobrevive a um recarregamento.
        }
    }, [carrinho]);

    function adicionar(produtoId: number) {
        setCarrinho((atual) => ({ ...atual, [produtoId]: (atual[produtoId] ?? 0) + 1 }));
    }

    function remover(produtoId: number) {
        setCarrinho((atual) => {
            const quantidade = (atual[produtoId] ?? 0) - 1;
            const novo = { ...atual };
            if (quantidade <= 0) {
                delete novo[produtoId];
            } else {
                novo[produtoId] = quantidade;
            }
            return novo;
        });
    }

    function removerTudo(produtoId: number) {
        setCarrinho((atual) => {
            const novo = { ...atual };
            delete novo[produtoId];
            return novo;
        });
    }

    const quantidadeTotal = Object.values(carrinho).reduce((soma, q) => soma + q, 0);

    return (
        <CarrinhoContext.Provider
            value={{ carrinho, quantidadeTotal, adicionar, remover, removerTudo, limpar: () => setCarrinho({}) }}
        >
            {children}
        </CarrinhoContext.Provider>
    );
}
