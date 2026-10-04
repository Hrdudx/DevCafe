import type { Usuario } from "../types/Usuario";
import UsuarioItem from "./UsuarioItem";

interface UsuarioListaProps {
    usuarios: Usuario[];
    onEditar: (usuario: Usuario) => void;
    onExcluir: (id: number) => void;
}

function UsuarioLista({ usuarios, onEditar, onExcluir }: UsuarioListaProps) {
    if (usuarios.length === 0) {
        return <p className="state-message">Nenhum cadastro ainda.</p>;
    }

    return (
        <ul className="list">
            {usuarios.map((usuario) => (
                <UsuarioItem
                    key={usuario.id}
                    usuario={usuario}
                    onEditar={() => onEditar(usuario)}
                    onExcluir={() => onExcluir(usuario.id)}
                />
            ))}
        </ul>
    );
}

export default UsuarioLista;
