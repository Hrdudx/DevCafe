import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbProps {
    voltarPara: string;
    itens: { label: string; to?: string }[];
}

function Breadcrumb({ voltarPara, itens }: BreadcrumbProps) {
    return (
        <nav className="breadcrumb">
            <Link to={voltarPara} className="breadcrumb-back" aria-label="Voltar">
                <ArrowLeft size={16} />
            </Link>
            {itens.map((item, indice) => (
                <span key={item.label} className="breadcrumb-item">
                    {indice > 0 && <ChevronRight size={14} />}
                    {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
                </span>
            ))}
        </nav>
    );
}

export default Breadcrumb;
