import UsuarioList from "./components/UsuarioList";
import PermissaoList from "./components/PermissaoList";
import ProdutoList from "./components/ProdutoList";

function App() {
    return (
        <div>
            <h1>DevCafé ☕</h1>

            <h2>Usuários cadastrados</h2>
            <UsuarioList />

            <h2>Permissões cadastradas</h2>
            <PermissaoList />

            <h2>Produtos cadastrados</h2>
            <ProdutoList />
        </div>
    );
}

export default App;