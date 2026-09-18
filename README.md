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

- CRUD completo (criar, listar, editar, excluir) de:
  - **Usuários** (nome, username, e-mail, senha protegida)
  - **Permissões** (nome, descrição)
  - **Produtos** (nome, descrição, preço) — base do cardápio da cafeteria
- API REST (`/api/usuarios`, `/api/permissoes`, `/api/produtos`)
- CORS configurado para o front-end em desenvolvimento
- Interface React com formulários controlados e listagens com loading/erro

## Próximos passos

- Entidade de **Pedido** (relacionando usuário + produtos)
- Autenticação e autorização com Spring Security + JWT
- Painel de acompanhamento de pedidos em tempo real

## Como rodar o projeto

### Back-end

```bash
./mvnw spring-boot:run
```

Sobe em `http://localhost:8080`.

### Front-end

```bash
cd frontend
npm install
npm run dev
```

Sobe em `http://localhost:5173`.

## Estrutura do projeto

```
devcafe/
├── src/main/java/...        # Back-end Spring Boot
├── src/main/resources/      # Configurações (application.properties)
├── frontend/                # Front-end React + TypeScript
└── pom.xml                  # Configuração Maven
```
