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

echo [1/6] Parando containers antigos (se existirem)...
docker-compose down >nul 2>&1

echo [2/6] Construindo e subindo containers Docker...
docker-compose up -d --build

echo.
echo [3/6] Aguardando banco de dados iniciar...
timeout /t 15 /nobreak >nul

echo [4/6] Instalando dependencias do backend...
docker exec peladafacil-backend npm install

echo [5/6] Configurando banco de dados...
docker exec peladafacil-backend npx prisma generate
docker exec peladafacil-backend npx prisma migrate deploy

REM Verificar se precisa popular banco
docker exec peladafacil-backend npx prisma migrate status | findstr "Database schema is up to date" >nul
if %errorlevel% equ 0 (
    echo Populando banco com dados de exemplo...
    docker exec peladafacil-backend npx prisma db seed
) else (
    echo Banco ja possui dados!
)

echo.
echo [6/6] Aguardando aplicacao iniciar...
timeout /t 20 /nobreak >nul

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
