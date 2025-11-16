# ⚡ INÍCIO RÁPIDO - Pelada Fácil

## 🎯 3 Formas de Rodar o Projeto

---

## 🥇 OPÇÃO 1: Executáveis (MAIS FÁCIL!)

### Windows 🪟

```
1️⃣ Duplo clique em: INICIAR.bat
2️⃣ Aguarde configuração automática (~2 minutos na primeira vez)
3️⃣ Navegador abre automaticamente
4️⃣ Login: user1@email.com / senha123
5️⃣ Pronto! Use a plataforma! 🎉
```

**Para desligar:**
```
Duplo clique em: PARAR.bat
```

### Linux/Mac 🐧🍎

```bash
1️⃣ Duplo clique em: INICIAR.sh
   (ou execute: ./INICIAR.sh)
2️⃣ Aguarde configuração automática
3️⃣ Acesse: http://localhost:3000
4️⃣ Login: user1@email.com / senha123
5️⃣ Pronto! Use a plataforma! 🎉
```

**Para desligar:**
```bash
./PARAR.sh
```

---

## 🥈 OPÇÃO 2: Interface Visual

```
1️⃣ Abra o arquivo: LAUNCHER.html no seu navegador
2️⃣ Veja o status do Frontend e Backend
3️⃣ Clique em "Abrir Pelada Fácil"
4️⃣ Pronto!
```

**Recursos do Launcher:**
- ✅ Verifica se Frontend está online
- ✅ Verifica se Backend está online
- ✅ Botões para abrir aplicação
- ✅ Links para documentação
- ✅ Informações de usuários de teste

---

## 🥉 OPÇÃO 3: Terminal (Manual)

### Docker Compose

```bash
# Subir tudo
docker-compose up -d

# Primeira vez: configurar banco
docker exec -it peladafacil-backend npx prisma migrate dev
docker exec -it peladafacil-backend npx prisma db seed

# Acessar
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Sem Docker

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

**Frontend (outro terminal):**
```bash
cd frontend
npm install
npm run dev
```

---

## 📋 Pré-requisitos

✅ **Docker Desktop** (recomendado)
- Windows/Mac: https://www.docker.com/products/docker-desktop
- Linux: `sudo apt install docker.io docker-compose`

**OU**

✅ **Node.js 20+** + **PostgreSQL 14+** (sem Docker)

---

## 👤 Usuários de Teste

Após a inicialização:

| Tipo | Email | Senha |
|------|-------|-------|
| **Admin** | admin@peladafacil.com | admin123 |
| **Usuário 1** | user1@email.com | senha123 |
| **Usuário 2** | user2@email.com | senha123 |
| **...** | user3 até user50 | senha123 |

---

## 🌐 URLs da Aplicação

- **Frontend (Interface):** http://localhost:3000
- **Backend (API):** http://localhost:3001
- **Health Check:** http://localhost:3001/health
- **Prisma Studio:** Execute `docker exec -it peladafacil-backend npx prisma studio` → http://localhost:5555

---

## 🎮 Funcionalidades Disponíveis

Após fazer login, você pode:

### 📊 Dashboard
- Ver suas estatísticas
- Nível, XP, Rating
- Próximas partidas

### ⚽ Partidas
- Ver partidas disponíveis
- Filtrar por esporte e status
- Entrar em partidas abertas

### 🎯 Mercado de Jogadores (MATADOR)
- Ver solicitações de times incompletos
- Ver jogadores disponíveis próximos
- Aceitar convocações

### 🏆 Rankings
- Top jogadores por esporte
- Artilharia
- Melhores ratings

### 👤 Perfil
- Editar informações
- Alterar disponibilidade
- Ver estatísticas pessoais

---

## ❓ Problemas Comuns

### ❌ "Docker não encontrado"
**Solução:** Instale o Docker Desktop (link acima)

### ❌ "Porta já em uso"
**Solução:**
```bash
# Parar tudo e tentar novamente
docker-compose down
# Executar INICIAR novamente
```

### ❌ "Página não carrega"
**Solução:**
- Aguarde mais 30 segundos
- Verifique se os containers estão rodando: `docker ps`
- Veja os logs: `docker-compose logs`

### ❌ "Erro ao executar script .sh"
**Solução:**
```bash
chmod +x INICIAR.sh PARAR.sh
```

---

## 📚 Mais Informações

- **Guia Completo de Executáveis:** [GUIA_EXECUTAVEIS.md](GUIA_EXECUTAVEIS.md)
- **Como Rodar (Detalhado):** [COMO_RODAR.md](COMO_RODAR.md)
- **Arquitetura Técnica:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **README Principal:** [README.md](README.md)

---

## 🆘 Precisa de Ajuda?

1. Verifique [GUIA_EXECUTAVEIS.md](GUIA_EXECUTAVEIS.md) - Seção "Solução de Problemas"
2. Veja os logs: `docker-compose logs`
3. Abra uma issue: https://github.com/kellyr5/site-peladaFacil/issues

---

## 🎉 Pronto para Começar?

### Windows:
```
🖱️ Duplo clique → INICIAR.bat
```

### Linux/Mac:
```bash
./INICIAR.sh
```

### Navegador:
```
🌐 Abra → LAUNCHER.html
```

---

**Pelada Fácil - Tão fácil quanto dar dois cliques!** 🚀⚽

Desenvolvido para ser simples. **Zero configuração necessária!** ✨
