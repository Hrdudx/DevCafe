import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import type { Permissao } from "../types/Permissao";
import type { Usuario } from "../types/Usuario";
import Breadcrumb from "../components/Breadcrumb";

// Detalhe de um perfil de acesso e de quem da equipe o possui: rota /permissoes/:id
function PermissaoDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [permissao, setPermissao] = useState<Permissao | null>(null);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([api.get<Permissao>(`/permissoes/${id}`), api.get<Usuario[]>("/usuarios")])
            .then(([respPermissao, respUsuarios]) => {
                setPermissao(respPermissao.data);
                // useParams devolve string: converte para comparar com o id numérico.
                setUsuarios(respUsuarios.data.filter((u) => u.permissoes?.some((p) => p.id === Number(id))));
                setErro(null);
            })
            .catch(() => setErro("Permissão não encontrada."));
    }, [id]);

    if (erro) return <p className="state-error">{erro}</p>;
    if (!permissao) return <p className="state-message">Carregando...</p>;

    return (
        <div>
            <Breadcrumb
                voltarPara="/permissoes"
                itens={[{ label: "Permissões", to: "/permissoes" }, { label: permissao.nome }]}
            />

            <div className="page-header">
                <div>
                    <h1 className="page-title">{permissao.nome}</h1>
                    <p className="page-subtitle">{permissao.descricao || "Sem descrição"}</p>
                </div>
                <div className="toolbar-actions">
                    <button className="btn btn-outline" onClick={() => navigate("/permissoes")}>
                        Voltar
                    </button>
                </div>
            </div>

            <section className="panel">
                <h2 className="panel-title">Quem tem este perfil</h2>
                {usuarios.length === 0 ? (
                    <p className="state-message">Nenhum usuário com esta permissão.</p>
                ) : (
                    <ul className="list">
                        {usuarios.map((u) => (
                            <li key={u.id} className="list-item">
                                <span className="list-item-info">
                                    <Link to={`/usuarios/${u.id}`}><strong>{u.nome}</strong></Link> ({u.username}) — {u.email}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default PermissaoDetailPage;
