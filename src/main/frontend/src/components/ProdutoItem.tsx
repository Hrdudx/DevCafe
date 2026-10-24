import Botao from "./Botao";
import type { Produto } from "../types/Produto";
import { formatarMoeda } from "../utils/formatar";

interface ProdutoItemProps {
    produto: Produto;
    onEditar?: () => void;
    onExcluir?: () => void;
}

function ProdutoItem({ produto, onEditar, onExcluir }: ProdutoItemProps) {
    return (
        <li className="list-item">
            <span className="list-item-info">
                <strong>{produto.nome}</strong> — {produto.descricao} ({formatarMoeda(produto.preco)})
            </span>
            <span className="list-item-actions">
                {onEditar && <Botao variante="neutro" tamanho="sm" onClick={onEditar}>Editar</Botao>}
                {onExcluir && <Botao variante="perigo" tamanho="sm" onClick={onExcluir}>Excluir</Botao>}
            </span>
        </li>
    );
}

export default ProdutoItem;
