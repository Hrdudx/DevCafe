import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import { lerErroApi } from "../utils/erros";
import type { Produto } from "../types/Produto";

const CATEGORIAS = ["Cafés", "Bebidas Geladas", "Lanches", "Doces", "Salgados"];

interface ProdutoFormProps {
    onProdutoSalvo: () => void;
    onCancelar: () => void;
    produtoEditando?: Produto | null;
}

function ProdutoForm({ onProdutoSalvo, onCancelar, produtoEditando }: ProdutoFormProps) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [categoria, setCategoria] = useState(CATEGORIAS[0]);
    const [imagemUrl, setImagemUrl] = useState("");
    const [erro, setErro] = useState<string | null>(null);
    // Upload: arquivo escolhido e o endereço temporário usado para a pré-visualização.
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Quando o usuário clica em "Editar", preenche o formulário com os dados do item.
    useEffect(() => {
        setNome(produtoEditando?.nome ?? "");
        setDescricao(produtoEditando?.descricao ?? "");
        setPreco(produtoEditando?.preco?.toString() ?? "");
        setCategoria(produtoEditando?.categoria ?? CATEGORIAS[0]);
        setImagemUrl(produtoEditando?.imagemUrl ?? "");
        setArquivo(null);
        setErro(null);
    }, [produtoEditando]);

    // Mostra a foto escolhida antes de enviar; libera a memória quando trocar de arquivo.
    useEffect(() => {
        if (!arquivo) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(arquivo);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [arquivo]);

    function escolherArquivo(lista: FileList | null) {
        const escolhido = lista?.[0] ?? null;
        if (escolhido && !escolhido.type.startsWith("image/")) {
            setErro("Escolha um arquivo de imagem (PNG, JPG, WEBP ou GIF).");
            return;
        }
        if (escolhido && escolhido.size > 2 * 1024 * 1024) {
            setErro("A imagem pode ter no máximo 2 MB.");
            return;
        }
        setErro(null);
        setArquivo(escolhido);
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!nome.trim()) {
            setErro("Informe o nome do produto.");
            return;
        }

        if (Number(preco) <= 0) {
            setErro("O preço deve ser maior que zero.");
            return;
        }

        const dados = { nome, descricao, preco: Number(preco), categoria, imagemUrl };

        try {
            const resposta = produtoEditando
                ? await api.put<Produto>(`/produtos/${produtoEditando.id}`, dados)
                : await api.post<Produto>("/produtos", dados);

            // Com uma foto escolhida, envia o arquivo (multipart) depois de salvar o produto.
            if (arquivo) {
                const formulario = new FormData();
                formulario.append("arquivo", arquivo);
                await api.post(`/produtos/${resposta.data.id}/imagem`, formulario);
            }

            if (!produtoEditando) {
                setNome("");
                setDescricao("");
                setPreco("");
                setImagemUrl("");
            }
            setArquivo(null);
            setErro(null);
            onProdutoSalvo();
        } catch (e) {
            setErro(lerErroApi(e, "Não foi possível salvar o produto. Verifique os dados e tente novamente.").mensagem);
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <input
                className="input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
            />
            <input
                className="input"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição"
            />
            <input
                className="input"
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Preço"
            />
            <select className="input" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
            <input
                className="input"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                placeholder="URL da imagem (opcional)"
            />
            <label className="upload-campo">
                <span className="form-campo-label">Ou envie uma foto (até 2 MB)</span>
                <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(e) => escolherArquivo(e.target.files)}
                />
            </label>
            {(preview || imagemUrl) && (
                <div className="upload-preview">
                    <img src={preview ?? imagemUrl} alt="Pré-visualização da foto do produto" />
                    <small>{preview ? "Nova foto (será enviada ao salvar)" : "Foto atual"}</small>
                </div>
            )}
            {erro && <p className="form-error">{erro}</p>}
            <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                    {produtoEditando ? "Salvar alterações" : "Cadastrar"}
                </button>
                {produtoEditando && (
                    <button className="btn btn-outline" type="button" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default ProdutoForm;
