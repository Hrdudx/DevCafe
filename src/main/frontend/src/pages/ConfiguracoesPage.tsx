import { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import CategoriaTabs from "../components/CategoriaTabs";
import ProdutosPage from "./ProdutosPage";
import PermissoesPage from "./PermissoesPage";

const ABAS = [
    { valor: "produtos", label: "Produtos" },
    { valor: "permissoes", label: "Permissões" },
];

function ConfiguracoesPage() {
    const [aba, setAba] = useState("produtos");

    return (
        <div>
            <Breadcrumb voltarPara="/" itens={[{ label: "Configurações" }]} />
            <h1 className="page-title">Configurações</h1>
            <p className="page-subtitle">Gerencie os produtos do cardápio e os perfis de acesso.</p>

            <CategoriaTabs opcoes={ABAS} selecionada={aba} onSelecionar={setAba} />
            <section className="panel">{aba === "produtos" ? <ProdutosPage /> : <PermissoesPage />}</section>
        </div>
    );
}

export default ConfiguracoesPage;
