# DevCafé ☕

Sistema de pedidos para cafeteria, desenvolvido para a **Avaliação N1 de Desenvolvimento Web II**.
Back-end em **Java + Spring Boot** e front-end em **React + TypeScript**, integrados de ponta a ponta
(React → API REST → banco H2).

- **Projeto-base (Aulas 01 a 06):** CRUD de `Usuario` e `Permissao` em camadas (Controller → Service → Repository).
- **Funcionalidades próprias:** entidades `Produto` (cardápio) e `Pedido` (com `ItemPedido`), com CRUD completo,
  além de login, painel inicial, cardápio, carrinho e acompanhamento de pedidos.

---

## 1. Como rodar

**Pré-requisitos:** Java 21 e Node.js 20.19+ (ou 22+). Não é preciso instalar banco: o H2 é criado sozinho.

Abra **dois terminais** na pasta do projeto:

**Terminal 1 — back-end** (sobe em `http://localhost:8080`)

```bash
./mvnw spring-boot:run
```

> No Windows: `mvnw.cmd spring-boot:run`

**Terminal 2 — front-end** (sobe em `http://localhost:5173`)

```bash
cd src/main/frontend
npm install
npm run dev
```

Depois acesse **http://localhost:5173** no navegador.

> Se a porta 5173 estiver ocupada, o Vite usa a próxima (5174, 5175…) e mostra o endereço no terminal.
> O back-end aceita o front-end em qualquer porta do `localhost`.
>
> Se o login mostrar *"Não foi possível entrar. Verifique se o back-end está rodando"*, confira se o
> Terminal 1 está com o back-end no ar (`http://localhost:8080/api/produtos` deve abrir uma lista).

## 2. Login

Na primeira vez que o back-end sobe, um administrador é criado automaticamente:

| E-mail | Senha |
|---|---|
| `admin@devcafe.com` | `admin123` |

Também são carregados **produtos e pedidos de exemplo** (`src/main/resources/data.sql`), para as telas não começarem vazias.
Novos usuários cadastrados na tela **Usuários** (com senha) também conseguem fazer login.

## 3. Como testar o CRUD no navegador

| Entidade | Tela (menu) | O que fazer |
|---|---|---|
| **Usuário** | Usuários | Preencher o formulário e **Cadastrar** → aparece na lista → **Editar** (o formulário é preenchido) → **Salvar alterações** → **Excluir** |
| **Permissão** | Configurações → aba Permissões (ou `/permissoes`) | Mesmo fluxo: cadastrar → listar → editar → excluir |
| **Produto** (entidade própria) | Configurações → aba Produtos (ou `/produtos`) | Mesmo fluxo. O produto cadastrado aparece no **Cardápio** |
| **Pedido** (entidade própria) | Fazer Pedido → Meus Pedidos | Adicionar produtos com **+** e **Finalizar Pedido** → ver em **Meus Pedidos** → abrir (👁) e trocar o **status** no selo ao lado do título → excluir pela lixeira |

Após cada operação a lista é recarregada a partir da API.

## 4. Checklist da Avaliação N1

### Projeto e ambiente

| Requisito | Onde está |
|---|---|
| Spring Boot com Maven, Java 21, grupo `br.ueg.trindade` | `pom.xml` |
| Dependências Web, Data JPA, H2, PostgreSQL, DevTools e Security | `pom.xml` |
| Front-end React (Vite + TypeScript) em `src/main/frontend`, rodando com `npm run dev` | `src/main/frontend/` |

### Back-end — `src/main/java/br/ueg/trindade/artifact/Web_2_fullstack/`

| Requisito | Onde está |
|---|---|
| Entidade `Usuario` (nome, username, senha, email) com `@Entity`, `@Id`, `@GeneratedValue` | `model/Usuario.java` |
| Entidade `Permissao` | `model/Permissao.java` |
| Entidades próprias | `model/Produto.java`, `model/Pedido.java`, `model/ItemPedido.java` |
| Senha oculta nas respostas | `model/Usuario.java` — `@JsonProperty(access = WRITE_ONLY)`: a senha é recebida no cadastro, mas nunca devolvida pela API. Ela também é gravada criptografada (BCrypt) |
| `application.properties` com H2 | `src/main/resources/application.properties` |
| Um `JpaRepository` por entidade | `repository/UsuarioRepository`, `PermissaoRepository`, `ProdutoRepository`, `PedidoRepository`, `ItemPedidoRepository` |
| Pacotes `controller`, `service`, `repository`, `model` | pastas com esses nomes |
| Controllers com `@RestController` em `/api`, GET/POST/PUT/DELETE com `@PathVariable`, acessando apenas o Service | `controller/` |
| Regras de negócio no Service | `service/` (ver lista abaixo) |

**Regras de negócio implementadas nos Services**

- `UsuarioService`: e-mail único, senha obrigatória no cadastro (criptografada), senha em branco na edição mantém a atual, login por e-mail e senha.
- `PermissaoService`: nome obrigatório.
- `ProdutoService`: nome obrigatório, preço maior que zero, produto que já aparece em pedidos não pode ser excluído.
- `PedidoService`: pedido precisa ter ao menos um item, quantidade maior que zero, total calculado pelo back-end com o preço do produto, status só aceita valores válidos.

### Front-end — `src/main/frontend/src/`

| Requisito | Onde está |
|---|---|
| Axios com `baseURL` | `services/api.ts` |
| `@CrossOrigin` no back-end | todos os arquivos em `controller/` |
| `components/` com listagem, item (via props) e formulário controlado (`useState` + `useEffect`) | `UsuarioLista` / `UsuarioItem` / `UsuarioForm`, `PermissaoLista` / `PermissaoItem` / `PermissaoForm`, `ProdutoLista` / `ProdutoItem` / `ProdutoForm` |
| `pages/` com a lógica de cada tela | `UsuariosPage`, `PermissoesPage`, `ProdutosPage` (entidade própria), `PedidosPage`, entre outras |
| `App.tsx` apenas renderizando as páginas | `App.tsx` (só declara as rotas) |
| Botões **Editar** e **Excluir**, recarregando a lista | componentes `*Item.tsx` + função `carregar...()` nas páginas |
| CRUD completo no navegador para `Usuario`, `Permissao` e entidade própria | ver seção 3 |
| Aplicação de ponta a ponta (React → API → H2) | ver seções 1 e 3 |

## 5. Endpoints da API

Base: `http://localhost:8080/api`

| Recurso | GET (todos) | GET por id | POST | PUT | DELETE |
|---|---|---|---|---|---|
| Usuários | `/usuarios` | `/usuarios/{id}` | `/usuarios` | `/usuarios/{id}` | `/usuarios/{id}` |
| Permissões | `/permissoes` | `/permissoes/{id}` | `/permissoes` | `/permissoes/{id}` | `/permissoes/{id}` |
| Produtos | `/produtos` | `/produtos/{id}` | `/produtos` | `/produtos/{id}` | `/produtos/{id}` |
| Pedidos | `/pedidos` | `/pedidos/{id}` | `/pedidos` | `/pedidos/{id}/status` | `/pedidos/{id}` |

Login: `POST /api/auth/login` com `{ "email": "...", "senha": "..." }`.

Erros voltam com o código HTTP adequado e uma mensagem (`404` não encontrado, `400` dado inválido,
`401` login inválido, `409` conflito, como e-mail repetido ou produto em uso).

O console do banco H2 fica em `http://localhost:8080/h2-console`
(JDBC URL `jdbc:h2:file:./database.db`, usuário `sa`, sem senha).

## 6. Telas do sistema

| Tela | O que faz |
|---|---|
| Login | Entrada com e-mail e senha |
| Início | Indicadores do dia comparados a ontem, destaque do cardápio e pedidos recentes |
| Fazer Pedido | Escolha de produtos, carrinho com quantidades, observações e finalização |
| Meus Pedidos | Lista com filtro por situação, período e busca por número ou cliente |
| Detalhe do pedido | Cliente, endereço, pagamento, itens, troca de status e impressão |
| Cardápio | Produtos por categoria, busca, ordenação e favoritos |
| Clientes / Relatórios | Informações geradas a partir dos pedidos |
| Usuários / Configurações | Cadastros de usuários, produtos e permissões |

## 7. Estrutura do projeto

```
DevCafe/
├── pom.xml                                   # Maven (dependências do back-end)
├── src/main/java/br/ueg/trindade/artifact/Web_2_fullstack/
│   ├── controller/   # Endpoints REST (/api)
│   ├── service/      # Regras de negócio
│   ├── repository/   # JpaRepository de cada entidade
│   ├── model/        # Entidades JPA
│   ├── dto/          # Dados de entrada (login e novo pedido)
│   └── config/       # Segurança, CORS e administrador inicial
├── src/main/resources/
│   ├── application.properties                # Configuração do H2
│   └── data.sql                              # Produtos e pedidos de exemplo
└── src/main/frontend/                        # Front-end React + Vite
    └── src/
        ├── services/api.ts                   # Axios (baseURL)
        ├── components/                       # Lista, item, formulário e componentes visuais
        ├── pages/                            # Lógica de cada tela
        └── App.tsx                           # Rotas
```

## 8. Tecnologias

**Back-end:** Java 21, Spring Boot 4, Spring Web, Spring Data JPA, Spring Security (BCrypt), H2, PostgreSQL (driver), DevTools.

**Front-end:** React 19, TypeScript, Vite, Axios, React Router, lucide-react (ícones).

## 9. Próximos passos

- Proteger as rotas da API com Spring Security + JWT
- Cadastro de promoções
- Acompanhamento de pedidos em tempo real
