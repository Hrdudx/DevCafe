import UsuariosPage from "./pages/UsuariosPage";
import PermissoesPage from "./pages/PermissoesPage";
import ProdutosPage from "./pages/ProdutosPage";

function App() {
    return (
        <div>
            <h1>DevCafé ☕</h1>

            <h2>Usuários cadastrados</h2>
            <UsuariosPage />

            <h2>Permissões cadastradas</h2>
            <PermissoesPage />

            <h2>Produtos cadastrados</h2>
            <ProdutosPage />
        </div>
    );
}

export default App;
