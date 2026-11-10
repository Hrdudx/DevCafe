import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError, AxiosHeaders } from "axios";
import ClienteForm from "../components/ClienteForm";
import api from "../services/api";

// O formulário fala com o back-end pelo services/api.ts; aqui ele é trocado por uma versão falsa,
// então o teste roda sem o back-end ligado.
vi.mock("../services/api", () => ({
    default: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}));

const apiFalsa = vi.mocked(api);

// Monta um erro igual ao que o Axios gera quando o back-end responde com erro.
function erroDaApi(status: number, dados: unknown) {
    const config = { headers: new AxiosHeaders() };
    return new AxiosError("erro", "ERR_BAD_REQUEST", config, null, {
        status,
        statusText: "",
        headers: {},
        config,
        data: dados,
    });
}

describe("ClienteForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("cadastra um cliente com POST e avisa a página para recarregar a lista", async () => {
        apiFalsa.post.mockResolvedValue({ data: {} });
        const aoSalvar = vi.fn();
        render(<ClienteForm onClienteSalvo={aoSalvar} onCancelar={vi.fn()} />);

        await userEvent.type(screen.getByPlaceholderText("Nome"), "Carla Souza");
        await userEvent.type(screen.getByPlaceholderText("E-mail"), "carla@exemplo.com");
        await userEvent.click(screen.getByRole("button", { name: "Cadastrar" }));

        expect(apiFalsa.post).toHaveBeenCalledWith("/clientes", expect.objectContaining({
            nome: "Carla Souza",
            email: "carla@exemplo.com",
        }));
        expect(aoSalvar).toHaveBeenCalled();
    });

    it("mostra embaixo de cada campo o erro de validação que veio do back-end", async () => {
        apiFalsa.post.mockRejectedValue(erroDaApi(400, {
            message: "Informe o nome do cliente",
            erros: { nome: "Informe o nome do cliente", email: "Informe um e-mail válido" },
        }));
        const aoSalvar = vi.fn();
        render(<ClienteForm onClienteSalvo={aoSalvar} onCancelar={vi.fn()} />);

        await userEvent.click(screen.getByRole("button", { name: "Cadastrar" }));

        expect(await screen.findByText("Informe o nome do cliente")).toBeTruthy();
        expect(screen.getByText("Informe um e-mail válido")).toBeTruthy();
        expect(aoSalvar).not.toHaveBeenCalled();
    });

    it("ao editar, preenche os campos e salva com PUT", async () => {
        apiFalsa.put.mockResolvedValue({ data: {} });
        const cliente = { id: 7, nome: "Davi", email: "davi@exemplo.com", telefone: "123" };
        render(<ClienteForm clienteEditando={cliente} onClienteSalvo={vi.fn()} onCancelar={vi.fn()} />);

        const nome = screen.getByPlaceholderText("Nome") as HTMLInputElement;
        expect(nome.value).toBe("Davi");

        await userEvent.clear(nome);
        await userEvent.type(nome, "Davi Lopes");
        await userEvent.click(screen.getByRole("button", { name: "Salvar alterações" }));

        expect(apiFalsa.put).toHaveBeenCalledWith("/clientes/7", expect.objectContaining({ nome: "Davi Lopes" }));
    });

    it("Buscar CEP preenche o endereço com a resposta da API externa", async () => {
        apiFalsa.get.mockResolvedValue({ data: { enderecoFormatado: "Rua 1, Centro - Goiânia/GO" } });
        render(<ClienteForm onClienteSalvo={vi.fn()} onCancelar={vi.fn()} />);

        await userEvent.type(screen.getByPlaceholderText(/^CEP/), "74000-000");
        await userEvent.click(screen.getByRole("button", { name: "Buscar CEP" }));

        expect(apiFalsa.get).toHaveBeenCalledWith("/cep/74000000");
        const endereco = screen.getByPlaceholderText("Endereço (preenchido pelo CEP ou digitado)") as HTMLInputElement;
        expect(endereco.value).toBe("Rua 1, Centro - Goiânia/GO");
    });

    it("CEP com menos de 8 números mostra erro e nem chama a API", async () => {
        render(<ClienteForm onClienteSalvo={vi.fn()} onCancelar={vi.fn()} />);

        await userEvent.type(screen.getByPlaceholderText(/^CEP/), "123");
        await userEvent.click(screen.getByRole("button", { name: "Buscar CEP" }));

        expect(screen.getByText("Informe o CEP com 8 números (ex.: 74000-000)")).toBeTruthy();
        expect(apiFalsa.get).not.toHaveBeenCalled();
    });
});
