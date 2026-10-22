---
layout: project
title: Klyo
date: 2025-10-06
description: A digital memory vault
live_url: https://app.myklyo.com
tags:
    - Full Stack
    - Web Application
    - Architecture
---

> *sent to last*

KLYO is a digital memory vault. People record audio "moments" (messages meant to be heard later), send them to people they love, and keep them in a personal vault that can be downloaded. Long-term storage is gated by a one-time vault purchase, and audio is encrypted in the browser before upload.

This summary covers the product, then the technical architecture, then the current status and open items.

---

## 1. Product
### 1.1 Problem

Voices are easy to lose. They sit in chat apps, phones and cloud accounts that change terms, get deleted or become unreadable. KLYO offers a vault that is simple to fill, visit and that the owner can export and keep.

### 1.2 Target users

- **Senders** who want to leave a message for a specific person to hear later, for example at a milestone or after they are gone.
- **Recipients** who want to receive and keep those messages without an account-management burden.
- **Vault owners** who want a durable, downloadable archive of what they have saved.

### 1.3 Core user flows

| Flow | What happens |
|---|---|
| **Sign up / log in** | Phone number, then a one-time code (OTP). Production uses Twilio Verify. Development uses a mock provider. |
| **Biometric recovery enrollment** | After first sign-in, users must enroll a face-based recovery key before they can enter the app. A face embedding is captured on-device and converted into a key. Recovery is later verified with a challenge. |
| **Create a moment** | The user records audio and adds a message and optional tags. Audio is encrypted on the device and uploaded to object storage through a pre-signed URL. |
| **Send a moment** | The moment is addressed to a recipient phone number. Moments can also be unattached. |
| **Claim a moment** | A recipient uses a claim token to bring a moment into their own vault. |
| **Timeline** | Vault owners browse moments and play them back. Listen counts are tracked. |
| **Buy a vault** | Users choose a one-time tier through Stripe Checkout (section 1.4). |
| **Export** | Owners can request a vault export manifest. A full download is not yet built (see section 4). |
| **WhatsApp capture** | A capture page explains saving moments from WhatsApp. The webhook is wired in the backend. |
| **Admin** | Operators manage a phone allowlist, gift vault access, and look up user activity statistics. |

### 1.4 Pricing and business model

Pricing is one-time, not subscription.

| Tier | Term | Price | Notes |
|---|---|---|---|
| **The Keep** | 5 years | $29 | Downloads remain with the user after access expires. |
| **The Archive** | 10 years | $49 | Same guarantee, longer term. |
| **The Legacy** | Lifetime | $99 | Never expires. Earlier purchases are credited toward it. |

The central promise in the spec is that content downloaded during an active term stays with the user after access expires. Expiry suspends access but does not delete downloaded files. Marketing is meant to lead with this guarantee to reduce anxiety about expiry.

Planned lifecycle messages, from the spec:

- Reminders at 90, 30 and 7 days before expiry. **Not found in the backend code yet.**
- Upgrade path from Keep or Archive to Legacy. **Partly implemented:** Legacy checkout creates a one-time Stripe coupon equal to what the user has already paid, with a $1 floor.
- Stripe-hosted receipts and an in-app purchase history.

### 1.5 Trust, privacy and compliance posture

- **On-device encryption.** Audio is encrypted in the browser (ECIES over P-256 with AES-256-GCM, HKDF-derived keys). The server stores ciphertext, and re-encrypt flows are supported.
- **Biometric data stays local.** Face processing runs in the browser with MediaPipe FaceMesh. Raw face images are not sent to the backend.
- **Published policies.** Privacy Policy and Terms of Service are in the frontend, issued by Nylon Threads, LLC, effective December 6, 2025.
- **Security headers.** The backend sets HSTS, a restrictive CSP, `X-Frame-Options: DENY`, `nosniff`, and a locked-down Permissions-Policy.

### 1.6 Product maturity

The core loop (sign up, enroll, record, send, claim, timeline, pay) is implemented. Several areas are partly built or only specified. See section 4.

---

## 2. Architecture

```
┌──────────────────────────┐        HTTPS/JSON        ┌────────────────────────────┐
│  Vue 3 SPA (Vite, TS)    │ ───────────────────────▶ │  Go + Gin API              │
│  - Pinia stores          │                          │  - Auth, moments, vault    │
│  - Vue Router guards     │ ◀── pre-signed URLs ──── │  - Admin, Stripe, WhatsApp │
│  - On-device crypto      │                          └──────┬──────────┬──────────┘
│  - MediaPipe FaceMesh    │                                 │          │
└──────────────────────────┘                    ┌────────────▼───┐  ┌───▼─────────────┐
           │                                    │ DB (SQLite /   │  │ Object storage  │
           ▼                                    │ Postgres)      │  │ (S3 / GCS via   │
   Static hosting: S3 + CloudFront,             └────────────────┘  │ Go CDK)         │
   deployed by GitHub Actions on push to main                       └─────────────────┘
```

### 2.1 Backend

- **Stack:** Go 1.24 with Gin. Swagger docs are generated with swaggo and served at `/swagger`.
- **Entrypoint:** `cmd/main.go` wires middleware, auth, handlers and routes. It listens on `PORT` (default 8080).
- **Layers:**
  - `internal/api/`: HTTP handlers for auth, moments, checkout, admin, WhatsApp, export and re-encryption.
  - `internal/auth/`: OTP service and SMS providers (Twilio Verify, or a mock).
  - `internal/middleware/`: auth, vault-access, admin, and CORS middleware.
  - `internal/database/`: a `Database` interface with SQLite, Postgres and Go CDK docstore implementations.
  - `internal/storage/`: object storage through Go CDK (S3-compatible and GCS).
  - `internal/shared/`: service initialization and shared helpers.
  - `internal/logging/`: zap-based structured logging.
- **Payments:** Stripe SDK v82. Checkout Sessions are created server-side. Each tier maps to a `STRIPE_PRICE_*` environment variable. A `checkout.session.completed` webhook handles post-payment processing.
- **Access control:** three tiers of routes.
  1. Public: auth begin, OTP, recovery challenge, webhooks.
  2. Authenticated: enrollment, profile, moment sending, checkout, vault status.
  3. Vault-protected: timeline, moment playback, listen counter, export manifest, download. These are guarded by `RequireVaultAccess`.
  Admin routes sit behind `RequireAdmin`, which reads an `is_admin` flag in the database. There is no UI for granting it, by design.
- **Core data tables:** `users`, `moments`, `sessions`, `otps`, `allowed_phone_numbers`, `recovery_enrollments`, `recovery_enrollment_versions`, `recovery_challenges`, `vault_purchases`.
- **Tests:** Go tests cover the SQLite database layer, the claim flow, and shared helpers.

### 2.2 Frontend

- **Stack:** Vue 3.5 with TypeScript, Vite 7, Vue Router 4, Pinia 3, Vitest 4, ESLint 9 and Prettier.
- **Routes:** `/timeline`, `/moments/create`, `/moments/:id/celebrate`, `/signup`, `/login`, `/logout`, `/recovery/face`, `/recovery/verify`, `/pricing`, `/vault/welcome`, `/whatsapp`, `/admin`. Content pages are rendered from Markdown.
- **Route guards:** protected routes require sign-in. Users who have not enrolled a recovery key are redirected to enrollment before reaching anything else.
- **Client modules:**
  - `lib/bioKey.ts` derives a P-256 key from the face embedding, using HKDF and PBKDF2 (210,000 iterations).
  - `lib/audioEncryption.ts` and `lib/recoveryCrypto.ts` handle the envelope encryption.
  - `lib/momentsClient.ts`, `lib/timelineClient.ts`, `lib/checkoutClient.ts`, `lib/adminClient.ts` and `lib/api.ts` are API clients.
  - `lib/audioCache.ts` caches decrypted audio.
- **Analytics:** PostHog, loaded in production only.
- **Packaging:** JSZip is a dependency, for packaging downloads on the client.

### 2.3 Delivery and operations

- **Frontend CI/CD.** A GitHub Actions workflow runs on push to `main`. It installs dependencies, runs the build, syncs `dist/` to S3 with long-lived cache headers, uploads `index.html` with no-cache headers, and invalidates CloudFront.
- **Backend hosting.** The README targets Railway, with a note that this may change.
- **Configuration.** Runtime behavior is driven by environment variables: Stripe keys and price IDs, Twilio, WhatsApp (Meta) tokens, S3 base URLs, `HOST`/`PORT`, and `KLYO_ENV`. When `KLYO_ENV=dev`, the mock SMS provider is used.

---

## 3. Key technical decisions

1. **Encrypt in the browser, store ciphertext on the server.** The server cannot read moment audio. This is the main trust claim, and it shapes the design of recovery and sharing.
2. **Recovery through the face, not a password.** A biometric-derived key lets users recover their vault without a password. The trade-off is that recovery depends on a face embedding and a challenge flow, so its failure modes need careful handling.
3. **One-time payments with server-side tier gating.** Access is checked on every vault route rather than cached in the client. Expiry is enforced server-side.
4. **Pluggable infrastructure.** Database and storage sit behind interfaces with multiple backends, which keeps local development cheap and production options open.

---

## 4. Status, gaps and open questions

| Area | Status |
|---|---|
| Auth (OTP, sessions, admin allowlist) | Built. Production SMS depends on Twilio configuration. |
| Biometric recovery | Built, with enrollment and challenge endpoints and encrypted versions. |
| Moments (request, upload, send, claim, playback) | Built, with re-encryption and an encryption-status flag. |
| Stripe checkout and webhook | Built. Tiers and Legacy loyalty credit are implemented. |
| Vault download | **Stub.** `GetVaultDownloadURL` returns a TODO. The planned per-user archive zip with a signed URL is not built. |
| Expiry emails and reminders | **Specified, not found in code.** |
| Upgrade path (Keep or Archive to Legacy) | **Partly implemented.** Legacy checkout applies a coupon for the prior payment. The spec's delta-charge logic should be checked against the code. |
| Purchase history page | Backend endpoint exists. The frontend page should be confirmed. |
| WhatsApp capture | Webhook and verification are wired. The end-to-end product flow should be confirmed. |

### Spec and code differences to resolve

- The payment spec assumes `user.email` for Stripe checkout. The User model stores only a phone number, so `customer_email` is omitted. Receipts depend on what Stripe collects.
- The spec's `prod_*` product IDs are placeholders. Live products and prices must be created in Stripe and configured through environment variables.

---

## 5. Stack at a glance

| Layer | Technology |
|---|---|
| Backend | Go 1.24, Gin, Swagger (swaggo), zap, Go CDK, Stripe SDK v82 |
| Data | SQLite (dev and tests), Postgres, MongoDB docstore option |
| Storage | S3-compatible and GCS (via Go CDK) |
| Frontend | Vue 3, TypeScript, Vite, Pinia, Vue Router, Vitest |
| Crypto | WebCrypto, `@noble/curves` (P-256), AES-256-GCM, HKDF, PBKDF2 |
| Vision | MediaPipe FaceMesh |
| Payments | Stripe Checkout (one-time payment mode) and webhooks |
| Messaging | Twilio Verify (SMS OTP), Meta WhatsApp Cloud API webhook |
| Analytics | PostHog |
| Hosting and CI | S3 + CloudFront, GitHub Actions, Railway (backend target) |
