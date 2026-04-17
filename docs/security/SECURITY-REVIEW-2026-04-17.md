# Security Review — ChainDay

**Date:** 2026-04-17
**Branch:** `sec-audit-2026-04-17`
**Reviewer:** Claude (automated)
**Scope:** Backend (Convex), mobile client (Expo/React Native), Next.js marketing site, dependencies, infra/config
**Deliverable:** findings only — no code changes applied

---

## Severity rubric

| Severity | Meaning |
|---|---|
| **Critical** | Reachable in production, breaks auth / premium model / exposes other users' data, or enables RCE. Fix this week. |
| **High** | Reachable and damaging but bounded (e.g. single-user data exposure, PII leak to third party, device-local exposure). Fix this sprint. |
| **Medium** | Hardening gap, degrades defense-in-depth, or becomes exploitable only under specific conditions. Fix this quarter. |
| **Low** | Best-practice misses with minimal blast radius. Fix opportunistically. |
| **Info** | Observations, hardening suggestions, positive confirmations. No action required. |

---

## Executive summary

**Overall posture: GOOD.** The codebase shows clear evidence of a security-first culture. Prior audits landed under `SEC-001` … `SEC-005` tags; all remain in place. Auth (Clerk), webhook signing (HMAC-SHA256 timing-safe), input validation, ownership checks, free-tier gating, and GDPR-style account deletion are all implemented server-side and confirmed.

No **Critical** findings in this app's actually-reachable code paths. The one Critical advisory surfaced by `npm audit` (Clerk middleware bypass, CVSS 9.1) does **not** apply to this Expo app — the vulnerable code path is `clerkMiddleware` used in Next.js apps, which this mobile app does not use. It is still transitively pulled in via `@clerk/clerk-expo` and should be updated as hygiene.

Primary risks surfaced by this review, in priority order:

1. **`next-mdx-remote` RCE** (High) in the marketing site — the site *does* render MDX content, so exploitability depends on whether content sources are trusted.
2. **Sentry transmits user email** (High) — PII sent to third party without clear user-visible disclosure.
3. **Offline mutation queue stored unencrypted** (High) on-device in AsyncStorage.
4. **Missing security headers** (Medium) on marketing site (no CSP/HSTS/X-Frame-Options).
5. **Dependency vulnerabilities** (Medium aggregate) — 14 advisories on mobile (5 low / 2 moderate / 6 high / 1 critical) and 8 on website (3 moderate / 5 high); all have `npm audit fix` paths available.

### Findings by severity

| Severity | Count |
|---|---|
| Critical | 0 (1 dep advisory not reachable) |
| High | 3 + dependency rollup |
| Medium | 7 |
| Low | 3 |
| Info / Hardening | 6 |

---

## Findings

### SR-2026-04-17-01 — `next-mdx-remote` RCE via untrusted MDX
- **Severity:** High
- **CWE:** CWE-94 (Code Injection)
- **Location:** `website/package.json` → `next-mdx-remote@^5.0.0` (advisory `GHSA-g4xw-jxrg-5f6m`), consumed by `website/src/app/blog/[slug]/page.tsx` and `website/src/lib/blog.ts`
- **Description:** `next-mdx-remote` 4.3.0 – 5.0.0 is vulnerable to arbitrary code execution during SSR of untrusted MDX. The marketing site builds blog posts via an MDX pipeline.
- **Impact:** If the MDX source is ever attacker-influenced (authored outside the repo, pulled from an untrusted CMS, or if the Obsidian sync script at `website/scripts/sync-blog.sh` ever pulls from a compromised source), an attacker can execute arbitrary code in the Next.js server context at build or request time.
- **Reproduction / evidence:** `npm audit` in `website/` lists the advisory as High. Content path appears to be trusted (local Obsidian vault), which mitigates real-world risk — but the vulnerability is real.
- **Recommendation:** `cd website && npm audit fix --force` will upgrade to `next-mdx-remote@6.0.0` (breaking change — test MDX render output). Until then, treat the blog content pipeline as a high-trust boundary.

### SR-2026-04-17-02 — Sentry transmits user email as PII
- **Severity:** High
- **CWE:** CWE-359 (Exposure of Private Personal Information)
- **Location:** `src/lib/sentry/reporter/sentryReporter.ts:67-71`
- **Description:** `Sentry.setUser()` is called with `{ email, id, username }` on every authenticated session. Email is PII under GDPR/CCPA and is not required for error correlation — `id` alone is sufficient.
- **Impact:** Every error report sent to Sentry carries the user's email. A Sentry dashboard breach or insider access to the Sentry org would expose the full user email list. This may also conflict with the app's privacy policy if email transmission to Sentry is not disclosed.
- **Reproduction / evidence:** Lines 67-71:
  ```ts
  Sentry.setUser({ email: user.email, id: user.id, username: user.username });
  ```
- **Recommendation:** Drop `email` (and likely `username` if it's derived from email). Keep only `id`. If user-identifiable context is needed, use a scrubbed hash.

### SR-2026-04-17-03 — Offline mutation queue unencrypted on device
- **Severity:** High
- **CWE:** CWE-312 (Cleartext Storage of Sensitive Information)
- **Location:** `src/lib/offline/persistence/queueStorage.ts:57-67, 75-88`
- **Description:** Offline habit mutations are persisted to AsyncStorage in cleartext JSON. On Android, AsyncStorage is not encrypted by default. On iOS, the app container is protected at the OS level but still readable via physical-access attacks (e.g. via backups / jailbreak). Habit notes may contain sensitive personal content (cue descriptions, identity statements, why-I-want-this text).
- **Impact:** Device-local attackers with backup / filesystem access can read queued mutations, including habit notes and identity statements that the user has not yet synced.
- **Reproduction / evidence:** `transactionSafeWrite` and `saveQueueStateUnsafe` both write via `AsyncStorage.setItem` without encryption. Note that `src/utils/storage/sensitiveStorage.ts` already provides a secure-storage abstraction that's currently used for Clerk tokens.
- **Recommendation:** Route queue persistence through `sensitiveStorage` (or Expo SecureStore directly), chunking if necessary. Alternative: add an AES envelope using a key stored in SecureStore. *Scope check before fixing*: confirm queue payload sizes stay under SecureStore's iOS 2KB / Android 16KB limits, otherwise chunk.
- **Positive note:** Queue scope **is** correctly cleared on identity changes (`src/providers/OfflineProvider/Offline.provider.tsx:66, 83, 103, 117`) — no cross-user leakage on the same device.

### SR-2026-04-17-04 — Dependency vulnerabilities (aggregate)
- **Severity:** High (aggregate)
- **Location:** `package.json` (root), `website/package.json`
- **Description:** `npm audit` surfaces 14 advisories in root (5 low / 2 moderate / 6 high / 1 critical) and 8 in website (3 moderate / 5 high). Raw JSON archived at `docs/security/npm-audit-2026-04-17.json` and `docs/security/npm-audit-website-2026-04-17.json`.
- **Breakdown of Critical + High:**

  | Package | Severity | Scope | Notes |
  |---|---|---|---|
  | `@clerk/shared` (≤3.47.3) | **Critical (9.1)** | transitive via `@clerk/clerk-expo` | Advisory `GHSA-vqx2-fgx2-5wq9` is a Next.js `clerkMiddleware` bypass. **Not reachable in Expo mobile app** — no `clerkMiddleware` use. Update for hygiene. |
  | `vite` | High | dev only | Path traversal + dev-server WS file read. Affects local dev only. |
  | `picomatch` | High | transitive (build) | ReDoS + method injection. Dev / build tooling. |
  | `lodash` | High | transitive | `_.template` code injection + prototype pollution. Check if pulled into runtime bundle. |
  | `node-forge` | High | transitive | Cert-chain / Ed25519 signature issues. Check runtime reachability. |
  | `flatted` | High | transitive | Prototype pollution via `parse()`. |
  | `@xmldom/xmldom` | High | transitive | XML injection via CDATA. |
  | `next` (16.1.3) | High | website runtime | Multiple CSRF / DoS advisories. |
  | `next-mdx-remote` | High | website runtime | See SR-01. |
  | `yaml` | Moderate | transitive | Stack overflow via deep nesting. |
- **Recommendation:** Run `npm audit fix` in both root and `website/`. For advisories requiring `--force`, regress-test. Project already has `audit:deps` / `audit:security` scripts configured in `package.json` — wire these into CI if not already.

### SR-2026-04-17-05 — Marketing site missing security headers
- **Severity:** Medium
- **CWE:** CWE-693 (Protection Mechanism Failure)
- **Location:** `website/next.config.ts`
- **Description:** No `headers()` function. No CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, or Permissions-Policy set.
- **Impact:** Clickjacking (no X-Frame-Options), MIME sniffing (no X-Content-Type-Options), no HSTS (HTTPS downgrade window on first visit).
- **Recommendation:** Add a `headers()` returning at minimum:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - CSP — start in `Content-Security-Policy-Report-Only` mode.

### SR-2026-04-17-06 — Sentry breadcrumb redaction is too narrow
- **Severity:** Medium
- **CWE:** CWE-532 (Insertion of Sensitive Information into Log)
- **Location:** `src/lib/sentry/init/sentryCallbacks.ts:27-30`
- **Description:** The `beforeSend` breadcrumb filter only drops keys `['token', 'accessToken', 'refreshToken']`. Anything else (`authorization`, `apiKey`, `secret`, `password`, `email`, `clerkId`, `sessionId`, `cookie`) passes through.
- **Impact:** Any breadcrumb from third-party libs (e.g. Clerk, Convex, fetch interceptors) that adds auth-bearing keys will reach Sentry.
- **Recommendation:** Extend to a comprehensive blocklist (case-insensitive match on substrings): `token`, `secret`, `password`, `auth`, `cookie`, `session`, `credential`, `apikey`, `api_key`, `email`, `clerk_`. Also consider scrubbing from `event.extra`, `event.contexts`, and `event.request.headers` — currently only breadcrumbs are scrubbed.

### SR-2026-04-17-07 — Privacy & Terms hosted on `andres9888.github.io`
- **Severity:** Medium
- **CWE:** CWE-1021 (Improper Restriction of Rendered UI Layers)
- **Location:** `website/src/components/layout/Footer.tsx:11`
- **Description:** Privacy and Terms links point to `https://andres9888.github.io/chainday-landing/`. A compromised personal GitHub Pages site would let an attacker modify legal content users see when linked from the product.
- **Impact:** Reputation + regulatory risk (agreements rendered could be substituted). Also confusing for users unsure which URL is canonical.
- **Recommendation:** Move Privacy / Terms to the same origin as the product site (`website/src/app/privacy/` already exists; add `terms/`). Update footer links. Consider `chainday.app/privacy` and `chainday.app/terms`.

### SR-2026-04-17-08 — Convex pinned to alpha version in production
- **Severity:** Medium
- **CWE:** CWE-1104 (Use of Unmaintained Third-Party Components)
- **Location:** `package.json` → `"convex": "1.21.1-alpha.1"`
- **Description:** Convex is the entire backend and auth adapter. Running an alpha release in production means bearing pre-release stability + security risk.
- **Impact:** Any security fix released in stable may not be picked up; alpha may contain regressions never promoted to stable.
- **Recommendation:** Pin to the most recent stable minor line. If the alpha is required for a specific feature, document which feature and create a tracking issue to migrate off.

### SR-2026-04-17-09 — No explicit rate limiting in Convex functions
- **Severity:** Medium
- **CWE:** CWE-770 (Allocation of Resources Without Limits)
- **Location:** Across `convex/` — no per-function throttling. Relies entirely on Convex platform defaults.
- **Description:** `habits.create`, `tracking.toggle`, `users.getOrCreateUser`, webhook handler — all lack explicit rate limits.
- **Impact:** A stolen Clerk session could enumerate / spam habit creation, inflate template usage counts, or flood tracking writes. The RevenueCat webhook endpoint is public (signature-protected) but an attacker could still generate constant invalid-signature load.
- **Recommendation:** Add per-`userId` sliding-window limits on hot write paths. Convex doesn't ship rate-limiting primitives, but it's easy to implement with a dedicated `rateLimits` table indexed by `(userId, action)` with `windowStart` + `count`.

### SR-2026-04-17-10 — `LLM` API keys polluting `.env.example`
- **Severity:** Medium
- **CWE:** CWE-1188 (Insecure Default Initialization of Resource)
- **Location:** `.env.example` (ANTHROPIC_API_KEY, OPENAI_API_KEY, PERPLEXITY_API_KEY, GOOGLE_API_KEY, MISTRAL_API_KEY, XAI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY, AZURE_OPENAI_API_KEY, OLLAMA_API_KEY, GITHUB_API_KEY)
- **Description:** Eleven model-provider API keys are documented as if required, but no corresponding runtime code reads them. These appear to be Task Master / dev-tooling artifacts.
- **Impact:** Risk of a contributor pasting a real key into an `.env.local` for a key that isn't used in product code — creating a never-reviewed credential that can still be committed by accident. Also grows the surface of "which key means what."
- **Recommendation:** Split `.env.example` into `.env.example` (product-required: Clerk, Convex, RevenueCat, Sentry, `CLERK_AUTH_DOMAIN`, `REVENUECAT_WEBHOOK_SECRET`) and `.env.taskmaster.example` (dev tooling). Comment product-required as such.

### SR-2026-04-17-11 — Redundant Android permission
- **Severity:** Medium
- **CWE:** CWE-250 (Execution with Unnecessary Privileges)
- **Location:** `app.json:32-38` — `android.permission.READ_EXTERNAL_STORAGE`
- **Description:** On Android 10+ (API 29+), `READ_EXTERNAL_STORAGE` is superseded by `READ_MEDIA_IMAGES` (which is already declared). It remains only for Android 9 and below support. `expo-image-picker` manages the correct permissions automatically.
- **Impact:** Slightly broader declared surface than needed; Play Store reviewers increasingly scrutinize broad storage permissions.
- **Recommendation:** Remove unless pre-Android-10 support is an explicit requirement.

### SR-2026-04-17-12 — Analytics without consent flow (marketing site)
- **Severity:** Low
- **CWE:** CWE-359
- **Location:** `website/src/app/layout.tsx:3` — `@vercel/analytics` loaded unconditionally.
- **Description:** No consent banner or conditional loading. GDPR in strict jurisdictions expects explicit opt-in for tracking analytics.
- **Recommendation:** Either add a consent banner gating the `<Analytics />` mount, or confirm that Vercel Analytics' privacy-friendly mode (no cookies) satisfies the relevant jurisdiction.

### SR-2026-04-17-13 — Inconsistent `rel="noopener noreferrer"` on external links
- **Severity:** Low
- **CWE:** CWE-1022 (Use of Web Link to Untrusted Target with `window.opener` Access)
- **Location:** `website/src/components/layout/Footer.tsx`, `website/src/components/layout/Header.tsx` (external links without `rel`).
- **Description:** Blog post share uses `rel="noopener noreferrer"` correctly; marketing header/footer external links are inconsistent.
- **Recommendation:** Audit all `target="_blank"` links and add `rel="noopener noreferrer"`.

### SR-2026-04-17-14 — Hardcoded build paths in `sync-blog.sh`
- **Severity:** Low
- **CWE:** CWE-1188
- **Location:** `website/scripts/sync-blog.sh`
- **Description:** Absolute paths `/Users/andres/...` embedded in the script used by `prebuild`. Not a security issue by itself, but it means CI builds cannot run cleanly and therefore security audits / tests gated on builds won't run.
- **Recommendation:** Parameterize via env var with a safe default; gate the sync step behind `[ -d "$OBSIDIAN_BLOG" ]` so CI builds skip cleanly.

### SR-2026-04-17-15 — Info: webhook replay protection is solid
- **Severity:** Info (positive)
- **Location:** `convex/subscriptions.ts:71-74, 152, 200` and `convex/schema.ts:242`
- **Description:** `lastWebhookEventId` is persisted on the subscription record; every webhook-triggered mutation (`grantPremium`, `revokePremium`, `setBillingIssue`) early-returns if `args.eventId === existing.lastWebhookEventId`. Combined with the `isStaleWebhookTimestamp` check, replay attacks are defeated even if an attacker obtained a valid past signature.
- **Note:** The `eventId` field is declared `v.optional(v.string())`. A malicious caller could omit `eventId` to sidestep the event-id dedup — but they'd still be gated by the HMAC signature verification, which uses the full raw body. Consider tightening to `v.string()` (required) in a future hardening pass.

### SR-2026-04-17-16 — Info: input validation is comprehensive
- **Severity:** Info (positive)
- **Location:** `convex/lib/inputValidation.ts`, `convex/habits/validation.ts`
- **Description:** Central `containsDangerousPatterns()` covers the common XSS / injection patterns; every string-writing mutation (`habits/create`, `habits/update`, `settings/settings#update`, `templates/importTemplate`) funnels through `validateFields` or `validateHabitUpdateFields`. This was specifically verified on UPDATE paths during this review.

### SR-2026-04-17-17 — Info: GDPR delete is complete
- **Severity:** Info (positive)
- **Location:** `convex/users.ts:82-168`, `convex/schema.ts`
- **Description:** Every user-scoped table in the schema (`habits`, `tracking`, `userSettings`, `subscriptions`, `users`, `deletedHabits`, `templateUsage`) is explicitly deleted in `deleteCurrentUserData`. No orphan tables.

### SR-2026-04-17-18 — Info: clean secrets hygiene
- **Severity:** Info (positive)
- **Description:** No committed `.env*` with real values. `.gitignore` covers `.env`, `.env.local`, `.env.development.local`, `.env.test.local`, `.env.production.local`, `.env.mcp`, `.figma-token`, `figma-token.txt`. Project has `scan:secrets` (gitleaks) script wired. `ios/.xcode.env` is committed but contains only `export NODE_BINARY=$(command -v node)` — benign.

### SR-2026-04-17-19 — Info: path-traversal-like surface on blog slug handled by static generation
- **Severity:** Info
- **Location:** `website/src/lib/blog.ts`
- **Description:** `getPostBySlug` takes a slug and builds `path.join(BLOG_DIR, \`${slug}.md\`)`. Slugs come from filesystem enumeration, pre-generated via `generateStaticParams()`. Not exploitable under current design. If slug ever becomes user-supplied, validate against `/^[a-z0-9-]+$/`.

### SR-2026-04-17-20 — Info: strong security tooling already wired up
- **Severity:** Info (positive)
- **Location:** `package.json` scripts block
- **Description:** Project ships `audit:deps`, `audit:deps:fix`, `audit:deps:report`, `audit:licenses`, `audit:outdated`, `scan:secrets`, `scan:secrets:history`, `audit:security`, `test:security`, `test:security:fast`. This is above average. Recommendation: gate deploys on `audit:security` in CI.

---

## Prior `SEC-###` verification

All prior security tags were located and verified against current code. Every one is still enforced.

| Tag | Coverage | Verification status |
|---|---|---|
| **SEC-001** — Auth + ownership | `auth.config.ts`, all habit queries/mutations, `settings.ts`, `analytics*.ts`, `users.ts` | **PASS** — every public function calls `ctx.auth.getUserIdentity()` and filters by `identity.subject` on reads, verifies `record.userId === identity.subject` on writes. |
| **SEC-002** — RevenueCat webhook signing + server-side premium | `webhooks/revenuecat.ts`, `webhooks/revenuecatSignature.ts`, `subscriptions/premiumCheck.ts`, `router.ts` | **PASS** — HMAC-SHA256 verified *before* DB work; timing-safe compare; raw body (not parsed JSON) used for HMAC; replay defeated by `lastWebhookEventId` + `isStaleWebhookTimestamp`. Webhook aborts if `REVENUECAT_WEBHOOK_SECRET` is unset. |
| **SEC-003** — Input validation | `lib/inputValidation.ts`, `habits/validation.ts`, invoked in `habits/create.ts`, `habits/update.ts`, `settings/settings.ts`, `templates/importTemplate.ts` | **PASS** — dangerous-pattern denylist, per-field length caps, URL allowlist for storage domains, timestamp range validation. |
| **SEC-004** — Ownership check before delete | `habits/remove.ts:58, 69`, `habits/archive.ts` | **PASS** — delete-before-own checked. |
| **SEC-005** — Premium gating + free-tier limits | `habits/create.ts`, `habits/batchArchive.ts`, `habits/archive.ts`, `templates/importTemplate.ts`, `subscriptions/premiumCheck.ts`, `schema.ts:220` | **PASS** — free-tier cap enforced on every habit-creating surface (direct create, unarchive, template import). No bypass via reorder / restore. |
| **SEC-PUBLIC** — intentionally public endpoints | `categories.ts`, `templates/queries.ts` | **PASS** — return only template-catalog data, no per-user counts or PII. Aggregate template popularity numbers are not user-linkable. |

---

## What was checked

- All files under `convex/` (auth, habits, tracking, settings, templates, categories, users, webhooks, subscriptions, analytics, crons, router, schema, inputValidation).
- All files under `src/` touching: secure storage, Sentry integration, offline sync, auth providers, form validation, deep linking, WebView usage, EXPO_PUBLIC env vars, feature gating.
- `website/` Next.js app: next.config, middleware, blog pipeline, layout/header/footer, legal pages, package.json.
- Dependency advisories: `npm audit` in both root and `website/` with JSON output archived.
- Infra / config: `app.json`, `eas.json`, `.env.example`, `.gitignore`, `ios/.xcode.env`, committed env file inventory.
- Prior SEC-### tag locations and enforcement.

## What was NOT checked

- Clerk platform internals / Clerk dashboard configuration.
- Convex platform security (rate limits, DDoS protection, tenant isolation).
- RevenueCat platform internals.
- iOS / Android OS sandbox weaknesses.
- TLS / certificate pinning (none configured; relies on OS trust store).
- Supply chain beyond `npm audit` (e.g. typosquatting analysis of every transitive dep).
- Social-engineering / Clerk account recovery flows.
- Load testing; DoS resilience beyond visible code-level rate limiting.
- Published App Store / Play Store binary integrity.
- CI/CD pipeline configuration, branch protection, required reviews, signing setup (`eas.json` inspected only).

## Suggested next actions (in priority order)

1. **Fix SR-02** (remove Sentry email) — one-line change, removes a PII exposure to a third party.
2. **Fix SR-06** (expand Sentry breadcrumb redaction) — complements SR-02.
3. **Run `npm audit fix`** in root and `website/` (SR-04). Then `npm audit fix --force` for the remainder; regression-test the MDX blog render (SR-01).
4. **Add security headers to `website/next.config.ts`** (SR-05) — ~20 lines.
5. **Encrypt offline queue** (SR-03) — modest rework of `queueStorage.ts` to route through `sensitiveStorage`.
6. **Move privacy/terms in-domain** (SR-07) — add `website/src/app/terms/page.tsx`, update footer.
7. **Pin Convex to stable** (SR-08) — or document the feature blocking the upgrade.
8. **Add basic rate limiting** to hot Convex mutations (SR-09).
9. **Split `.env.example`** (SR-10) and tidy Android permissions (SR-11).
