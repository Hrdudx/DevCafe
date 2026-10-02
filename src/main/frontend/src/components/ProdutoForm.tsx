import { useState } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Produto } from "../types/Produto";

interface ProdutoFormProps {
    onProdutoSalvo: () => void;
    produtoEditando?: Produto | null;
}

function ProdutoForm({ onProdutoSalvo, produtoEditando }: ProdutoFormProps) {
    const [nome, setNome] = useState(produtoEditando?.nome ?? "");
    const [descricao, setDescricao] = useState(produtoEditando?.descricao ?? "");
    const [preco, setPreco] = useState(produtoEditando?.preco?.toString() ?? "");
    const [erro, setErro] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (Number(preco) <= 0) {
            setErro("O preço deve ser maior que zero.");
            return;
        }

        setErro(null);
        const dados = { nome, descricao, preco: Number(preco) };

        try {
            if (produtoEditando) {
                await api.put(`/produtos/${produtoEditando.id}`, dados);
            } else {
                await api.post("/produtos", dados);
            }
            onProdutoSalvo();
        } catch {
            setErro("Não foi possível salvar o produto. Verifique os dados e tente novamente.");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
            />
            <input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição"
            />
            <input
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Preço"
            />
            {erro && <p>{erro}</p>}
            <button type="submit">
                {produtoEditando ? "Salvar alterações" : "Cadastrar"}
            </button>
        </form>
    );
}

export default ProdutoForm;
