@echo off
title Pelada Facil - Parando...
color 0C

echo ========================================
echo    PELADA FACIL - DESLIGANDO
echo ========================================
echo.

echo Parando containers...
docker-compose down

echo.
echo ========================================
echo   Pelada Facil foi desligado!
echo ========================================
echo.
pause
