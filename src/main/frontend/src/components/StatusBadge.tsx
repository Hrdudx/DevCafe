import { STATUS_INFO } from "../utils/constantes";

function StatusBadge({ status }: { status: string }) {
    const info = STATUS_INFO[status] ?? { label: status, className: "badge-info" };
    return <span className={"status-badge " + info.className}>{info.label}</span>;
}

export default StatusBadge;
