# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Kişisel Dashboard — tek kullanıcılı, self-hosted web uygulaması. Gelir/gider, alışkanlıklar, görevler ve yatırım portföyü.

**Stack:** Django 5 + DRF (backend:8000) · Next.js 14 App Router + TypeScript (frontend:3000) · PostgreSQL

## Commands

### Docker — Geliştirme
```bash
docker-compose up -d          # tüm servisleri başlat
docker-compose down           # durdur
docker-compose logs backend   # backend logları
```

### Docker — Production (AWS EC2)
```bash
# İlk deploy:
cp .env.production.example .env  # değerleri doldur
docker compose -f docker-compose.prod.yml up -d

# Sonraki deploy'lar:
./deploy.sh

# Superuser oluştur (ilk kurulum):
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

# SSL sertifikası al (domain DNS ayarlandıktan sonra):
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  -d yourdomain.com --email your@email.com --agree-tos --no-eff-email
```

### Backend (standalone)
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Backend — migration iş akışı
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Frontend (standalone)
```bash
cd frontend
npm install
npm run dev        # localhost:3000
npm run type-check # TypeScript kontrol
npm run build      # prod build
```

### Environment
Backend: `backend/.env` (şablonu: `backend/.env.example`)
Frontend: `frontend/.env.local` (şablonu: `frontend/.env.local.example`)

Kritik env var'lar:
- `ANTHROPIC_API_KEY` — finance import için Claude API (boşsa CSV fallback devreye girer)
- `DATABASE_URL` — PostgreSQL bağlantısı
- `NEXTAUTH_SECRET` — NextAuth JWT imzalama

## Backend Mimarisi

### URL yapısı
```
/api/v1/auth/      token, refresh, me, change-password, dashboard/summary
/api/v1/finance/   categories, transactions, summary, breakdown, import, import/confirm, export, excel-schema
/api/v1/habits/    habits (+ today, export_excel actions), logs (+ toggle, heatmap actions)
/api/v1/tasks/     tasks (+ complete, today actions)
/api/v1/portfolio/ asset-classes, assets, entries, summary, distribution, target-allocation
```

### Kritik kurallar

**Ownership filter zorunlu:** Her view `filter(user=request.user)` ile başlar. İstisna yoktur.

**Custom User:** `AUTH_USER_MODEL = 'core.User'`, `USERNAME_FIELD = 'email'`. Model referanslarında `settings.AUTH_USER_MODEL` kullan, `User`'ı doğrudan import etme.

**Streak hesaplama:** DB'de değil, Python'da yapılır. `habits/serializers.py` içinde standalone fonksiyonlar: `is_scheduled`, `calculate_current_streak`, `calculate_longest_streak`, `calculate_completion_rate`. Bu fonksiyonlar `core/views.py` (DashboardSummaryView) tarafından da import edilir.

**Portfolio fiyat fallback:** `PortfolioEntry.current_price` null olabilir. Her hesaplamada:
```python
effective = e.current_price if e.current_price is not None else e.purchase_price
```

**Finance import akışı:**
1. `POST /import/` → dosya upload → `_extract_text_from_file` → `_call_anthropic` (claude-3-5-haiku) → preview JSON
2. `POST /import/confirm/` → DB'ye yazar, kategori ismine göre eşler
3. `ANTHROPIC_API_KEY` yoksa `_fallback_csv_parse` devreye girer

**Settings:** Tek `config/settings.py`, `python-decouple` ile env var okur. dev/prod ayrımı yok.

## Frontend Mimarisi

### Route yapısı
```
app/
  (auth)/login/         → login sayfası (NextAuth)
  (dashboard)/          → korumalı layout (Sidebar + main)
    dashboard/          → ana özet
    finance/            → gelir/gider + import + categories
    habits/             → günlük + analytics
    tasks/              → günlük + weekly + backlog
    portfolio/          → özet + add
    settings/
  demo/                 → auth gerektirmeyen demo sayfaları
```

### Auth akışı
- `auth.ts`: NextAuth v5 Credentials provider — Django JWT token alır, 55 dakikada bir refresh eder
- `middleware.ts`: login dışı tüm rotaları korur, `/demo/*` hariç
- Session'dan `accessToken` okunur, tüm API isteklerine `Authorization: Bearer` eklenir

### API client
`lib/api/client.ts` — `api.get/post/patch/put/delete` — token injection otomatik.
Her modülün kendi API dosyası: `lib/api/{finance,habits,tasks,portfolio,dashboard}.ts`

### Veri fetching kuralı
- `useQuery` — okuma
- `useMutation` + `queryClient.invalidateQueries` — yazma/silme sonrası cache yenileme
- Tüm API'ler TanStack Query üzerinden geçer, bare `fetch` yok

### Design system
CSS variables `globals.css`'de tanımlı, Tailwind bunları extend eder:
- Renkler: `var(--surface)`, `var(--border)`, `var(--success)`, `var(--danger)`, `var(--primary)` vb.
- `bg-[#hex]` yerine her zaman CSS variable kullan
- Font class'ları: `font-display` (Syne, başlıklar), `font-mono` (DM Mono, tüm sayılar/para), `font-body` (DM Sans)
- Border radius: `rounded-card` = 12px, `rounded-modal` = 16px, `rounded-sm` = 6px

## gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Install gstack (one-time, per machine):
```sh
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

Available gstack skills:
- `/office-hours` — structured office hours session
- `/plan-ceo-review` — CEO review of a plan
- `/plan-eng-review` — engineering review of a plan
- `/plan-design-review` — design review of a plan
- `/design-consultation` — design consultation session
- `/design-shotgun` — rapid design exploration
- `/design-html` — generate HTML designs
- `/review` — code review
- `/ship` — ship a feature end-to-end
- `/land-and-deploy` — land and deploy changes
- `/canary` — canary deployment
- `/benchmark` — run benchmarks
- `/browse` — headless browser for web browsing, QA, and dogfooding
- `/connect-chrome` — connect to Chrome browser
- `/qa` — full QA session
- `/qa-only` — QA without implementation
- `/design-review` — design review
- `/setup-browser-cookies` — set up browser cookies
- `/setup-deploy` — configure deployment
- `/setup-gbrain` — configure gbrain
- `/retro` — retrospective
- `/investigate` — investigate an issue
- `/document-release` — document a release
- `/document-generate` — generate documentation
- `/codex` — codex skill
- `/cso` — CSO review
- `/autoplan` — automatic planning
- `/plan-devex-review` — developer experience review of a plan
- `/devex-review` — developer experience review
- `/careful` — careful/safe mode
- `/freeze` — freeze changes
- `/guard` — guard mode
- `/unfreeze` — unfreeze changes
- `/gstack-upgrade` — upgrade gstack
- `/learn` — learning session

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
