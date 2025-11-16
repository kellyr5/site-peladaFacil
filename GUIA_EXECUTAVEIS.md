# 🚀 Guia dos Executáveis - Pelada Fácil

Este projeto possui scripts executáveis para facilitar o uso. **Basta clicar duas vezes no arquivo correspondente ao seu sistema operacional!**

---

## 🪟 Windows

### **INICIAR.bat** (Recomendado)
**Como usar:**
1. Dê um **duplo clique** no arquivo `INICIAR.bat`
2. Aguarde o script configurar tudo automaticamente
3. O navegador abrirá automaticamente em http://localhost:3000
4. Pronto! Use a plataforma

**O que ele faz:**
- ✅ Verifica se o Docker está instalado
- ✅ Inicia o Docker Desktop se necessário
- ✅ Sobe os containers automaticamente
- ✅ Configura o banco de dados (primeira vez)
- ✅ Popula com dados de exemplo (primeira vez)
- ✅ Abre o navegador automaticamente
- ✅ Mostra logs em tempo real

### **INICIAR.ps1** (PowerShell - Alternativa)
**Como usar:**
1. Clique com botão direito no arquivo
2. Escolha **"Executar com PowerShell"**

**Nota:** Se der erro de política de execução, abra o PowerShell como Administrador e execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **PARAR.bat**
Para desligar a aplicação:
1. Dê um **duplo clique** no arquivo `PARAR.bat`
2. Aguarde a mensagem de confirmação

---

## 🐧 Linux / 🍎 macOS

### **INICIAR.sh** (Recomendado)
**Como usar:**

**Opção 1: Interface Gráfica**
1. Dê um **duplo clique** no arquivo `INICIAR.sh`
2. Se aparecer opção, escolha "Executar" ou "Executar no Terminal"

**Opção 2: Terminal**
```bash
./INICIAR.sh
```

**O que ele faz:**
- ✅ Verifica se o Docker está instalado
- ✅ Sobe os containers automaticamente
- ✅ Configura o banco de dados (primeira vez)
- ✅ Popula com dados de exemplo (primeira vez)
- ✅ Abre o navegador automaticamente
- ✅ Mostra logs em tempo real

### **PARAR.sh**
Para desligar a aplicação:
```bash
./PARAR.sh
```

Ou dê duplo clique no arquivo.

---

## 📋 Pré-requisitos

Antes de usar os executáveis, certifique-se de ter instalado:

### ✅ Docker Desktop

**Windows/Mac:**
- Baixe em: https://www.docker.com/products/docker-desktop
- Instale e inicie o Docker Desktop

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker
```

---

## 🎮 Usando a Aplicação

Após executar o **INICIAR**, você terá acesso a:

### 🌐 URLs
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Prisma Studio:** Execute `docker exec -it peladafacil-backend npx prisma studio` e acesse http://localhost:5555

### 👤 Usuários de Teste

**Admin:**
- Email: `admin@peladafacil.com`
- Senha: `admin123`

**Usuários Comuns:**
- Email: `user1@email.com` até `user50@email.com`
- Senha: `senha123`

---

## 🔧 Solução de Problemas

### ❌ "Docker não encontrado"
**Solução:** Instale o Docker Desktop (link acima)

### ❌ "Docker não está rodando"
**Solução:**
- **Windows/Mac:** Abra o Docker Desktop manualmente
- **Linux:** Execute `sudo systemctl start docker`

### ❌ "Porta já em uso"
**Solução:** Alguma aplicação está usando as portas 3000, 3001 ou 5432

**Descobrir o que está usando a porta:**
- **Windows:** `netstat -ano | findstr :3000`
- **Linux/Mac:** `lsof -i :3000`

**Parar containers anteriores:**
```bash
docker-compose down
```

### ❌ Erro ao executar script no Linux
**Solução:** Dê permissão de execução:
```bash
chmod +x INICIAR.sh PARAR.sh
```

### 🔄 Resetar tudo (limpar banco de dados)
```bash
# Parar containers
docker-compose down

# Remover volumes (CUIDADO: apaga todos os dados!)
docker-compose down -v

# Executar novamente
./INICIAR.sh  # ou INICIAR.bat no Windows
```

---

## 📊 Comandos Úteis

### Ver logs em tempo real
```bash
docker-compose logs -f
```

### Acessar banco de dados
```bash
docker exec -it peladafacil-backend npx prisma studio
```

### Executar comandos no backend
```bash
docker exec -it peladafacil-backend sh
```

### Ver containers rodando
```bash
docker ps
```

### Parar todos os containers
```bash
docker-compose down
```

---

## 🎯 Fluxo Completo de Uso

### Primeira Vez:
1. ✅ Instalar Docker Desktop
2. ✅ Duplo clique em **INICIAR.bat** (Windows) ou **INICIAR.sh** (Linux/Mac)
3. ✅ Aguardar configuração automática (~2 minutos)
4. ✅ Usar a aplicação no navegador
5. ✅ Quando terminar, duplo clique em **PARAR**

### Próximas Vezes:
1. ✅ Duplo clique em **INICIAR**
2. ✅ Aguardar (~30 segundos)
3. ✅ Usar a aplicação
4. ✅ Duplo clique em **PARAR** quando terminar

---

## 🎨 Personalização

Se quiser modificar as portas ou configurações:

**Editar portas:**
1. Abra `docker-compose.yml`
2. Modifique as portas na seção `ports:`
3. Salve e execute o **INICIAR** novamente

**Editar variáveis de ambiente:**
1. Backend: Edite `backend/.env`
2. Frontend: Edite `frontend/.env.local`

---

## ❓ Perguntas Frequentes

**P: Preciso instalar Node.js?**
R: Não! Com Docker, tudo roda em containers. Só precisa do Docker.

**P: Posso usar sem Docker?**
R: Sim, mas será necessário instalar Node.js, PostgreSQL e configurar manualmente. Veja `COMO_RODAR.md`

**P: Os dados são salvos?**
R: Sim! Enquanto não executar `docker-compose down -v`, os dados permanecem.

**P: Posso acessar de outro computador na rede?**
R: Sim! Use o IP da máquina ao invés de `localhost`. Exemplo: `http://192.168.1.100:3000`

**P: Como atualizar o código?**
R:
```bash
git pull
docker-compose down
docker-compose up -d --build
```

---

## 🆘 Suporte

Se tiver problemas:
1. Leia a seção "Solução de Problemas" acima
2. Verifique os logs: `docker-compose logs`
3. Abra uma issue: https://github.com/kellyr5/site-peladaFacil/issues

---

**Pelada Fácil - Simplificado ao máximo!** 🏆⚽

Desenvolvido para ser fácil de usar. **Apenas 1 clique!** 🚀
