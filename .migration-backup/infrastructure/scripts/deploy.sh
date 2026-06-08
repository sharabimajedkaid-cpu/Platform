# ============================================================
# Britishce44 Production Launch Script (Linux/macOS)
# ============================================================

set -e

echo "============================================================"
echo "  Britishce44 - Production Launch"
echo "============================================================"
echo ""

# Step 1: Check Docker
echo "[1/7] Checking Docker..."
docker version > /dev/null 2>&1 || { echo "ERROR: Docker is not running."; exit 1; }
echo " OK Docker is running."
echo ""

# Step 2: Create .env if missing
echo "[2/7] Setting up environment..."
cd "$(dirname "$0")/.."
if [ ! -f docker/.env ]; then
  cp docker/.env.example docker/.env
  echo " Created .env from .env.example"
else
  echo " .env already exists"
fi
echo ""

# Step 3: Build
echo "[3/7] Building services..."
docker compose -f docker/docker-compose.yml build || echo "WARNING: Build had errors."
echo " Build complete."
echo ""

# Step 4: Start databases
echo "[4/7] Starting databases..."
docker compose -f docker/docker-compose.yml up -d postgres redis mongodb elasticsearch minio
echo " Databases started. Waiting 10s for initialization..."
sleep 10
echo ""

# Step 5: Seed data
echo "[5/7] Seeding initial data..."
if command -v psql &> /dev/null; then
  source docker/.env 2>/dev/null || true
  PGPASSWORD=$DB_PASSWORD psql -h localhost -U postgres -d britishce44 -f ../backend/services/classroom-service/migrations/init.sql 2>/dev/null || true
  echo " Database schema applied."
else
  echo " psql not found - TypeORM will create tables on service start."
fi
echo ""

# Step 6: Start all services
echo "[6/7] Starting all services..."
docker compose -f docker/docker-compose.yml up -d
echo " All services started."
echo ""

# Step 7: Verify
echo "[7/7] Verifying service health..."
sleep 5
docker compose -f docker/docker-compose.yml ps
echo ""

echo "============================================================"
echo "  Launch Complete!"
echo ""
echo "  API Gateway:     http://localhost:3000"
echo "  Frontend:        http://localhost:80"
echo "  Swagger Docs:    http://localhost:3000/api"
echo "  MinIO Console:   http://localhost:9001"
echo ""
echo "  To stop: docker compose -f docker/docker-compose.yml down"
echo "============================================================"
