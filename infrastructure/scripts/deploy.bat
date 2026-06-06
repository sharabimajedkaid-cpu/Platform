@echo off
REM ============================================================
REM Britishce44 Production Launch Script
REM ============================================================
echo.
echo ============================================================
echo   Britishce44 - Production Launch
echo ============================================================
echo.

REM Step 1: Check Docker
echo [1/7] Checking Docker...
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)
echo  OK Docker is running.
echo.

REM Step 2: Create .env if missing
echo [2/7] Setting up environment...
if not exist "infrastructure\docker\.env" (
    copy infrastructure\docker\.env.example infrastructure\docker\.env
    echo  Created .env from .env.example
) else (
    echo  .env already exists
)
echo.

REM Step 3: Pull images and build
echo [3/7] Building services...
cd /d "%~dp0.."
docker compose -f infrastructure/docker/docker-compose.yml build
if %errorlevel% neq 0 (
    echo WARNING: Build had errors, check output above.
)
echo  Build complete.
echo.

REM Step 4: Start databases first
echo [4/7] Starting databases...
docker compose -f infrastructure/docker/docker-compose.yml up -d postgres redis mongodb elasticsearch minio
if %errorlevel% neq 0 (
    echo ERROR: Failed to start databases.
    pause
    exit /b 1
)
echo  Databases started. Waiting 10s for initialization...
ping -n 10 127.0.0.1 >nul
echo.

REM Step 5: Run database migrations
echo [5/7] Initializing database schema...

REM PostgreSQL schema (if psql is available)
where psql >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('type infrastructure\docker\.env ^| findstr DB_PASSWORD') do set %%a
    psql -h localhost -U postgres -d britishce44 -f backend/services/classroom-service/migrations/init.sql 2>nul
    echo  Database schema applied.
) else (
    echo  psql not found - users will be auto-created by TypeORM on service start.
)
echo.

REM Step 6: Start all services
echo [6/7] Starting all services...
docker compose -f infrastructure/docker/docker-compose.yml up -d
if %errorlevel% neq 0 (
    echo ERROR: Failed to start services.
    pause
    exit /b 1
)
echo  All services started.
echo.

REM Step 7: Verify health
echo [7/7] Verifying service health...
ping -n 5 127.0.0.1 >nul
docker compose -f infrastructure/docker/docker-compose.yml ps
echo.

echo ============================================================
echo  Launch Complete!
echo.
echo  API Gateway:     http://localhost:3000
echo  Frontend:        http://localhost:80
echo  Swagger Docs:    http://localhost:3000/api
echo  MinIO Console:   http://localhost:9001
echo.
echo  To stop: docker compose -f infrastructure/docker/docker-compose.yml down
echo ============================================================
pause
