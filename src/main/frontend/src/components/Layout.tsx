import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    Bell,
    BookOpen,
    ClipboardList,
    Coffee,
    FileText,
    House,
    Search,
    Settings,
    ShoppingCart,
    Star,
    UserRound,
    UsersRound,
} from "lucide-react";
import api from "../services/api";
import type { Pedido } from "../types/Pedido";
import type { Produto } from "../types/Produto";
import { obterUsuarioLogado } from "../services/auth";

const navItens = [
    { to: "/", label: "Início", icon: House },
    { to: "/fazer-pedido", label: "Fazer Pedido", icon: ShoppingCart },
    { to: "/pedidos", label: "Meus Pedidos", icon: ClipboardList },
    { to: "/cardapio", label: "Cardápio", icon: BookOpen },
    { to: "/clientes", label: "Clientes", icon: UserRound },
    { to: "/relatorios", label: "Relatórios", icon: FileText },
    { to: "/promocoes", label: "Promoções", icon: Star },
    { to: "/usuarios", label: "Usuários", icon: UsersRound },
    { to: "/configuracoes", label: "Configurações", icon: Settings },
];

function SidebarLink({ to, label, icon: Icon }: (typeof navItens)[number]) {
    return (
        <NavLink
            to={to}
            end={to === "/"}
            className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
        >
            <Icon size={18} strokeWidth={1.8} />
            {label}
        </NavLink>
    );
}

function Layout() {
    const usuario = obterUsuarioLogado();
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");
    const [emAndamento, setEmAndamento] = useState(0);
    const [nomesProdutos, setNomesProdutos] = useState<string[]>([]);

    useEffect(() => {
        api.get<Produto[]>("/produtos")
            .then((resposta) => setNomesProdutos(resposta.data.map((p) => p.nome.toLowerCase())))
            .catch(() => {});
        api.get<Pedido[]>("/pedidos")
            .then((resposta) => {
                const abertos = resposta.data.filter((p) => ["RECEBIDO", "EM_PREPARO", "PRONTO"].includes(p.status));
                setEmAndamento(abertos.length);
            })
            .catch(() => {});
    }, []);

    function buscar(event: FormEvent) {
        event.preventDefault();
        const termo = busca.trim();
        if (!termo) return;
        // Se o texto bate com algum produto, abre o cardápio; senão procura
        // nos pedidos (pelo número ou pelo nome do cliente).
        if (nomesProdutos.some((nome) => nome.includes(termo.toLowerCase()))) {
            navigate(`/cardapio?busca=${encodeURIComponent(termo)}`);
        } else {
            navigate(`/pedidos?busca=${encodeURIComponent(termo.replace("#", ""))}`);
        }
        setBusca("");
    }

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <Coffee size={26} strokeWidth={2} />
                    <span>Devcafé</span>
                </div>
                <nav className="sidebar-nav">
                    {navItens.map((item) => (
                        <SidebarLink key={item.to} {...item} />
                    ))}
                </nav>
            </aside>
            <div className="main-area">
                <header className="topbar">
                    <form className="search-field topbar-search" onSubmit={buscar}>
                        <Search size={16} />
                        <input
                            type="search"
                            placeholder="Buscar produtos, pedidos ou clientes..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </form>
                    <div className="topbar-right">
                        <button
                            className="topbar-bell"
                            onClick={() => navigate("/pedidos?aba=ANDAMENTO")}
                            title={`${emAndamento} pedido(s) em andamento`}
                            aria-label="Pedidos em andamento"
                        >
                            <Bell size={20} strokeWidth={1.8} />
                            {emAndamento > 0 && <span className="topbar-bell-dot" />}
                        </button>
                        <div className="topbar-user">
                            <span className="topbar-avatar">{usuario.charAt(0).toUpperCase()}</span>
                            <span className="topbar-user-text">
                                <strong>{usuario}</strong>
                                <small>Administradora</small>
                            </span>
                        </div>
                    </div>
                </header>
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
