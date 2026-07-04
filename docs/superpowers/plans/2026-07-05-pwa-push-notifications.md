# PWA + Push Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Uygulamayı PWA'ya dönüştür ve her sabah 10:00'da tamamlanmamış görev/alışkanlık varsa akıllı push bildirimi gönder.

**Architecture:** Backend'de pywebpush + VAPID ile push gönderimi, Django'da PushSubscription modeli ve günlük scheduler job. Frontend'de public/sw.js (push handler), app/manifest.ts (installability), PWARegister client component (SW kayıt), Settings sayfasında bildirim toggle.

**Tech Stack:** pywebpush>=2.0.0 (backend), Next.js 14 manifest.ts built-in, vanilla service worker (no extra npm packages)

---

## File Map

**Oluşturulacak:**
- `backend/apps/core/notifications.py` — push gönderme + akıllı kontrol
- `backend/apps/core/migrations/0003_pushsubscription.py`
- `frontend/app/manifest.ts`
- `frontend/public/sw.js`
- `frontend/public/icon.svg`
- `frontend/lib/api/push.ts`
- `frontend/components/PWARegister.tsx`

**Değiştirilecek:**
- `backend/requirements.txt` — pywebpush ekle
- `backend/config/settings.py` — VAPID env vars
- `backend/apps/core/models.py` — PushSubscription modeli
- `backend/apps/core/views.py` — 3 yeni endpoint
- `backend/apps/core/urls.py` — yeni route'lar
- `backend/apps/core/management/commands/run_scheduler.py` — sabah job
- `frontend/app/layout.tsx` — PWARegister ekle
- `frontend/next.config.mjs` — sw.js headers
- `frontend/app/(dashboard)/settings/page.tsx` — bildirim toggle

---

## Task 1: Backend — pywebpush kurulumu + VAPID ayarları

**Files:**
- Modify: `backend/requirements.txt`
- Modify: `backend/config/settings.py`

- [ ] **Step 1: requirements.txt'e pywebpush ekle**

`backend/requirements.txt` dosyasının sonuna şunu ekle:
```
pywebpush>=2.0.0
```

- [ ] **Step 2: settings.py'e VAPID env var'larını ekle**

`backend/config/settings.py` dosyasının sonuna (mevcut `APSCHEDULER_RUN_NOW_TIMEOUT` satırından sonra) ekle:

```python
VAPID_PRIVATE_KEY = config('VAPID_PRIVATE_KEY', default='').replace('\\n', '\n')
VAPID_PUBLIC_KEY = config('VAPID_PUBLIC_KEY', default='')
VAPID_CLAIMS_EMAIL = config('VAPID_CLAIMS_EMAIL', default='admin@example.com')
```

- [ ] **Step 3: Commit**

```bash
git add backend/requirements.txt backend/config/settings.py
git commit -m "feat(pwa): add pywebpush dependency and VAPID settings"
```

---

## Task 2: Backend — PushSubscription modeli + migration

**Files:**
- Modify: `backend/apps/core/models.py`
- Create: `backend/apps/core/migrations/0003_pushsubscription.py`

- [ ] **Step 1: PushSubscription modelini ekle**

`backend/apps/core/models.py` dosyasının sonuna ekle:

```python
class PushSubscription(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='push_subscription',
    )
    endpoint = models.TextField()
    p256dh = models.TextField()
    auth = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PushSubscription({self.user.email})"
```

- [ ] **Step 2: Migration dosyasını elle yaz**

`backend/apps/core/migrations/0003_pushsubscription.py` dosyasını oluştur:

```python
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_weeklyinsight'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PushSubscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('endpoint', models.TextField()),
                ('p256dh', models.TextField()),
                ('auth', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='push_subscription',
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
        ),
    ]
```

- [ ] **Step 3: Commit**

```bash
git add backend/apps/core/models.py backend/apps/core/migrations/0003_pushsubscription.py
git commit -m "feat(pwa): add PushSubscription model and migration"
```

---

## Task 3: Backend — Push API endpoint'leri

**Files:**
- Modify: `backend/apps/core/views.py`
- Modify: `backend/apps/core/urls.py`

- [ ] **Step 1: views.py'e 3 view ekle**

`backend/apps/core/views.py` dosyasında mevcut `WeeklyInsightView` sınıfının hemen altına şunu ekle:

```python
class PushSubscribeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.conf import settings as django_settings
        return Response({'vapid_public_key': django_settings.VAPID_PUBLIC_KEY})

    def post(self, request):
        from .models import PushSubscription
        endpoint = request.data.get('endpoint')
        p256dh = request.data.get('p256dh')
        auth = request.data.get('auth')
        if not endpoint or not p256dh or not auth:
            return Response({'detail': 'endpoint, p256dh ve auth zorunlu.'}, status=status.HTTP_400_BAD_REQUEST)
        PushSubscription.objects.update_or_create(
            user=request.user,
            defaults={'endpoint': endpoint, 'p256dh': p256dh, 'auth': auth},
        )
        return Response({'detail': 'Subscription kaydedildi.'}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        from .models import PushSubscription
        PushSubscription.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

- [ ] **Step 2: urls.py'e route ekle**

`backend/apps/core/urls.py` dosyasını şu şekilde güncelle:

```python
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView, MeView, ChangePasswordView,
    DashboardSummaryView, WeeklyInsightView, PushSubscribeView,
)

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard_summary'),
    path('dashboard/weekly-insight/', WeeklyInsightView.as_view(), name='weekly_insight'),
    path('push/subscribe/', PushSubscribeView.as_view(), name='push_subscribe'),
]
```

- [ ] **Step 3: Commit**

```bash
git add backend/apps/core/views.py backend/apps/core/urls.py
git commit -m "feat(pwa): add push subscribe/unsubscribe/vapid-key endpoints"
```

---

## Task 4: Backend — notifications.py + scheduler job

**Files:**
- Create: `backend/apps/core/notifications.py`
- Modify: `backend/apps/core/management/commands/run_scheduler.py`

- [ ] **Step 1: notifications.py oluştur**

`backend/apps/core/notifications.py` dosyasını oluştur:

```python
import json
import logging
from datetime import date

from django.conf import settings

logger = logging.getLogger(__name__)


def get_pending_counts(user):
    from apps.habits.models import Habit, HabitLog
    from apps.habits.serializers import is_scheduled
    from apps.tasks.models import Task

    today = date.today()

    habits = Habit.objects.filter(user=user, is_active=True)
    completed_habit_ids = set(
        HabitLog.objects.filter(
            habit__user=user, date=today, completed=True,
        ).values_list('habit_id', flat=True)
    )
    pending_habits = sum(
        1 for h in habits
        if is_scheduled(h, today) and h.id not in completed_habit_ids
    )

    pending_tasks = Task.objects.filter(
        user=user,
        due_date__lte=today,
        status__in=('todo', 'in_progress'),
    ).count()

    return pending_habits, pending_tasks


def send_push_to_user(user):
    from .models import PushSubscription
    try:
        sub = PushSubscription.objects.get(user=user)
    except PushSubscription.DoesNotExist:
        return

    pending_habits, pending_tasks = get_pending_counts(user)
    if pending_habits == 0 and pending_tasks == 0:
        return

    parts = []
    if pending_tasks:
        parts.append(f"📋 {pending_tasks} görev")
    if pending_habits:
        parts.append(f"🔔 {pending_habits} alışkanlık")

    body = ", ".join(parts) + " seni bekliyor"

    try:
        from pywebpush import webpush, WebPushException
        webpush(
            subscription_info={
                'endpoint': sub.endpoint,
                'keys': {'p256dh': sub.p256dh, 'auth': sub.auth},
            },
            data=json.dumps({
                'title': 'Günlük Kontrol',
                'body': body,
                'url': '/dashboard',
            }),
            vapid_private_key=settings.VAPID_PRIVATE_KEY,
            vapid_claims={'sub': f'mailto:{settings.VAPID_CLAIMS_EMAIL}'},
        )
        logger.info('Push gönderildi: %s', user.email)
    except Exception as e:
        logger.error('Push gönderilemedi (%s): %s', user.email, e)
        if 'expired' in str(e).lower() or '410' in str(e):
            sub.delete()
            logger.info('Expired subscription silindi: %s', user.email)
```

- [ ] **Step 2: run_scheduler.py'e sabah job'unu ekle**

`backend/apps/core/management/commands/run_scheduler.py` dosyasını şu şekilde güncelle:

```python
import logging

from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


def run_weekly_insight_job():
    from apps.core.insight import generate_insight_for_all_users
    logger.info('Haftalık içgörü üretiliyor...')
    generate_insight_for_all_users()
    logger.info('Haftalık içgörü tamamlandı.')


def run_morning_notification_job():
    from apps.core.models import PushSubscription
    from apps.core.notifications import send_push_to_user
    logger.info('Sabah bildirimleri gönderiliyor...')
    subs = PushSubscription.objects.select_related('user').all()
    for sub in subs:
        send_push_to_user(sub.user)
    logger.info('Sabah bildirimleri tamamlandı.')


class Command(BaseCommand):
    help = 'Scheduler\'ı başlatır (blocking — Docker service olarak çalışır)'

    def handle(self, *args, **options):
        from apscheduler.schedulers.blocking import BlockingScheduler
        from apscheduler.triggers.cron import CronTrigger
        from django_apscheduler.jobstores import DjangoJobStore

        scheduler = BlockingScheduler(timezone='Europe/Istanbul')
        scheduler.add_jobstore(DjangoJobStore(), 'default')

        scheduler.add_job(
            run_weekly_insight_job,
            trigger=CronTrigger(day_of_week='mon', hour=9, minute=0),
            id='weekly_insight_job',
            jobstore='default',
            replace_existing=True,
            misfire_grace_time=3600,
        )

        scheduler.add_job(
            run_morning_notification_job,
            trigger=CronTrigger(hour=10, minute=0),
            id='morning_notification_job',
            jobstore='default',
            replace_existing=True,
            misfire_grace_time=3600,
        )

        self.stdout.write('Scheduler başlatıldı. Her gün 10:00 bildirim, her Pazartesi 09:00 içgörü.')
        try:
            scheduler.start()
        except (KeyboardInterrupt, SystemExit):
            self.stdout.write('Scheduler durduruldu.')
```

- [ ] **Step 3: Commit**

```bash
git add backend/apps/core/notifications.py backend/apps/core/management/commands/run_scheduler.py
git commit -m "feat(pwa): add morning notification logic and scheduler job"
```

---

## Task 5: Frontend — manifest.ts + ikon

**Files:**
- Create: `frontend/app/manifest.ts`
- Create: `frontend/public/icon.svg`

- [ ] **Step 1: app/manifest.ts oluştur**

`frontend/app/manifest.ts` dosyasını oluştur:

```ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dashboard',
    short_name: 'Dashboard',
    description: 'Kişisel komuta merkezin',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0F0F1A',
    theme_color: '#0F0F1A',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
```

- [ ] **Step 2: public/icon.svg oluştur**

`frontend/public/icon.svg` dosyasını oluştur:

```svg
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="72" fill="#0F0F1A"/>
  <text x="256" y="360" font-family="Georgia, serif" font-size="300" font-weight="bold" fill="#A78BFA" text-anchor="middle">D</text>
</svg>
```

- [ ] **Step 3: Commit**

```bash
git add frontend/app/manifest.ts frontend/public/icon.svg
git commit -m "feat(pwa): add web manifest and app icon"
```

---

## Task 6: Frontend — service worker

**Files:**
- Create: `frontend/public/sw.js`
- Modify: `frontend/next.config.mjs`

- [ ] **Step 1: public/sw.js oluştur**

`frontend/public/sw.js` dosyasını oluştur:

```javascript
self.addEventListener('push', function (event) {
  if (!event.data) return

  const data = event.data.json()
  const title = data.title || 'Dashboard'
  const options = {
    body: data.body || '',
    icon: '/icon.svg',
    badge: '/icon.svg',
    data: { url: data.url || '/dashboard' },
    requireInteraction: false,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const url = event.notification.data?.url || '/dashboard'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
```

- [ ] **Step 2: next.config.mjs'ye sw.js header'ları ekle**

`frontend/next.config.mjs` dosyasını şu şekilde güncelle:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
```

- [ ] **Step 3: Commit**

```bash
git add frontend/public/sw.js frontend/next.config.mjs
git commit -m "feat(pwa): add service worker and cache-control headers"
```

---

## Task 7: Frontend — push API client

**Files:**
- Create: `frontend/lib/api/push.ts`

- [ ] **Step 1: lib/api/push.ts oluştur**

`frontend/lib/api/push.ts` dosyasını oluştur:

```ts
import { api } from './client'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const pushApi = {
  getVapidPublicKey: () =>
    api.get<{ vapid_public_key: string }>('/api/v1/auth/push/subscribe/'),

  subscribe: async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false

    const registration = await navigator.serviceWorker.ready
    const { vapid_public_key } = await pushApi.getVapidPublicKey()
    if (!vapid_public_key) return false

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapid_public_key),
    })

    const json = subscription.toJSON()
    await api.post('/api/v1/auth/push/subscribe/', {
      endpoint: json.endpoint,
      p256dh: json.keys?.p256dh,
      auth: json.keys?.auth,
    })

    localStorage.setItem('push_subscribed', '1')
    return true
  },

  unsubscribe: async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.getSubscription()
      if (sub) await sub.unsubscribe()
    }
    await api.delete('/api/v1/auth/push/subscribe/')
    localStorage.removeItem('push_subscribed')
  },

  isSubscribed: (): boolean => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('push_subscribed') === '1'
  },
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/lib/api/push.ts
git commit -m "feat(pwa): add push notification API client"
```

---

## Task 8: Frontend — PWARegister component + layout

**Files:**
- Create: `frontend/components/PWARegister.tsx`
- Modify: `frontend/app/layout.tsx`

- [ ] **Step 1: PWARegister.tsx oluştur**

`frontend/components/PWARegister.tsx` dosyasını oluştur:

```tsx
'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('SW registration failed:', err)
      })
    }
  }, [])

  return null
}
```

- [ ] **Step 2: layout.tsx'e PWARegister ekle**

`frontend/app/layout.tsx` dosyasını şu şekilde güncelle:

```tsx
import type { Metadata } from 'next'
import { Syne, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import PWARegister from '@/components/PWARegister'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Personal Dashboard',
  description: 'Kişisel komuta merkezin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
        <PWARegister />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/components/PWARegister.tsx frontend/app/layout.tsx
git commit -m "feat(pwa): register service worker on app mount"
```

---

## Task 9: Frontend — Settings bildirim toggle

**Files:**
- Modify: `frontend/app/(dashboard)/settings/page.tsx`

- [ ] **Step 1: settings/page.tsx'e bildirim bölümü ekle**

`frontend/app/(dashboard)/settings/page.tsx` dosyasında:

**a)** Import'lara `Bell` ve `BellOff` ekle (mevcut lucide-react satırını bul, `Bell, BellOff` ekle):
```tsx
import { User, Lock, Database, CheckCircle2, AlertCircle, Bell, BellOff } from 'lucide-react'
```

**b)** `pushApi` import'unu ekle (mevcut import'ların altına):
```tsx
import { pushApi } from '@/lib/api/push'
```

**c)** `export default function SettingsPage()` içinde mevcut state'lerin altına ekle:
```tsx
const [pushEnabled, setPushEnabled] = useState(pushApi.isSubscribed())
const [pushMsg, setPushMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
const [pushLoading, setPushLoading] = useState(false)

const handlePushToggle = async () => {
  setPushLoading(true)
  setPushMsg(null)
  try {
    if (pushEnabled) {
      await pushApi.unsubscribe()
      setPushEnabled(false)
      setPushMsg({ text: 'Bildirimler kapatıldı.', type: 'success' })
    } else {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setPushMsg({ text: 'Bildirim izni verilmedi.', type: 'error' })
        return
      }
      const ok = await pushApi.subscribe()
      if (ok) {
        setPushEnabled(true)
        setPushMsg({ text: 'Bildirimler açıldı. Her sabah 10:00\'da hatırlatıcı alacaksın.', type: 'success' })
      } else {
        setPushMsg({ text: 'Bildirim kaydedilemedi.', type: 'error' })
      }
    }
  } catch {
    setPushMsg({ text: 'Bir hata oluştu.', type: 'error' })
  } finally {
    setPushLoading(false)
    setTimeout(() => setPushMsg(null), 4000)
  }
}
```

**d)** `</div>` kapanan `max-w-xl space-y-5` div'inin içine, Excel Schema Section'ından sonra bildirim bölümünü ekle:

```tsx
{/* Notifications */}
<Section title="Bildirimler" icon={pushEnabled ? Bell : BellOff}>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-text-primary">Sabah bildirimleri</p>
      <p className="text-xs text-text-muted mt-0.5">
        Her sabah 10:00'da tamamlanmamış görev ve alışkanlıkların için hatırlatıcı
      </p>
    </div>
    <button
      onClick={handlePushToggle}
      disabled={pushLoading}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50"
      style={{ backgroundColor: pushEnabled ? 'var(--accent)' : 'var(--border)' }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        style={{ transform: pushEnabled ? 'translateX(24px)' : 'translateX(4px)' }}
      />
    </button>
  </div>
  {pushMsg && <Toast message={pushMsg.text} type={pushMsg.type} />}
</Section>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/(dashboard)/settings/page.tsx
git commit -m "feat(pwa): add notification toggle to settings page"
```

---

## Task 10: Deploy — EC2 kurulumu

**Bu adımlar EC2 sunucusunda çalıştırılır.**

- [ ] **Step 1: Kodu EC2'ya çek**

```bash
cd ~/claude_ai
git pull
```

- [ ] **Step 2: VAPID key'leri üret**

```bash
docker-compose exec backend python -c "
from py_vapid import Vapid
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
import base64

v = Vapid()
v.generate_keys()

private_pem = v.private_pem().decode().replace('\n', '\\\\n')
pub_bytes = v.public_key.public_bytes(Encoding.X962, PublicFormat.UncompressedPoint)
public_b64 = base64.urlsafe_b64encode(pub_bytes).rstrip(b'=').decode()

print('VAPID_PRIVATE_KEY=' + private_pem)
print('VAPID_PUBLIC_KEY=' + public_b64)
"
```

Çıktıdaki iki satırı kopyala.

- [ ] **Step 3: .env dosyasına VAPID key'leri ekle**

```bash
echo 'VAPID_PRIVATE_KEY=<üretilen_private_key>' >> .env
echo 'VAPID_PUBLIC_KEY=<üretilen_public_key>' >> .env
echo 'VAPID_CLAIMS_EMAIL=mr.prlk@gmail.com' >> .env
```

- [ ] **Step 4: Docker'ı yeniden başlat ve migration'ı çalıştır**

```bash
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --build
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
```

Beklenen çıktı (migrate):
```
Running migrations:
  Applying core.0003_pushsubscription... OK
```

- [ ] **Step 5: Bildirim gönderimini manuel test et**

Tarayıcıda https://butcem.juniussoft.com/settings adresine git.
"Bildirimler" toggle'ını aç → tarayıcı izin iste → "İzin ver".
Toast "Bildirimler açıldı" göstermeli.

Sonra EC2'da test push gönder:
```bash
docker-compose -f docker-compose.prod.yml exec backend python -c "
from django.contrib.auth import get_user_model
from apps.core.notifications import send_push_to_user
User = get_user_model()
user = User.objects.first()
send_push_to_user(user)
print('Done')
"
```

Tarayıcıda bildirim gelmeli.

- [ ] **Step 6: Commit (varsa kalan değişiklik yoksa skip)**

```bash
git status
# Kalan değişiklik yoksa skip
```

---

## Özet

| Task | Commit |
|------|--------|
| 1 | pywebpush + VAPID settings |
| 2 | PushSubscription model |
| 3 | Push API endpoints |
| 4 | notifications.py + scheduler |
| 5 | manifest.ts + icon.svg |
| 6 | sw.js + next.config headers |
| 7 | push API client |
| 8 | PWARegister + layout |
| 9 | Settings toggle |
| 10 | EC2 deploy + test |
