import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Cliente } from "../types/Cliente";
import { lerErroApi } from "../utils/erros";

interface ClienteFormProps {
    onClienteSalvo: () => void;
    onCancelar: () => void;
    clienteEditando?: Cliente | null;
}

function ClienteForm({ onClienteSalvo, onCancelar, clienteEditando }: ClienteFormProps) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cep, setCep] = useState("");
    const [endereco, setEndereco] = useState("");
    const [buscandoCep, setBuscandoCep] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [errosCampos, setErrosCampos] = useState<Record<string, string>>({});

    // Quando o usuário clica em "Editar", preenche o formulário com os dados do cliente.
    useEffect(() => {
        setNome(clienteEditando?.nome ?? "");
        setEmail(clienteEditando?.email ?? "");
        setTelefone(clienteEditando?.telefone ?? "");
        setCep(clienteEditando?.cep ?? "");
        setEndereco(clienteEditando?.endereco ?? "");
        setErro(null);
        setErrosCampos({});
    }, [clienteEditando]);

    // API externa: o back-end consulta a ViaCEP e devolve o endereço para preencher o campo.
    async function buscarCep() {
        const numeros = cep.replace(/\D/g, "");
        if (numeros.length !== 8) {
            setErrosCampos((atual) => ({ ...atual, cep: "Informe o CEP com 8 números (ex.: 74000-000)" }));
            return;
        }
        setBuscandoCep(true);
        try {
            const resposta = await api.get<{ enderecoFormatado: string }>(`/cep/${numeros}`);
            setEndereco(resposta.data.enderecoFormatado);
            setErrosCampos((atual) => ({ ...atual, cep: "", endereco: "" }));
        } catch (e) {
            const { mensagem } = lerErroApi(e, "Não foi possível consultar o CEP.");
            setErrosCampos((atual) => ({ ...atual, cep: mensagem }));
        } finally {
            setBuscandoCep(false);
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const dados = { nome, email, telefone, cep, endereco };

        try {
            if (clienteEditando) {
                await api.put(`/clientes/${clienteEditando.id}`, dados);
            } else {
                await api.post("/clientes", dados);
                setNome("");
                setEmail("");
                setTelefone("");
                setCep("");
                setEndereco("");
            }
            setErro(null);
            setErrosCampos({});
            onClienteSalvo();
        } catch (e) {
            const { mensagem, campos } = lerErroApi(e, "Não foi possível salvar o cliente.");
            setErrosCampos(campos);
            // Se o erro é de um campo, ele já aparece embaixo do campo; senão mostra a mensagem geral.
            setErro(Object.keys(campos).length > 0 ? null : mensagem);
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit} noValidate>
            <label className="form-campo">
                <input
                    className={"input" + (errosCampos.nome ? " input-erro" : "")}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome"
                />
                {errosCampos.nome && <span className="campo-erro">{errosCampos.nome}</span>}
            </label>
            <label className="form-campo">
                <input
                    className={"input" + (errosCampos.email ? " input-erro" : "")}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail"
                />
                {errosCampos.email && <span className="campo-erro">{errosCampos.email}</span>}
            </label>
            <label className="form-campo">
                <input
                    className={"input" + (errosCampos.telefone ? " input-erro" : "")}
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="Telefone (opcional)"
                />
                {errosCampos.telefone && <span className="campo-erro">{errosCampos.telefone}</span>}
            </label>
            <div className="form-campo form-campo-largo">
                <span className="campo-com-botao">
                    <input
                        className={"input" + (errosCampos.cep ? " input-erro" : "")}
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        onBlur={() => cep.replace(/\D/g, "").length === 8 && !endereco && buscarCep()}
                        placeholder="CEP (opcional) — ex.: 01001-000"
                        inputMode="numeric"
                        maxLength={9}
                    />
                    <button className="btn btn-outline" type="button" onClick={buscarCep} disabled={buscandoCep}>
                        {buscandoCep ? "Buscando..." : "Buscar CEP"}
                    </button>
                </span>
                {errosCampos.cep && <span className="campo-erro">{errosCampos.cep}</span>}
            </div>
            <label className="form-campo form-campo-largo">
                <input
                    className={"input" + (errosCampos.endereco ? " input-erro" : "")}
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Endereço (preenchido pelo CEP ou digitado)"
                />
                {errosCampos.endereco && <span className="campo-erro">{errosCampos.endereco}</span>}
            </label>
            {erro && <p className="form-error">{erro}</p>}
            <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                    {clienteEditando ? "Salvar alterações" : "Cadastrar"}
                </button>
                {clienteEditando && (
                    <button className="btn btn-outline" type="button" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default ClienteForm;
