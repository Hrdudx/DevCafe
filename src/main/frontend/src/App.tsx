import "./App.css";
import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { CarrinhoProvider } from "./context/CarrinhoContext";
import LoginPage from "./pages/LoginPage";
import InicioPage from "./pages/InicioPage";
import CardapioPage from "./pages/CardapioPage";
import FazerPedidoPage from "./pages/FazerPedidoPage";
import PedidosPage from "./pages/PedidosPage";
import PedidoDetailPage from "./pages/PedidoDetailPage";
import UsuariosPage from "./pages/UsuariosPage";
import ClientesPage from "./pages/ClientesPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import PromocoesPage from "./pages/PromocoesPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";

function PaginaCadastro({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: ReactNode }) {
    return (
        <div>
            <h1 className="page-title">{titulo}</h1>
            <p className="page-subtitle">{subtitulo}</p>
            <section className="panel">{children}</section>
        </div>
    );
}

function App() {
    return (
        <CarrinhoProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<InicioPage />} />
                    <Route path="fazer-pedido" element={<FazerPedidoPage />} />
                    <Route path="cardapio" element={<CardapioPage />} />
                    <Route path="pedidos" element={<PedidosPage />} />
                    <Route path="pedidos/:id" element={<PedidoDetailPage />} />
                    <Route
                        path="usuarios"
                        element={
                            <PaginaCadastro titulo="Usuários" subtitulo="Cadastre e gerencie quem usa o sistema.">
                                <UsuariosPage />
                            </PaginaCadastro>
                        }
                    />
                    <Route path="clientes" element={<ClientesPage />} />
                    <Route path="relatorios" element={<RelatoriosPage />} />
                    <Route path="promocoes" element={<PromocoesPage />} />
                    <Route path="configuracoes" element={<ConfiguracoesPage />} />
                    <Route path="produtos" element={<Navigate to="/configuracoes" replace />} />
                    <Route path="permissoes" element={<Navigate to="/configuracoes" replace />} />
                </Route>
            </Routes>
        </CarrinhoProvider>
    );
}

export default App;
