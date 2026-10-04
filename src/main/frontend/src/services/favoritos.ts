const CHAVE = "devcafe_favoritos";

export function obterFavoritos(): number[] {
    try {
        return JSON.parse(localStorage.getItem(CHAVE) ?? "[]");
    } catch {
        return [];
    }
}

export function salvarFavoritos(ids: number[]) {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(ids));
    } catch {
        // Sem localStorage os favoritos valem só para esta visita.
    }
}
