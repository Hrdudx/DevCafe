import { Link } from "react-router-dom";

// Aula 08: rota "*" — qualquer URL que não bate com nenhuma rota cai aqui.
function NaoEncontradaPage() {
    return (
        <section className="panel mx-auto max-w-md text-center">
            <p className="mt-0 mb-2 text-5xl font-bold text-primary">404</p>
            <h1 className="mt-0 mb-2 text-xl font-bold text-texto">Página não encontrada</h1>
            <p className="mt-0 mb-6 text-sm text-texto-suave">O endereço acessado não existe no DevCafé.</p>
            <Link
                to="/"
                className="inline-flex rounded-lg no-underline bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
                Voltar ao início
            </Link>
        </section>
    );
}

export default NaoEncontradaPage;
