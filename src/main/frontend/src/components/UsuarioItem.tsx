import type { Usuario } from "../types/Usuario";

interface UsuarioItemProps {
    usuario: Usuario;
    onEditar?: () => void;
    onExcluir?: () => void;
}

function UsuarioItem({ usuario, onEditar, onExcluir }: UsuarioItemProps) {
    return (
        <li>
            <strong>{usuario.nome}</strong> ({usuario.username}) — {usuario.email}
            {onEditar && <button onClick={onEditar}>Editar</button>}
            {onExcluir && <button onClick={onExcluir}>Excluir</button>}
        </li>
    );
}

export default UsuarioItem;