import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, Search, ShoppingBag, Trash2 } from "lucide-react";
import api from "../services/api";
import type { Pedido } from "../types/Pedido";
import type { Produto } from "../types/Produto";
import { useProdutos, filtrarProdutos } from "../hooks/useProdutos";
import { useCarrinho } from "../context/CarrinhoContext";
import { obterEmailLogado, obterUsuarioLogado } from "../services/auth";
import Breadcrumb from "../components/Breadcrumb";
import ProdutoCard from "../components/ProdutoCard";
import CategoriaTabs, { CATEGORIAS } from "../components/CategoriaTabs";
import { formatarMoeda } from "../utils/formatar";

function FazerPedidoPage() {
    const { produtos, loading, erro, favoritos, alternarFavorito } = useProdutos();
    const { carrinho, adicionar, remover, removerTudo, limpar } = useCarrinho();
    const [categoria, setCategoria] = useState("Todos");
    const [busca, setBusca] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [erroEnvio, setErroEnvio] = useState<string | null>(null);
    const navigate = useNavigate();

    const produtosFiltrados = filtrarProdutos(produtos, categoria, busca);

    const itensCarrinho = Object.entries(carrinho)
        .map(([produtoId, quantidade]) => ({
            produto: produtos.find((p) => p.id === Number(produtoId)),
            quantidade,
        }))
        .filter((item): item is { produto: Produto; quantidade: number } => item.produto !== undefined);

    const subtotal = itensCarrinho.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0);
    const taxaEntrega = 0;

    function finalizarPedido() {
        setEnviando(true);
        setErroEnvio(null);
        const itens = Object.fromEntries(itensCarrinho.map((item) => [item.produto.id, item.quantidade]));
        api.post<Pedido>("/pedidos", {
            itens,
            cliente: obterUsuarioLogado(),
            email: obterEmailLogado() || null,
            observacoes: observacoes.trim() || null,
            formaPagamento: "Pagamento na retirada",
        })
            .then((resposta) => {
                limpar();
                setObservacoes("");
                navigate(`/pedidos/${resposta.data.id}`);
            })
            .catch(() => setErroEnvio("Não foi possível enviar o pedido. Tente novamente."))
            .finally(() => setEnviando(false));
    }

    return (
        <div className="order-layout">
            <div className="order-main">
                <Breadcrumb voltarPara="/" itens={[{ label: "Fazer Pedido", to: "/fazer-pedido" }, { label: "Novo Pedido" }]} />
                <h1 className="page-title">Novo Pedido</h1>
                <p className="page-subtitle">Selecione os produtos e finalize o pedido.</p>

                <label className="search-field search-field-full">
                    <Search size={16} />
                    <input
                        type="search"
                        placeholder="Buscar produto..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </label>

                <CategoriaTabs opcoes={CATEGORIAS} selecionada={categoria} onSelecionar={setCategoria} />

                {loading && <p className="state-message">Carregando cardápio...</p>}
                {erro && <p className="state-error">{erro}</p>}
                {!loading && !erro && produtosFiltrados.length === 0 && (
                    <p className="state-message">Nenhum produto encontrado.</p>
                )}

                {!loading && !erro && produtosFiltrados.length > 0 && (
                    <div className="produto-grid compacto">
                        {produtosFiltrados.map((produto) => (
                            <ProdutoCard
                                key={produto.id}
                                compacto
                                produto={produto}
                                favorito={favoritos.includes(produto.id)}
                                onFavoritar={() => alternarFavorito(produto.id)}
                                onAdicionar={() => adicionar(produto.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <aside className="cart-panel">
                <div className="cart-panel-header">
                    <h2 className="panel-title">Seu Pedido</h2>
                    {itensCarrinho.length > 0 && (
                        <button className="link-button" onClick={limpar}>Limpar</button>
                    )}
                </div>

                {itensCarrinho.length === 0 ? (
                    <div className="cart-empty">
                        <ShoppingBag size={32} strokeWidth={1.5} />
                        <p>Seu pedido está vazio.</p>
                        <small>Toque no + de um produto para adicioná-lo.</small>
                    </div>
                ) : (
                    <>
                        <ul className="cart-list">
                            {itensCarrinho.map(({ produto, quantidade }) => (
                                <li className="cart-item" key={produto.id}>
                                    {produto.imagemUrl ? (
                                        <img className="cart-item-img" src={produto.imagemUrl} alt="" />
                                    ) : (
                                        <span className="cart-item-img" />
                                    )}
                                    <div className="cart-item-info">
                                        <strong>{produto.nome}</strong>
                                        <span>{formatarMoeda(produto.preco)}</span>
                                    </div>
                                    <div className="qty-stepper">
                                        <button onClick={() => remover(produto.id)} aria-label="Diminuir quantidade">
                                            <Minus size={14} />
                                        </button>
                                        <span>{quantidade}</span>
                                        <button className="mais" onClick={() => adicionar(produto.id)} aria-label="Aumentar quantidade">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <button className="btn-trash" onClick={() => removerTudo(produto.id)} aria-label={`Remover ${produto.nome}`}>
                                        <Trash2 size={17} />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <label className="field">
                            <span className="field-label">Observações (opcional)</span>
                            <textarea
                                className="input"
                                rows={2}
                                placeholder="Ex.: sem açúcar, leite vegetal, etc."
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                            />
                        </label>

                        <div className="totals">
                            <div className="totals-row">
                                <span>Subtotal</span>
                                <strong>{formatarMoeda(subtotal)}</strong>
                            </div>
                            <div className="totals-row">
                                <span>Taxa de entrega</span>
                                <span>{formatarMoeda(taxaEntrega)}</span>
                            </div>
                            <div className="totals-row totals-total">
                                <span>Total</span>
                                <span>{formatarMoeda(subtotal + taxaEntrega)}</span>
                            </div>
                        </div>

                        {erroEnvio && <p className="state-error">{erroEnvio}</p>}

                        <button className="btn btn-primary btn-lg btn-block" onClick={finalizarPedido} disabled={enviando}>
                            {enviando ? "Enviando..." : <>Finalizar Pedido <ArrowRight size={17} /></>}
                        </button>
                    </>
                )}
            </aside>
        </div>
    );
}

export default FazerPedidoPage;
