#!/bin/bash
cd /home/ubuntu/junius-app-front-main

# AWS CLI kullanarak ECR'den giriş yapın
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 471112771661.dkr.ecr.eu-central-1.amazonaws.com

# Docker Compose kullanarak container'ları başlatın
# docker-compose pull
docker pull 471112771661.dkr.ecr.eu-central-1.amazonaws.com/juniusappfront:latest
docker-compose up -d --no-deps frontend
