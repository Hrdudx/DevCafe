import type { Produto } from "../types/Produto";

interface ProdutoItemProps {
    produto: Produto;
    onEditar?: () => void;
    onExcluir?: () => void;
}

function ProdutoItem({ produto, onEditar, onExcluir }: ProdutoItemProps) {
    return (
        <li>
            <strong>{produto.nome}</strong> — {produto.descricao} (R$ {produto.preco.toFixed(2)})
            {onEditar && <button onClick={onEditar}>Editar</button>}
            {onExcluir && <button onClick={onExcluir}>Excluir</button>}
        </li>
    );
}

export default ProdutoItem;
