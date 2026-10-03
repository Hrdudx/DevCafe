import { NavLink, Outlet } from "react-router-dom";

const navItems = [
    { to: "/", label: "Início", icon: "🏠" },
    { to: "/cardapio", label: "Cardápio", icon: "☕" },
    { to: "/pedidos", label: "Pedidos", icon: "🧾" },
    { to: "/usuarios", label: "Usuários", icon: "👤" },
    { to: "/permissoes", label: "Permissões", icon: "🔑" },
    { to: "/produtos", label: "Produtos", icon: "📦" },
];

function Layout() {
    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-brand">☕ DevCafé</div>
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
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
