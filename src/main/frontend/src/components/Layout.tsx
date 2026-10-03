import { NavLink, Outlet } from "react-router-dom";
import { obterUsuarioLogado } from "../services/auth";

const navItems = [
    { to: "/", label: "Início", icon: "🏠" },
    { to: "/cardapio", label: "Cardápio", icon: "☕" },
    { to: "/pedidos", label: "Meus Pedidos", icon: "🧾" },
    { to: "/usuarios", label: "Usuários", icon: "👤" },
    { to: "/permissoes", label: "Permissões", icon: "🔑" },
    { to: "/produtos", label: "Produtos", icon: "📦" },
];

function Layout() {
    const usuario = obterUsuarioLogado();

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-brand">☕ Devcafé</div>
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            className={({ isActive }) =>
                                "sidebar-link" + (isActive ? " active" : "")
                            }
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <div className="main-area">
                <header className="topbar">
                    <input className="topbar-search" type="search" placeholder="Buscar produtos, pedidos..." />
                    <div className="topbar-right">
                        <span className="topbar-bell" aria-label="Notificações">🔔</span>
                        <span className="topbar-user">
                            <span className="topbar-avatar">{usuario.charAt(0).toUpperCase()}</span>
                            <span className="topbar-user-name">{usuario}</span>
                        </span>
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
