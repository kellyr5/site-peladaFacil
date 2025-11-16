#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${RED}========================================"
echo "   🛑 PELADA FÁCIL - DESLIGANDO"
echo -e "========================================${NC}"
echo ""

echo "Parando containers..."
docker-compose down

echo ""
echo -e "${GREEN}========================================"
echo "   ✅ Pelada Fácil foi desligado!"
echo -e "========================================${NC}"
echo ""
