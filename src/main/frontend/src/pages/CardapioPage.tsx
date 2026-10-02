import { useEffect, useState } from "react";
import api from "../services/api";
import type { Produto } from "../types/Produto";

function CardapioPage() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        api.get<Produto[]>("/produtos")
            .then((resposta) => {
                setProdutos(resposta.data);
                setErro(null);
            })
            .catch(() => {
                setErro("Não foi possível carregar o cardápio. Verifique se o back-end está rodando.");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1 className="page-title">Cardápio</h1>
            <p className="page-subtitle">Nossos cafés, bebidas e delícias para o seu dia.</p>

            {loading && <p className="state-message">Carregando cardápio...</p>}
            {erro && <p className="state-error">{erro}</p>}

            {!loading && !erro && produtos.length === 0 && (
                <p className="state-message">Nenhum produto cadastrado ainda.</p>
            )}

            {!loading && !erro && produtos.length > 0 && (
                <div className="menu-grid">
                    {produtos.map((produto) => (
                        <div className="menu-card" key={produto.id}>
                            <h3>{produto.nome}</h3>
                            <p className="menu-card-desc">{produto.descricao}</p>
                            <span className="menu-card-price">R$ {produto.preco.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CardapioPage;
