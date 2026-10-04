import { useEffect, useState } from "react";
import api from "../services/api";
import type { Produto } from "../types/Produto";
import { obterFavoritos, salvarFavoritos } from "../services/favoritos";

// Carrega os produtos do cardápio e controla os favoritos (guardados no navegador).
export function useProdutos() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [favoritos, setFavoritos] = useState<number[]>(obterFavoritos);

    useEffect(() => {
        api.get<Produto[]>("/produtos")
            .then((resposta) => {
                setProdutos(resposta.data);
                setErro(null);
            })
            .catch(() => setErro("Não foi possível carregar o cardápio. Verifique se o back-end está rodando."))
            .finally(() => setLoading(false));
    }, []);

    function alternarFavorito(produtoId: number) {
        setFavoritos((atual) => {
            const novos = atual.includes(produtoId)
                ? atual.filter((id) => id !== produtoId)
                : [...atual, produtoId];
            salvarFavoritos(novos);
            return novos;
        });
    }

    return { produtos, loading, erro, favoritos, alternarFavorito };
}

export function filtrarProdutos(produtos: Produto[], categoria: string, busca: string) {
    const termo = busca.trim().toLowerCase();
    return produtos.filter((produto) => {
        const bateCategoria = categoria === "Todos" || produto.categoria === categoria;
        const bateBusca = termo === "" || produto.nome.toLowerCase().includes(termo);
        return bateCategoria && bateBusca;
    });
}
