import { Link } from "react-router-dom";

// Rota "*": qualquer endereço que não existe no sistema cai aqui.
function NaoEncontradaPage() {
    return (
        <div className="nao-encontrada">
            <h1 className="page-title">Página não encontrada</h1>
            <p className="page-subtitle">O endereço que você abriu não existe no DevCafé.</p>
            <Link className="btn btn-primary" to="/">Voltar ao início</Link>
        </div>
    );
}

export default NaoEncontradaPage;
