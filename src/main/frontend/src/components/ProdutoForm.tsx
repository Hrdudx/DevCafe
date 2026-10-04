import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Produto } from "../types/Produto";

const CATEGORIAS = ["Cafés", "Bebidas Geladas", "Lanches", "Doces", "Salgados"];

interface ProdutoFormProps {
    onProdutoSalvo: () => void;
    onCancelar: () => void;
    produtoEditando?: Produto | null;
}

function ProdutoForm({ onProdutoSalvo, onCancelar, produtoEditando }: ProdutoFormProps) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [categoria, setCategoria] = useState(CATEGORIAS[0]);
    const [imagemUrl, setImagemUrl] = useState("");
    const [erro, setErro] = useState<string | null>(null);

    // Quando o usuário clica em "Editar", preenche o formulário com os dados do item.
    useEffect(() => {
        setNome(produtoEditando?.nome ?? "");
        setDescricao(produtoEditando?.descricao ?? "");
        setPreco(produtoEditando?.preco?.toString() ?? "");
        setCategoria(produtoEditando?.categoria ?? CATEGORIAS[0]);
        setImagemUrl(produtoEditando?.imagemUrl ?? "");
        setErro(null);
    }, [produtoEditando]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!nome.trim()) {
            setErro("Informe o nome do produto.");
            return;
        }

        if (Number(preco) <= 0) {
            setErro("O preço deve ser maior que zero.");
            return;
        }

        const dados = { nome, descricao, preco: Number(preco), categoria, imagemUrl };

        try {
            if (produtoEditando) {
                await api.put(`/produtos/${produtoEditando.id}`, dados);
            } else {
                await api.post("/produtos", dados);
                setNome("");
                setDescricao("");
                setPreco("");
                setImagemUrl("");
            }
            setErro(null);
            onProdutoSalvo();
        } catch {
            setErro("Não foi possível salvar o produto. Verifique os dados e tente novamente.");
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <input
                className="input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
            />
            <input
                className="input"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição"
            />
            <input
                className="input"
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Preço"
            />
            <select className="input" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
            <input
                className="input"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                placeholder="URL da imagem (opcional)"
            />
            {erro && <p className="form-error">{erro}</p>}
            <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                    {produtoEditando ? "Salvar alterações" : "Cadastrar"}
                </button>
                {produtoEditando && (
                    <button className="btn btn-outline" type="button" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default ProdutoForm;
