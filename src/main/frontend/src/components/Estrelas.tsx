import { Star } from "lucide-react";

interface EstrelasProps {
    nota: number;
    // Com onChange as estrelas viram um campo clicável (formulário); sem ele, só exibem a nota.
    onChange?: (nota: number) => void;
    tamanho?: number;
}

function Estrelas({ nota, onChange, tamanho = 16 }: EstrelasProps) {
    return (
        <span className="estrelas" role={onChange ? "radiogroup" : "img"} aria-label={`Nota ${nota} de 5`}>
            {[1, 2, 3, 4, 5].map((valor) => {
                const icone = (
                    <Star
                        size={tamanho}
                        className={valor <= nota ? "estrela-cheia" : "estrela-vazia"}
                        fill={valor <= nota ? "currentColor" : "none"}
                    />
                );
                return onChange ? (
                    <button
                        key={valor}
                        type="button"
                        className="estrela-botao"
                        onClick={() => onChange(valor)}
                        role="radio"
                        aria-checked={valor === nota}
                        aria-label={`${valor} estrela${valor > 1 ? "s" : ""}`}
                    >
                        {icone}
                    </button>
                ) : (
                    <span key={valor}>{icone}</span>
                );
            })}
        </span>
    );
}

export default Estrelas;
