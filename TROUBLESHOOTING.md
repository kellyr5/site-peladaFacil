# 🔧 Guia de Solução de Problemas - Pelada Fácil

Este guia ajuda a resolver os problemas mais comuns ao rodar o projeto.

---

## ✅ PROBLEMA RESOLVIDO: tailwindcss-animate

### ❌ Erro:
```
Error: Cannot find module 'tailwindcss-animate'
```

### ✅ Solução:
**JÁ CORRIGIDO!** O pacote foi adicionado ao `package.json`.

Para aplicar a correção:

#### Opção 1: Executar script atualizado (RECOMENDADO)
```bash
# Windows
INICIAR.bat

# Linux/Mac
./INICIAR.sh
```

Os scripts agora fazem rebuild automático e instalam todas as dependências!

#### Opção 2: Manual
```bash
# Parar containers
docker-compose down

# Limpar cache de build
docker-compose build --no-cache

# Subir novamente
docker-compose up -d

# Instalar dependências no frontend
docker exec peladafacil-frontend npm install

# Instalar dependências no backend
docker exec peladafacil-backend npm install
```

---

## 🐛 Problemas Comuns e Soluções

### 1. ❌ "Docker não encontrado"

**Causa:** Docker não está instalado

**Solução:**
1. Baixe Docker Desktop: https://www.docker.com/products/docker-desktop
2. Instale e reinicie o computador
3. Execute o script novamente

---

### 2. ❌ "Docker não está rodando"

**Causa:** Docker Desktop não foi iniciado

**Solução:**

**Windows/Mac:**
1. Abra Docker Desktop manualmente
2. Aguarde até o ícone ficar verde
3. Execute o script novamente

**Linux:**
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

---

### 3. ❌ "Porta já em uso"

**Erro:**
```
Error: bind: address already in use
Port 3000 is already in use
```

**Causa:** Outra aplicação está usando as portas 3000, 3001 ou 5432

**Solução:**

#### Descobrir o que está usando a porta:

**Windows:**
```cmd
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5432
```

**Linux/Mac:**
```bash
lsof -i :3000
lsof -i :3001
lsof -i :5432
```

#### Parar containers do Pelada Fácil:
```bash
docker-compose down
```

#### Matar processo específico:
**Windows:**
```cmd
# Use o PID da saída do netstat
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Use o PID da saída do lsof
kill -9 <PID>
```

---

### 4. ❌ "Página não carrega" / "Cannot connect"

**Causa:** Containers ainda estão inicializando

**Solução:**
1. Aguarde mais 30-60 segundos
2. Verifique se os containers estão rodando:
```bash
docker ps
```

Você deve ver 3 containers:
- `peladafacil-frontend`
- `peladafacil-backend`
- `peladafacil-db`

3. Veja os logs:
```bash
docker-compose logs -f
```

---

### 5. ❌ "Permission denied" ao executar .sh

**Erro:**
```bash
bash: ./INICIAR.sh: Permission denied
```

**Solução:**
```bash
chmod +x INICIAR.sh PARAR.sh
./INICIAR.sh
```

---

### 6. ❌ "prisma migrate" falha

**Erro:**
```
Error: P1001: Can't reach database server
```

**Causa:** Banco de dados não está pronto

**Solução:**
```bash
# Parar tudo
docker-compose down

# Limpar volumes (CUIDADO: apaga dados!)
docker-compose down -v

# Subir novamente
./INICIAR.bat  # ou ./INICIAR.sh
```

---

### 7. ❌ "npm install" trava ou demora muito

**Causa:** Cache corrompido ou conexão lenta

**Solução:**
```bash
# Limpar cache do npm
docker exec peladafacil-backend npm cache clean --force
docker exec peladafacil-frontend npm cache clean --force

# Reinstalar
docker exec peladafacil-backend npm install
docker exec peladafacil-frontend npm install
```

---

### 8. ❌ "Cannot find module" em outros pacotes

**Solução rápida - Rebuild completo:**
```bash
# Parar tudo
docker-compose down

# Rebuild sem cache
docker-compose build --no-cache

# Subir novamente
docker-compose up -d

# Aguardar e acessar
```

---

### 9. ❌ Frontend compila mas tela fica em branco

**Causa:** Erro de JavaScript no navegador

**Solução:**
1. Abra o Console do navegador (F12)
2. Veja os erros em vermelho
3. Limpe o cache do navegador (Ctrl+Shift+Delete)
4. Recarregue a página (Ctrl+F5)

Se o erro persistir:
```bash
# Rebuild do frontend
docker-compose up -d --build frontend
```

---

### 10. ❌ "Backend API não responde" / 500 Error

**Solução:**
```bash
# Ver logs do backend
docker logs peladafacil-backend

# Reiniciar backend
docker restart peladafacil-backend

# Aguardar 30 segundos
```

---

### 11. ❌ "Database schema is not in sync"

**Solução:**
```bash
docker exec peladafacil-backend npx prisma migrate deploy
docker exec peladafacil-backend npx prisma generate
```

---

### 12. ❌ Windows: "Execution Policy" no PowerShell

**Erro:**
```
cannot be loaded because running scripts is disabled
```

**Solução:**
Abra PowerShell como Administrador:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

### 13. ❌ "Out of memory" / "JavaScript heap out of memory"

**Causa:** Docker sem memória suficiente

**Solução:**

**Docker Desktop:**
1. Abra Docker Desktop
2. Settings → Resources
3. Aumente Memory para 4GB ou mais
4. Apply & Restart

**Ou aumentar heap do Node:**
```bash
# Editar docker-compose.yml e adicionar:
environment:
  - NODE_OPTIONS=--max-old-space-size=4096
```

---

### 14. ❌ Banco de dados vazio / Sem usuários de teste

**Solução:**
```bash
docker exec peladafacil-backend npx prisma db seed
```

---

### 15. ❌ "ECONNREFUSED" ao conectar na API

**Causa:** Backend não está rodando ou não está pronto

**Solução:**
```bash
# Verificar se backend está rodando
docker ps | grep backend

# Ver logs
docker logs peladafacil-backend

# Reiniciar
docker restart peladafacil-backend
```

---

## 🔄 Reset Completo (Último Recurso)

Se nada funcionar, faça um reset completo:

```bash
# Parar TUDO
docker-compose down -v

# Remover containers e imagens antigas
docker system prune -a --volumes

# AVISO: Isso remove TODOS containers, imagens e volumes do Docker!
# Use com cuidado se tiver outros projetos Docker

# Subir novamente do zero
./INICIAR.bat  # Windows
# ou
./INICIAR.sh   # Linux/Mac
```

---

## 📋 Checklist de Verificação

Antes de pedir ajuda, verifique:

- [ ] Docker Desktop está instalado?
- [ ] Docker Desktop está rodando? (ícone verde)
- [ ] Executou o script INICIAR.bat ou INICIAR.sh?
- [ ] Aguardou pelo menos 2 minutos na primeira execução?
- [ ] Verificou os logs com `docker-compose logs`?
- [ ] Tentou `docker-compose down` e executar novamente?
- [ ] Tem pelo menos 4GB de RAM disponível?
- [ ] Tem pelo menos 5GB de espaço em disco?

---

## 🆘 Precisa de Mais Ajuda?

1. **Veja os logs detalhados:**
```bash
docker-compose logs -f
```

2. **Crie uma issue no GitHub:**
https://github.com/kellyr5/site-peladaFacil/issues

Inclua:
- Sistema operacional
- Mensagem de erro completa
- Saída do comando `docker-compose logs`
- O que você já tentou

---

## 📞 Comandos Úteis para Debug

```bash
# Ver todos os containers
docker ps -a

# Ver logs de um container específico
docker logs peladafacil-frontend
docker logs peladafacil-backend
docker logs peladafacil-db

# Entrar em um container
docker exec -it peladafacil-backend sh
docker exec -it peladafacil-frontend sh

# Ver uso de recursos
docker stats

# Ver networks
docker network ls

# Testar conectividade
curl http://localhost:3000
curl http://localhost:3001/health

# Ver variáveis de ambiente
docker exec peladafacil-backend env
```

---

**Pelada Fácil - Troubleshooting Guide** 🔧

Atualizado para resolver o erro de `tailwindcss-animate` e outros problemas comuns!
