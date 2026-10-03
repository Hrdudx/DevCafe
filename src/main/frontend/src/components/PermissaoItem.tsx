import type { Permissao } from "../types/Permissao";

interface PermissaoItemProps {
    permissao: Permissao;
    onEditar?: () => void;
    onExcluir?: () => void;
}

function PermissaoItem({ permissao, onEditar, onExcluir }: PermissaoItemProps) {
    return (
        <li className="list-item">
            <span className="list-item-info">
                <strong>{permissao.nome}</strong> — {permissao.descricao}
            </span>
            <span className="list-item-actions">
                {onEditar && <button className="btn btn-edit" onClick={onEditar}>Editar</button>}
                {onExcluir && <button className="btn btn-delete" onClick={onExcluir}>Excluir</button>}
            </span>
        </li>
    );
}

export default PermissaoItem;
