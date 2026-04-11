# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

Next.js 14 + TypeScript + MUI v5 + Zustand + React Query (TanStack) + Axios + React Hook Form + Yup + i18next + CASL

## Local Development

### Kurulum

```bash
bun install
```

`.env` dosyası oluştur:
```
NEXT_PUBLIC_HOST_API=http://localhost:8000
NEXT_PUBLIC_SECRET_KEY=herhangi-bir-deger
NEXT_PUBLIC_COOKIE_NAME=junius_token
```

### Komutlar

```bash
bun dev          # Geliştirme sunucusu → http://localhost:3000
bun build        # Production build
bun lint         # ESLint kontrolü
bun lint:fix     # ESLint otomatik düzeltme
bun format       # Prettier formatla
bun fix          # lint:fix + format + tsc (tek seferde temizlik)
```

## Proje Mimarisi

```
src/
  app/           → Next.js App Router — sayfa ve layout'lar
  components/    → Yeniden kullanılabilir MUI tabanlı bileşenler
  hooks/         → Custom React hook'ları
  services/      → Axios API çağrıları — backend endpoint'leriyle 1-1 eşleşir
  stores/        → Zustand global state store'ları
  types/         → TypeScript tip tanımları
  utils/         → Yardımcı fonksiyonlar
```

## Kritik Dosyalar

- `src/env.ts` — `@t3-oss/env-nextjs` ile env doğrulama. `NEXT_PUBLIC_HOST_API`, `NEXT_PUBLIC_SECRET_KEY`, `NEXT_PUBLIC_COOKIE_NAME` zorunlu. Eksik olursa build/dev başlamaz.
- `next.config.js` — MUI modular import optimizasyonu, SVG desteği (`@svgr/webpack`), ESLint ve TypeScript hataları build'i durdurmaz (`ignoreDuringBuilds: true`).

## Env Doğrulaması

`next.config.js` build sırasında `src/env.ts`'i `jiti` ile import eder — bu yüzden `.env` eksik değişkenlerle dev server bile başlamaz.

## API İletişimi

`NEXT_PUBLIC_HOST_API` backend base URL'i. `axios-auth-refresh` ile JWT refresh token akışı otomatik yönetilir. Auth state Zustand store'da tutulur.

## Önemli Notlar

- Paket yöneticisi `bun` — `npm` veya `yarn` kullanma.
- Commit için `bun commit` (Commitizen + emoji formatı) kullan; doğrudan `git commit` Husky/commitlint ile bloklanabilir.
- CASL (`@casl/ability`) yetkilendirme kütüphanesi projeye dahil ama implementasyonu hâlâ devam ediyor.
- i18n aktif — kullanıcıya gösterilen string'leri doğrudan hardcode etme, i18next key'leri kullan.
