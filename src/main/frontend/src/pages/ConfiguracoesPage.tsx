import { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import CategoriaTabs from "../components/CategoriaTabs";
import ProdutosPage from "./ProdutosPage";
import PermissoesPage from "./PermissoesPage";
import UsuarioPermissoesPage from "./UsuarioPermissoesPage";

const ABAS = [
    { valor: "produtos", label: "Produtos" },
    { valor: "permissoes", label: "Permissões" },
    { valor: "equipe", label: "Permissões da equipe" },
];

function ConfiguracoesPage() {
    const [aba, setAba] = useState("produtos");

    return (
        <div>
            <Breadcrumb voltarPara="/" itens={[{ label: "Configurações" }]} />
            <h1 className="page-title">Configurações</h1>
            <p className="page-subtitle">Gerencie os produtos do cardápio e os perfis de acesso da equipe.</p>

            <CategoriaTabs opcoes={ABAS} selecionada={aba} onSelecionar={setAba} />
            <section className="panel">
                {aba === "produtos" && <ProdutosPage />}
                {aba === "permissoes" && <PermissoesPage />}
                {aba === "equipe" && <UsuarioPermissoesPage />}
            </section>
        </div>
    );
}

export default ConfiguracoesPage;
