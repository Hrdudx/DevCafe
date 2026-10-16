import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AtSign, Mail, ShieldCheck } from "lucide-react";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import Breadcrumb from "../components/Breadcrumb";

// Detalhe de um membro da equipe: rota /usuarios/:id
function UsuarioDetailPage() {
    const { id } = useParams(); // sempre string, ex.: "2"
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        api.get<Usuario>(`/usuarios/${id}`)
            .then((resposta) => {
                setUsuario(resposta.data);
                setErro(null);
            })
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

            <div className="page-header">
                <div>
                    <h1 className="page-title">{usuario.nome}</h1>
                    <p className="page-subtitle">Membro da equipe DevCafé</p>
                </div>
                <div className="toolbar-actions">
                    <button className="btn btn-outline" onClick={() => navigate("/usuarios")}>
                        Voltar
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate(`/usuarios?editar=${usuario.id}`)}>
                        Editar
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/atribuir-permissoes?usuario=${usuario.id}`)}
                    >
                        Atribuir permissões
                    </button>
                </div>
            </div>

            <div className="info-grid">
                <div className="info-card">
                    <span className="info-icon"><AtSign size={20} /></span>
                    <div>
                        <h3>Username</h3>
                        <p>{usuario.username}</p>
                    </div>
                </div>
                <div className="info-card">
                    <span className="info-icon"><Mail size={20} /></span>
                    <div>
                        <h3>E-mail</h3>
                        <p>{usuario.email}</p>
                    </div>
                </div>
                <div className="info-card">
                    <span className="info-icon"><ShieldCheck size={20} /></span>
                    <div>
                        <h3>Perfis de acesso</h3>
                        {permissoes.length === 0 ? (
                            <p>Nenhuma permissão atribuída.</p>
                        ) : (
                            <span className="perfil-tags perfil-tags-bloco">
                                {permissoes.map((p) => (
                                    <Link key={p.id} to={`/permissoes/${p.id}`} className="status-badge badge-info">
                                        {p.nome}
                                    </Link>
                                ))}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsuarioDetailPage;
