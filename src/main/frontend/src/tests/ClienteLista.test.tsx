import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClienteLista from "../components/ClienteLista";
import type { Cliente } from "../types/Cliente";

const clientes: Cliente[] = [
    { id: 1, nome: "Ana Lima", email: "ana@exemplo.com", telefone: "(62) 90000-0000", dataCadastro: "2026-11-01" },
    { id: 2, nome: "Bruno Reis", email: "bruno@exemplo.com", endereco: "Rua 1, Centro - Goiânia/GO" },
];

describe("ClienteLista e ClienteItem", () => {
    it("mostra um aviso quando não há clientes", () => {
        render(<ClienteLista clientes={[]} onEditar={vi.fn()} onExcluir={vi.fn()} />);

        expect(screen.getByText("Nenhum cliente cadastrado ainda.")).toBeTruthy();
    });

    it("lista cada cliente com nome, e-mail e endereço", () => {
        render(<ClienteLista clientes={clientes} onEditar={vi.fn()} onExcluir={vi.fn()} />);

        const itens = screen.getAllByRole("listitem");
        expect(itens).toHaveLength(2);
        expect(within(itens[0]).getByText("Ana Lima")).toBeTruthy();
        expect(itens[0].textContent).toContain("ana@exemplo.com");
        expect(itens[1].textContent).toContain("Rua 1, Centro - Goiânia/GO");
    });

    it("os botões Editar e Excluir avisam qual cliente foi escolhido", async () => {
        const aoEditar = vi.fn();
        const aoExcluir = vi.fn();
        render(<ClienteLista clientes={clientes} onEditar={aoEditar} onExcluir={aoExcluir} />);

        const segundo = screen.getAllByRole("listitem")[1];
        await userEvent.click(within(segundo).getByRole("button", { name: "Editar" }));
        await userEvent.click(within(segundo).getByRole("button", { name: "Excluir" }));

        expect(aoEditar).toHaveBeenCalledWith(clientes[1]);
        expect(aoExcluir).toHaveBeenCalledWith(2);
    });
});
