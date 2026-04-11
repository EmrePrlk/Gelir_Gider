#!/bin/bash
set -e

echo "==> Bun kuruluyor..."
curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc

echo "==> Backend bağımlılıkları kuruluyor..."
cd /workspaces/junius-app/junius-app-backend-main
pip install -r requirements.txt

echo "==> Backend .env oluşturuluyor..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "   .env oluşturuldu (.env.example'dan)"
fi

echo "==> Backend migration çalıştırılıyor..."
python3 manage.py migrate --settings=core.settings.dev

echo "==> Başlangıç verileri yükleniyor..."
python3 manage.py loaddata definitions/fixtures/initial_data.json --settings=core.settings.dev

echo "==> Frontend bağımlılıkları kuruluyor..."
cd /workspaces/junius-app/junius-app-front-main
$BUN_INSTALL/bin/bun install

echo "==> Frontend .env oluşturuluyor..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "   .env oluşturuldu (.env.example'dan)"
fi

echo ""
echo "✓ Kurulum tamamlandı!"
echo ""
echo "Servisleri başlatmak için:"
echo "  Backend : cd junius-app-backend-main && python3 manage.py runserver --settings=core.settings.dev"
echo "  Frontend: cd junius-app-front-main && bun dev"
