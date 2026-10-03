import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Produto } from "../types/Produto";

function CardapioPage() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [carrinho, setCarrinho] = useState<Record<number, number>>({});
    const [enviando, setEnviando] = useState(false);
    const navigate = useNavigate();

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

    function adicionar(produtoId: number) {
        setCarrinho((atual) => ({ ...atual, [produtoId]: (atual[produtoId] ?? 0) + 1 }));
    }

    function remover(produtoId: number) {
        setCarrinho((atual) => {
            const quantidade = (atual[produtoId] ?? 0) - 1;
            const novo = { ...atual };
            if (quantidade <= 0) {
                delete novo[produtoId];
            } else {
                novo[produtoId] = quantidade;
            }
            return novo;
        });
    }

    const itensCarrinho = Object.entries(carrinho).map(([produtoId, quantidade]) => {
        const produto = produtos.find((p) => p.id === Number(produtoId));
        return { produto, quantidade };
    }).filter((item) => item.produto);

    const total = itensCarrinho.reduce((soma, item) => soma + (item.produto!.preco * item.quantidade), 0);

    function finalizarPedido() {
        setEnviando(true);
        api.post("/pedidos", carrinho)
            .then(() => {
                setCarrinho({});
                navigate("/pedidos");
            })
            .catch(() => setErro("Não foi possível enviar o pedido. Tente novamente."))
            .finally(() => setEnviando(false));
    }

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
                    {produtos.map((produto) => {
                        const quantidade = carrinho[produto.id] ?? 0;
                        return (
                            <div className="menu-card" key={produto.id}>
                                <h3>{produto.nome}</h3>
                                <p className="menu-card-desc">{produto.descricao}</p>
                                <div className="menu-card-footer">
                                    <span className="menu-card-price">R$ {produto.preco.toFixed(2)}</span>
                                    {quantidade === 0 ? (
                                        <button className="btn btn-primary" onClick={() => adicionar(produto.id)}>
                                            Adicionar
                                        </button>
                                    ) : (
                                        <span className="qty-stepper">
                                            <button className="btn-step" onClick={() => remover(produto.id)}>-</button>
                                            <span>{quantidade}</span>
                                            <button className="btn-step" onClick={() => adicionar(produto.id)}>+</button>
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {itensCarrinho.length > 0 && (
                <div className="cart-bar">
                    <span>{itensCarrinho.reduce((s, i) => s + i.quantidade, 0)} item(ns) — R$ {total.toFixed(2)}</span>
                    <button className="btn btn-primary" onClick={finalizarPedido} disabled={enviando}>
                        {enviando ? "Enviando..." : "Finalizar pedido"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default CardapioPage;
