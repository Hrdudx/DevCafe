import { useEffect, useState } from "react";
import api from "../services/api";
import type { Produto } from "../types/Produto";
import ProdutoItem from "./ProdutoItem";
import ProdutoForm from "./ProdutoForm";

function ProdutoList() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [editando, setEditando] = useState<Produto | null>(null);

    function carregarProdutos() {
        setLoading(true);
        api.get<Produto[]>("/produtos")
            .then((resposta) => {
                setProdutos(resposta.data);
                setErro(null);
            })
            .catch(() => {
                setErro("Não foi possível carregar os produtos. Verifique se o back-end está rodando.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        carregarProdutos();
    }, []);

    async function excluir(id: number) {
        await api.delete(`/produtos/${id}`);
        carregarProdutos();
    }

    if (loading) {
        return <p>Carregando produtos...</p>;
    }

    if (erro) {
        return <p>{erro}</p>;
    }

    return (
        <>
            <ProdutoForm
                key={editando?.id ?? "novo"}
                produtoEditando={editando}
                onProdutoSalvo={() => {
                    carregarProdutos();
                    setEditando(null);
                }}
            />

            <ul>
                {produtos.map((produto) => (
                    <ProdutoItem
                        key={produto.id}
                        produto={produto}
                        onEditar={() => setEditando(produto)}
                        onExcluir={() => excluir(produto.id)}
                    />
                ))}
            </ul>
        </>
    );
}

export default ProdutoList;
