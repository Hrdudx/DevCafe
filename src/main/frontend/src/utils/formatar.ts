const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatarMoeda(valor: number) {
    return moeda.format(valor);
}

export function formatarData(dataHora: string) {
    return new Date(dataHora).toLocaleDateString("pt-BR");
}

export function formatarHora(dataHora: string) {
    return new Date(dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function formatarDataHora(dataHora: string) {
    return `${formatarData(dataHora)} ${formatarHora(dataHora)}`;
}

export function formatarDataPorExtenso(data: Date) {
    const texto = data.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Lista os nomes dos produtos de um pedido, sem repetir.
export function resumirItens(itens: { produto: { nome: string } }[]) {
    return [...new Set(itens.map((item) => item.produto.nome))].join(", ");
}
