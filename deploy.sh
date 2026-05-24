#!/bin/bash
# EC2'da çalıştır: ./deploy.sh
# Her deploy'da: git pull + yeniden build + restart

set -e

echo "==> Pulling latest code..."
git pull origin main

echo "==> Building and restarting services..."
docker compose -f docker-compose.prod.yml up -d --build

echo "==> Waiting for services to start..."
sleep 5

echo "==> Service status:"
docker compose -f docker-compose.prod.yml ps

echo "==> Done! Dashboard: https://$(grep '^DOMAIN=' .env | cut -d= -f2)"
