# DevCafé ☕

Sistema de pedidos para cafeteria, desenvolvido em Java (Spring Boot) no back-end e React (TypeScript) no front-end.

Este projeto nasceu a partir dos estudos da disciplina **Programação Web II** (arquitetura full stack com Spring Boot + React) e está evoluindo como um projeto pessoal, com o objetivo de construir um sistema completo de gestão de pedidos para uma cafeteria: cadastro de usuários, permissões, produtos (cardápio) e, futuramente, pedidos.

## Tecnologias

**Back-end**
- Java 21
- Spring Boot 4
- Spring Data JPA
- Spring Security
- Banco H2 (desenvolvimento) / PostgreSQL (produção)

**Front-end**
- React + TypeScript
- Vite
- Axios

## Funcionalidades atuais

- **Login** com e-mail e senha dos usuários cadastrados (senhas guardadas com BCrypt)
- **Início**: indicadores do dia (pedidos, faturamento, produtos vendidos, clientes) comparados com o dia anterior, destaque de novidade e pedidos recentes
- **Cardápio** com filtro por categoria, busca, ordenação e favoritos
- **Fazer Pedido**: carrinho com quantidades, observações e finalização do pedido
- **Meus Pedidos**: filtro por situação, período e busca por número ou cliente
- **Detalhe do pedido**: cliente, endereço, forma de pagamento, itens, alteração de status e impressão
- **Clientes** e **Relatórios** gerados a partir dos pedidos
- **Usuários** e **Configurações** (cadastro de produtos e permissões)
- API REST (`/api/usuarios`, `/api/permissoes`, `/api/produtos`, `/api/pedidos`)
- Produtos e pedidos de exemplo carregados automaticamente no primeiro start (`data.sql`)

## Próximos passos

- Autorização com Spring Security + JWT (proteger também as rotas da API)
- Cadastro de promoções
- Painel de acompanhamento de pedidos em tempo real

## Primeiro acesso

Na primeira vez que o back-end sobe, é criado um administrador:

- **E-mail:** `admin@devcafe.com`
- **Senha:** `admin123`

Depois de entrar, cadastre novos usuários em **Usuários** (com senha) e use-os para fazer login.
Usuários antigos, cadastrados antes da tela de senha existir, precisam ser editados para receber uma senha.

## Checklist da Avaliação N1

| Requisito | Onde está |
|---|---|
| Spring Boot (Maven, Java 21, `br.ueg.trindade`) com Web, Data JPA, H2, PostgreSQL, DevTools e Security | `pom.xml` |
| React (Vite + TypeScript) em `src/main/frontend` | `npm run dev` |
| Entidades `Usuario` (nome, username, senha, email), `Permissao` e próprias (`Produto`, `Pedido`, `ItemPedido`) | `model/` |
| Senha oculta nas respostas | `@JsonProperty(access = WRITE_ONLY)` em `Usuario.senha` |
| H2 no `application.properties` e um `JpaRepository` por entidade | `resources/`, `repository/` |
| Pacotes `controller`, `service`, `repository`, `model` | `br.ueg.trindade.artifact.Web_2_fullstack` |
| Controllers `/api` com GET, POST, PUT, DELETE (`@PathVariable`) acessando só o Service | `controller/` |
| Regras de negócio no Service (e-mail único, preço > 0, produto em uso não pode ser excluído, status válido…) | `service/` |
| Axios com `services/api.ts` (`baseURL`) e `@CrossOrigin` no back-end | `services/api.ts`, controllers |
| `components/` com lista, item (props) e formulário controlado (`useState` + `useEffect`) | `UsuarioLista/Item/Form`, `PermissaoLista/Item/Form`, `ProdutoLista/Item/Form` |
| `pages/` com a lógica de cada tela | `UsuariosPage`, `PermissoesPage`, `ProdutosPage`, `PedidosPage`… |
| `App.tsx` apenas renderizando as páginas | `App.tsx` |
| Editar e Excluir recarregando a lista; CRUD completo no navegador | `/usuarios`, `/permissoes`, `/produtos`, `/pedidos` |

## Como rodar o projeto

### Back-end

```bash
./mvnw spring-boot:run
```

Sobe em `http://localhost:8080`.

### Front-end

```bash
cd src/main/frontend
npm install
npm run dev
```

Sobe em `http://localhost:5173`.

## Estrutura do projeto

```
devcafe/
├── src/main/java/...        # Back-end Spring Boot
├── src/main/resources/      # Configurações (application.properties)
├── src/main/frontend/       # Front-end React + TypeScript
└── pom.xml                  # Configuração Maven
```
