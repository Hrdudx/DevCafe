import { Link } from "react-router-dom";
import type { Usuario } from "../types/Usuario";
import Botao from "./Botao";

interface UsuarioItemProps {
    usuario: Usuario;
    onEditar?: () => void;
    onExcluir?: () => void;
}

function UsuarioItem({ usuario, onEditar, onExcluir }: UsuarioItemProps) {
    return (
        <li className="flex flex-wrap items-center justify-between gap-2 p-4">
            <span>
                <Link to={`/usuarios/${usuario.id}`} className="font-medium text-blue-600 no-underline hover:underline">
                    {usuario.nome}
                </Link>{" "}
                <span className="text-gray-500">({usuario.username}) — {usuario.email}</span>
            </span>
            <span className="flex gap-2">
                {onEditar && <Botao variante="neutro" onClick={onEditar}>Editar</Botao>}
                {onExcluir && <Botao variante="perigo" onClick={onExcluir}>Excluir</Botao>}
            </span>
        </li>
    );
}

export default UsuarioItem;
