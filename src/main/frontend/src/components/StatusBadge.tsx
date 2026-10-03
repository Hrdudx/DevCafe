const STATUS_INFO: Record<string, { label: string; className: string }> = {
    RECEBIDO: { label: "Recebido", className: "badge-info" },
    EM_PREPARO: { label: "Em preparo", className: "badge-warning" },
    PRONTO: { label: "Pronto", className: "badge-info" },
    ENTREGUE: { label: "Concluído", className: "badge-success" },
    CANCELADO: { label: "Cancelado", className: "badge-danger" },
};

function StatusBadge({ status }: { status: string }) {
    const info = STATUS_INFO[status] ?? { label: status, className: "badge-info" };
    return <span className={"status-badge " + info.className}>{info.label}</span>;
}

export default StatusBadge;
