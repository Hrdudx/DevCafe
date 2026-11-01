import type { ButtonHTMLAttributes } from "react";

type Variante = "primario" | "perigo" | "neutro" | "sucesso";

const estilos: Record<Variante, string> = {
    primario: "bg-blue-600 hover:bg-blue-700",
    perigo: "bg-red-600 hover:bg-red-700",
    neutro: "bg-gray-500 hover:bg-gray-600",
    sucesso: "bg-green-600 hover:bg-green-700",
};

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variante?: Variante;
}

function Botao({ variante = "primario", className = "", ...props }: BotaoProps) {
    return (
        <button
            className={`cursor-pointer rounded-md border-0 px-3 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${estilos[variante]} ${className}`}
            {...props}
        />
    );
}

export default Botao;
