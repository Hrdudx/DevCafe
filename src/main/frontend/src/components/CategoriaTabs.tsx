interface CategoriaTabsProps {
    opcoes: { valor: string; label: string }[];
    selecionada: string;
    onSelecionar: (valor: string) => void;
}

function CategoriaTabs({ opcoes, selecionada, onSelecionar }: CategoriaTabsProps) {
    return (
        <div className="chips">
            {opcoes.map((opcao) => (
                <button
                    key={opcao.valor}
                    className={"chip" + (selecionada === opcao.valor ? " active" : "")}
                    onClick={() => onSelecionar(opcao.valor)}
                >
                    {opcao.label}
                </button>
            ))}
        </div>
    );
}

export default CategoriaTabs;
