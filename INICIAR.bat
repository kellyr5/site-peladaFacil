@echo off
title Pelada Facil - Iniciando...
color 0A

echo ========================================
echo    PELADA FACIL - INICIALIZADOR
echo ========================================
echo.

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao encontrado!
    echo.
    echo Por favor, instale o Docker Desktop:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo [OK] Docker encontrado!
echo.

REM Verificar se Docker está rodando
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Docker nao esta rodando!
    echo Iniciando Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Aguarde 30 segundos para o Docker iniciar...
    timeout /t 30 /nobreak >nul
)

echo [1/5] Subindo containers Docker...
docker-compose up -d

echo.
echo [2/5] Aguardando banco de dados iniciar...
timeout /t 10 /nobreak >nul

REM Verificar se precisa rodar migrações (primeira execução)
docker exec peladafacil-backend npx prisma migrate status >nul 2>&1
if %errorlevel% neq 0 (
    echo [3/5] Primeira execucao detectada! Configurando banco de dados...
    docker exec peladafacil-backend npx prisma generate
    docker exec peladafacil-backend npx prisma migrate deploy

    echo [4/5] Populando banco com dados de exemplo...
    docker exec peladafacil-backend npx prisma db seed
) else (
    echo [3/5] Banco de dados ja configurado!
    echo [4/5] Pulando seed...
)

echo.
echo [5/5] Aguardando aplicacao iniciar...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo   PELADA FACIL ESTA RODANDO!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo Usuarios de teste:
echo - admin@peladafacil.com / admin123
echo - user1@email.com / senha123
echo.
echo Pressione Ctrl+C para parar os containers
echo ou feche esta janela.
echo ========================================
echo.

REM Abrir navegador automaticamente
start http://localhost:3000

REM Mostrar logs
echo Logs do sistema:
echo.
docker-compose logs -f
