import type { Cliente } from "../types/Cliente";
import ClienteItem from "./ClienteItem";

interface ClienteListaProps {
    clientes: Cliente[];
    onEditar: (cliente: Cliente) => void;
    onExcluir: (id: number) => void;
}

function ClienteLista({ clientes, onEditar, onExcluir }: ClienteListaProps) {
    if (clientes.length === 0) {
        return <p className="state-message">Nenhum cliente cadastrado ainda.</p>;
    }

    return (
        <ul className="list">
            {clientes.map((cliente) => (
                <ClienteItem
                    key={cliente.id}
                    cliente={cliente}
                    onEditar={() => onEditar(cliente)}
                    onExcluir={() => onExcluir(cliente.id)}
                />
            ))}
        </ul>
    );
}

export default ClienteLista;
