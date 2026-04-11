# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

Django 5 + Django REST Framework + PostgreSQL (prod) / SQLite (dev) + JWT auth (`djangorestframework-simplejwt`) + `django-rest-registration`

## Local Development

### Kurulum

```bash
pip install -r requirements.txt
```

`.env` dosyası oluştur (minimum):
```
SECRET_KEY=herhangi-bir-deger
INSTANCE_IP=localhost,127.0.0.1
USE_S3=FALSE
```

### Sunucu başlatma (SQLite ile — DB kurulumu gerekmez)

```bash
python manage.py migrate --settings=core.settings.dev
python manage.py runserver --settings=core.settings.dev
```

### Tek komutla superuser + migrate + runserver

```bash
python manage.py migrate --settings=core.settings.dev && \
python manage.py createsuperuser --settings=core.settings.dev && \
python manage.py runserver --settings=core.settings.dev
```

## Settings Yapısı

| Dosya | Kullanım |
|-------|----------|
| `core/settings/base.py` | Ortak ayarlar — `USE_S3`, JWT, CORS, REST_FRAMEWORK vs. |
| `core/settings/dev.py` | `DEBUG=True`, SQLite DB, debug_toolbar aktif |
| `core/settings/prod.py` | `DEBUG=True` (dikkat!), PostgreSQL — `.env`'den DB bilgisi alır |

Her komuta `--settings=core.settings.dev` ekle. `DJANGO_SETTINGS_MODULE` env değişkeni de kullanılabilir.

## Proje Mimarisi

```
accounts/    → CustomUser modeli (email tabanlı auth), sertifika, dil, eğitim, deneyim
definitions/ → Lookup tabloları: Title, Skill, UserProfileType, Language
business/    → İş/proje/fikir katmanı (filters.py mevcut)
core/        → Proje ayarları, URL root, izinler
```

- **Kullanıcı modeli:** `accounts.CustomUser` — email ile login (`USERNAME_FIELD = 'email'`). `auth_backends.py`'de custom `EmailBackend` var.
- **3 tip kullanıcı:** Developer, İnovator, Yatırımcı — `UserProfileType` ile yönetilir.
- **`definitions` app'i bağımlılık:** `accounts.models` doğrudan `definitions.models`'i import eder. Migration sırası önemli.
- **`ATOMIC_REQUESTS = True`** — tüm view'lar otomatik transaction içinde çalışır.
- **`USE_S3=FALSE`** olduğunda medya dosyaları local filesystem'e yazılır.

## API

- Swagger: `http://localhost:8000/api/swagger/`
- ReDoc: `http://localhost:8000/api/redoc/`
- Admin: `http://localhost:8000/admin/`
- Auth endpoint'leri: `accounts/` prefix ile
- JWT: `Authorization: Bearer <access-token>` — Access token 120 dk, refresh 1 gün

## Önemli Notlar

- `entrypoint.sh` production içindir (gunicorn); local'de kullanma.
- `base.py`'de `DEBUG = False` hard-coded — dev ayarını `dev.py` override eder.
- Email doğrulama şu an **devre dışı** (`REST_REGISTRATION` ayarları).
- AWS S3 entegrasyonu mevcut ama `USE_S3=FALSE` ile local'de devre dışı bırakılabilir.
