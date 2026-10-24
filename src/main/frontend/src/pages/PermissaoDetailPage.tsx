import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import api from "../services/api";
import type { Permissao } from "../types/Permissao";
import type { Usuario } from "../types/Usuario";
import Breadcrumb from "../components/Breadcrumb";
import Botao from "../components/Botao";

// Aula 08 (exercício 2): detalhe da permissão, lendo o :id da URL com useParams.
function PermissaoDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [permissao, setPermissao] = useState<Permissao | null>(null);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        api.get<Permissao>(`/permissoes/${id}`)
            .then((resposta) => setPermissao(resposta.data))
            .catch(() => setErro("Permissão não encontrada."));
        // O JSON da permissão não traz os usuários (evita a recursão infinita),
        // então descobrimos quem a possui a partir da lista de usuários.
        api.get<Usuario[]>("/usuarios")
            .then((resposta) => setUsuarios(resposta.data))
            .catch(() => setUsuarios([]));
    }, [id]);

    if (erro) return <p className="state-error">{erro}</p>;
    if (!permissao) return <p className="state-message">Carregando...</p>;

    const comEssaPermissao = usuarios.filter((usuario) =>
        usuario.permissoes?.some((p) => p.id === permissao.id)
    );

    return (
        <div>
            <Breadcrumb
                voltarPara="/permissoes"
                itens={[{ label: "Permissões", to: "/permissoes" }, { label: permissao.nome }]}
            />

            <section className="panel max-w-xl">
                <div className="mb-5 flex items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
                        <ShieldCheck size={26} />
                    </span>
                    <div>
                        <h1 className="m-0 text-2xl font-bold text-texto">{permissao.nome}</h1>
                        <p className="m-0 text-sm text-texto-suave">{permissao.descricao || "Sem descrição"}</p>
                    </div>
                </div>

                <h2 className="mt-0 mb-2 text-sm font-semibold text-texto">
                    Usuários com esta permissão ({comEssaPermissao.length})
                </h2>
                {comEssaPermissao.length === 0 ? (
                    <p className="mt-0 mb-5 text-sm text-texto-suave">Nenhum usuário possui esta permissão.</p>
                ) : (
                    <ul className="mt-0 mb-5 list-none divide-y divide-borda p-0 rounded-lg border border-borda">
                        {comEssaPermissao.map((usuario) => (
                            <li key={usuario.id} className="px-4 py-2 text-sm">
                                <Link to={`/usuarios/${usuario.id}`} className="font-semibold text-primary no-underline hover:underline">
                                    {usuario.nome}
                                </Link>{" "}
                                <span className="text-texto-suave">({usuario.username})</span>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex flex-wrap gap-2">
                    <Botao variante="contorno" onClick={() => navigate("/permissoes")}>Voltar</Botao>
                    <Botao onClick={() => navigate("/atribuir-permissoes")}>Atribuir a usuários</Botao>
                </div>
            </section>
        </div>
    );
}

export default PermissaoDetailPage;
