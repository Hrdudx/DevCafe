import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Avaliacao } from "../types/Avaliacao";
import type { Cliente } from "../types/Cliente";
import type { Produto } from "../types/Produto";
import { lerErroApi } from "../utils/erros";
import Estrelas from "./Estrelas";

interface AvaliacaoFormProps {
    clientes: Cliente[];
    produtos: Produto[];
    onAvaliacaoSalva: () => void;
    onCancelar: () => void;
    avaliacaoEditando?: Avaliacao | null;
}

function AvaliacaoForm({ clientes, produtos, onAvaliacaoSalva, onCancelar, avaliacaoEditando }: AvaliacaoFormProps) {
    const [clienteId, setClienteId] = useState("");
    const [produtoId, setProdutoId] = useState("");
    const [nota, setNota] = useState(5);
    const [comentario, setComentario] = useState("");
    const [erro, setErro] = useState<string | null>(null);
    const [errosCampos, setErrosCampos] = useState<Record<string, string>>({});

    // Quando o usuário clica em "Editar", preenche o formulário com os dados da avaliação.
    useEffect(() => {
        setClienteId(avaliacaoEditando?.cliente.id.toString() ?? "");
        setProdutoId(avaliacaoEditando?.produto.id.toString() ?? "");
        setNota(avaliacaoEditando?.nota ?? 5);
        setComentario(avaliacaoEditando?.comentario ?? "");
        setErro(null);
        setErrosCampos({});
    }, [avaliacaoEditando]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        // O relacionamento vai como objeto só com o id: { cliente: { id: 1 } }.
        const dados = {
            nota,
            comentario,
            cliente: clienteId ? { id: Number(clienteId) } : null,
            produto: produtoId ? { id: Number(produtoId) } : null,
        };

        try {
            if (avaliacaoEditando) {
                await api.put(`/avaliacoes/${avaliacaoEditando.id}`, dados);
            } else {
                await api.post("/avaliacoes", dados);
                setProdutoId("");
                setNota(5);
                setComentario("");
            }
            setErro(null);
            setErrosCampos({});
            onAvaliacaoSalva();
        } catch (e) {
            const { mensagem, campos } = lerErroApi(e, "Não foi possível salvar a avaliação.");
            setErrosCampos(campos);
            setErro(Object.keys(campos).length > 0 ? null : mensagem);
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit} noValidate>
            <label className="form-campo">
                <select
                    className={"input" + (errosCampos.cliente ? " input-erro" : "")}
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                >
                    <option value="">Cliente...</option>
                    {clientes.map((c) => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                </select>
                {errosCampos.cliente && <span className="campo-erro">{errosCampos.cliente}</span>}
            </label>
            <label className="form-campo">
                <select
                    className={"input" + (errosCampos.produto ? " input-erro" : "")}
                    value={produtoId}
                    onChange={(e) => setProdutoId(e.target.value)}
                >
                    <option value="">Produto avaliado...</option>
                    {produtos.map((p) => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                </select>
                {errosCampos.produto && <span className="campo-erro">{errosCampos.produto}</span>}
            </label>
            <div className="form-campo">
                <span className="form-campo-label">Nota</span>
                <Estrelas nota={nota} onChange={setNota} tamanho={22} />
                {errosCampos.nota && <span className="campo-erro">{errosCampos.nota}</span>}
            </div>
            <label className="form-campo form-campo-largo">
                <textarea
                    className={"input" + (errosCampos.comentario ? " input-erro" : "")}
                    rows={2}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder={nota <= 2 ? "Conte o que não agradou (obrigatório para nota 1 ou 2)" : "Comentário (opcional)"}
                />
                {errosCampos.comentario && <span className="campo-erro">{errosCampos.comentario}</span>}
            </label>
            {erro && <p className="form-error">{erro}</p>}
            <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                    {avaliacaoEditando ? "Salvar alterações" : "Avaliar"}
                </button>
                {avaliacaoEditando && (
                    <button className="btn btn-outline" type="button" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default AvaliacaoForm;
