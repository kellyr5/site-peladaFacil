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

# Subir containers
echo -e "${BLUE}[1/5] Subindo containers Docker...${NC}"
docker-compose up -d

echo ""
echo -e "${BLUE}[2/5] Aguardando banco de dados iniciar...${NC}"
sleep 10

# Verificar se precisa rodar migrações (primeira execução)
if ! docker exec peladafacil-backend npx prisma migrate status &> /dev/null; then
    echo -e "${BLUE}[3/5] Primeira execução detectada! Configurando banco de dados...${NC}"
    docker exec peladafacil-backend npx prisma generate
    docker exec peladafacil-backend npx prisma migrate deploy

    echo -e "${BLUE}[4/5] Populando banco com dados de exemplo...${NC}"
    docker exec peladafacil-backend npx prisma db seed
else
    echo -e "${GREEN}[3/5] Banco de dados já configurado!${NC}"
    echo -e "${GREEN}[4/5] Pulando seed...${NC}"
fi

echo ""
echo -e "${BLUE}[5/5] Aguardando aplicação iniciar...${NC}"
sleep 15

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
