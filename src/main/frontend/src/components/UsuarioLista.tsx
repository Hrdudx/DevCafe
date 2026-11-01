import type { Usuario } from "../types/Usuario";
import UsuarioItem from "./UsuarioItem";

interface UsuarioListaProps {
    usuarios: Usuario[];
    onEditar: (usuario: Usuario) => void;
    onExcluir: (id: number) => void;
}

function UsuarioLista({ usuarios, onEditar, onExcluir }: UsuarioListaProps) {
    if (usuarios.length === 0) {
        return <p className="text-gray-500">Nenhum cadastro ainda.</p>;
    }

    return (
        <ul className="m-0 list-none divide-y divide-gray-200 rounded-lg border border-gray-200 p-0">
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
