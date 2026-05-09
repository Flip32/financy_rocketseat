# Financy

Aplicacao FullStack para gerenciamento de financas com backend GraphQL e frontend React.

## Requisitos

- Node.js (versao LTS recomendada)
- npm

## Estrutura

- `backend/`: API GraphQL com Prisma + SQLite
- `frontend/`: Aplicacao React com Vite

## Como rodar localmente

### 1) Backend

1. Entre na pasta do backend:

```bash
cd /Users/flipmac/Projetos/financy_rocketseat/backend
```

2. Instale as dependencias:

```bash
npm install
```

3. Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

4. Gere o client do Prisma:

```bash
npm run prisma:generate
```

5. Rode as migracoes (cria o banco SQLite):

```bash
npm run prisma:migrate
```

6. Inicie o servidor:

```bash
npm run dev
```

A API ficara disponivel em `http://localhost:3333/graphql` (ou a porta definida no `.env`).

### 2) Frontend

1. Em outro terminal, entre na pasta do frontend:

```bash
cd /Users/flipmac/Projetos/financy_rocketseat/frontend
```

2. Instale as dependencias:

```bash
npm install
```

3. Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

4. Inicie o frontend:

```bash
npm run dev
```

A aplicacao estara disponivel no endereco informado pelo Vite (geralmente `http://localhost:5173`).

## Variaveis de ambiente

### Backend (`backend/.env`)

- `JWT_SECRET`: segredo para assinar tokens
- `DATABASE_URL`: caminho do SQLite
- `PORT`: porta do servidor
- `CORS_ORIGIN`: origem permitida do frontend

### Frontend (`frontend/.env`)

- `VITE_BACKEND_URL`: URL da API GraphQL

## Dicas

- Se mudar a URL do backend, atualize `VITE_BACKEND_URL`.
- Em caso de erro de banco, rode novamente `npm run prisma:migrate`.

## Testes de integracao

O comando abaixo cria um banco SQLite separado para testes e valida o isolamento de dados entre usuarios.

```bash
cd /backend
npm run test
```

