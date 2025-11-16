# 🚀 Como Rodar o Projeto Pelada Fácil

## Pré-requisitos

- **Node.js** versão 20 ou superior
- **PostgreSQL** versão 14 ou superior
- **Git**
- **Docker** e **Docker Compose** (opcional, mas recomendado)

## Opção 1: Rodar com Docker (RECOMENDADO)

Esta é a forma mais fácil e rápida de rodar o projeto!

### 1. Clone o repositório

\`\`\`bash
git clone https://github.com/kellyr5/site-peladaFacil.git
cd site-peladaFacil
\`\`\`

### 2. Suba os containers

\`\`\`bash
docker-compose up -d
\`\`\`

### 3. Execute as migrações e seed do banco

\`\`\`bash
# Entrar no container do backend
docker exec -it peladafacil-backend sh

# Dentro do container:
npx prisma migrate dev
npx prisma db seed

# Sair do container
exit
\`\`\`

### 4. Acesse a aplicação

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Banco de Dados:** localhost:5432

### Usuários de Teste

Após rodar o seed:

**Admin:**
- Email: \`admin@peladafacil.com\`
- Senha: \`admin123\`

**Usuários:**
- Email: \`user1@email.com\` (até user50@email.com)
- Senha: \`senha123\`

---

## Opção 2: Rodar Localmente (Sem Docker)

### 1. Clone o repositório

\`\`\`bash
git clone https://github.com/kellyr5/site-peladaFacil.git
cd site-peladaFacil
\`\`\`

### 2. Configure o PostgreSQL

Certifique-se de que o PostgreSQL está rodando e crie um banco de dados:

\`\`\`sql
CREATE DATABASE peladafacil;
\`\`\`

### 3. Configure o Backend

\`\`\`bash
cd backend

# Instalar dependências
npm install

# O arquivo .env já está configurado com valores padrão
# Edite se necessário:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/peladafacil?schema=public"

# Gerar Prisma Client
npx prisma generate

# Rodar migrações
npx prisma migrate dev

# Popular banco de dados
npx prisma db seed

# Iniciar backend
npm run dev
\`\`\`

O backend estará rodando em http://localhost:3001

### 4. Configure o Frontend (em outro terminal)

\`\`\`bash
cd frontend

# Instalar dependências
npm install

# O arquivo .env.local já está configurado
# Iniciar frontend
npm run dev
\`\`\`

O frontend estará rodando em http://localhost:3000

---

## 📊 Acessar o Prisma Studio (Visualizar Banco de Dados)

\`\`\`bash
cd backend
npx prisma studio
\`\`\`

Acesse http://localhost:5555 para visualizar e editar dados diretamente.

---

## 🎯 Funcionalidades Disponíveis

### ✅ Já Implementadas

1. **Autenticação**
   - Login/Registro
   - Perfil de usuário

2. **Dashboard**
   - Visão geral de estatísticas
   - Quick actions

3. **Partidas**
   - Listar partidas
   - Filtrar por esporte e status
   - Entrar em partidas

4. **Mercado de Jogadores (MATADOR)**
   - Ver solicitações abertas
   - Ver jogadores disponíveis
   - Filtros por esporte

5. **Rankings**
   - Ranking por esporte
   - Top jogadores

6. **Perfil**
   - Ver perfil completo
   - Alterar disponibilidade
   - Estatísticas pessoais

### Backend API

As seguintes rotas estão disponíveis:

**Autenticação:**
- POST \`/api/auth/register\` - Criar conta
- POST \`/api/auth/login\` - Fazer login
- GET \`/api/auth/profile\` - Ver perfil
- PUT \`/api/auth/profile\` - Atualizar perfil

**Partidas:**
- GET \`/api/matches\` - Listar partidas
- POST \`/api/matches\` - Criar partida
- GET \`/api/matches/:id\` - Ver partida
- POST \`/api/matches/:id/join\` - Entrar na partida
- POST \`/api/matches/:id/leave\` - Sair da partida
- POST \`/api/matches/:id/finish\` - Finalizar partida

**Mercado:**
- GET \`/api/market/requests\` - Ver solicitações
- POST \`/api/market/requests\` - Criar solicitação
- GET \`/api/market/players\` - Jogadores disponíveis
- POST \`/api/market/requests/:requestId/invite/:playerId\` - Convocar jogador

---

## 🐛 Troubleshooting

### Erro de conexão com banco de dados

Verifique se o PostgreSQL está rodando e se a URL no \`.env\` está correta.

### Porta já em uso

Se as portas 3000, 3001 ou 5432 já estiverem em uso, você pode alterá-las:
- Frontend: edite \`frontend/package.json\` script dev
- Backend: edite \`backend/.env\` PORT
- Postgres: edite \`docker-compose.yml\` ports

### Erro ao instalar dependências

Limpe o cache e reinstale:

\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

---

## 📚 Documentação Adicional

- [README.md](./README.md) - Visão geral do projeto
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura técnica detalhada
- [Prisma Schema](./backend/prisma/schema.prisma) - Modelo de dados

---

## 🤝 Suporte

Se encontrar problemas, abra uma issue no GitHub:
https://github.com/kellyr5/site-peladaFacil/issues

---

**Pelada Fácil** - Desenvolvido com ❤️ 🇧🇷⚽
