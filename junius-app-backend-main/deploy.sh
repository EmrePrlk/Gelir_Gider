#!/bin/bash
cd /home/ubuntu/junius-app-backend-prod

# AWS CLI kullanarak ECR'den giriş yapın
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 471112771661.dkr.ecr.eu-central-1.amazonaws.com

# Docker Compose kullanarak container'ları başlatın
# docker-compose pull
# <<<<<<< HEAD
# docker pull 471112771661.dkr.ecr.eu-central-1.amazonaws.com/juniusappback:latest
# docker rm -f frontend
# =======
# docker pull 471112771661.dkr.ecr.eu-central-1.amazonaws.com/juniusappback2:latest
# >>>>>>> 0bb7731ccfc9198cf423c5ce6abddb2995867de6
# docker rm -f backend
# docker-compose up -f docker-compose2.yaml -d
