export const STATUS_INFO: Record<string, { label: string; className: string }> = {
    RECEBIDO: { label: "Recebido", className: "badge-info" },
    EM_PREPARO: { label: "Em preparo", className: "badge-warning" },
    PRONTO: { label: "Pronto", className: "badge-info" },
    ENTREGUE: { label: "Concluído", className: "badge-success" },
    CANCELADO: { label: "Cancelado", className: "badge-danger" },
};

export const CATEGORIAS = ["Todos", "Cafés", "Bebidas Geladas", "Lanches", "Doces", "Salgados"].map((c) => ({
    valor: c,
    label: c,
}));
