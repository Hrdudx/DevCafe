import { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";
import type { Produto } from "../types/Produto";
import ProdutoForm from "../components/ProdutoForm";
import ProdutoLista from "../components/ProdutoLista";

function ProdutosPage() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [erroExclusao, setErroExclusao] = useState<string | null>(null);
    const [editando, setEditando] = useState<Produto | null>(null);

    function carregarProdutos() {
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
        if (!window.confirm("Tem certeza que deseja excluir?")) return;
        try {
            await api.delete(`/produtos/${id}`);
            setErroExclusao(null);
            if (editando?.id === id) setEditando(null);
        } catch (e) {
            const mensagem = axios.isAxiosError(e) ? e.response?.data?.message : null;
            setErroExclusao(mensagem || "Não foi possível excluir o produto.");
        }
        carregarProdutos();
    }

    if (loading) {
        return <p className="state-message">Carregando...</p>;
    }

    if (erro) {
        return <p className="state-error">{erro}</p>;
    }

    return (
        <>
            <ProdutoForm
                produtoEditando={editando}
                onCancelar={() => setEditando(null)}
                onProdutoSalvo={() => {
                    carregarProdutos();
                    setEditando(null);
                }}
            />

            {erroExclusao && <p className="state-error">{erroExclusao}</p>}

            <ProdutoLista produtos={produtos} onEditar={setEditando} onExcluir={excluir} />
        </>
    );
}

export default ProdutosPage;
