import type { Permissao } from "../types/Permissao";
import PermissaoItem from "./PermissaoItem";

interface PermissaoListaProps {
    permissoes: Permissao[];
    onEditar: (permissao: Permissao) => void;
    onExcluir: (id: number) => void;
}

function PermissaoLista({ permissoes, onEditar, onExcluir }: PermissaoListaProps) {
    if (permissoes.length === 0) {
        return <p className="state-message">Nenhum cadastro ainda.</p>;
    }

    return (
        <ul className="list">
            {permissoes.map((permissao) => (
                <PermissaoItem
                    key={permissao.id}
                    permissao={permissao}
                    onEditar={() => onEditar(permissao)}
                    onExcluir={() => onExcluir(permissao.id)}
                />
            ))}
        </ul>
    );
}

export default PermissaoLista;
