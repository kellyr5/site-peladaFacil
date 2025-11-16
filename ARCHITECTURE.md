# 🏆 Pelada Fácil - Arquitetura Técnica

## 📖 Visão Geral
Plataforma multiesportiva para organização de partidas e campeonatos amadores, com foco em resolver o problema da "falta de gente" através do **Mercado de Jogadores (Matador)** e engajamento via **Gamificação**.

## 🎯 Diferenciais Competitivos

### 1. Mercado de Jogadores (MATADOR)
- **Problema**: Times incompletos, partidas canceladas
- **Solução**: Conectar jogadores disponíveis com times que precisam de gente
- **Tecnologia**: Geolocalização + Filtros inteligentes + Notificações real-time

### 2. Gamificação Completa
- Perfil com estatísticas detalhadas
- Sistema de conquistas e badges
- Ranking por esporte e região
- Evolução de nível (RPG-like)

### 3. Modelo Híbrido Unificado
- Partidas casuais (peladas)
- Campeonatos formais
- Multi-esporte (Futebol, Futsal, Vôlei, Basquete, Tênis, Padel)

## 🏗️ Stack Tecnológico

### Frontend
```
- Next.js 14 (React 18 + TypeScript)
- Tailwind CSS (design responsivo)
- Shadcn/ui (componentes UI)
- Zustand (state management)
- React Query (data fetching & cache)
- Leaflet (mapas/geolocalização)
- Framer Motion (animações)
- React Hook Form + Zod (formulários)
- Axios (HTTP client)
```

### Backend
```
- Node.js + Express (TypeScript)
- PostgreSQL (banco relacional)
- Prisma ORM
- JWT (autenticação)
- Socket.io (real-time)
- Mercado Pago SDK (pagamentos)
- Cloudinary (upload de imagens)
- bcrypt (hash de senhas)
- express-validator (validação)
```

### DevOps
```
- Docker + Docker Compose
- Git/GitHub
- ESLint + Prettier
```

## 📊 Estrutura do Banco de Dados

### Entidades Principais

#### Users (Usuários)
```typescript
{
  id: uuid
  email: string (unique)
  password: string (hashed)
  name: string
  avatar: string (url)
  phone: string
  birthDate: date
  bio: text
  location: {lat, lng, city, state}
  preferredSports: Sport[]
  preferredPositions: Position[]
  level: int (1-100)
  rating: float (0-5)
  totalRatings: int
  isAvailable: boolean
  role: 'player' | 'admin'
  createdAt: timestamp
}
```

#### Matches (Partidas)
```typescript
{
  id: uuid
  type: 'casual' | 'championship'
  sport: Sport
  name: string
  date: timestamp
  location: {name, address, lat, lng}
  organizerId: uuid (User)
  maxPlayers: int
  currentPlayers: int
  cost: decimal
  status: 'open' | 'full' | 'ongoing' | 'finished' | 'cancelled'
  teams: Team[]
  createdAt: timestamp
}
```

#### Championships (Campeonatos)
```typescript
{
  id: uuid
  name: string
  sport: Sport
  organizerId: uuid
  startDate: date
  endDate: date
  format: 'league' | 'knockout' | 'groups'
  teams: Team[]
  matches: Match[]
  status: 'upcoming' | 'ongoing' | 'finished'
}
```

#### PlayerStats (Estatísticas)
```typescript
{
  id: uuid
  userId: uuid
  sport: Sport
  matchesPlayed: int
  wins: int
  draws: int
  losses: int
  goals: int
  assists: int
  yellowCards: int
  redCards: int
  mvpCount: int
}
```

#### Ratings (Avaliações)
```typescript
{
  id: uuid
  fromUserId: uuid
  toUserId: uuid
  matchId: uuid
  rating: int (1-5)
  comment: text
  categories: {
    technique: int
    teamwork: int
    punctuality: int
    attitude: int
  }
}
```

#### Achievements (Conquistas)
```typescript
{
  id: uuid
  name: string
  description: string
  icon: string
  type: 'goals' | 'matches' | 'wins' | 'special'
  requirement: json
}
```

#### MarketRequests (Mercado de Jogadores)
```typescript
{
  id: uuid
  matchId: uuid
  requesterId: uuid
  sport: Sport
  position: string
  urgency: 'low' | 'medium' | 'high'
  location: {lat, lng}
  radius: int (km)
  status: 'open' | 'accepted' | 'cancelled'
  responderId?: uuid
}
```

## 🎨 Estrutura de Pastas

```
pelada-facil/
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── matches/
│   │   │   │   ├── championships/
│   │   │   │   ├── market/
│   │   │   │   ├── profile/
│   │   │   │   └── rankings/
│   │   │   └── admin/
│   │   ├── components/
│   │   │   ├── ui/                 # Shadcn components
│   │   │   ├── layout/
│   │   │   ├── matches/
│   │   │   ├── players/
│   │   │   └── shared/
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   ├── utils/
│   │   │   └── hooks/
│   │   ├── store/                  # Zustand stores
│   │   └── types/
│   ├── public/
│   │   └── images/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── types/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## 🔐 Autenticação & Segurança

- **JWT tokens** com refresh token
- **Bcrypt** para hash de senhas
- **Rate limiting** para prevenir abuse
- **CORS** configurado
- **Helmet.js** para headers de segurança
- **Input validation** com Zod e express-validator
- **SQL injection protection** via Prisma ORM

## 🌍 Funcionalidades por Módulo

### 1. Autenticação
- [x] Registro com email/senha
- [x] Login com email/senha
- [x] Login social (Google)
- [x] Recuperação de senha
- [x] Perfil de usuário editável

### 2. Dashboard
- [x] Visão geral de estatísticas
- [x] Próximas partidas
- [x] Convites pendentes
- [x] Atalhos rápidos

### 3. Mercado de Jogadores (MATADOR)
- [x] Criar solicitação de jogador
- [x] Ver jogadores disponíveis no mapa
- [x] Filtrar por esporte, posição, nível
- [x] Convocar jogador (notificação real-time)
- [x] Aceitar/recusar convocação

### 4. Gestão de Partidas
- [x] Criar partida casual
- [x] Convidar jogadores
- [x] Sorteio automático de times
- [x] Controle de pagamento (split)
- [x] Check-in de presença
- [x] Registrar resultado e estatísticas
- [x] Avaliar jogadores (pós-partida)

### 5. Campeonatos
- [x] Criar campeonato
- [x] Inscrever times
- [x] Gerar tabela de jogos
- [x] Registrar súmulas
- [x] Tabela de classificação
- [x] Artilharia

### 6. Gamificação
- [x] Estatísticas por esporte
- [x] Sistema de níveis (XP)
- [x] Conquistas/Badges
- [x] Ranking regional/global
- [x] Histórico de partidas
- [x] Perfil público

### 7. Admin
- [x] Dashboard de métricas
- [x] Gestão de usuários
- [x] Moderação de conteúdo
- [x] Configurações da plataforma

### 8. Pagamentos
- [x] Split de pagamento
- [x] Histórico de transações
- [x] Integração Mercado Pago

## 📱 Responsividade

**Breakpoints Tailwind:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Abordagem Mobile-First:**
Todos os componentes são desenvolvidos primeiro para mobile e depois adaptados para telas maiores.

## 🚀 Performance

- **SSR** com Next.js para SEO
- **Image optimization** com next/image
- **Code splitting** automático
- **React Query** para cache e sincronização
- **Lazy loading** de componentes
- **CDN** para assets estáticos (Cloudinary)

## 🎯 Métricas de Sucesso

1. **Retenção**: % de usuários que voltam após 7 dias
2. **Engajamento**: Partidas criadas por usuário/mês
3. **Conversão Market**: % de solicitações aceitas em < 1h
4. **NPS**: Net Promoter Score
5. **Rating médio**: Avaliação média da plataforma

---

**Versão:** 1.0
**Data:** Novembro 2025
**Autor:** Equipe Pelada Fácil
