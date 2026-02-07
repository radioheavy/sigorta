<div align="center">

# KFZ VERSICHERUNG VERGLEICH

**Araç Sigortası Karşılaştırma Platformu**

Anonim, hızlı ve DSGVO uyumlu KFZ sigortası karşılaştırma uygulaması.
Kullanıcılar kayıt olmadan araç sigortası tekliflerini karşılaştırır ve danışmanlarla anında iletişime geçer.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-FACC15?style=flat-square)](./LICENSE)

<br />

```
┌─────────────────────────────────────────────┐
│                                             │
│   KFZ VERSICHERUNG                          │
│   ██ VERGLEICHEN ██                         │
│                                             │
│   100% Anonym · DSGVO Konform · Sofort      │
│                                             │
│   [ JETZT VERGLEICHEN → ]                   │
│                                             │
└─────────────────────────────────────────────┘
```

</div>

---

## Nedir Bu?

Almanya'da araç sigortası karşılaştırma platformu. Kullanıcılar:

1. **Araç bilgilerini girer** (HSN/TSN veya manuel seçim)
2. **9 farklı sağlayıcıdan** anlık fiyat teklifi alır
3. **Filtreleyip sıralar** (fiyat, rating, sağlayıcı)
4. **Danışmanla iletişime geçer** (WhatsApp / Telegram / Web Chat)

Hiçbir aşamada kayıt, e-posta veya kişisel bilgi gerekmez.

---

## Özellikler

### Araç Girişi
- **HSN/TSN ile hızlı arama** — Fahrzeugschein'dan 2 kod gir, araç otomatik bulunur
- **Manuel giriş** — 20 marka, ~90 model, motor tipi, baujahr, erstzulassung
- **3 sigorta türü** — Haftpflicht / Teilkasko / Vollkasko
- **Selbstbeteiligung** — 0 ile 2.500 EUR arası muafiyet seçimi

### Tarife Karşılaştırma
- **2 partner API adaptörü** ile 9 sigorta sağlayıcı (mock)
- **Gerçekçi fiyatlandırma** — Yaş, SF-Klasse, araç tipi, motor türüne göre dinamik hesaplama
- **Redis cache** — Aynı sorgu 1 saat boyunca anında döner
- **Paralel sorgu** — Tüm adaptörler `Promise.allSettled` ile eş zamanlı çağrılır

### İletişim Kanalları
- **WhatsApp** — Araç + tarife + fiyat + tracking ID ile önceden doldurulmuş mesaj
- **Telegram** — Deep-link ile aynı format
- **Web Messenger** — Site içi anonim chat, 3sn polling, otomatik danışman yanıtı

### Güvenlik & DSGVO
- **Tamamen anonim** — İletişim öncesi kişisel veri alınmaz
- **IP hashleme** — Günlük salt ile SHA-256, geri takip imkansız
- **Cookie Banner** — 3 kategori (Notwendig / Funktional / Analyse)
- **Onay kaydı** — Her consent DB'de saklanır
- **24 saat TTL** — Session otomatik temizlenir
- **Audit logging** — Tüm işlemler tracking ID bazlı loglanır

---

## Mimari

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  Next.js 16 (App Router) + TypeScript + Tailwind CSS v4     │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Fahrzeug │→│  Fahrer  │→│ Ergebnis │→│ Kontakt  │       │
│  │  (Araç)  │ │ (Sürücü) │ │(Sonuçlar)│ │(İletişim)│       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                              │
│                                                             │
│  /api/vehicle/*    Araç arama (HSN/TSN + marka/model)       │
│  /api/session      Anonim session CRUD                      │
│  /api/tariff/*     Tarife karşılaştırma motoru              │
│  /api/contact      İletişim talebi + CRM webhook            │
│  /api/messenger    Web chat mesajları                       │
│  /api/consent      DSGVO onay yönetimi                      │
└──────────┬──────────────────────────────┬───────────────────┘
           │                              │
           ▼                              ▼
┌─────────────────────┐    ┌─────────────────────────────────┐
│     PostgreSQL      │    │         Redis Cache              │
│                     │    │                                  │
│  sessions           │    │  tariff:{hash} → results (1h)   │
│  vehicle_makes      │    │                                  │
│  vehicle_models     │    └─────────────────────────────────┘
│  tariff_queries     │
│  tariff_results     │    ┌─────────────────────────────────┐
│  contact_requests   │    │     Tariff Adapters              │
│  messages           │    │                                  │
│  audit_logs         │    │  ┌───────────┐ ┌─────────────┐  │
│  consent_records    │    │  │ blaudirekt│ │  fondsnet   │  │
│                     │    │  │ (5 tarif) │ │  (4 tarif)  │  │
└─────────────────────┘    │  └───────────┘ └─────────────┘  │
                           └─────────────────────────────────┘
                                          │
                           ┌──────────────┴──────────────┐
                           │     İletişim Kanalları       │
                           │                              │
                           │  WhatsApp (Click-to-Chat)    │
                           │  Telegram (Deep-Link)        │
                           │  Web Messenger (Polling)     │
                           └──────────────────────────────┘
```

---

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Dil** | TypeScript 5 |
| **Stil** | Tailwind CSS v4, Brutalist Design |
| **Font** | JetBrains Mono |
| **Veritabanı** | PostgreSQL + Prisma 7 |
| **Cache** | Redis (ioredis) |
| **Session** | iron-session (encrypted HttpOnly cookie) |
| **Validasyon** | Zod |
| **ID** | nanoid (tracking) |

---

## Hızlı Başlangıç

### Gereksinimler

- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Kurulum

```bash
# 1. Repo'yu klonla
git clone https://github.com/user/kfz-versicherung-vergleich.git
cd kfz-versicherung-vergleich

# 2. Bağımlılıkları yükle
npm install

# 3. Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını düzenle (DATABASE_URL, REDIS_URL, SESSION_SECRET)

# 4. Veritabanını oluştur ve migrate et
createdb sigorta
npx prisma generate
npx prisma migrate dev

# 5. Seed verilerini yükle (20 marka, ~90 model)
npm run db:seed

# 6. Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini aç.

### Docker ile (Opsiyonel)

```bash
# PostgreSQL + Redis
docker compose up -d postgres redis

# Uygulamayı başlat
npm run dev
```

---

## Proje Yapısı

```
src/
├── app/
│   ├── page.tsx                    # Landing sayfası
│   ├── layout.tsx                  # Root layout (Header, Footer, Cookie Banner)
│   ├── not-found.tsx               # 404 sayfası (brutalist)
│   ├── error.tsx                   # Hata sayfası (brutalist)
│   │
│   ├── (rechner)/                  # Hesaplama akışı (Stepper layout)
│   │   ├── fahrzeug/page.tsx       # Adım 1: Araç girişi
│   │   ├── fahrer/page.tsx         # Adım 2: Sürücü profili
│   │   ├── ergebnis/page.tsx       # Adım 3: Tarife sonuçları
│   │   └── kontakt/page.tsx        # Adım 4: İletişim
│   │
│   ├── (legal)/                    # Yasal sayfalar
│   │   ├── datenschutz/            # Gizlilik politikası
│   │   ├── impressum/              # Yasal bildirim
│   │   └── agb/                    # Kullanım şartları
│   │
│   └── api/
│       ├── vehicle/                # Araç arama API'leri
│       │   ├── makes/              # GET — Marka listesi
│       │   ├── models/             # GET — Model listesi
│       │   └── lookup/             # GET — HSN/TSN araması
│       ├── session/                # Anonim session yönetimi
│       ├── tariff/compare/         # POST — Tarife karşılaştırma
│       ├── contact/                # POST — İletişim talebi + CRM
│       ├── messenger/              # GET/POST — Web chat
│       └── consent/                # GET/POST — DSGVO onay
│
├── components/
│   ├── ui/                         # Brutalist UI primitives
│   │   ├── Button.tsx              # border-4, uppercase, hover invert
│   │   ├── Input.tsx               # border-4, focus:accent
│   │   ├── Select.tsx              # Custom dropdown
│   │   ├── Card.tsx                # Container, accent strip
│   │   ├── Badge.tsx               # Etiketler
│   │   ├── Stepper.tsx             # Adım göstergesi
│   │   └── Modal.tsx               # Dialog
│   ├── layout/                     # Header, Footer
│   ├── forms/                      # VehicleForm, DriverForm, InsuranceTypeSelector
│   ├── tariff/                     # TariffCard, TariffList, TariffFilters, Skeleton
│   ├── contact/                    # WhatsApp, Telegram, WebMessenger, ContactPanel
│   └── gdpr/                       # CookieBanner
│
├── services/
│   ├── tariff/                     # Adapter pattern
│   │   ├── adapter.ts              # TariffAdapter interface
│   │   ├── blaudirekt.adapter.ts   # Mock — Allianz, HUK, DEVK, AXA, VHV
│   │   ├── fondsnet.adapter.ts     # Mock — ERGO, Württembergische, Cosmos, HDI
│   │   └── comparator.ts           # Sort & filter
│   └── contact/
│       └── message-builder.ts      # Pre-filled mesaj oluşturucu
│
├── lib/
│   ├── db.ts                       # Prisma singleton
│   ├── redis.ts                    # Redis singleton + cache helpers
│   ├── session.ts                  # iron-session config
│   ├── validation.ts               # Zod schemas
│   └── utils.ts                    # nanoid, price format, IP hash
│
└── generated/prisma/               # Prisma client (gitignored)
```

---

## Fiyatlandırma Mantığı

Mock adaptörler gerçekçi bir fiyatlandırma modeli kullanır:

```
Baz Fiyat: ~45 EUR/ay (Haftpflicht)

Çarpanlar:
├── Sigorta Türü
│   ├── Haftpflicht:  1.0x
│   ├── Teilkasko:    1.4x
│   └── Vollkasko:    2.1x
│
├── Sürücü Yaşı
│   ├── < 25 yaş:     1.8x  (genç sürücü riski)
│   ├── 25-30 yaş:    1.3x
│   ├── 30-65 yaş:    1.0x
│   └── > 65 yaş:     1.2x
│
├── SF-Klasse (Schadenfreiheitsklasse)
│   ├── SF0 (yeni):   2.3x
│   ├── SF1-3:        1.5x
│   ├── SF4-10:       0.8x
│   └── SF11+:        0.6x  (deneyimli sürücü indirimi)
│
├── Araç Yaşı
│   ├── 0-2 yıl:      1.2x  (yeni araç)
│   └── 10+ yıl:      0.8x
│
└── Muafiyet (Selbstbeteiligung)
    ├── 300 EUR+:      0.9x
    └── 500 EUR+:      0.85x
```

---

## API Referansı

### Araç

```
GET /api/vehicle/makes
→ { makes: [{ id, name }] }

GET /api/vehicle/models?makeId=xxx
→ { models: [{ id, name, hsn, tsn }] }

GET /api/vehicle/lookup?hsn=0005&tsn=AHK
→ { vehicle: { id, name, hsn, tsn, makeId, makeName } }
```

### Session

```
GET  /api/session
→ { trackingId, vehicleData, driverData, insuranceType }

POST /api/session
← { vehicleData: {...}, driverData: {...}, insuranceType: "HAFTPFLICHT" }
→ { trackingId, success: true }
```

### Tarife

```
POST /api/tariff/compare
← { fromSession: true }
→ { results: [{ id, provider, productName, monthlyPrice, yearlyPrice, coverage, rating }], cached }
```

### İletişim

```
POST /api/contact
← { tariffId, channel: "WHATSAPP" | "TELEGRAM" | "WEB_MESSENGER", message? }
→ { id, success: true }

GET  /api/messenger
→ { messages: [{ id, sender, content, createdAt }] }

POST /api/messenger
← { content: "Merhaba..." }
→ { id, success: true }
```

### DSGVO

```
GET  /api/consent
→ { consent: { necessary, functional, analytics } | null }

POST /api/consent
← { necessary: true, functional: false, analytics: false }
→ { success: true }
```

---

## Veritabanı Şeması

```
VehicleMake ──< VehicleModel
                    (hsn/tsn unique)

Session ──< TariffQuery ──< TariffResult
    │                            │
    ├──< ContactRequest ─────────┘
    ├──< Message
    ├──< AuditLog

ConsentRecord (trackingId bazlı)
```

9 tablo, 4 enum (InsuranceType, EngineType, ContactChannel, ContactStatus).

---

## Tasarım Sistemi

**Brutalist Design** — kasıtlı olarak ham, doğrudan ve dikkat çekici.

| Özellik | Değer |
|---------|-------|
| Font | JetBrains Mono |
| Border | `border-4 border-black` |
| Border Radius | `0` (tümü) |
| Accent | `#FACC15` (sarı) |
| Renk Paleti | Siyah + Beyaz + Sarı |
| Hover | Renk ters çevirme |
| Active | `translate-y-[2px]` |
| Selection | Siyah zemin, sarı yazı |

---

## Ortam Değişkenleri

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `DATABASE_URL` | PostgreSQL bağlantı URL'i | - |
| `REDIS_URL` | Redis bağlantı URL'i | `redis://localhost:6379` |
| `SESSION_SECRET` | iron-session şifreleme anahtarı (min 32 karakter) | - |
| `CRM_WEBHOOK_URL` | CRM webhook endpoint (opsiyonel) | - |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | WhatsApp telefon numarası | `+4915123456789` |
| `NEXT_PUBLIC_TELEGRAM_BOT` | Telegram bot kullanıcı adı | `sigortabot` |

---

## Scriptler

```bash
npm run dev          # Geliştirme sunucusu (Turbopack)
npm run build        # Production build
npm start            # Production sunucusu
npm run lint         # ESLint
npm run db:seed      # Seed verilerini yükle
npm run db:studio    # Prisma Studio (DB arayüzü)
npm run db:migrate   # Migration uygula
npm run db:generate  # Prisma Client oluştur
```

---

## Yeni Adapter Ekleme

Adapter pattern sayesinde yeni sigorta sağlayıcı eklemek kolay:

```typescript
// src/services/tariff/my-provider.adapter.ts
import { TariffAdapter, TariffRequest, TariffResponse } from "./adapter";

export class MyProviderAdapter implements TariffAdapter {
  name = "my-provider";

  async isAvailable(): Promise<boolean> {
    return true; // API sağlık kontrolü
  }

  async fetchTariffs(req: TariffRequest): Promise<TariffResponse[]> {
    // API çağrısı, normalize et, döndür
    return [...];
  }
}
```

`src/app/api/tariff/compare/route.ts` içinde adapters dizisine ekle:

```typescript
const adapters = [
  new BlaudirektAdapter(),
  new FondsnetAdapter(),
  new MyProviderAdapter(), // yeni
];
```

---

## Yol Haritası

- [x] Araç girişi (HSN/TSN + manuel)
- [x] Tarife karşılaştırma (2 mock adaptör, 9 sağlayıcı)
- [x] Fiyat sıralama + filtreleme
- [x] WhatsApp / Telegram / Web Messenger
- [x] DSGVO (Cookie Banner, Consent, Audit)
- [x] Yasal sayfalar (Datenschutz, Impressum, AGB)
- [x] CRM webhook entegrasyonu
- [x] Anonim session (24h TTL)
- [x] Brutalist UI tasarımı
- [ ] Rate limiting
- [ ] CI/CD pipeline
- [ ] E2E testler (Playwright)
- [ ] Gerçek partner API entegrasyonu
- [ ] Ev / Sağlık sigortası (Phase 2)
- [ ] Admin dashboard
- [ ] Multi-language (DE/TR/EN)
- [ ] PWA desteği

---

## Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## Lisans

MIT License. Detaylar için [LICENSE](./LICENSE) dosyasına bakın.

---

<div align="center">

Built with brutalism. No rounded corners were harmed.

</div>
