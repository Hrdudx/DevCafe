import type { Avaliacao } from "../types/Avaliacao";
import AvaliacaoItem from "./AvaliacaoItem";

interface AvaliacaoListaProps {
    avaliacoes: Avaliacao[];
    onEditar: (avaliacao: Avaliacao) => void;
    onExcluir: (id: number) => void;
}

function AvaliacaoLista({ avaliacoes, onEditar, onExcluir }: AvaliacaoListaProps) {
    if (avaliacoes.length === 0) {
        return <p className="state-message">Nenhuma avaliação ainda.</p>;
    }

    return (
        <ul className="list">
            {avaliacoes.map((avaliacao) => (
                <AvaliacaoItem
                    key={avaliacao.id}
                    avaliacao={avaliacao}
                    onEditar={() => onEditar(avaliacao)}
                    onExcluir={() => onExcluir(avaliacao.id)}
                />
            ))}
        </ul>
    );
}

export default AvaliacaoLista;
