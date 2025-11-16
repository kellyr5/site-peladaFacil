# PowerShell Script para Windows
# Pelada Fácil - Inicializador

$Host.UI.RawUI.WindowTitle = "Pelada Fácil - Iniciando..."

Write-Host "========================================" -ForegroundColor Green
Write-Host "   🏆 PELADA FÁCIL - INICIALIZADOR" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Verificar se Docker está instalado
try {
    $dockerVersion = docker --version
    Write-Host "[OK] Docker encontrado!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "[ERRO] Docker não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instale o Docker Desktop:"
    Write-Host "https://www.docker.com/products/docker-desktop"
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se Docker está rodando
try {
    docker ps | Out-Null
} catch {
    Write-Host "[AVISO] Docker não está rodando!" -ForegroundColor Yellow
    Write-Host "Iniciando Docker Desktop..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Write-Host "Aguarde 30 segundos para o Docker iniciar..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
}

# Subir containers
Write-Host "[1/5] Subindo containers Docker..." -ForegroundColor Cyan
docker-compose up -d

Write-Host ""
Write-Host "[2/5] Aguardando banco de dados iniciar..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Verificar se precisa rodar migrações (primeira execução)
$migrateStatus = docker exec peladafacil-backend npx prisma migrate status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[3/5] Primeira execução detectada! Configurando banco de dados..." -ForegroundColor Cyan
    docker exec peladafacil-backend npx prisma generate
    docker exec peladafacil-backend npx prisma migrate deploy

    Write-Host "[4/5] Populando banco com dados de exemplo..." -ForegroundColor Cyan
    docker exec peladafacil-backend npx prisma db seed
} else {
    Write-Host "[3/5] Banco de dados já configurado!" -ForegroundColor Green
    Write-Host "[4/5] Pulando seed..." -ForegroundColor Green
}

Write-Host ""
Write-Host "[5/5] Aguardando aplicação iniciar..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✅ PELADA FÁCIL ESTÁ RODANDO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Blue
Write-Host "Backend:  " -NoNewline
Write-Host "http://localhost:3001" -ForegroundColor Blue
Write-Host ""
Write-Host "Usuários de teste:"
Write-Host "- admin@peladafacil.com / admin123" -ForegroundColor Yellow
Write-Host "- user1@email.com / senha123" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pressione Ctrl+C para parar os containers"
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Abrir navegador automaticamente
Start-Process "http://localhost:3000"

# Mostrar logs
Write-Host "Logs do sistema:" -ForegroundColor Cyan
Write-Host ""
docker-compose logs -f
