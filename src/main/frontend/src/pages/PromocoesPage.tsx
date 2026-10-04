import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

function PromocoesPage() {
    return (
        <div>
            <Breadcrumb voltarPara="/" itens={[{ label: "Promoções" }]} />
            <h1 className="page-title">Promoções</h1>
            <p className="page-subtitle">Destaques que aparecem na tela inicial.</p>

            <section className="promo-banner">
                <div className="promo-banner-text">
                    <span className="promo-tag">Novidade!</span>
                    <h2>Latte Gelado</h2>
                    <p>Refrescância e muito sabor.</p>
                    <Link className="btn btn-primary btn-sm" to="/cardapio?categoria=Bebidas%20Geladas">
                        Ver no cardápio
                    </Link>
                </div>
            </section>

            <section className="panel">
                <h2 className="panel-title">Promoções ativas</h2>
                <p className="state-message">
                    Por enquanto o destaque acima é fixo. O cadastro de novas promoções é um dos próximos passos do projeto.
                </p>
            </section>
        </div>
    );
}

export default PromocoesPage;
