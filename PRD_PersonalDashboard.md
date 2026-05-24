# PRD — Kişisel Dashboard Uygulaması
**Versiyon:** 1.0 — MVP  
**Tarih:** Mayıs 2026  
**Stack:** Django 5 + DRF · Next.js 14 + TypeScript · PostgreSQL

---

## 1. Vizyon

Tek bir yerde yaşayan, tasarımıyla fark yaratan kişisel komuta merkezi.  
Gelir–gider, alışkanlıklar, görevler ve yatırım portföyü — hepsi birbiriyle konuşan, veriyi anlamlı hale getiren bir sistem.

**Temel ilke:** Veriyi girmek kolay olmalı, görsel olarak ödüllendirici olmalı, asla bir spreadsheet gibi hissettirmemeli.

---

## 2. Tasarım Dili

### 2.1 Aesthetic Direction — "Obsidian Fintech"

Premium bir araçta çalışma hissi. Bloomberg Terminal'in işlevselliği + modern bir tasarım stüdyosunun estetiği.

**Tema:** Koyu. Dark-first, light mode opsiyonel sonraki versiyonda.

**Renk Paleti:**
```
Background:   #0A0A0F  (derin gece siyahı, tam siyah değil)
Surface:      #111118  (kart ve panel yüzeyleri)
Surface-2:    #1A1A24  (hover, elevated paneller)
Border:       #2A2A38  (ince, neredeyse görünmez çizgiler)

Primary:      #F5C842  (altın sarı — yatırım ve para tonlarına referans)
Primary-dim:  #C49A1E  (hover state)
Accent:       #4F8EF7  (mavi — aksiyon butonları, linkler)
Accent-2:     #A78BFA  (mor — alışkanlık modülü için)
Success:      #34D399  (kazanç, tamamlanan görevler)
Danger:       #F87171  (kayıp, gecikmiş görevler)
Warning:      #FBBF24  (dikkat gerektiren metrikler)

Text-primary:   #F1F1F5
Text-secondary: #8888A4
Text-muted:     #4A4A62
```

**Tipografi:**
```
Display / Başlıklar: "Syne" — geometrik, güçlü, karakterli
Gövde metni:         "DM Sans" — temiz, okunabilir, nötr
Sayısal veriler:     "DM Mono" — tüm rakamlar, yüzdeler, para birimleri
```
Google Fonts — `next/font/google` ile self-host edilir (Next.js otomatik yönetir, CDN isteği atmaz, layout shift olmaz).

**Spacing Sistemi:** 4px base grid. `4, 8, 12, 16, 24, 32, 48, 64, 96px`

**Border Radius:** Küçük elementlerde `6px`, kartlarda `12px`, modallarda `16px`.

**Shadow Sistemi:**
```css
--shadow-sm:  0 1px 3px rgba(0,0,0,0.4);
--shadow-md:  0 4px 16px rgba(0,0,0,0.5);
--shadow-glow-gold: 0 0 24px rgba(245,200,66,0.12);
--shadow-glow-blue: 0 0 24px rgba(79,142,247,0.12);
```

### 2.2 Layout Sistemi

**Sidebar Navigation:** Sol tarafta sabit, 64px genişliğinde collapsed (sadece ikonlar), hover ya da toggle ile 240px'e açılıyor.  
**Main Content Area:** Fluid grid, 12 kolon, max-width `1440px`.  
**Dashboard Widget'ları:** Sürükle-bırak sıralama — ilk versiyonda sabit, v2'de eklenir.

### 2.3 Mikro-Animasyon Kuralları

- **Sayfa geçişi:** Fade + 12px yukarı kayma, `200ms ease-out`
- **Kart hover:** `translateY(-2px)` + glow shadow artışı, `150ms`
- **Sayı güncellemesi:** Sayılar count-up animasyonuyla güncellenir
- **Progress bar'lar:** Mount'ta sol-sağ dolum animasyonu
- **Streak flame ikonları:** Subtle pulse animasyonu aktif streak'lerde
- **Loading:** Skeleton screen, spinner yok

---

## 3. Genel Mimari

### 3.1 Repository Yapısı

```
personal-dashboard/
├── backend/               # Django 5 + DRF
│   ├── apps/
│   │   ├── core/          # User, Auth, shared utils
│   │   ├── finance/       # Gelir/Gider modülü
│   │   ├── habits/        # Alışkanlık takibi
│   │   ├── tasks/         # İş planı
│   │   └── portfolio/     # Yatırım portföyü
│   ├── integrations/      # Dış API istemcileri (Bigpara, TEFAS vs.)
│   └── config/
├── frontend/              # Next.js 14 + TypeScript
│   ├── app/               # App Router
│   │   ├── (auth)/
│   │   ├── dashboard/
│   │   ├── finance/
│   │   ├── habits/
│   │   ├── tasks/
│   │   └── portfolio/
│   ├── components/
│   │   ├── ui/            # Design system primitives
│   │   ├── charts/        # Recharts wrapper'ları
│   │   └── modules/       # Feature-specific components
│   └── lib/
│       ├── api/           # Base fetch client — token injection + refresh interceptor
│       └── hooks/
└── docker-compose.yml     # postgres:16-alpine + backend + frontend servisleri
```

### 3.2 Auth

- Django SimpleJWT
- NextAuth.js v5 ile frontend token yönetimi
- `httpOnly` cookie — localStorage'a token yok
- Single user — admin panelinden tek kullanıcı oluşturulur, kayıt ekranı yok

### 3.3 API Yapısı

```
/api/v1/auth/          token, refresh, me
/api/v1/finance/       transactions, categories, excel-import, excel-export, summary
/api/v1/habits/        habits, logs, streaks
/api/v1/tasks/         tasks, recurring-tasks
/api/v1/portfolio/     assets, price-history, summary
/api/v1/dashboard/     net-worth, combined-summary
```

Tüm endpoint'ler authentication gerektirir. Ownership filter her view'da zorunlu.

---

## 4. Modüller

---

### 4.1 Modül — Gelir / Gider Takibi

#### Amaç
Banka ekstrelerini otomatik parse edip kategorize etmek, mevcut Excel şemasıyla uyumlu hale getirmek ve harcama analizini görsel sunmak.

#### 4.1.1 Excel Entegrasyonu

**Import Akışı:**
1. Kullanıcı banka ekstresini yükler (PDF veya CSV)
2. Backend Claude API'ye gönderir — sistem prompt'u şablonu içerir:
   - Tarihi standart formata çevir
   - Tutarı parse et (binlik nokta/virgül farkları)
   - Kategoriyi tahmin et (market, fatura, restoran, vb.)
   - JSON array döndür
3. Dönen veri kullanıcıya önizleme tablosunda gösterilir
4. Kullanıcı kategori düzeltmesi yapabilir (inline edit)
5. Onayla → DB'ye yaz

**Şema Tanımlama:**
- İlk kurulumda kullanıcı mevcut Excel dosyasını yükler
- Sistem kolon mapping'i çıkarır: hangi kolon tarih, tutar, açıklama, kategori
- Bu mapping `UserExcelSchema` modeline kaydedilir
- Export işlemi bu şemayı kullanır

**Export Akışı:**
- DB'deki filtrelenmiş veri → mevcut Excel şemasına uygun .xlsx üretimi
- `openpyxl` ile backend'de oluşturulur, download URL döndürülür

#### 4.1.2 Veri Modeli

```python
class Category(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    type = models.CharField(choices=['income', 'expense'])
    color = models.CharField(max_length=7)  # hex
    icon = models.CharField(max_length=50)  # lucide icon name

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=500)
    category = models.ForeignKey(Category, ...)
    type = models.CharField(choices=['income', 'expense'])
    source = models.CharField(choices=['manual', 'import'])
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class UserExcelSchema(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    column_date = models.CharField(max_length=100)
    column_amount = models.CharField(max_length=100)
    column_description = models.CharField(max_length=100)
    column_category = models.CharField(max_length=100, blank=True)
    date_format = models.CharField(max_length=50)
    amount_decimal_separator = models.CharField(max_length=1)
    updated_at = models.DateTimeField(auto_now=True)
```

#### 4.1.3 UI Sayfaları

**`/finance` — Ana Sayfa:**
- Üst: Bu ay gelir / gider / net bakiye kartları (büyük sayılar, DM Mono font)
- Orta sol: Aylık harcama bar chart (recharts) — hover'da kategori breakdown
- Orta sağ: Kategori dağılımı donut chart
- Alt: İşlem tablosu — tarih, açıklama, kategori chip, tutar
  - Inline kategori değiştirme
  - Satır silme
  - Arama + filtre (tarih aralığı, kategori, tür)

**`/finance/import` — İçe Aktarma:**
- Drag & drop upload alanı (büyük, görsel)
- Upload sonrası: önizleme tablosu (düzenlenebilir)
- Sağ panel: Tespit edilen kategoriler özeti
- "Onayla ve Kaydet" CTA

**`/finance/categories` — Kategori Yönetimi:**
- Grid layout — her kategori renk + ikon + isim
- Yeni kategori ekleme (inline form, color picker)

#### 4.1.4 Harcama Analizi

- **Aylık trend:** Son 12 ay gelir vs gider çizgi grafiği
- **Kategori bazlı breakdown:** "Bu ay markete X TL harcadın, geçen aya göre %Y fazla"
- **En yüksek harcama kategorileri:** Sıralı liste, progress bar ile toplama oranı

---

### 4.2 Modül — Alışkanlık Takibi

#### Amaç
Günlük alışkanlıkları işaretlemek, streak hesaplamak, tutarlılığı görselleştirmek.

#### 4.2.1 Veri Modeli

```python
class Habit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7)
    icon = models.CharField(max_length=50)
    frequency = models.CharField(choices=['daily', 'weekdays', 'custom'])
    custom_days = models.JSONField(default=list)  # [0,1,2,3,4] = weekdays
    target_streak = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE)
    date = models.DateField()
    completed = models.BooleanField(default=True)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ['habit', 'date']
```

#### 4.2.2 Streak Hesaplama (Backend)

- **Current streak:** Bugünden geriye kaç gün ardışık tamamlandı
- **Longest streak:** Tüm zamanların rekoru
- **Completion rate:** Son 30 gün / son 90 gün / tüm zamanlar
- Hesaplama DB'de değil, view'da yapılır — cron'a gerek yok

#### 4.2.3 UI Sayfaları

**`/habits` — Ana Sayfa:**
- Üst: Bugünün alışkanlıkları — her biri büyük tıklanabilir kart
  - Tıklayınca işaretle/kaldır (optimistic update)
  - Sol tarafta renk bandı + ikon
  - Sağ tarafta streak sayısı ve flame emoji (aktif streak'te animasyonlu)
- Orta: Completion rate özeti — "Bugün X/Y tamamlandı" progress bar
- Alt: Heatmap (GitHub contribution graph tarzı)
  - 12 aylık görünüm, her gün küçük kare
  - Tamamlanan alışkanlık sayısına göre renk yoğunluğu
  - Hover'da detay tooltip

**`/habits/analytics` — Analiz:**
- Alışkanlık bazlı streak ve completion rate tablosu
- En tutarlı / en az tutarlı alışkanlıklar
- Haftalık pattern: Pazartesi mi daha iyisin, Cuma mı kötü gidiyor?

**Excel Export:**
- Tüm habit log verisi → Excel'e aktar
- Format: Tarih + her alışkanlık kolon

---

### 4.3 Modül — İş Planı / Task Yönetimi

#### Amaç
Günlük görevleri girmek, haftalık/aylık planlama yapmak, önceliklendirmek.

#### 4.3.1 Veri Modeli

```python
class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    status = models.CharField(choices=['todo', 'in_progress', 'done', 'cancelled'])
    priority = models.CharField(choices=['low', 'medium', 'high', 'urgent'])
    due_date = models.DateField(null=True, blank=True)
    due_time = models.TimeField(null=True, blank=True)
    tags = models.JSONField(default=list)
    is_recurring = models.BooleanField(default=False)
    recurrence_rule = models.JSONField(null=True)  # {frequency: 'weekly', days: [0,4]}
    parent_task = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

#### 4.3.2 UI Sayfaları

**`/tasks` — Günlük Görünüm (default):**
- Sol: Bugünkü görevler listesi — sürükle bırak sıralama
  - Priority renk kodu (sol border rengi: urgent=kırmızı, high=turuncu, vb.)
  - Checkbox tıklaması → tamamlama animasyonu (strikethrough + fade)
  - Quick-add input (en üstte, Enter ile ekle)
- Sağ: Mini haftalık overview — her gün kaç görev var/tamamlandı

**`/tasks/weekly` — Haftalık Görünüm:**
- 7 kolon kanban tarzı layout
- Her kolonun altında o güne ait görev sayısı
- Görev kartlarını günler arası sürükleyebilme

**`/tasks/backlog` — Tüm Görevler:**
- Tablo görünümü — filtre + arama + bulk actions
- Tarihsiz görevler buraya düşer

#### 4.3.3 Günü Planlama Yardımı

Sabah açınca küçük bir panel:
- "Bugün 5 görevin var, 2'si gecikmiş"
- Sürükle-bırak ile bugüne öne çıkarma
- 3 öncelikli görev seçme ("bugünün top 3'ü")

#### 4.3.4 Hatırlatmalar (Mail)

- Sabah 8:00 — "Bugünün görevleri" özeti (opsiyonel, toggle ile açılır)
- Django-q ya da Celery ile schedule — basit setup
- SMTP ile gönderim, HTML email şablonu

---

### 4.4 Modül — Yatırım Portföyü

#### Amaç
Varlıkları alış tarihiyle girmek, güncel fiyatı çekerek kâr/zarar hesaplamak.

#### 4.4.1 Veri Modeli

```python
class AssetClass(models.Model):
    # 'gold', 'fund', 'stock', 'crypto', 'forex', 'other'
    name = models.CharField(max_length=100)
    key = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7)

class Asset(models.Model):
    name = models.CharField(max_length=200)         # "Garanti BBVA"
    symbol = models.CharField(max_length=50)        # "GARAN"
    asset_class = models.ForeignKey(AssetClass, on_delete=models.PROTECT)
    data_source = models.CharField(max_length=100)  # 'bigpara', 'tefas', 'coingecko', 'manual'
    source_identifier = models.CharField(max_length=200)  # API'deki ID

class PortfolioEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=20, decimal_places=8)
    purchase_price = models.DecimalField(max_digits=16, decimal_places=4)
    purchase_date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class PriceSnapshot(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=16, decimal_places=4)
    currency = models.CharField(max_length=3, default='TRY')
    fetched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fetched_at']
```

#### 4.4.2 Veri Kaynakları

| Varlık Türü | Kaynak | Yöntem |
|---|---|---|
| Gram Altın | collectapi.com / TCMB | REST API |
| TEFAS Fonları | tefas.gov.tr | HTTP scrape + parse |
| BIST Hisseler | Bigpara veya isyatirim | REST API |
| Kripto | CoinGecko (ücretsiz tier) | REST API |
| Döviz | TCMB kur API | REST API |
| Manuel | — | Kullanıcı girer |

**Fiyat Güncelleme:** Django management command + crontab. Gün içinde 2-3 kez. Cache'lenmiş fiyat → "Son güncelleme: 14:32" şeklinde gösterilir.

#### 4.4.3 UI Sayfaları

**`/portfolio` — Ana Sayfa:**
- Üst: Toplam portföy değeri (büyük sayı, TRY), toplam maliyet, toplam kâr/zarar (tutar + yüzde)
- Orta: Varlık sınıfı dağılımı donut chart (Altın %X, Hisse %Y...)
- Alt: Her varlık için satır:
  - İsim + sembol, miktar, alış fiyatı, güncel fiyat, değer, K/Z (renk kodlu)

**`/portfolio/add` — Varlık Ekleme:**
- Asset class seç → sembol ara (autocomplete) → miktar + alış fiyatı + tarih
- Manuel fiyat girişi seçeneği (API'siz varlıklar için)

#### 4.4.4 Hedef Dağılım

- "Altın %20, Hisse %40, Fon %30, Nakit %10 olsun" gibi hedef tanımlama
- Mevcut dağılım vs hedef dağılım side-by-side bar chart
- "Altın %8 az, hisse %5 fazla" uyarısı

---

### 4.5 Dashboard — Net Servet & Özet

**`/` veya `/dashboard` — Ana Sayfa:**

Tüm modüllerin birleştiği komuta merkezi.

#### Widgetlar (soldan sağa, yukarıdan aşağıya):

**Satır 1 — Hero Metrikler:**
- Net Servet = Portföy Değeri + (Bu ayki birikimler kümülatif)
- Bu ay net (gelir - gider)
- Bugün tamamlanan görev / toplam
- Aktif streak'lerin ortalaması

**Satır 2 — Grafikler:**
- Sol (2/3 genişlik): Son 12 ay gelir-gider çizgi grafiği
- Sağ (1/3 genişlik): Portföy dağılımı donut

**Satır 3 — Listeler:**
- Sol: Bugünün görevleri (top 5, tıklanabilir)
- Orta: Bugünün alışkanlıkları (tıklanabilir — modülden çıkmadan işaretle)
- Sağ: Portföy en iyi/en kötü performans (bugün)

---

## 5. Excel Şema Sistemi — Detay

### 5.1 İlk Kurulum Akışı

```
1. Kullanıcı mevcut Excel'ini yükler
2. Backend: openpyxl ile kolon başlıklarını çıkar
3. Frontend: "Hangi kolon nedir?" eşleştirme UI'ı gösterilir
   - Dropdown: "Tarih kolonunu seç" → kullanıcı seçer
   - Dropdown: "Tutar kolonunu seç" → kullanıcı seçer
   - Dropdown: "Açıklama kolonunu seç" → kullanıcı seçer
   - "Kategori kolonu var mı?" → opsiyonel
4. Örnek satır önizlemesi — "Bu satır böyle parse edilecek"
5. Kaydet → UserExcelSchema oluşur
```

### 5.2 Claude API Parse Prompt Yapısı

```python
PARSE_SYSTEM_PROMPT = """
Sen bir banka ekstresi parser'ısın. Sana verilen CSV veya PDF metnini analiz edip
her satır için JSON çıktısı üreteceksin.

Kurallar:
- Tarih: YYYY-MM-DD formatına çevir
- Tutar: Float, negatif değer gider, pozitif gelir
- Kategori: [market, restoran, ulaşım, fatura, sağlık, eğlence, giyim, teknoloji, kira, diğer] listesinden seç
- Açıklama: Orijinal metni koru, temizle sadece

Sadece JSON array döndür, başka açıklama yok.
Format: [{"date": "2026-01-15", "amount": -250.00, "description": "...", "category": "..."}]
"""
```

---

## 6. MVP Scope — Ne Var Ne Yok

### ✅ MVP'de Var

- [ ] Auth (login/logout, JWT)
- [ ] Dashboard overview sayfası
- [ ] Gelir/gider CRUD + manuel ekleme
- [ ] Excel import (Claude API parse) + export
- [ ] Kategori yönetimi
- [ ] Alışkanlık CRUD + günlük işaretleme
- [ ] Heatmap görselleştirme
- [ ] Streak hesaplama
- [ ] Task CRUD + önceliklendirme
- [ ] Günlük/haftalık view
- [ ] Portföy varlık girişi (manuel fiyat)
- [ ] Portföy K/Z hesabı
- [ ] Net servet dashboard widget'ı
- [ ] Harcama analizi grafikleri
- [ ] Kategori bazlı breakdown

### ⏳ V2'de Gelecek

- [ ] Otomatik fiyat çekme (Bigpara, TEFAS, CoinGecko)
- [ ] Mail hatırlatmaları (Celery + SMTP)
- [ ] Hedef dağılım karşılaştırması
- [ ] Task sürükle-bırak sıralama
- [ ] Dashboard widget sıralama
- [ ] Haftalık/aylık harcama pattern analizi
- [ ] Light mode

### ❌ Scope Dışı

- Banka API entegrasyonu (Open Banking)
- Çoklu kullanıcı / paylaşım
- Mobil uygulama
- Push notification

---

## 7. Build Sırası (MVP)

```
Sprint 1 — Temel
  → Repo setup, Django project, Next.js app
  → docker-compose: postgres servisi + Django + Next.js
  → CORS setup (django-cors-headers, localhost:3000)
  → Auth (JWT + NextAuth v5 credentials provider)
  → lib/api/ — base fetch client, token injection, refresh interceptor
  → Tailwind versiyon kararı (v3 önerilir) + config + CSS variables
  → Design system: renkler, font (next/font/google), komponent primitives
  → Sidebar navigation skeleton

Sprint 2 — Alışkanlıklar
  → Habit model + API
  → Günlük işaretleme UI
  → Streak hesaplama
  → Heatmap component (`react-calendar-heatmap` — custom yazmaya gerek yok)

Sprint 3 — Görevler
  → Task model + API
  → Günlük view + haftalık view
  → Quick-add, önceliklendirme

Sprint 4 — Gelir/Gider
  → Transaction + Category model + API
  → Manuel ekleme formu
  → Excel şema tanımlama flow
  → Claude API entegrasyonu (import)
  → Grafikler (recharts)

Sprint 5 — Portföy
  → Asset + PortfolioEntry model + API
  → Manuel varlık girişi
  → K/Z hesaplama ve görselleştirme

Sprint 6 — Dashboard
  → Net servet hesaplama
  → Dashboard widget'ları
  → Son dokunuşlar, polish
```

---

## 8. Teknik Kararlar

| Konu | Karar | Neden |
|---|---|---|
| State management | Zustand | Basit, TypeScript-friendly, Redux overkill |
| Data fetching | TanStack Query | Cache, loading states, refetch otomatik |
| Charts | Recharts | React-native, TypeScript, lightweight |
| Forms | React Hook Form + Zod | Validation, TypeScript inference |
| Excel işleme | openpyxl (backend) | Güvenilir, feature-rich |
| PDF parse | pdfminer.six (backend) | Pure Python, dependency az |
| Claude API | anthropic Python SDK | Resmi |
| Cron (v2) | django-q veya Celery + Redis | Fiyat güncelleme için |
| Styling | Tailwind CSS v3 + CSS variables | v3 seçildi — eklenti uyumluluğu için |
| Icon library | Lucide React | Tutarlı, tree-shakeable |
| Font yönetimi | next/font/google | Otomatik self-host, layout shift yok |
| Heatmap | react-calendar-heatmap | GitHub-style, custom yazmaya gerek yok |
| CORS | django-cors-headers | Development ve production CORS yönetimi |

---

## 9. Environment Variables

```env
# Backend
SECRET_KEY=
DEBUG=False
DATABASE_URL=
ANTHROPIC_API_KEY=
ALLOWED_HOSTS=
CORS_ALLOWED_ORIGINS=

# Frontend
NEXT_PUBLIC_API_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

## 10. Klasör Yapısı — Frontend Detay

```
frontend/app/
├── (auth)/
│   └── login/page.tsx
├── dashboard/page.tsx
├── finance/
│   ├── page.tsx               # Ana liste + grafikler
│   ├── import/page.tsx        # Excel import flow
│   └── categories/page.tsx
├── habits/
│   ├── page.tsx               # Günlük + heatmap
│   └── analytics/page.tsx
├── tasks/
│   ├── page.tsx               # Günlük view
│   ├── weekly/page.tsx
│   └── backlog/page.tsx
└── portfolio/
    ├── page.tsx               # Portföy özeti
    └── add/page.tsx

frontend/components/
├── ui/                        # Design system
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Tooltip.tsx
│   └── Skeleton.tsx
├── charts/
│   ├── LineChart.tsx          # Recharts wrapper
│   ├── BarChart.tsx
│   ├── DonutChart.tsx
│   └── HeatmapGrid.tsx        # Custom, GitHub-style
├── layout/
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── PageWrapper.tsx
└── modules/
    ├── finance/
    ├── habits/
    ├── tasks/
    └── portfolio/
```

---

*Bu doküman Claude Code'a doğrudan verilebilir. Her sprint başında ilgili kısım context olarak eklenmelidir.*
