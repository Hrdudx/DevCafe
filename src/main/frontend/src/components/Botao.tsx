import type { ButtonHTMLAttributes } from "react";

// Aula 08.5: botão reutilizável estilizado com Tailwind. Em vez de repetir as
// mesmas classes em cada botão, escolhemos só a variante (cor) e o tamanho.
type Variante = "primario" | "neutro" | "perigo" | "sucesso" | "contorno";
type Tamanho = "md" | "sm";

const estilos: Record<Variante, string> = {
    primario: "border-transparent bg-primary text-white hover:bg-primary-hover",
    neutro: "border-transparent bg-primary-soft text-primary hover:bg-blue-100",
    perigo: "border-transparent bg-red-50 text-red-700 hover:bg-red-100",
    sucesso: "border-transparent bg-green-600 text-white hover:bg-green-700",
    contorno: "border-borda-forte bg-white text-primary hover:border-primary",
};

const tamanhos: Record<Tamanho, string> = {
    md: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-[13px]",
};

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variante?: Variante;
    tamanho?: Tamanho;
}

function Botao({ variante = "primario", tamanho = "md", className = "", type = "button", ...props }: BotaoProps) {
    return (
        <button
            type={type}
            className={`inline-flex cursor-pointer items-center border border-solid justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${estilos[variante]} ${tamanhos[tamanho]} ${className}`}
            {...props}
        />
    );
}

export default Botao;
