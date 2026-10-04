import type { Produto } from "../types/Produto";
import ProdutoItem from "./ProdutoItem";

interface ProdutoListaProps {
    produtos: Produto[];
    onEditar: (produto: Produto) => void;
    onExcluir: (id: number) => void;
}

function ProdutoLista({ produtos, onEditar, onExcluir }: ProdutoListaProps) {
    if (produtos.length === 0) {
        return <p className="state-message">Nenhum cadastro ainda.</p>;
    }

    return (
        <ul className="list">
            {produtos.map((produto) => (
                <ProdutoItem
                    key={produto.id}
                    produto={produto}
                    onEditar={() => onEditar(produto)}
                    onExcluir={() => onExcluir(produto.id)}
                />
            ))}
        </ul>
    );
}

export default ProdutoLista;
