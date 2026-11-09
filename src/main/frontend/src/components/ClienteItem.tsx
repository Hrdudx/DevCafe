import type { Cliente } from "../types/Cliente";
import { formatarData } from "../utils/formatar";

interface ClienteItemProps {
    cliente: Cliente;
    onEditar?: () => void;
    onExcluir?: () => void;
}

function ClienteItem({ cliente, onEditar, onExcluir }: ClienteItemProps) {
    return (
        <li className="list-item">
            <span className="list-item-info">
                <strong>{cliente.nome}</strong> — {cliente.email}
                {cliente.telefone && ` · ${cliente.telefone}`}
                {cliente.endereco && <small className="list-item-meta"> · {cliente.endereco}</small>}
                {cliente.dataCadastro && (
                    <small className="list-item-meta"> · cliente desde {formatarData(cliente.dataCadastro + "T00:00")}</small>
                )}
            </span>
            <span className="list-item-actions">
                {onEditar && <button className="btn btn-edit" onClick={onEditar}>Editar</button>}
                {onExcluir && <button className="btn btn-delete" onClick={onExcluir}>Excluir</button>}
            </span>
        </li>
    );
}

export default ClienteItem;
