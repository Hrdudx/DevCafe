import { Link } from "react-router-dom";
import Botao from "./Botao";
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
                <Link to={`/permissoes/${permissao.id}`} className="font-semibold text-texto no-underline hover:text-primary hover:underline">
                    {permissao.nome}
                </Link>{" "}
                — {permissao.descricao}
            </span>
            <span className="list-item-actions">
                {onEditar && <Botao variante="neutro" tamanho="sm" onClick={onEditar}>Editar</Botao>}
                {onExcluir && <Botao variante="perigo" tamanho="sm" onClick={onExcluir}>Excluir</Botao>}
            </span>
        </li>
    );
}

export default PermissaoItem;
