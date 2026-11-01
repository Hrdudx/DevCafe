import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import type { Permissao } from "../types/Permissao";
import Breadcrumb from "../components/Breadcrumb";
import Botao from "../components/Botao";

function PermissaoDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [permissao, setPermissao] = useState<Permissao | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        api.get<Permissao>(`/permissoes/${id}`)
            .then((resposta) => setPermissao(resposta.data))
            .catch(() => setErro("Permissão não encontrada."));
    }, [id]);

    if (erro) return <p className="text-red-600">{erro}</p>;
    if (!permissao) return <p className="text-gray-500">Carregando...</p>;

    return (
        <div>
            <Breadcrumb
                voltarPara="/permissoes"
                itens={[{ label: "Permissões", to: "/permissoes" }, { label: permissao.nome }]}
            />
            <div className="max-w-md rounded-lg bg-white p-6 shadow">
                <h1 className="mt-0 mb-4 text-2xl font-bold text-gray-800">{permissao.nome}</h1>
                <p className="mt-0 mb-5 text-gray-700"><strong>Descrição:</strong> {permissao.descricao}</p>
                <Botao variante="neutro" onClick={() => navigate("/permissoes")}>Voltar</Botao>
            </div>
        </div>
    );
}

export default PermissaoDetailPage;
