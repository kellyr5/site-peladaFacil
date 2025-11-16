#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================"
echo "   🏆 PELADA FÁCIL - INICIALIZADOR"
echo -e "========================================${NC}"
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERRO] Docker não encontrado!${NC}"
    echo ""
    echo "Por favor, instale o Docker:"
    echo "https://docs.docker.com/get-docker/"
    echo ""
    exit 1
fi

echo -e "${GREEN}[OK] Docker encontrado!${NC}"
echo ""

# Verificar se Docker está rodando
if ! docker ps &> /dev/null; then
    echo -e "${YELLOW}[AVISO] Docker não está rodando!${NC}"
    echo "Por favor, inicie o Docker e execute este script novamente."
    exit 1
fi

# Parar containers antigos
echo -e "${BLUE}[1/6] Parando containers antigos (se existirem)...${NC}"
docker-compose down &> /dev/null

# Construir e subir containers
echo -e "${BLUE}[2/6] Construindo e subindo containers Docker...${NC}"
docker-compose up -d --build

echo ""
echo -e "${BLUE}[3/6] Aguardando banco de dados iniciar...${NC}"
sleep 15

# Instalar dependências
echo -e "${BLUE}[4/6] Instalando dependências do backend...${NC}"
docker exec peladafacil-backend npm install

# Configurar banco
echo -e "${BLUE}[5/6] Configurando banco de dados...${NC}"
docker exec peladafacil-backend npx prisma generate
docker exec peladafacil-backend npx prisma migrate deploy

# Popular banco (somente se necessário)
if docker exec peladafacil-backend npx prisma migrate status | grep -q "up to date"; then
    echo "Populando banco com dados de exemplo..."
    docker exec peladafacil-backend npx prisma db seed
else
    echo "Banco já possui dados!"
fi

echo ""
echo -e "${BLUE}[6/6] Aguardando aplicação iniciar...${NC}"
sleep 20

echo ""
echo -e "${GREEN}========================================"
echo "   ✅ PELADA FÁCIL ESTÁ RODANDO!"
echo -e "========================================${NC}"
echo ""
echo -e "Frontend: ${BLUE}http://localhost:3000${NC}"
echo -e "Backend:  ${BLUE}http://localhost:3001${NC}"
echo ""
echo "Usuários de teste:"
echo -e "- ${YELLOW}admin@peladafacil.com${NC} / admin123"
echo -e "- ${YELLOW}user1@email.com${NC} / senha123"
echo ""
echo "Pressione Ctrl+C para parar os containers"
echo -e "${GREEN}========================================${NC}"
echo ""

# Detectar sistema operacional e abrir navegador
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000 &> /dev/null
    elif command -v gnome-open &> /dev/null; then
        gnome-open http://localhost:3000 &> /dev/null
    fi
fi

# Mostrar logs
echo "Logs do sistema:"
echo ""
docker-compose logs -f
