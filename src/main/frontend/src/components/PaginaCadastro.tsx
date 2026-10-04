import type { ReactNode } from "react";

interface PaginaCadastroProps {
    titulo: string;
    subtitulo: string;
    children: ReactNode;
}

// Moldura com título e painel branco usada pelas telas de cadastro.
function PaginaCadastro({ titulo, subtitulo, children }: PaginaCadastroProps) {
    return (
        <div>
            <h1 className="page-title">{titulo}</h1>
            <p className="page-subtitle">{subtitulo}</p>
            <section className="panel">{children}</section>
        </div>
    );
}

export default PaginaCadastro;
