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

- **Login** (tela pronta; a validação real de credenciais ainda é um próximo passo)
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

- Autenticação e autorização com Spring Security + JWT
- Cadastro de promoções
- Painel de acompanhamento de pedidos em tempo real

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
