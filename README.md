# 🏆 Pelada Fácil - A Revolução do Esporte Amador

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)](https://www.prisma.io/)

Plataforma multiesportiva para organização de partidas e campeonatos amadores, resolvendo o problema da "falta de gente" através do **Mercado de Jogadores (Matador)** e aumentando o engajamento via **Gamificação completa**.

## 🎯 Diferenciais Competitivos

### 1. 🎲 Mercado de Jogadores (MATADOR)
Solução revolucionária que conecta jogadores disponíveis com times incompletos em tempo real:
- **Geolocalização** para encontrar jogadores próximos
- **Filtros inteligentes** por esporte, posição, nível
- **Notificações instantâneas** via Socket.io
- **Sistema de convocação rápida**

### 2. 🎮 Gamificação Completa
Transforme sua evolução no esporte em uma experiência RPG:
- **Perfil detalhado** com estatísticas completas
- **Sistema de conquistas** (badges)
- **Ranking** por esporte e região
- **Níveis e XP** baseados em desempenho
- **Avaliações 5 estrelas** com categorias

### 3. ⚽ Modelo Híbrido Unificado
Uma plataforma para tudo:
- **Partidas casuais** (peladas rápidas)
- **Campeonatos formais** (ligas e torneios)
- **Multi-esporte** (Futebol, Futsal, Vôlei, Basquete, Tênis, Padel)

## 📋 Funcionalidades Principais

- ✅ **Autenticação completa** (JWT + OAuth)
- ✅ **Dashboard responsivo** com métricas
- ✅ **Mercado de Jogadores** com mapa interativo
- ✅ **Gestão de partidas** (criar, convidar, gerenciar)
- ✅ **Campeonatos e ligas** (tabelas, súmulas, classificação)
- ✅ **Sistema de pagamentos** (Mercado Pago)
- ✅ **Gamificação** (stats, conquistas, ranking)
- ✅ **Avaliações** (rating 5 estrelas)
- ✅ **Área administrativa** (moderação, analytics)
- ✅ **Notificações real-time** (Socket.io)

## 🏗️ Tecnologias

### Frontend
- **Next.js 14** - Framework React com SSR
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling responsivo
- **Shadcn/ui** - Componentes UI
- **Zustand** - State management
- **React Query** - Data fetching
- **Leaflet** - Mapas interativos
- **Framer Motion** - Animações

### Backend
- **Node.js + Express** - API RESTful
- **TypeScript** - Type safety
- **PostgreSQL** - Banco de dados
- **Prisma ORM** - Database toolkit
- **JWT** - Autenticação
- **Socket.io** - Real-time
- **Cloudinary** - Upload de imagens
- **Mercado Pago** - Pagamentos

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- **Node.js** 20+
- **Docker** e **Docker Compose**
- **Git**

### 1. Clone o repositório

\`\`\`bash
git clone https://github.com/kellyr5/site-peladaFacil.git
cd site-peladaFacil
\`\`\`

### 2. Configure as variáveis de ambiente

**Backend:**
\`\`\`bash
cd backend
cp .env.example .env
# Edite o arquivo .env com suas configurações
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
cp .env.local.example .env.local
# Edite o arquivo .env.local com suas configurações
\`\`\`

### 3. Suba os containers com Docker Compose

**Opção 1: Com Docker (Recomendado)**
\`\`\`bash
# Na raiz do projeto
docker-compose up -d

# Aguarde os containers iniciarem
# O backend estará em http://localhost:3001
# O frontend estará em http://localhost:3000
\`\`\`

**Opção 2: Sem Docker (Desenvolvimento local)**

**Backend:**
\`\`\`bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed  # Popular banco com dados de exemplo
npm run dev
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### 4. Acesse a aplicação

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Prisma Studio:** Execute \`npx prisma studio\` no diretório \`backend\`

### 5. Usuários de teste

Após rodar o seed, você terá acesso a usuários de exemplo:

**Admin:**
- Email: \`admin@peladafacil.com\`
- Senha: \`admin123\`

**Jogadores:**
- Email: \`joao@email.com\` | Senha: \`senha123\`
- Email: \`maria@email.com\` | Senha: \`senha123\`
- Email: \`carlos@email.com\` | Senha: \`senha123\`

## 📁 Estrutura do Projeto

\`\`\`
pelada-facil/
├── frontend/               # Next.js App
│   ├── src/
│   │   ├── app/           # App Router (rotas)
│   │   ├── components/    # Componentes React
│   │   ├── lib/           # Utils, API, hooks
│   │   └── store/         # Zustand stores
│   └── public/            # Assets estáticos
│
├── backend/               # Express API
│   ├── src/
│   │   ├── controllers/  # Controllers
│   │   ├── routes/       # Rotas da API
│   │   ├── services/     # Lógica de negócio
│   │   ├── middlewares/  # Middlewares
│   │   └── server.ts     # Entry point
│   └── prisma/
│       ├── schema.prisma # Schema do banco
│       └── seed.ts       # Seed data
│
├── docker-compose.yml    # Orquestração Docker
└── README.md             # Documentação
\`\`\`

## 🎨 Screenshots

(Screenshots serão adicionados aqui após o desenvolvimento da interface)

## 📊 Modelo de Dados

Principais entidades:
- **Users** - Jogadores e administradores
- **Matches** - Partidas (casuais e de campeonato)
- **Championships** - Torneios e ligas
- **Teams** - Times
- **PlayerStats** - Estatísticas por esporte
- **Achievements** - Conquistas
- **Ratings** - Avaliações de jogadores
- **MarketRequests** - Solicitações do Mercado de Jogadores
- **Payments** - Transações financeiras
- **Notifications** - Notificações

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para detalhes completos.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Time

Desenvolvido com ❤️ pela equipe Pelada Fácil

## 📞 Contato

- **GitHub:** [kellyr5](https://github.com/kellyr5)
- **Email:** contato@peladafacil.com

---

**Pelada Fácil** - Transformando o esporte amador no Brasil! 🇧🇷⚽🏀🏐
