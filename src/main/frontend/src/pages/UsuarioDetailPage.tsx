import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mail, UserRound } from "lucide-react";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import Breadcrumb from "../components/Breadcrumb";
import Botao from "../components/Botao";

// Aula 08: rota com parâmetro (/usuarios/:id). useParams lê o id da URL
// e useNavigate faz a navegação pelos botões.
function UsuarioDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        api.get<Usuario>(`/usuarios/${id}`)
            .then((resposta) => setUsuario(resposta.data))
            .catch(() => setErro("Usuário não encontrado."));
    }, [id]);

    if (erro) return <p className="state-error">{erro}</p>;
    if (!usuario) return <p className="state-message">Carregando...</p>;

    const permissoes = usuario.permissoes ?? [];

    return (
        <div>
            <Breadcrumb
                voltarPara="/usuarios"
                itens={[{ label: "Usuários", to: "/usuarios" }, { label: usuario.nome }]}
            />

            <section className="panel max-w-xl">
                <div className="mb-5 flex items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-2xl font-bold text-primary">
                        {usuario.nome.charAt(0).toUpperCase()}
                    </span>
                    <div>
                        <h1 className="m-0 text-2xl font-bold text-texto">{usuario.nome}</h1>
                        <p className="m-0 text-sm text-texto-suave">Usuário #{usuario.id}</p>
                    </div>
                </div>

                <dl className="mt-0 mb-5 grid gap-3 text-sm">
                    <div className="flex items-center gap-2 text-texto">
                        <UserRound size={16} className="text-texto-suave" />
                        <dt className="font-semibold">Username:</dt>
                        <dd className="m-0">{usuario.username}</dd>
                    </div>
                    <div className="flex items-center gap-2 text-texto">
                        <Mail size={16} className="text-texto-suave" />
                        <dt className="font-semibold">E-mail:</dt>
                        <dd className="m-0">{usuario.email}</dd>
                    </div>
                </dl>

                <h2 className="mt-0 mb-2 text-sm font-semibold text-texto">Permissões</h2>
                {permissoes.length === 0 ? (
                    <p className="mt-0 mb-5 text-sm text-texto-suave">Nenhuma permissão atribuída.</p>
                ) : (
                    <div className="mb-5 flex flex-wrap gap-2">
                        {permissoes.map((permissao) => (
                            <span
                                key={permissao.id}
                                className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary"
                                title={permissao.descricao}
                            >
                                {permissao.nome}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    <Botao variante="contorno" onClick={() => navigate("/usuarios")}>Voltar</Botao>
                    <Botao variante="neutro" onClick={() => navigate(`/usuarios?editar=${usuario.id}`)}>Editar</Botao>
                    <Botao onClick={() => navigate(`/atribuir-permissoes?usuario=${usuario.id}`)}>
                        Gerenciar permissões
                    </Botao>
                </div>
            </section>
        </div>
    );
}

export default UsuarioDetailPage;
