import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Coffee, Search, SlidersHorizontal } from "lucide-react";
import { useProdutos, filtrarProdutos } from "../hooks/useProdutos";
import { useCarrinho } from "../context/useCarrinho";
import Breadcrumb from "../components/Breadcrumb";
import ProdutoCard from "../components/ProdutoCard";
import CategoriaTabs from "../components/CategoriaTabs";
import { CATEGORIAS } from "../utils/constantes";
import { formatarMoeda } from "../utils/formatar";

const ORDENACOES = [
    { valor: "padrao", label: "Padrão" },
    { valor: "menor-preco", label: "Menor preço" },
    { valor: "maior-preco", label: "Maior preço" },
    { valor: "nome", label: "Nome (A-Z)" },
    { valor: "favoritos", label: "Favoritos primeiro" },
];

function CardapioPage() {
    const [params] = useSearchParams();
    const { produtos, loading, erro, favoritos, alternarFavorito } = useProdutos();
    const { carrinho, quantidadeTotal, adicionar } = useCarrinho();
    const [categoria, setCategoria] = useState(params.get("categoria") ?? "Todos");
    const [busca, setBusca] = useState(params.get("busca") ?? "");
    const [ordenacao, setOrdenacao] = useState("padrao");
    const [menuAberto, setMenuAberto] = useState(false);

    const produtosVisiveis = useMemo(() => {
        const lista = filtrarProdutos(produtos, categoria, busca);
        if (ordenacao === "menor-preco") lista.sort((a, b) => a.preco - b.preco);
        if (ordenacao === "maior-preco") lista.sort((a, b) => b.preco - a.preco);
        if (ordenacao === "nome") lista.sort((a, b) => a.nome.localeCompare(b.nome));
        if (ordenacao === "favoritos") {
            lista.sort((a, b) => Number(favoritos.includes(b.id)) - Number(favoritos.includes(a.id)));
        }
        return lista;
    }, [produtos, categoria, busca, ordenacao, favoritos]);

    const totalCarrinho = produtos.reduce((soma, p) => soma + p.preco * (carrinho[p.id] ?? 0), 0);

    return (
        <div>
            <Breadcrumb voltarPara="/" itens={[{ label: "Cardápio" }]} />

            <div className="page-header">
                <div>
                    <h1 className="page-title page-title-icon">
                        <span className="title-icon"><Coffee size={18} /></span>
                        Cardápio
                    </h1>
                    <p className="page-subtitle">Nossos cafés, bebidas e delícias para o seu dia.</p>
                </div>
                <div className="toolbar-actions">
                    <label className="search-field">
                        <Search size={16} />
                        <input
                            type="search"
                            placeholder="Buscar produto..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </label>
                    <div className="dropdown">
                        <button
                            className={"btn-square" + (ordenacao !== "padrao" ? " active" : "")}
                            onClick={() => setMenuAberto((v) => !v)}
                            aria-label="Ordenar produtos"
                            aria-expanded={menuAberto}
                        >
                            <SlidersHorizontal size={17} />
                        </button>
                        {menuAberto && (
                            <div className="dropdown-menu">
                                <span className="dropdown-title">Ordenar por</span>
                                {ORDENACOES.map((o) => (
                                    <button
                                        key={o.valor}
                                        className={ordenacao === o.valor ? "active" : ""}
                                        onClick={() => {
                                            setOrdenacao(o.valor);
                                            setMenuAberto(false);
                                        }}
                                    >
                                        {o.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CategoriaTabs opcoes={CATEGORIAS} selecionada={categoria} onSelecionar={setCategoria} />

            {loading && <p className="state-message">Carregando cardápio...</p>}
            {erro && <p className="state-error">{erro}</p>}

            {!loading && !erro && produtosVisiveis.length === 0 && (
                <p className="state-message">Nenhum produto encontrado.</p>
            )}

            {!loading && !erro && produtosVisiveis.length > 0 && (
                <div className="produto-grid">
                    {produtosVisiveis.map((produto) => (
                        <ProdutoCard
                            key={produto.id}
                            produto={produto}
                            favorito={favoritos.includes(produto.id)}
                            onFavoritar={() => alternarFavorito(produto.id)}
                            onAdicionar={() => adicionar(produto.id)}
                        />
                    ))}
                </div>
            )}

            {quantidadeTotal > 0 && (
                <Link className="carrinho-flutuante" to="/fazer-pedido">
                    <span>
                        {quantidadeTotal} {quantidadeTotal === 1 ? "item" : "itens"} · {formatarMoeda(totalCarrinho)}
                    </span>
                    <strong>
                        Ver meu pedido <ArrowRight size={16} />
                    </strong>
                </Link>
            )}
        </div>
    );
}

export default CardapioPage;
