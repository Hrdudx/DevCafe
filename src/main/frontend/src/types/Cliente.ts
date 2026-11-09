export interface Cliente {
    id: number;
    nome: string;
    email: string;
    telefone?: string;
    cep?: string;
    endereco?: string;
    dataCadastro?: string;
}
