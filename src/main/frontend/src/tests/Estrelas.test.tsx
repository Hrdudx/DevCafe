import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Estrelas from "../components/Estrelas";

describe("Estrelas", () => {
    it("só exibe a nota quando não recebe onChange", () => {
        render(<Estrelas nota={4} />);

        expect(screen.getByRole("img", { name: "Nota 4 de 5" })).toBeTruthy();
        expect(screen.queryAllByRole("radio")).toHaveLength(0);
    });

    it("vira um campo clicável no formulário e avisa a nota escolhida", async () => {
        const aoMudar = vi.fn();
        render(<Estrelas nota={5} onChange={aoMudar} />);

        expect(screen.getAllByRole("radio")).toHaveLength(5);
        await userEvent.click(screen.getByRole("radio", { name: "3 estrelas" }));

        expect(aoMudar).toHaveBeenCalledWith(3);
    });
});
