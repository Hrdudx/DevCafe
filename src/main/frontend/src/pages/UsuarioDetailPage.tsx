import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import Breadcrumb from "../components/Breadcrumb";
import Botao from "../components/Botao";

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

    if (erro) return <p className="text-red-600">{erro}</p>;
    if (!usuario) return <p className="text-gray-500">Carregando...</p>;

    return (
        <div>
            <Breadcrumb
                voltarPara="/usuarios"
                itens={[{ label: "Usuários", to: "/usuarios" }, { label: usuario.nome }]}
            />
            <div className="max-w-md rounded-lg bg-white p-6 shadow">
                <h1 className="mt-0 mb-4 text-2xl font-bold text-gray-800">{usuario.nome}</h1>
                <p className="my-1 text-gray-700"><strong>Username:</strong> {usuario.username}</p>
                <p className="my-1 text-gray-700"><strong>E-mail:</strong> {usuario.email}</p>
                <p className="mt-3 mb-1 text-gray-700"><strong>Permissões:</strong></p>
                <div className="mb-5 flex flex-wrap gap-2">
                    {usuario.permissoes && usuario.permissoes.length > 0 ? (
                        usuario.permissoes.map((p) => (
                            <span key={p.id} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                {p.nome}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-500">Nenhuma permissão atribuída.</span>
                    )}
                </div>
                <div className="flex gap-2">
                    <Botao variante="neutro" onClick={() => navigate("/usuarios")}>Voltar</Botao>
                    <Botao onClick={() => navigate(`/atribuir-permissoes?usuario=${usuario.id}`)}>
                        Editar permissões
                    </Botao>
                </div>
            </div>
        </div>
    );
}

export default UsuarioDetailPage;
