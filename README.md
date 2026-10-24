# DevCafé ☕

Sistema de pedidos para cafeteria, desenvolvido para a **Avaliação N1 de Desenvolvimento Web II**.
Back-end em **Java + Spring Boot** e front-end em **React + TypeScript**, integrados de ponta a ponta
(React → API REST → banco H2).

- **Projeto-base (Aulas 01 a 06):** CRUD de `Usuario` e `Permissao` em camadas (Controller → Service → Repository).
- **Aula 07:** relacionamento muitos-para-muitos `Usuario` ↔ `Permissao` e tela **Atribuir Permissões**.
- **Aula 08:** React Router com menu (`Layout` + `Outlet`), rotas com parâmetro (`/usuarios/:id`, `/permissoes/:id`) e página 404.
- **Aula 08.5:** Tailwind CSS e o componente reutilizável `Botao`.
- **Funcionalidades próprias:** entidades `Produto` (cardápio) e `Pedido` (com `ItemPedido`), com CRUD completo,
  além de login, painel inicial, cardápio, carrinho e acompanhamento de pedidos.

---

## 🔑 Acesso para teste

| E-mail | Senha |
|---|---|
| **`admin@devcafe.com`** | **`admin123`** |

Esse usuário é criado automaticamente na primeira vez que o back-end sobe.
Também são carregados **produtos e pedidos de exemplo** (`src/main/resources/data.sql`), para as telas não começarem vazias.
Usuários novos cadastrados na tela **Usuários** (com senha) também conseguem fazer login.

## 1. Como rodar

**Pré-requisitos:** Java 21, Node.js 20.19+ (ou 22+) e Git.
Não é preciso instalar Maven nem banco de dados: o projeto usa o Maven Wrapper (`mvnw`) e o H2 é criado sozinho.

### Passo 1 — Baixar o projeto

```bash
git clone https://github.com/Hrdudx/DevCafe.git
cd DevCafe
```

### Passo 2 — Subir o back-end (Terminal 1)

Na pasta `DevCafe`:

| Sistema | Comando |
|---|---|
| Windows (PowerShell) | `.\mvnw.cmd spring-boot:run` |
| Windows (Prompt de Comando) | `mvnw.cmd spring-boot:run` |
| Linux / macOS | `./mvnw spring-boot:run` |

Aguarde aparecer a mensagem **`Started ArtifactWeb2FullstackApplication`**.
O back-end fica em `http://localhost:8080` (teste: `http://localhost:8080/api/produtos` deve mostrar uma lista).

### Passo 3 — Subir o front-end (Terminal 2)

Abra **outro terminal** na pasta `DevCafe`:

```bash
cd src/main/frontend
npm install
npm run dev
```

### Passo 4 — Abrir no navegador

Acesse **http://localhost:5173** e entre com **`admin@devcafe.com`** / **`admin123`**.

> Se a porta 5173 estiver ocupada, o Vite usa a próxima (5174, 5175…) e mostra o endereço certo no terminal.
> O back-end aceita o front-end em qualquer porta do `localhost`.
>
> Se o login mostrar *"Não foi possível entrar. Verifique se o back-end está rodando"*, o Terminal 1
> ainda não terminou de subir ou foi fechado.

## 2. Roteiro de teste

Com o back-end e o front-end rodando (seção 1), siga os passos abaixo no navegador.
Leva cerca de 10 minutos e cobre todos os itens da checklist.

### 2.1 Login
1. A tela de login mostra e-mail, senha e o botão **Entrar**.
2. Digite uma senha errada: aparece *"E-mail ou senha inválidos"*.
3. Entre com **`admin@devcafe.com`** / **`admin123`**: abre a tela **Início**, com indicadores do dia e pedidos recentes.

### 2.2 Usuário — menu **Usuários**
1. Preencha nome, username, e-mail e senha e clique em **Cadastrar**: o usuário aparece na lista.
2. Clique em **Editar**: o formulário é preenchido com os dados. Altere o nome e clique em **Salvar alterações**: a lista é atualizada.
3. Clique no nome do usuário logado (canto superior direito) → **Sair** e entre com o usuário recém-criado: o login funciona.
4. Saia, entre de novo como admin, clique em **Excluir** no usuário de teste e confirme: ele some da lista.

> A senha não aparece em nenhuma resposta da API: confira em `http://localhost:8080/api/usuarios`.

### 2.3 Permissão — menu **Permissões** (ou **Configurações** → aba **Permissões**)
1. **Cadastrar** uma permissão → aparece na lista.
2. **Editar** → alterar a descrição → **Salvar alterações**.
3. **Excluir** → some da lista.

> Na primeira vez que o back-end sobe, já são criadas as permissões **ADMIN** e **ATENDENTE**,
> e o administrador recebe a permissão ADMIN.

### 2.4 Atribuir permissões (Aula 07) — menu **Atribuir Permissões**
1. Escolha um usuário no seletor: as permissões que ele já tem aparecem marcadas.
2. Marque/desmarque as permissões e clique em **Salvar permissões**: aparece o aviso verde *"Permissões salvas!"*.
3. Volte em **Usuários**: as permissões aparecem como etiquetas ao lado de cada usuário.
4. Exclua uma permissão que está atribuída a alguém: ela sai do usuário e da lista, sem erro.

### 2.5 Rotas e detalhes (Aula 08)
1. Em **Usuários**, clique no **nome** de um usuário: abre `/usuarios/{id}` com dados e permissões.
2. Nessa tela, **Editar** volta para a lista com o formulário preenchido; **Gerenciar permissões** abre a
   tela de atribuição já com o usuário escolhido; **Voltar** retorna à lista.
3. Em **Permissões**, clique no nome de uma permissão: abre `/permissoes/{id}` com os usuários que a possuem.
4. Acesse um endereço que não existe (ex.: `http://localhost:5173/qualquer-coisa`): aparece a página **404**.
5. Os botões voltar/avançar do navegador funcionam entre as telas.

### 2.6 Produto (entidade própria) — menu **Configurações** → aba **Produtos**
1. **Cadastrar** um produto com nome, descrição, preço e categoria → aparece na lista e também no menu **Cardápio**.
2. **Editar** o preço → a lista mostra o novo valor.
3. **Excluir** o produto de teste → some da lista.
4. Regra de negócio: tente **Excluir** o *Cappuccino* → aparece *"Este produto já aparece em pedidos e não pode ser excluído"*.
5. Regra de negócio: tente cadastrar um produto com preço `0` → o cadastro é recusado.

### 2.7 Pedido (entidade própria) — menus **Fazer Pedido** e **Meus Pedidos**
1. Em **Fazer Pedido**, clique no **+** de alguns produtos: o carrinho à direita mostra itens, quantidades e total.
2. Clique em **Finalizar Pedido**: abre o detalhe do pedido criado.
3. No selo de status ao lado do título, escolha outro status (ex.: *Em preparo*): o pedido é atualizado.
4. Em **Meus Pedidos**, o pedido aparece na lista (teste as abas, o filtro de datas e a busca por número ou cliente).
5. Clique na **lixeira** do pedido de teste e confirme: ele some da lista.

### 2.8 Banco de dados (opcional)
Abra `http://localhost:8080/h2-console`, use a JDBC URL `jdbc:h2:file:./database.db`, usuário `sa` e senha em branco.
As tabelas `USUARIO`, `PERMISSAO`, `USUARIO_PERMISSAO` (junção do muitos-para-muitos), `PRODUTO`, `PEDIDO` e `ITEM_PEDIDO`
mostram os dados gravados pelas telas.

## 3. Checklist da Avaliação N1

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
| **Aula 07:** `@ManyToMany` + `@JoinTable(usuario_permissao)` em `Usuario`, lado inverso `mappedBy` em `Permissao` | `model/Usuario.java`, `model/Permissao.java` |
| **Aula 07:** `GET` e `PUT /api/usuarios/{id}/permissoes` | `controller/UsuarioController.java` |

**Regras de negócio implementadas nos Services**

- `UsuarioService`: e-mail único, senha obrigatória no cadastro (criptografada), senha em branco na edição mantém a atual, login por e-mail e senha.
- `UsuarioService.atribuirPermissoes`: substitui as permissões do usuário pela lista de ids enviada (recusa ids inexistentes).
- `PermissaoService`: nome obrigatório; ao excluir, a permissão é retirada antes dos usuários que a possuem.
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
| CRUD completo no navegador para `Usuario`, `Permissao` e entidade própria | ver seção 2 |
| Aplicação de ponta a ponta (React → API → H2) | ver seções 1 e 2 |
| **Aula 07:** tela de atribuição com `<select>` de usuários e checkboxes | `pages/UsuarioPermissoesPage.tsx` |
| **Aula 08:** `BrowserRouter`, `Layout` com `NavLink` + `Outlet`, rotas aninhadas e 404 (`path="*"`) | `main.tsx`, `components/Layout.tsx`, `App.tsx`, `pages/NaoEncontradaPage.tsx` |
| **Aula 08:** `useParams` e `useNavigate` | `pages/UsuarioDetailPage.tsx`, `pages/PermissaoDetailPage.tsx`, `components/UsuarioForm.tsx` |
| **Aula 08.5:** Tailwind (`@tailwindcss/vite`) e componente `Botao` com variantes | `vite.config.ts`, `index.css`, `components/Botao.tsx` |

**Duas decisões diferentes dos slides**

- **`@JsonIgnore` em vez de `@JsonManagedReference`/`@JsonBackReference`.** O Jackson não aceita
  `@JsonBackReference` numa coleção (`Set<Usuario>`) ao ler JSON: com o par de anotações, o cadastro e a
  edição de usuário (POST/PUT) davam erro 500. Com `@JsonIgnore` em `Permissao.usuarios` a recursão é
  cortada do mesmo jeito e o JSON do usuário continua trazendo as permissões.
- **Tailwind sem o "preflight".** O slide troca o `index.css` inteiro por `@import "tailwindcss";`, mas o reset
  de estilos do Tailwind desmontaria o visual que o DevCafé já tinha. Por isso o `index.css` importa só o
  tema e as classes utilitárias; as classes do Tailwind funcionam normalmente.

## 4. Endpoints da API

Base: `http://localhost:8080/api`

| Recurso | GET (todos) | GET por id | POST | PUT | DELETE |
|---|---|---|---|---|---|
| Usuários | `/usuarios` | `/usuarios/{id}` | `/usuarios` | `/usuarios/{id}` | `/usuarios/{id}` |
| Permissões | `/permissoes` | `/permissoes/{id}` | `/permissoes` | `/permissoes/{id}` | `/permissoes/{id}` |
| Permissões do usuário | — | `/usuarios/{id}/permissoes` | — | `/usuarios/{id}/permissoes` (corpo: `[1, 2]`) | — |
| Produtos | `/produtos` | `/produtos/{id}` | `/produtos` | `/produtos/{id}` | `/produtos/{id}` |
| Pedidos | `/pedidos` | `/pedidos/{id}` | `/pedidos` | `/pedidos/{id}/status` | `/pedidos/{id}` |

Login: `POST /api/auth/login` com `{ "email": "...", "senha": "..." }`.

Erros voltam com o código HTTP adequado e uma mensagem (`404` não encontrado, `400` dado inválido,
`401` login inválido, `409` conflito, como e-mail repetido ou produto em uso).

O console do banco H2 fica em `http://localhost:8080/h2-console`
(JDBC URL `jdbc:h2:file:./database.db`, usuário `sa`, sem senha).

## 5. Telas do sistema

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
| Detalhe do usuário / da permissão | Dados, permissões do usuário ou usuários que têm a permissão |
| Atribuir Permissões | Seleção muitos-para-muitos de permissões por usuário |
| 404 | Qualquer endereço que não existe |

## 6. Estrutura do projeto

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
        ├── components/                       # Lista, item, formulário, Botao e componentes visuais
        ├── pages/                            # Lógica de cada tela
        └── App.tsx                           # Rotas
```

## 7. Tecnologias

**Back-end:** Java 21, Spring Boot 4, Spring Web, Spring Data JPA, Spring Security (BCrypt), H2, PostgreSQL (driver), DevTools.

**Front-end:** React 19, TypeScript, Vite, Axios, React Router, Tailwind CSS, lucide-react (ícones).

## 8. Próximos passos

- Proteger as rotas da API com Spring Security + JWT
- Cadastro de promoções
- Acompanhamento de pedidos em tempo real
