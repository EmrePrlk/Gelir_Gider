#!/bin/bash
# EC2'ya ilk bağlandıktan sonra BİR KEZ çalıştır.
# sudo bash ec2-setup.sh

set -e

echo "==> Installing Docker..."
apt-get update -y
apt-get install -y docker.io docker-compose-plugin git curl

systemctl enable docker
systemctl start docker
usermod -aG docker ubuntu

echo "==> Cloning repository..."
mkdir -p /app
cd /app
git clone https://github.com/EmrePrlk/claude_ai.git dashboard
cd dashboard

echo "==> Creating .env from example..."
cp .env.production.example .env

echo ""
echo "=========================================="
echo "EC2 kurulumu tamamlandı!"
echo ""
echo "Sonraki adımlar:"
echo ""
echo "1. .env dosyasını düzenle:"
echo "   nano /app/dashboard/.env"
echo "   → DOMAIN, SECRET_KEY, POSTGRES_PASSWORD, ANTHROPIC_API_KEY, NEXTAUTH_SECRET"
echo ""
echo "2. nginx.conf içinde 'yourdomain.com' satırlarını kendi domain'inle değiştir:"
echo "   nano /app/dashboard/nginx/nginx.conf"
echo ""
echo "3. Servisleri başlat (ilk kez, HTTP):"
echo "   cd /app/dashboard"
echo "   docker compose -f docker-compose.prod.yml up -d"
echo ""
echo "4. Domain DNS'ini bu EC2'nun IP'sine yönlendir."
echo "   EC2 IP: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo '<EC2_PUBLIC_IP>')"
echo ""
echo "5. SSL sertifikası al (DNS propagasyon sonrası):"
echo "   docker compose -f docker-compose.prod.yml run --rm certbot certonly \\"
echo "     --webroot --webroot-path=/var/www/certbot \\"
echo "     -d yourdomain.com -d www.yourdomain.com \\"
echo "     --email your@email.com --agree-tos --no-eff-email"
echo ""
echo "6. nginx.conf içinde HTTPS bloğunu aktif et, HTTP'yi sadece redirect'e çevir."
echo "   nano /app/dashboard/nginx/nginx.conf"
echo "   docker compose -f docker-compose.prod.yml exec nginx nginx -s reload"
echo ""
echo "7. Superuser oluştur:"
echo "   docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser"
echo "=========================================="
