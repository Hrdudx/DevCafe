import "./App.css";
import UsuariosPage from "./pages/UsuariosPage";
import PermissoesPage from "./pages/PermissoesPage";
import ProdutosPage from "./pages/ProdutosPage";

function App() {
    return (
        <div>
            <h1 className="app-header">DevCafé ☕</h1>

            <section className="panel">
                <h2 className="panel-title">Usuários cadastrados</h2>
                <UsuariosPage />
            </section>

            <section className="panel">
                <h2 className="panel-title">Permissões cadastradas</h2>
                <PermissoesPage />
            </section>

            <section className="panel">
                <h2 className="panel-title">Produtos cadastrados</h2>
                <ProdutosPage />
            </section>
        </div>
    );
}

export default App;
