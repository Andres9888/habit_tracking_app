# Security Review — ChainDay (Q3 2026)

**Date:** 2026-08-19
**Branch:** `cursor/q3-2026-security-review-998c`
**Scope:** Full application review of `main` (`a615498a5`)
**Stack:** Expo / React Native, Convex, Clerk, RevenueCat
**Related:** GitHub issue #1382 (quarterly audit), prior review `docs/security/SECURITY-REVIEW-2026-04-17.md`

This review is a code audit of the current tree. It is not a live Clerk / Convex / RevenueCat dashboard review, and it does not include a production binary or jailbreak assessment.

---

## Severity rubric

| Severity | Meaning |
|---|---|
| **Critical** | Reachable now, breaks auth / premium integrity / other users' data, or enables RCE. |
| **High** | Reachable and damaging but bounded (PII leftover, launch-blocking paywall bypass, third-party PII). |
| **Medium** | Hardening gap, or exploitable only under specific conditions. |
| **Low** | Best-practice miss with small blast radius. |
| **Info** | Confirmations, launch notes, residual dependency noise. |

---

## Executive summary

**Overall posture: GOOD, with launch-blocking gaps.** Authentication, ownership checks, webhook signing, premium self-grant hardening, Sentry PII minimization, and encrypted offline-queue storage from the April / July 2026 work are still in place. No new Critical finding.

The two issues that should be treated as **must-fix before App Store paywall cutover** (#1430) are:

1. **Account deletion leaves `habitDayNotes` in Convex** (High, GDPR). The table was added after the April review; `deleteCurrentUserData` never queries it. Per-habit delete paths already clean notes.
2. **Premium is not a server-side invariant** (High for launch). `PAYWALL_ENABLED` is `false`, `requirePremium()` is unused, and `habits.create` / `templates.importTemplate` have no free-tier or entitlement check. The only remaining server cap is unarchive. AuthGate also treats paywall `onClose` as entitlement once the flag is flipped.

A third High, already tracked as #1433: Convex wipe then `user?.delete()` can leave a live Clerk identity if the Clerk call is skipped or fails.

### Findings by severity

| Severity | Count |
|---|---|
| Critical | 0 |
| High | 3 |
| Medium | 4 |
| Low | 2 |
| Info | 6 |

---

## Findings

### SR-2026-08-19-01 — Account deletion does not erase `habitDayNotes`

- **Severity:** High
- **CWE:** CWE-212 (Improper Removal of Sensitive Information Before Storage or Transfer)
- **Location:** `convex/users.ts` (`deleteCurrentUserData`); `convex/schema.ts` `habitDayNotes`
- **Description:** Day notes (free-text, often personal) are a user-scoped table added after the April GDPR pass. `deleteCurrentUserData` deletes habits, tracking, settings, subscriptions, users, storage ownership, deleted-habits undo rows, template usage, and rate-limit rows. It never reads `habitDayNotes`. Single-habit `remove`, `deleteAllArchived`, and `deleteTrackingChunk` *do* delete notes, so the gap is specifically the account-wipe path.
- **Impact:** A user who taps “Delete account” can retain journal-like notes in Convex keyed by `userId` / `habitId` after the rest of the account is gone. That fails the in-app promise (“permanently delete … all your data”) and GDPR erasure for that content.
- **Recommendation:** Query `habitDayNotes` by `userId` (add `by_userId`) and delete those rows in the same mutation. Keep a source-scan test so a future table cannot be forgotten.
- **Remediation in this PR:** index + delete + regression test.

### SR-2026-08-19-02 — Clerk identity can survive Convex deletion

- **Severity:** High (operational / GDPR)
- **CWE:** CWE-706 (Use of Incorrectly Resolved Name or Reference)
- **Location:** `src/components/SettingsModal/useAccountDangerActions.ts`
- **Description:** Delete order is Convex `deleteCurrentUserData` then `user?.delete()`. Optional chaining means a missing `user` object skips Clerk deletion after Convex data is already gone. A Clerk failure after a successful Convex wipe leaves a live login with an empty backend (or, if retried later, a half-deleted Clerk user). Tracked as issue #1433.
- **Impact:** Account appears deleted in-app while the IdP record (email) remains. Sign-in can recreate a Convex user. Erasure is not atomic.
- **Recommendation:** Do not use `user?.delete()`. Fail closed if Clerk user is missing. Persist a “pending erasure” flag, or delete Clerk first only after a recoverable Convex tombstone. Document the support recovery path.

### SR-2026-08-19-03 — Premium model is client-shaped, not server-enforced

- **Severity:** High (launch / revenue integrity). Not currently charging (`FEATURE_FLAGS.PAYWALL_ENABLED === false`).
- **CWE:** CWE-602 (Client-Side Enforcement of Server-Side Security)
- **Location:**
  - `src/constants/featureFlags.ts` — paywall off
  - `src/components/auth/AuthGate.tsx` / `AuthGateContent.tsx` — `onClose` sets `paywallDismissed`
  - `convex/habits/create.ts`, `convex/templates/importTemplate.ts` — no entitlement / free-tier check
  - `convex/subscriptions/premiumCheck.ts` — `requirePremium()` is never called
  - Contrast: `convex/habits/archive.ts` `unarchive` and `batchUnarchive` still enforce `FREE_HABIT_LIMIT = 3`
- **Description:** Product comments say the free habit cap was replaced by an AuthGate paywall. That gate is a React screen. Any caller of the public Convex API (modified client, replayed JWT) can create or import unlimited habits. Unarchive is the only write path that still consults `hasPremiumAccess`. When the flag is enabled, closing the paywall (`dismissible` default true) still grants `screenKey === 'app'`.
- **Impact:** Before paywall cutover this is free product. After cutover it is a full entitlement bypass unless server gates land in the same release as `PAYWALL_ENABLED: true`.
- **Recommendation:** Before flipping the flag: (1) do not treat `onClose` as entitlement — only purchase/restore, and consider `dismissible={false}` for the hard gate; (2) call `requirePremium` or a shared free-tier helper on every habit-creating mutation (`create`, `importTemplate`, unarchive already); (3) keep webhook-only writes to `hasPremium` (already tested).

### SR-2026-08-19-04 — Template import bypasses the create rate limit

- **Severity:** Medium
- **CWE:** CWE-770
- **Location:** `convex/templates/importTemplate.ts`
- **Description:** `habits.create` is limited to 20 calls / 60s via `enforceRateLimit(..., 'habit.create')`. `importTemplate` inserts habits with no throttle. A stolen session can flood habit rows and `templateUsage` through the catalog.
- **Recommendation:** Apply `habit.create` (or a dedicated `templates.import` limit) before insert.
- **Remediation in this PR:** share the `habit.create` limiter.

### SR-2026-08-19-05 — In-app Privacy / Terms still hosted on personal GitHub Pages

- **Severity:** Medium
- **CWE:** CWE-1021
- **Location:** `src/constants/urls.ts` (`PRIVACY`, `TERMS`, `CHANGELOG`); contrast `app.json` `extra.privacyUrl` = `https://chainday.app/privacy`
- **Description:** April SR-07. Store metadata points at `chainday.app`; the signed-in Settings and auth legal footer still open `andres9888.github.io/chainday-landing/`. Compromise of that Pages site substitutes legal copy users tap from the app.
- **Recommendation:** Host Privacy, Terms, and Changelog on `chainday.app` and make `EXTERNAL_URLS` the single source of truth.

### SR-2026-08-19-06 — Duplicate public template APIs on `templatesDataSeed`

- **Severity:** Medium
- **CWE:** CWE-770
- **Location:** `convex/templatesDataSeed.ts` — public `list`, `getById`, `getPopular`, `getTemplateCount`, `listTemplateNames`
- **Description:** Canonical catalog reads live in `convex/templates/queries.ts` (indexed, documented SEC-PUBLIC). `templatesDataSeed.ts` still exports unauthenticated `list()` that `collect()`s the whole table without the `by_createdAt` index used in `queries.ts`. Seed mutations in this file are correctly `internalMutation`.
- **Impact:** Extra public surface and a cheaper full-scan path for unauthenticated clients. Catalog is non-PII, so this is availability / hygiene, not data leak.
- **Recommendation:** Stop exporting public queries from the seed module (keep internals only) so there is one catalog API.

### SR-2026-08-19-07 — Completion-status errors distinguish missing vs unauthorized habits

- **Severity:** Low
- **CWE:** CWE-203
- **Location:** `convex/tracking/getCompletionStatus.ts`
- **Description:** Returns “Habit not found” vs “Not authorized…”. `habits.get` returns `null` for both. Convex IDs are unguessable, so practical risk is low.
- **Recommendation:** Return `false` / `null` for both cases, matching `get`.

### SR-2026-08-19-08 — Science preview opens the raw `youtubeLink`

- **Severity:** Low
- **CWE:** CWE-601
- **Location:** `src/components/FullsizeTemplatePreview/components/ScienceVideoEmbed.tsx`
- **Description:** Thumbnail extraction validates a YouTube id, but `onPress` opens `template.youtubeLink` unchanged. Catalog rows are seeded internally today. A poisoned template URL (`javascript:`, non-YouTube https) would still be handed to `Linking.openURL`.
- **Recommendation:** If `extractYouTubeId` fails, render nothing; on press open `https://www.youtube.com/watch?v=${id}` only.
- **Remediation in this PR:** allowlisted watch URL.

---

## Prior findings — verification

| ID | Topic | Status on 2026-08-19 |
|---|---|---|
| SR-2026-04-17-01 | `next-mdx-remote` RCE | **N/A** — `website/` is no longer in this repo |
| SR-2026-04-17-02 | Sentry email | **FIXED** — `Sentry.setUser({ id })` only |
| SR-2026-04-17-03 | Offline queue plaintext | **FIXED** — `offlineStorage` → `sensitiveStorage` / SecureStore, with AsyncStorage migration |
| SR-2026-04-17-04 | npm audit | **Residual** — 8 High, all `image-size` via Metro/Expo; CI already treats as non-actionable (`scripts/ci/count-actionable-audits.mjs`). 0 Critical in `--omit=dev` |
| SR-2026-04-17-05 | Marketing security headers | **N/A** — website tree removed |
| SR-2026-04-17-06 | Narrow Sentry scrub | **FIXED** — `sentryScrub.ts` key + value redaction, extra/contexts/headers/messages |
| SR-2026-04-17-07 | GitHub Pages legal URLs | **OPEN** — see SR-2026-08-19-05 |
| SR-2026-04-17-08 | Convex `1.21.1-alpha.1` | **FIXED** — `convex@1.21.0` |
| SR-2026-04-17-09 | No rate limits | **MOSTLY FIXED** — limiter on create/toggle/settings/storage/seed/user; import remaining (SR-04) |
| SR-2026-04-17-10 | LLM keys in `.env.example` | **FIXED** — product vs Taskmaster split |
| SR-2026-04-17-11 | `READ_EXTERNAL_STORAGE` | **FIXED**; `CAMERA` + `RECORD_AUDIO` remain and match profile photo / voice-note features |
| P0 Jul 2026 | `settings.update` premium self-grant | **FIXED** — validator omission, handler guard, source-scan test |
| SEC-001 | Auth + ownership | **PASS** on habit/tracking/settings/analytics/storage/day-note paths sampled |
| SEC-002 | RevenueCat HMAC + replay | **PASS** — secret required, timing-safe compare, required `event.id`, stale timestamp skip, `internalMutation` only |
| SEC-003 | Input validation | **PASS** — create/update/settings/import/day notes |
| SEC-004 | Ownership before delete | **PASS** |
| SEC-005 | Premium + free-tier | **PARTIAL** — see SR-03 |
| SEC-PUBLIC | Catalog queries | **PASS** for `templates/queries.ts` + `categories.ts`; extra copies on seed module (SR-06) |

---

## What was checked

- Public Convex `query` / `mutation` / `httpAction` surface: auth, ownership, validators, rate limits.
- Schema vs `deleteCurrentUserData` (GDPR completeness), including `habitDayNotes`, `storageOwnership`, `rateLimits`.
- RevenueCat webhook: signature, replay, grant/revoke, `hasPremium` write guard.
- Settings mass-assignment, storage upload claim/validate/orphan sweep.
- Client: AuthGate / paywall flag, Clerk token cache (SecureStore), Sentry scrub, offline queue adapter, legal URLs, YouTube preview, Android permissions, `EXPO_PUBLIC_*` usage.
- `npm audit --omit=dev` on the lockfile (8 High, Metro/`image-size` only).
- CI: `.github/workflows/security.yml` (npm audit, CodeQL, Gitleaks, license). Third-party actions remain SHA-pinned.

## What was not checked

- Clerk / Convex / RevenueCat production dashboard configuration (issue #1428–#1429).
- Whether `REVENUECAT_WEBHOOK_SECRET` and `CLERK_AUTH_DOMAIN` are set on the live deployment.
- App Store / Play binary, certificate pinning, device jailbreak.
- Load / webhook flood beyond code-level limits.
- Full historical secret scan (Gitleaks runs in CI).

---

## Suggested next actions

1. Land the GDPR note-delete in this PR; verify on a staging Convex deployment.
2. Close #1433 with an atomic Clerk + Convex erasure design before production accounts accumulate.
3. Do not set `PAYWALL_ENABLED: true` until SR-03 server gates and AuthGate dismiss behavior are fixed (coordinate with #1430 / #1437).
4. Move Privacy / Terms / Changelog to `chainday.app` and update `EXTERNAL_URLS`.
5. Remove public query exports from `templatesDataSeed.ts`.
6. Keep relying on CI `count-actionable-audits.mjs` until Expo ships an `image-size` bump; do not `--force` Expo 53.

---

## Sign-off

**Auditor:** Cursor cloud agent (automated code review)
**Date:** 2026-08-19
**Verdict:** **REVIEW** — no Critical issues in reachable auth/IDOR; High GDPR leftover and launch-time premium bypass remain.
