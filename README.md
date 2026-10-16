# DevCafé ☕

Sistema de pedidos para cafeteria, desenvolvido para a **Avaliação N1 de Desenvolvimento Web II**.
Back-end em **Java + Spring Boot** e front-end em **React + TypeScript**, integrados de ponta a ponta
(React → API REST → banco H2).

- **Projeto-base (Aulas 01 a 07):** CRUD de `Usuario` e `Permissao` em camadas (Controller → Service → Repository)
  e relacionamento muitos-para-muitos entre eles: cada membro da equipe recebe perfis como `ADMIN`, `ATENDENTE` e `BARISTA`.
- **Funcionalidades próprias:** entidades `Produto` (cardápio) e `Pedido` (com `ItemPedido`), com CRUD completo,
  além de login, painel inicial, cardápio, carrinho e acompanhamento de pedidos.

---

## 🔑 Acesso para teste

| E-mail | Senha |
|---|---|
| **`admin@devcafe.com`** | **`admin123`** |

Esse usuário é criado automaticamente na primeira vez que o back-end sobe.
Ele já vem com o perfil `ADMIN`. Também são carregados os **perfis da equipe** (`ADMIN`, `ATENDENTE`, `BARISTA`) e **produtos e pedidos de exemplo** (`src/main/resources/data.sql`), para as telas não começarem vazias.
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

### 2.3 Permissão — menu **Configurações** → aba **Permissões**
1. **Cadastrar** uma permissão → aparece na lista.
2. **Editar** → alterar a descrição → **Salvar alterações**.
3. **Excluir** → some da lista.
4. Regra de negócio: tente **Excluir** a permissão *ADMIN* → aparece *"Esta permissão está atribuída a usuários e não pode ser excluída"*.

### 2.4 Permissões da equipe (Aula 07: muitos-para-muitos) — menu **Usuários** → botão **Permissões**
1. Cadastre um usuário (ex.: *Ana*) e clique em **Permissões** na linha dele: abre a tela **Permissões da equipe** já com ele selecionado.
2. Marque *ATENDENTE* e *BARISTA* e clique em **Salvar permissões**: aparece *"Permissões salvas!"*.
3. Volte em **Usuários**: os perfis aparecem como etiquetas ao lado do nome.
4. Escolha outro usuário no seletor: os checkboxes mostram as permissões dele. A mesma tela fica em **Configurações** → aba **Permissões da equipe**.
5. Saia e entre como o usuário: o perfil aparece no canto superior direito.

> Confira em `http://localhost:8080/api/usuarios/{id}/permissoes`: o usuário vem com a lista `permissoes`,
> e em `/api/permissoes` as permissões não trazem os usuários de volta (sem recursão infinita).

### 2.5 Produto (entidade própria) — menu **Configurações** → aba **Produtos**
1. **Cadastrar** um produto com nome, descrição, preço e categoria → aparece na lista e também no menu **Cardápio**.
2. **Editar** o preço → a lista mostra o novo valor.
3. **Excluir** o produto de teste → some da lista.
4. Regra de negócio: tente **Excluir** o *Cappuccino* → aparece *"Este produto já aparece em pedidos e não pode ser excluído"*.
5. Regra de negócio: tente cadastrar um produto com preço `0` → o cadastro é recusado.

### 2.6 Pedido (entidade própria) — menus **Fazer Pedido** e **Meus Pedidos**
1. Em **Fazer Pedido**, clique no **+** de alguns produtos: o carrinho à direita mostra itens, quantidades e total.
2. Clique em **Finalizar Pedido**: abre o detalhe do pedido criado.
3. No selo de status ao lado do título, escolha outro status (ex.: *Em preparo*): o pedido é atualizado.
4. Em **Meus Pedidos**, o pedido aparece na lista (teste as abas, o filtro de datas e a busca por número ou cliente).
5. Clique na **lixeira** do pedido de teste e confirme: ele some da lista.

### 2.7 Banco de dados (opcional)
Abra `http://localhost:8080/h2-console`, use a JDBC URL `jdbc:h2:file:./database.db`, usuário `sa` e senha em branco.
As tabelas `USUARIO`, `PERMISSAO`, `USUARIO_PERMISSAO` (tabela de junção do muitos-para-muitos), `PRODUTO`, `PEDIDO` e `ITEM_PEDIDO`
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
| Relacionamento muitos-para-muitos `Usuario` ↔ `Permissao` (Aula 07) | `model/Usuario.java` — `@ManyToMany` + `@JoinTable(name = "usuario_permissao")`; `model/Permissao.java` — lado inverso `@ManyToMany(mappedBy = "permissoes")` |
| Sem recursão infinita no JSON | `model/Permissao.java` — `@JsonIgnore` em `usuarios` (ver observação abaixo) |
| Atribuir permissões ao usuário | `UsuarioService.atribuirPermissoes` (`@Transactional`) + `GET` e `PUT /api/usuarios/{id}/permissoes` no `UsuarioController` |
| Outros relacionamentos | `Pedido` `@OneToMany` → `ItemPedido` `@ManyToOne` → `Produto` |

> **Observação sobre a Aula 07:** o slide sugere `@JsonManagedReference` / `@JsonBackReference`. Com eles o JSON
> sai certo, mas o cadastro de usuário (`POST /api/usuarios`) falha com erro 500: o Jackson só aceita
> `@JsonBackReference` em um objeto único, e aqui o lado de volta é uma coleção (`Set<Usuario>`). Por isso foi usado
> `@JsonIgnore` no lado inverso, que corta a "volta" do mesmo jeito.

**Regras de negócio implementadas nos Services**

- `UsuarioService`: e-mail único, senha obrigatória no cadastro (criptografada), senha em branco na edição mantém a atual, login por e-mail e senha, atribuição de permissões só com permissões existentes.
- `PermissaoService`: nome obrigatório, permissão atribuída a algum usuário não pode ser excluída.
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
| Tela de atribuição de permissões (select de usuários + checkboxes) | `pages/UsuarioPermissoesPage.tsx`, com `permissoes?` em `types/Usuario.ts` |
| Aplicação de ponta a ponta (React → API → H2) | ver seções 1 e 2 |

## 4. Endpoints da API

Base: `http://localhost:8080/api`

| Recurso | GET (todos) | GET por id | POST | PUT | DELETE |
|---|---|---|---|---|---|
| Usuários | `/usuarios` | `/usuarios/{id}` | `/usuarios` | `/usuarios/{id}` | `/usuarios/{id}` |
| Permissões | `/permissoes` | `/permissoes/{id}` | `/permissoes` | `/permissoes/{id}` | `/permissoes/{id}` |
| Produtos | `/produtos` | `/produtos/{id}` | `/produtos` | `/produtos/{id}` | `/produtos/{id}` |
| Pedidos | `/pedidos` | `/pedidos/{id}` | `/pedidos` | `/pedidos/{id}/status` | `/pedidos/{id}` |

Permissões do usuário (Aula 07): `GET /api/usuarios/{id}/permissoes` e `PUT /api/usuarios/{id}/permissoes`
com a lista de ids no corpo (ex.: `[2, 3]`).

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
| Permissões da equipe | Escolha de um usuário e marcação dos perfis dele (ADMIN, ATENDENTE, BARISTA…) |

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
        ├── components/                       # Lista, item, formulário e componentes visuais
        ├── pages/                            # Lógica de cada tela
        └── App.tsx                           # Rotas
```

## 7. Tecnologias

**Back-end:** Java 21, Spring Boot 4, Spring Web, Spring Data JPA, Spring Security (BCrypt), H2, PostgreSQL (driver), DevTools.

**Front-end:** React 19, TypeScript, Vite, Axios, React Router, lucide-react (ícones).

## 8. Próximos passos

- Proteger as rotas da API com Spring Security + JWT
- Cadastro de promoções
- Acompanhamento de pedidos em tempo real
