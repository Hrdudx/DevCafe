import type { Produto } from "../types/Produto";

interface ProdutoItemProps {
    produto: Produto;
    onEditar?: () => void;
    onExcluir?: () => void;
}

function ProdutoItem({ produto, onEditar, onExcluir }: ProdutoItemProps) {
    return (
        <li className="list-item">
            <span className="list-item-info">
                <strong>{produto.nome}</strong> — {produto.descricao} (R$ {produto.preco.toFixed(2)})
            </span>
            <span className="list-item-actions">
                {onEditar && <button className="btn btn-edit" onClick={onEditar}>Editar</button>}
                {onExcluir && <button className="btn btn-delete" onClick={onExcluir}>Excluir</button>}
            </span>
        </li>
    );
}

export default ProdutoItem;
