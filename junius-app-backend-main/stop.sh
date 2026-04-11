#!/bin/bash
cd /home/ubuntu/app

# AWS CLI kullanarak ECR'den giriş yapın
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 471112771661.dkr.ecr.eu-central-1.amazonaws.com

# Docker Compose kullanarak container'ları başlatın
# docker-compose pull
docker-compose down -d
