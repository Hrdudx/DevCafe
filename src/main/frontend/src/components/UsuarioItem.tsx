import { Link } from "react-router-dom";
import Botao from "./Botao";
import type { Usuario } from "../types/Usuario";

interface UsuarioItemProps {
    usuario: Usuario;
    onEditar?: () => void;
    onExcluir?: () => void;
}

function UsuarioItem({ usuario, onEditar, onExcluir }: UsuarioItemProps) {
    return (
        <li className="list-item">
            <span className="list-item-info">
                <Link to={`/usuarios/${usuario.id}`} className="font-semibold text-texto no-underline hover:text-primary hover:underline">
                    {usuario.nome}
                </Link>{" "}
                ({usuario.username}) — {usuario.email}
                {usuario.permissoes?.map((permissao) => (
                    <span
                        key={permissao.id}
                        className="ml-2 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary"
                    >
                        {permissao.nome}
                    </span>
                ))}
            </span>
            <span className="list-item-actions">
                {onEditar && <Botao variante="neutro" tamanho="sm" onClick={onEditar}>Editar</Botao>}
                {onExcluir && <Botao variante="perigo" tamanho="sm" onClick={onExcluir}>Excluir</Botao>}
            </span>
        </li>
    );
}

export default UsuarioItem;
