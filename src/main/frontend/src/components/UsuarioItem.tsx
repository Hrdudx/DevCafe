import type { Usuario } from "../types/Usuario";

interface UsuarioItemProps {
    usuario: Usuario;
    onEditar?: () => void;
    onExcluir?: () => void;
    onPermissoes?: () => void;
}

function UsuarioItem({ usuario, onEditar, onExcluir, onPermissoes }: UsuarioItemProps) {
    return (
        <li className="list-item">
            <span className="list-item-info">
                <strong>{usuario.nome}</strong> ({usuario.username}) — {usuario.email}
                {usuario.permissoes && usuario.permissoes.length > 0 && (
                    <span className="perfil-tags">
                        {usuario.permissoes.map((p) => (
                            <span key={p.id} className="status-badge badge-info">{p.nome}</span>
                        ))}
                    </span>
                )}
            </span>
            <span className="list-item-actions">
                {onPermissoes && <button className="btn btn-outline btn-sm" onClick={onPermissoes}>Permissões</button>}
                {onEditar && <button className="btn btn-edit" onClick={onEditar}>Editar</button>}
                {onExcluir && <button className="btn btn-delete" onClick={onExcluir}>Excluir</button>}
            </span>
        </li>
    );
}

export default UsuarioItem;
