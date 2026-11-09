# DevCafé ☕

Sistema de pedidos para cafeteria, desenvolvido para a disciplina de **Desenvolvimento Web II**
(**Avaliação N1** e, sobre essa base, **Avaliação N2 — Trabalho Final**, individual).
Back-end em **Java + Spring Boot** e front-end em **React + TypeScript**, integrados de ponta a ponta
(React → API REST → banco H2).

- **Projeto-base (Aulas 01 a 06):** CRUD de `Usuario` e `Permissao` em camadas (Controller → Service → Repository).
- **Aula 07:** relacionamento muitos-para-muitos `Usuario` ↔ `Permissao` (`@ManyToMany`) e tela **Atribuir Permissões**.
- **Aula 08:** React Router — menu (`Layout` + `Outlet`), rotas com parâmetro (`/usuarios/:id`, `/permissoes/:id`, `/pedidos/:id`) e página 404.
- **Aula 08.5:** Tailwind CSS — componente `Botao` e telas de usuários, permissões e detalhes estilizadas com classes utilitárias.
- **Funcionalidades próprias:** entidades `Produto` (cardápio) e `Pedido` (com `ItemPedido`), com CRUD completo,
  além de login, painel inicial, cardápio, carrinho e acompanhamento de pedidos.
- **N2 — Trabalho Final:** dois modelos novos, `Cliente` e `Avaliacao` (1 cliente → N avaliações), com CRUD
  completo e duas telas novas (**Clientes** e **Avaliações**); login com **Spring Security + JWT** e rotas protegidas;
  e os extras **Bean Validation**, **API externa** (ViaCEP com `RestTemplate`), **upload de foto** dos produtos
  (`MultipartFile` + pré-visualização), **testes automatizados** (JUnit + MockMvc), **Tailwind CSS** e este **README**.

> **Por que continuar com o DevCafé na N2?** O projeto da N1 já funcionava de ponta a ponta, então partir dele
> permitiu investir o tempo nos conteúdos novos. Clientes e avaliações são uma evolução natural de uma cafeteria:
> a cafeteria passa a conhecer quem compra e o que essas pessoas acham de cada produto do cardápio.

---

## 🔑 Acesso para teste

| E-mail | Senha |
|---|---|
| **`admin@devcafe.com`** | **`admin123`** |

Esse usuário é criado automaticamente na primeira vez que o back-end sobe.
Também são carregados **produtos, pedidos, clientes e avaliações de exemplo** (`src/main/resources/data.sql`), para as telas não começarem vazias.
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
O back-end fica em `http://localhost:8080`.

> Desde a N2 a API é protegida por JWT: abrir `http://localhost:8080/api/produtos` direto no navegador responde
> **401**, e isso é o esperado. Os dados aparecem pelo front-end, depois do login.

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

## 2. Roteiro de teste — N2 (Trabalho Final)

Com o back-end e o front-end rodando (seção 1), siga os passos abaixo no navegador.
Leva cerca de 10 minutos e cobre todos os itens da checklist da N2 (seção 3).

### 2.1 Login com JWT e rotas protegidas
1. Sem estar logado, acesse `http://localhost:5173/clientes`: a tela volta para o **login** (rota protegida).
2. Digite uma senha errada: aparece *"E-mail ou senha inválidos"*.
3. Entre com **`admin@devcafe.com`** / **`admin123`**: abre a tela **Início**.
4. (Opcional) Aperte **F12** → **Application** → **Local Storage**: o token fica em `devcafe_token`.
   Na aba **Network**, as chamadas à API levam o cabeçalho `Authorization: Bearer <token>`.
5. (Opcional) Apague ou altere o `devcafe_token` e recarregue a página: o sistema volta para o login, porque a API responde **401**.

### 2.2 Clientes (modelo novo) — menu **Clientes**
1. A lista mostra os clientes de exemplo (Beatriz, Felipe e Rafael).
2. Clique em **Cadastrar** com os campos vazios: aparecem *"Informe o nome do cliente"* e *"Informe o e-mail do cliente"*
   embaixo de cada campo (Bean Validation).
3. Digite um e-mail inválido (ex.: `abc`): aparece *"Informe um e-mail válido"*.
4. Cadastre **Ana Teste** / `ana@exemplo.com`: ela aparece na lista, com a data de cadastro de hoje.
5. Regra de negócio: tente cadastrar outro cliente com `felipe@exemplo.com`: aparece *"Já existe um cliente cadastrado com esse e-mail"*.
6. Clique em **Editar** na Ana, altere o nome e clique em **Salvar alterações**: a lista é atualizada.

### 2.3 Avaliações (modelo novo) — menu **Avaliações**
1. A lista mostra as avaliações de exemplo com estrelas, produto, cliente, data e comentário, e a média geral no topo.
2. Escolha o cliente **Ana Teste**, o produto **Croissant**, clique na **2ª estrela** e clique em **Avaliar** sem comentário:
   aparece *"Para notas 1 ou 2, conte no comentário o que não agradou"* (regra de negócio).
3. Escreva um comentário e clique em **Avaliar**: a avaliação aparece no topo da lista e a média muda.
4. Regra de negócio: tente avaliar de novo o **Croissant** com a **Ana**: aparece *"Este cliente já avaliou esse produto"*.
5. Clique em **Editar** na avaliação, mude a nota para 4 estrelas e o comentário e clique em **Salvar alterações**.
6. No filtro **Todos os clientes** (à direita), escolha **Felipe Almeida**: aparecem só as avaliações dele.
   Esse filtro usa a rota do relacionamento `GET /api/clientes/{id}/avaliacoes`.

### 2.4 Relacionamento e exclusões
1. Em **Clientes**, clique em **Excluir** na **Ana Teste**: aparece *"Este cliente tem 1 avaliação(ões). Exclua as avaliações
   antes de excluir o cliente"*, porque um cliente com avaliações não pode ser apagado.
2. Em **Avaliações**, clique em **Excluir** na avaliação da Ana e confirme: ela some da lista.
3. Volte a **Clientes** e exclua a **Ana Teste**: agora ela some da lista.
4. Regra extra: em **Configurações → Produtos**, um produto que já foi avaliado não pode ser excluído.

### 2.5 Extras: CEP e foto do produto
1. **API externa (ViaCEP):** em **Clientes**, digite um CEP (ex.: `74000-000`) e clique em **Buscar CEP**: o campo
   **Endereço** é preenchido sozinho. O front chama o nosso back-end (`GET /api/cep/{cep}`), e o back-end consulta a ViaCEP
   com `RestTemplate`. CEP com formato errado mostra *"O CEP deve ter 8 números"*; sem internet, aparece um aviso para
   preencher o endereço manualmente.
2. **Upload:** em **Configurações → Produtos**, clique em **Editar** num produto, escolha uma foto em **Ou envie uma foto**:
   a pré-visualização aparece na hora. Clique em **Salvar alterações**: a foto passa a aparecer no **Cardápio**.
   Arquivos que não são imagem ou com mais de 2 MB são recusados.
3. **Testes:** pare o back-end e rode `.\mvnw.cmd test` (Windows) ou `./mvnw test` (Linux/macOS): **13 testes** devem passar
   (`Tests run: 13, Failures: 0`).

### 2.6 Banco de dados (opcional)
No H2 Console (`http://localhost:8080/h2-console`, JDBC URL `jdbc:h2:file:./database.db`, usuário `sa`, sem senha),
a tabela `AVALIACAO` tem as colunas `CLIENTE_ID` e `PRODUTO_ID`: são as chaves estrangeiras dos relacionamentos `@ManyToOne`.

## 3. Checklist da Avaliação N2

### Back-end — novos modelos (`src/main/java/br/ueg/trindade/artifact/Web_2_fullstack/`)

| Requisito | Onde está |
|---|---|
| 2 novas entidades com `@Entity`, `@Id` e `@GeneratedValue` | `model/Cliente.java`, `model/Avaliacao.java` |
| Relacionamento entre as novas entidades | `Cliente` `@OneToMany(mappedBy = "cliente")` ↔ `Avaliacao` `@ManyToOne` (coluna `cliente_id`). A avaliação também tem `@ManyToOne` com `Produto` |
| `JpaRepository` para cada nova entidade | `repository/ClienteRepository.java`, `repository/AvaliacaoRepository.java` |
| Camadas controller → service → repository → model | `ClienteController` → `ClienteService` → `ClienteRepository` → `Cliente` (e o mesmo para `Avaliacao`) |
| `@RestController` em `/api` com GET, POST, PUT e DELETE (`@PathVariable`) | `controller/ClienteController.java` (`/api/clientes`), `controller/AvaliacaoController.java` (`/api/avaliacoes`) |
| Regra de negócio no Service | `service/ClienteService.java`, `service/AvaliacaoService.java` (ver lista abaixo) |
| Autenticação com Spring Security + JWT, tela de login e rotas protegidas | `security/JwtUtil.java`, `security/JwtFilter.java`, `security/SecurityConfig.java`, `controller/AuthController.java`; no front, `pages/LoginPage.tsx`, `services/auth.ts`, `services/api.ts` e `components/Layout.tsx` |

**Regras de negócio dos modelos novos**

- `ClienteService`: e-mail único (sem diferenciar maiúsculas), data de cadastro definida pelo sistema e cliente com avaliações não pode ser excluído.
- `AvaliacaoService`: cliente e produto precisam existir, cada cliente avalia um mesmo produto uma única vez, nota 1 ou 2 exige comentário e a data da avaliação é definida pelo sistema.
- `ProdutoService`: um produto que já foi avaliado não pode ser excluído.

**Como funciona o JWT**

1. A tela de login envia e-mail e senha para `POST /api/auth/login`.
2. O back-end confere a senha (BCrypt) e devolve um **token JWT** assinado, válido por 8 horas, com o e-mail, o nome e as permissões do usuário.
3. O front-end guarda o token e o Axios o envia em toda requisição (`Authorization: Bearer <token>`).
4. O `JwtFilter` confere o token antes de cada requisição. Sem token válido, o Spring Security responde **401**.
5. No front, as telas internas exigem token (`Layout`) e um 401 da API leva de volta para o login.

### Front-end — novas telas (`src/main/frontend/src/`)

| Requisito | Onde está |
|---|---|
| 2 novas páginas em `pages/` | `pages/ClientesPage.tsx`, `pages/AvaliacoesPage.tsx` |
| Rota no React Router e item no menu | `App.tsx` (`/clientes`, `/avaliacoes`) e `components/Layout.tsx` (itens **Clientes** e **Avaliações**) |
| CRUD completo no navegador | ver seções 2.2 a 2.4 |
| Componentes reutilizáveis: listagem, item e formulário controlado (`useState` + `useEffect`) | `ClienteLista` / `ClienteItem` / `ClienteForm`, `AvaliacaoLista` / `AvaliacaoItem` / `AvaliacaoForm`, além de `Estrelas` (nota clicável ou só exibição) |
| Axios com `services/api.ts` (`baseURL`) e `@CrossOrigin` no back-end | `services/api.ts`; `@CrossOrigin` em `ClienteController` e `AvaliacaoController` |
| Botões **Editar** e **Excluir**, recarregando a lista | `ClienteItem` / `AvaliacaoItem` + `carregarClientes()` / `carregarAvaliacoes()` nas páginas |
| Aplicação de ponta a ponta (React → API → H2) | ver seções 1 e 2 |

### Extras

| Extra | Situação |
|---|---|
| **Validação**: Bean Validation no back-end e mensagens de erro no formulário | ✅ `@NotBlank`, `@Email`, `@Size`, `@NotNull`, `@Min`, `@Max` em `Cliente` e `Avaliacao`, com `@Valid` nos controllers. O `config/TratadorDeErros.java` devolve o erro de cada campo, e os formulários mostram a mensagem embaixo do campo |
| **API externa** com `RestTemplate` | ✅ `service/CepService.java` consulta a ViaCEP (`config/RestTemplateConfig.java`, `controller/CepController.java`, `dto/EnderecoCep.java`); no front, o botão **Buscar CEP** em `components/ClienteForm.tsx` |
| **Upload de arquivos** (`MultipartFile` + preview) | ✅ `POST /api/produtos/{id}/imagem` em `ProdutoController`; regras (só imagem, até 2 MB, nome único) em `ProdutoService.salvarImagem`; arquivos servidos em `/uploads/**` (`config/UploadConfig.java`); pré-visualização com `URL.createObjectURL` em `components/ProdutoForm.tsx` |
| **Testes** (JUnit/MockMvc) | ✅ `src/test/java/.../ClienteAvaliacaoApiTest.java` (login/JWT, CRUD, Bean Validation, regras de negócio, upload) e `CepServiceTest.java` (ViaCEP simulada com `MockRestServiceServer`). Rodar com `mvnw test` |
| **Framework CSS** | ✅ Tailwind CSS (desde a N1) |
| **README** com instruções para rodar back e front | ✅ este arquivo (seções 1 e 2) |
| Deploy com Docker | não implementado |

## 4. Roteiro de teste — N1 (projeto-base)

Com o back-end e o front-end rodando (seção 1) e logado como admin, siga os passos abaixo no navegador.
Leva cerca de 10 minutos e cobre os itens da checklist da N1 (seção 5).

### 4.1 Login
1. A tela de login mostra e-mail, senha e o botão **Entrar**.
2. Digite uma senha errada: aparece *"E-mail ou senha inválidos"*.
3. Entre com **`admin@devcafe.com`** / **`admin123`**: abre a tela **Início**, com indicadores do dia e pedidos recentes.

### 4.2 Usuário — menu **Usuários**
1. Preencha nome, username, e-mail e senha e clique em **Cadastrar**: o usuário aparece na lista.
2. Clique em **Editar**: o formulário é preenchido com os dados. Altere o nome e clique em **Salvar alterações**: a lista é atualizada.
3. Clique no nome do usuário logado (canto superior direito) → **Sair** e entre com o usuário recém-criado: o login funciona.
4. Saia, entre de novo como admin, clique em **Excluir** no usuário de teste e confirme: ele some da lista.

> A senha não aparece em nenhuma resposta da API: confira em `http://localhost:8080/api/usuarios`.

### 4.3 Detalhe do usuário e Atribuir Permissões (Aulas 07 e 08)
1. Em **Usuários**, clique no **nome** de um usuário: abre o detalhe em `/usuarios/{id}` com as permissões dele.
2. Clique em **Editar permissões** (ou no menu **Atribuir Permissões**): escolha o usuário, marque **ADMIN** e **COZINHA** e clique em **Salvar permissões** → aparece o aviso verde *"Permissões salvas!"*.
3. Volte ao detalhe do usuário: as permissões marcadas aparecem como selos.
4. Use o botão **voltar do navegador**: a navegação funciona sem recarregar a página.
5. Acesse um endereço que não existe (ex.: `http://localhost:5173/xyz`): aparece *"Página não encontrada"*.

> No H2 Console, a tabela `USUARIO_PERMISSAO` guarda os pares usuário/permissão.

### 4.4 Permissão — menu **Configurações** → aba **Permissões**
1. **Cadastrar** uma permissão → aparece na lista.
2. **Editar** → alterar a descrição → **Salvar alterações**.
3. Clique no **nome** da permissão: abre o detalhe em `/permissoes/{id}`.
4. **Excluir** → some da lista (mesmo que esteja atribuída a algum usuário: o vínculo é removido antes).

### 4.5 Produto (entidade própria) — menu **Configurações** → aba **Produtos**
1. **Cadastrar** um produto com nome, descrição, preço e categoria → aparece na lista e também no menu **Cardápio**.
2. **Editar** o preço → a lista mostra o novo valor.
3. **Excluir** o produto de teste → some da lista.
4. Regra de negócio: tente **Excluir** o *Cappuccino* → aparece *"Este produto já aparece em pedidos e não pode ser excluído"*.
5. Regra de negócio: tente cadastrar um produto com preço `0` → o cadastro é recusado.

### 4.6 Pedido (entidade própria) — menus **Fazer Pedido** e **Meus Pedidos**
1. Em **Fazer Pedido**, clique no **+** de alguns produtos: o carrinho à direita mostra itens, quantidades e total.
2. Clique em **Finalizar Pedido**: abre o detalhe do pedido criado.
3. No selo de status ao lado do título, escolha outro status (ex.: *Em preparo*): o pedido é atualizado.
4. Em **Meus Pedidos**, o pedido aparece na lista (teste as abas, o filtro de datas e a busca por número ou cliente).
5. Clique na **lixeira** do pedido de teste e confirme: ele some da lista.

### 4.7 Banco de dados (opcional)
Abra `http://localhost:8080/h2-console`, use a JDBC URL `jdbc:h2:file:./database.db`, usuário `sa` e senha em branco.
As tabelas `USUARIO`, `PERMISSAO`, `USUARIO_PERMISSAO`, `PRODUTO`, `PEDIDO` e `ITEM_PEDIDO` mostram os dados gravados pelas telas.

## 5. Checklist da Avaliação N1 (projeto-base)

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
| CRUD completo no navegador para `Usuario`, `Permissao` e entidade própria | ver seção 2 |
| Aplicação de ponta a ponta (React → API → H2) | ver seções 1 e 2 |

## 6. Endpoints da API

Base: `http://localhost:8080/api`

| Recurso | GET (todos) | GET por id | POST | PUT | DELETE |
|---|---|---|---|---|---|
| Usuários | `/usuarios` | `/usuarios/{id}` | `/usuarios` | `/usuarios/{id}` | `/usuarios/{id}` |
| Permissões | `/permissoes` | `/permissoes/{id}` | `/permissoes` | `/permissoes/{id}` | `/permissoes/{id}` |
| Produtos | `/produtos` | `/produtos/{id}` | `/produtos` | `/produtos/{id}` | `/produtos/{id}` |
| Pedidos | `/pedidos` | `/pedidos/{id}` | `/pedidos` | `/pedidos/{id}/status` | `/pedidos/{id}` |
| Clientes (N2) | `/clientes` | `/clientes/{id}` | `/clientes` | `/clientes/{id}` | `/clientes/{id}` |
| Avaliações (N2) | `/avaliacoes` | `/avaliacoes/{id}` | `/avaliacoes` | `/avaliacoes/{id}` | `/avaliacoes/{id}` |

Extras: `GET /cep/{cep}` (endereço pela ViaCEP) e `POST /produtos/{id}/imagem` (upload da foto, campo `arquivo`, multipart).

Avaliações de um cliente (relacionamento 1 → N): `GET /clientes/{id}/avaliacoes`.
Para criar ou editar uma avaliação, o cliente e o produto vão só com o id:
`{ "nota": 5, "comentario": "...", "cliente": { "id": 1 }, "produto": { "id": 2 } }`.

Permissões do usuário (Aula 07): `GET /usuarios/{id}/permissoes` e `PUT /usuarios/{id}/permissoes`
com a lista de ids no corpo (ex.: `[1, 2]`).

Login: `POST /api/auth/login` com `{ "email": "...", "senha": "..." }`. A resposta traz `{ "token": "...", "usuario": { ... } }`.
**Todas as outras rotas exigem o cabeçalho `Authorization: Bearer <token>`**; sem ele a resposta é `401`.

Erros voltam com o código HTTP adequado e uma mensagem (`404` não encontrado, `400` dado inválido,
`401` login inválido ou sem token, `409` conflito, como e-mail repetido ou produto em uso).
Nos campos validados com Bean Validation, a resposta `400` também traz `erros`, com a mensagem de cada campo
(ex.: `{ "message": "Informe um e-mail válido", "erros": { "email": "Informe um e-mail válido" } }`).

O console do banco H2 fica em `http://localhost:8080/h2-console`
(JDBC URL `jdbc:h2:file:./database.db`, usuário `sa`, sem senha).

## 7. Telas do sistema

| Tela | O que faz |
|---|---|
| Login | Entrada com e-mail e senha, que gera o token JWT |
| Início | Indicadores do dia comparados a ontem, destaque do cardápio e pedidos recentes |
| Fazer Pedido | Escolha de produtos, carrinho com quantidades, observações e finalização |
| Meus Pedidos | Lista com filtro por situação, período e busca por número ou cliente |
| Detalhe do pedido | Cliente, endereço, pagamento, itens, troca de status e impressão |
| Cardápio | Produtos por categoria, busca, ordenação e favoritos |
| Clientes (N2) | CRUD de clientes, com validação dos campos |
| Avaliações (N2) | CRUD de avaliações com nota em estrelas, média geral e filtro por cliente |
| Relatórios | Informações geradas a partir dos pedidos |
| Usuários / Configurações | Cadastros de usuários, produtos e permissões |
| Detalhe do usuário / da permissão | Dados do registro, aberto pelo nome na lista (`/usuarios/:id`, `/permissoes/:id`) |
| Atribuir Permissões | Seleção de usuário e checkboxes com os perfis de acesso (muitos-para-muitos) |

## 8. Estrutura do projeto

```
DevCafe/
├── pom.xml                                   # Maven (dependências do back-end)
├── src/main/java/br/ueg/trindade/artifact/Web_2_fullstack/
│   ├── controller/   # Endpoints REST (/api)
│   ├── service/      # Regras de negócio
│   ├── repository/   # JpaRepository de cada entidade
│   ├── model/        # Entidades JPA
│   ├── dto/          # Dados de entrada e saída (login e novo pedido)
│   ├── security/     # JWT (JwtUtil, JwtFilter) e configuração do Spring Security/CORS
│   └── config/       # Administrador inicial e tratamento de erros de validação
├── src/main/resources/
│   ├── application.properties                # Configuração do H2
│   └── data.sql                              # Produtos, pedidos, clientes e avaliações de exemplo
└── src/main/frontend/                        # Front-end React + Vite
    └── src/
        ├── services/api.ts                   # Axios (baseURL + envio do token JWT)
        ├── services/auth.ts                  # Guarda o token e o usuário logado
        ├── components/                       # Lista, item, formulário e componentes visuais
        ├── pages/                            # Lógica de cada tela
        └── App.tsx                           # Rotas
```

## 9. Tecnologias

**Back-end:** Java 21, Spring Boot 4, Spring Web, Spring Data JPA, Spring Security (BCrypt + JWT com jjwt 0.12), Bean Validation, H2, PostgreSQL (driver), DevTools.

**Front-end:** React 19, TypeScript, Vite, Axios, React Router, Tailwind CSS, lucide-react (ícones).

> O Tailwind é importado sem o *preflight* (reset de estilos), para conviver com o `App.css` das telas que já existiam.

## 10. Próximos passos

- Usar as permissões do token para liberar telas por perfil (ex.: só ADMIN gerencia usuários)
- Docker para o back-end e o front-end
- Cadastro de promoções
- Acompanhamento de pedidos em tempo real
