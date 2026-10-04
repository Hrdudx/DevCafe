import { useState } from "react";
import { Coffee, Heart, Plus } from "lucide-react";
import type { Produto } from "../types/Produto";
import { formatarMoeda } from "../utils/formatar";

interface ProdutoCardProps {
    produto: Produto;
    favorito: boolean;
    onFavoritar: () => void;
    onAdicionar: () => void;
    // Versão menor usada na tela de Fazer Pedido (sem descrição).
    compacto?: boolean;
}

function ProdutoCard({ produto, favorito, onFavoritar, onAdicionar, compacto }: ProdutoCardProps) {
    const [imagemFalhou, setImagemFalhou] = useState(false);

    return (
        <article className={"produto-card" + (compacto ? " compacto" : "")}>
            <div className="produto-card-img">
                {produto.imagemUrl && !imagemFalhou ? (
                    <img src={produto.imagemUrl} alt={produto.nome} loading="lazy" onError={() => setImagemFalhou(true)} />
                ) : (
                    <span className="produto-card-sem-img"><Coffee size={32} strokeWidth={1.5} /></span>
                )}
                <button
                    className={"btn-favorito" + (favorito ? " ativo" : "")}
                    onClick={onFavoritar}
                    aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                    <Heart size={14} strokeWidth={2.2} fill={favorito ? "currentColor" : "none"} />
                </button>
            </div>
            <div className="produto-card-body">
                <h3>{produto.nome}</h3>
                {!compacto && <p className="produto-card-desc">{produto.descricao}</p>}
                <div className="produto-card-footer">
                    <span className="produto-card-preco">{formatarMoeda(produto.preco)}</span>
                    <button className="btn-add" onClick={onAdicionar} aria-label={`Adicionar ${produto.nome}`}>
                        <Plus size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </article>
    );
}

export default ProdutoCard;
