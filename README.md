# Junius App

Geliştirici, fikir sahibi ve yatırımcıları buluşturan bir platform.

## Repolar

| Klasör | Teknoloji | Port |
|--------|-----------|------|
| `junius-app-backend-main/` | Django 5 + DRF + SQLite (dev) | 8000 |
| `junius-app-front-main/` | Next.js 14 + TypeScript + MUI | 3000 |

## Codespace ile Başlat

Repo'yu GitHub'a push ettikten sonra **Code → Codespaces → Create codespace** butonuna tıkla.

Codespace açılırken `setup.sh` otomatik çalışır:
- Python bağımlılıkları kurulur
- Bun + Node bağımlılıkları kurulur
- `db.sqlite3` için migration yapılır
- `.env` dosyaları oluşturulur

### Servisleri Başlatma

Kurulum bittikten sonra iki ayrı terminal aç:

**Terminal 1 — Backend:**
```bash
cd junius-app-backend-main
python manage.py runserver --settings=core.settings.dev
```

**Terminal 2 — Frontend:**
```bash
cd junius-app-front-main
bun dev
```

API Swagger: `http://localhost:8000/api/swagger/`  
Frontend: `http://localhost:3000`
