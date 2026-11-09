import { describe, expect, it } from "vitest";
import { AxiosError, AxiosHeaders } from "axios";
import { lerErroApi } from "../utils/erros";

describe("lerErroApi", () => {
    it("lê a mensagem e os erros por campo que o back-end devolve", () => {
        const config = { headers: new AxiosHeaders() };
        const erro = new AxiosError("erro", "ERR_BAD_REQUEST", config, null, {
            status: 409, statusText: "", headers: {}, config,
            data: { message: "Já existe um cliente cadastrado com esse e-mail" },
        });

        expect(lerErroApi(erro, "padrão")).toEqual({
            mensagem: "Já existe um cliente cadastrado com esse e-mail",
            campos: {},
        });
    });

    it("usa a mensagem padrão quando o erro não veio da API", () => {
        expect(lerErroApi(new Error("falha"), "Não foi possível salvar.")).toEqual({
            mensagem: "Não foi possível salvar.",
            campos: {},
        });
    });
});
