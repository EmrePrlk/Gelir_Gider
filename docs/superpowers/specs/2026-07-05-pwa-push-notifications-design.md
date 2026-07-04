# PWA + Push Notifications — Design Spec

**Date:** 2026-07-05  
**Status:** Approved  
**Scope:** manifest.json, service worker, push notifications (habits + tasks)

---

## Overview

Uygulamayı Progressive Web App'e dönüştür: telefona kurulabilir hale getir ve her sabah 10:00'da tamamlanmamış görev/alışkanlık varsa akıllı push bildirimi gönder.

---

## Architecture

```
Kullanıcı            Frontend (Next.js)         Backend (Django)
   │                        │                          │
   │  Uygulamayı açar       │                          │
   │───────────────────────►│                          │
   │                   sw.js register                  │
   │◄── Bildirim izni ──────│                          │
   │  İzin verir            │                          │
   │───────────────────────►│                          │
   │                   push subscription → POST /push/subscribe
   │                        │─────────────────────────►│
   │                        │                  PushSubscription DB
   │
   │            [Her sabah 10:00 İstanbul — Scheduler]
   │            tamamlanmamış habit/task var mı?
   │            varsa → pywebpush → tarayıcı
   │◄── "3 alışkanlık, 2 görev seni bekliyor" ─────────
```

---

## Backend

### Model

```python
# core/models.py
class PushSubscription(models.Model):
    user      = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    endpoint  = models.TextField()
    p256dh    = models.TextField()
    auth      = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
```

### Endpoints

| Method | URL | Açıklama |
|--------|-----|----------|
| `POST` | `/api/v1/auth/push/subscribe` | Subscription kaydet (OneToOne, üzerine yazar) |
| `DELETE` | `/api/v1/auth/push/subscribe` | Subscription sil |
| `GET` | `/api/v1/auth/push/vapid-public-key` | Frontend public key alır |

### VAPID Konfigürasyonu

`config/settings.py`'e eklenir, `python-decouple` ile env'den okunur:
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_CLAIMS_EMAIL`

Üretim: `pywebpush` ile `vapid_gen` komutu.

### Bildirim Mantığı (`core/notifications.py`)

```
send_morning_notification(user):
  habits → bugün scheduled ama log kaydı olmayan habit sayısı
  tasks  → due_date <= bugün ve status='pending' görev sayısı
  toplam == 0 → return (bildirim gönderme)
  toplam > 0  → pywebpush ile push gönder
```

Bildirim body formatı:
```
title: "Günlük Kontrol"
body:  "📋 {tasks} görev, 🔔 {habits} alışkanlık seni bekliyor"
url:   "/dashboard"
```

### Scheduler

Mevcut `core/scheduler.py`'e yeni job:
```python
scheduler.add_job(morning_notification_job, 'cron', hour=10, minute=0,
                  timezone='Europe/Istanbul', id='morning_notifications')
```

`morning_notification_job`: tüm aktif `PushSubscription` sahiplerine `send_morning_notification` çağırır.

### Yeni Bağımlılık

`backend/requirements.txt`'e: `pywebpush>=2.0.0`

---

## Frontend

### `app/manifest.ts`

```typescript
name: "Dashboard"
short_name: "Dashboard"
theme_color: "#0F0F1A"
background_color: "#0F0F1A"
display: "standalone"
start_url: "/dashboard"
icons: [{ src: "/icon-192.png", sizes: "192x192" },
        { src: "/icon-512.png", sizes: "512x512" }]
```

### `public/sw.js`

Push event handler ve notification click handler. Offline caching yok.

```javascript
self.addEventListener('push', event => { /* showNotification */ })
self.addEventListener('notificationclick', event => { /* openWindow */ })
```

### `components/PWARegister.tsx`

Client component. `app/layout.tsx`'e eklenir.

- Mount: `navigator.serviceWorker.register('/sw.js')`
- Toggle açık: `Notification.requestPermission()` → `pushManager.subscribe()` → `POST /push/subscribe`
- Toggle kapalı: `DELETE /push/subscribe`

Subscription durumunu localStorage'da saklar (sayfa yenilemede tekrar sormamak için).

### Settings Sayfası

Mevcut `app/(dashboard)/settings/page.tsx`'e "Bildirimler" bölümü eklenir:

```
[toggle] Sabah bildirimleri
         Her sabah 10:00'da tamamlanmamış görev ve alışkanlıkların için hatırlatıcı
```

### İkonlar

`public/icon-192.png` ve `public/icon-512.png` — basit monogram (D harfi, dark theme palette).

---

## Değişen Dosyalar

**Backend:**
- `core/models.py` — PushSubscription modeli
- `core/views.py` — subscribe/unsubscribe/vapid-key endpoint'leri
- `core/urls.py` — yeni route'lar
- `core/scheduler.py` — sabah 10 job'u
- `requirements.txt` — pywebpush

**Frontend:**
- `app/layout.tsx` — PWARegister eklenir
- `app/(dashboard)/settings/page.tsx` — bildirim toggle
- `next.config.mjs` — service worker header (Cache-Control)

**Yeni Dosyalar:**
- `backend/core/notifications.py`
- `backend/core/migrations/0003_pushsubscription.py`
- `frontend/app/manifest.ts`
- `frontend/public/sw.js`
- `frontend/components/PWARegister.tsx`
- `frontend/public/icon-192.png`
- `frontend/public/icon-512.png`

---

## Out of Scope

- Offline caching / offline sayfası
- Bildirim saati ayarı (sabit 10:00)
- Çoklu cihaz desteği (OneToOne — son cihaz kazanır)
- E-posta bildirimleri
