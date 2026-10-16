import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import PaginaCadastro from "./components/PaginaCadastro";
import { CarrinhoProvider } from "./context/CarrinhoContext";
import LoginPage from "./pages/LoginPage";
import InicioPage from "./pages/InicioPage";
import CardapioPage from "./pages/CardapioPage";
import FazerPedidoPage from "./pages/FazerPedidoPage";
import PedidosPage from "./pages/PedidosPage";
import PedidoDetailPage from "./pages/PedidoDetailPage";
import ClientesPage from "./pages/ClientesPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import PromocoesPage from "./pages/PromocoesPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import UsuariosPage from "./pages/UsuariosPage";
import PermissoesPage from "./pages/PermissoesPage";
import UsuarioPermissoesPage from "./pages/UsuarioPermissoesPage";
import UsuarioDetailPage from "./pages/UsuarioDetailPage";
import PermissaoDetailPage from "./pages/PermissaoDetailPage";
import NaoEncontradaPage from "./pages/NaoEncontradaPage";
import ProdutosPage from "./pages/ProdutosPage";

function App() {
    return (
        <CarrinhoProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<InicioPage />} />
                    <Route path="fazer-pedido" element={<FazerPedidoPage />} />
                    <Route path="pedidos" element={<PedidosPage />} />
                    <Route path="pedidos/:id" element={<PedidoDetailPage />} />
                    <Route path="cardapio" element={<CardapioPage />} />
                    <Route path="clientes" element={<ClientesPage />} />
                    <Route path="relatorios" element={<RelatoriosPage />} />
                    <Route path="promocoes" element={<PromocoesPage />} />
                    <Route path="configuracoes" element={<ConfiguracoesPage />} />
                    <Route
                        path="usuarios"
                        element={
                            <PaginaCadastro titulo="Usuários" subtitulo="Cadastre e gerencie quem usa o sistema.">
                                <UsuariosPage />
                            </PaginaCadastro>
                        }
                    />
                    <Route path="usuarios/:id" element={<UsuarioDetailPage />} />
                    <Route
                        path="atribuir-permissoes"
                        element={
                            <PaginaCadastro
                                titulo="Atribuir Permissões"
                                subtitulo="Escolha um usuário e marque os perfis de acesso dele."
                            >
                                <UsuarioPermissoesPage />
                            </PaginaCadastro>
                        }
                    />
                    <Route
                        path="permissoes"
                        element={
                            <PaginaCadastro titulo="Permissões" subtitulo="Defina os perfis de acesso.">
                                <PermissoesPage />
                            </PaginaCadastro>
                        }
                    />
                    <Route path="permissoes/:id" element={<PermissaoDetailPage />} />
                    <Route
                        path="produtos"
                        element={
                            <PaginaCadastro titulo="Produtos" subtitulo="Gerencie os itens que aparecem no cardápio.">
                                <ProdutosPage />
                            </PaginaCadastro>
                        }
                    />
                    <Route path="*" element={<NaoEncontradaPage />} />
                </Route>
            </Routes>
        </CarrinhoProvider>
    );
}

export default App;
