import type { Avaliacao } from "../types/Avaliacao";
import { formatarDataHora } from "../utils/formatar";
import Estrelas from "./Estrelas";

interface AvaliacaoItemProps {
    avaliacao: Avaliacao;
    onEditar?: () => void;
    onExcluir?: () => void;
}

function AvaliacaoItem({ avaliacao, onEditar, onExcluir }: AvaliacaoItemProps) {
    return (
        <li className="list-item">
            <span className="list-item-info avaliacao-info">
                <span>
                    <Estrelas nota={avaliacao.nota} /> <strong>{avaliacao.produto.nome}</strong> — por{" "}
                    {avaliacao.cliente.nome}
                    <small className="list-item-meta"> · {formatarDataHora(avaliacao.dataHora)}</small>
                </span>
                {avaliacao.comentario && <span className="avaliacao-comentario">"{avaliacao.comentario}"</span>}
            </span>
            <span className="list-item-actions">
                {onEditar && <button className="btn btn-edit" onClick={onEditar}>Editar</button>}
                {onExcluir && <button className="btn btn-delete" onClick={onExcluir}>Excluir</button>}
            </span>
        </li>
    );
}

export default AvaliacaoItem;
