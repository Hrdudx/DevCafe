import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import InicioPage from "./pages/InicioPage";
import CardapioPage from "./pages/CardapioPage";
import PedidosPage from "./pages/PedidosPage";
import PedidoDetailPage from "./pages/PedidoDetailPage";
import UsuariosPage from "./pages/UsuariosPage";
import PermissoesPage from "./pages/PermissoesPage";
import ProdutosPage from "./pages/ProdutosPage";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<InicioPage />} />
                <Route path="cardapio" element={<CardapioPage />} />
                <Route path="pedidos" element={<PedidosPage />} />
                <Route path="pedidos/:id" element={<PedidoDetailPage />} />
                <Route
                    path="usuarios"
                    element={
                        <div>
                            <h1 className="page-title">Usuários cadastrados</h1>
                            <UsuariosPage />
                        </div>
                    }
                />
                <Route
                    path="permissoes"
                    element={
                        <div>
                            <h1 className="page-title">Permissões cadastradas</h1>
                            <PermissoesPage />
                        </div>
                    }
                />
                <Route
                    path="produtos"
                    element={
                        <div>
                            <h1 className="page-title">Produtos cadastrados</h1>
                            <ProdutosPage />
                        </div>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
