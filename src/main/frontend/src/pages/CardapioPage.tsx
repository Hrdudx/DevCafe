import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Produto } from "../types/Produto";

const CATEGORIAS = ["Todos", "Cafés", "Bebidas Geladas", "Lanches", "Doces", "Salgados"];

function CardapioPage() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [carrinho, setCarrinho] = useState<Record<number, number>>({});
    const [enviando, setEnviando] = useState(false);
    const [categoria, setCategoria] = useState("Todos");
    const [busca, setBusca] = useState("");
    const [observacoes, setObservacoes] = useState("");
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

    function removerTudo(produtoId: number) {
        setCarrinho((atual) => {
            const novo = { ...atual };
            delete novo[produtoId];
            return novo;
        });
    }

    const produtosFiltrados = useMemo(() => {
        return produtos.filter((produto) => {
            const bateCategoria = categoria === "Todos" || produto.categoria === categoria;
            const bateBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());
            return bateCategoria && bateBusca;
        });
    }, [produtos, categoria, busca]);

    const itensCarrinho = Object.entries(carrinho).map(([produtoId, quantidade]) => {
        const produto = produtos.find((p) => p.id === Number(produtoId));
        return { produto, quantidade };
    }).filter((item) => item.produto) as { produto: Produto; quantidade: number }[];

    const total = itensCarrinho.reduce((soma, item) => soma + (item.produto.preco * item.quantidade), 0);

    function finalizarPedido() {
        setEnviando(true);
        api.post("/pedidos", carrinho)
            .then(() => {
                setCarrinho({});
                setObservacoes("");
                navigate("/pedidos");
            })
            .catch(() => setErro("Não foi possível enviar o pedido. Tente novamente."))
            .finally(() => setEnviando(false));
    }

    return (
        <div className="order-layout">
            <div className="order-main">
                <h1 className="page-title">Cardápio</h1>
                <p className="page-subtitle">Nossos cafés, bebidas e delícias para o seu dia.</p>

                <div className="toolbar">
                    <input
                        className="topbar-search"
                        type="search"
                        placeholder="Buscar produto..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>

                <div className="category-tabs">
                    {CATEGORIAS.map((c) => (
                        <button
                            key={c}
                            className={"category-tab" + (categoria === c ? " active" : "")}
                            onClick={() => setCategoria(c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {loading && <p className="state-message">Carregando cardápio...</p>}
                {erro && <p className="state-error">{erro}</p>}

                {!loading && !erro && produtosFiltrados.length === 0 && (
                    <p className="state-message">Nenhum produto encontrado.</p>
                )}

                {!loading && !erro && produtosFiltrados.length > 0 && (
                    <div className="menu-grid">
                        {produtosFiltrados.map((produto) => {
                            const quantidade = carrinho[produto.id] ?? 0;
                            return (
                                <div className="menu-card" key={produto.id}>
                                    {produto.imagemUrl && (
                                        <img className="menu-card-img" src={produto.imagemUrl} alt={produto.nome} />
                                    )}
                                    <h3>{produto.nome}</h3>
                                    <p className="menu-card-desc">{produto.descricao}</p>
                                    <div className="menu-card-footer">
                                        <span className="menu-card-price">R$ {produto.preco.toFixed(2)}</span>
                                        {quantidade === 0 ? (
                                            <button className="btn-add" onClick={() => adicionar(produto.id)} aria-label="Adicionar">+</button>
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
            </div>

            <aside className="cart-panel">
                <div className="cart-panel-header">
                    <h2 className="panel-title">Seu Pedido</h2>
                    {itensCarrinho.length > 0 && (
                        <button className="cart-clear" onClick={() => setCarrinho({})}>Limpar</button>
                    )}
                </div>

                {itensCarrinho.length === 0 ? (
                    <p className="state-message">Seu carrinho está vazio.</p>
                ) : (
                    <>
                        <ul className="cart-list">
                            {itensCarrinho.map(({ produto, quantidade }) => (
                                <li className="cart-item" key={produto.id}>
                                    <div className="cart-item-info">
                                        <strong>{produto.nome}</strong>
                                        <span className="menu-card-price">R$ {produto.preco.toFixed(2)}</span>
                                    </div>
                                    <div className="cart-item-actions">
                                        <span className="qty-stepper">
                                            <button className="btn-step" onClick={() => remover(produto.id)}>-</button>
                                            <span>{quantidade}</span>
                                            <button className="btn-step" onClick={() => adicionar(produto.id)}>+</button>
                                        </span>
                                        <button className="btn-trash" onClick={() => removerTudo(produto.id)} aria-label="Remover">🗑️</button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <textarea
                            className="input cart-observacoes"
                            placeholder="Observações (opcional). Ex: sem açúcar, leite vegetal..."
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                        />

                        <div className="cart-totals">
                            <div className="cart-totals-row">
                                <span>Subtotal</span>
                                <span>R$ {total.toFixed(2)}</span>
                            </div>
                            <div className="cart-totals-row">
                                <span>Taxa de entrega</span>
                                <span>R$ 0,00</span>
                            </div>
                            <div className="cart-totals-row cart-totals-total">
                                <span>Total</span>
                                <span>R$ {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button className="btn btn-primary btn-block" onClick={finalizarPedido} disabled={enviando}>
                            {enviando ? "Enviando..." : "Finalizar Pedido →"}
                        </button>
                    </>
                )}
            </aside>
        </div>
    );
}

export default CardapioPage;
