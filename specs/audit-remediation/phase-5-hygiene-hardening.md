# Phase 5 — Repo Hygiene + Defense-in-Depth

Priority: LOW (do anytime; independent of all other phases). No runtime behavior change except validation tightening.

## 5.1 Remove committed debug artifacts (LOW, hygiene)

**Files:** `har.json` (~20MB HTTP archive), `tmp-*.png` (multiple), stray `${HOME}/` directory at repo root.

**Problem:** HAR captures full request/response headers and shouldn't be in git; tmp screenshots are review leftovers; `${HOME}/` is a bad-path artifact from an earlier command. The keys inside har.json are publishable (Clerk `pk_test`, RevenueCat `appl_`) — **not secrets** — so this is hygiene, not an exposure. (Rotating keys is optional, not required.)

**Fix:** `git rm --cached har.json tmp-*.png` and delete the `${HOME}/` directory; add `har.json`, `tmp-*.png` to `.gitignore`. Note: these are already in history — full history scrub (BFG) is optional and only worth it if you want the 20MB out of the pack.

## 5.2 Tighten input validators (MEDIUM, defense-in-depth — not independently verified)

**Files:** `convex/settings/validators.ts:52,99`; `convex/habits/types.ts` (daysOfWeek, tags)

**Problem:** `streakReminderTime` and `appIcon` accept unbounded arbitrary strings; `daysOfWeek` accepts any number (not 0-6); `tags` elements have no length cap. Handler-level validation exists for some fields but the validator layer is permissive (defense-in-depth gap, storage-abuse surface).

**Fix:** Add format + length constraints: `streakReminderTime` → HH:MM format check; `appIcon` → short identifier/enum; `daysOfWeek` → enforce 0-6 range; `tags` → per-element max length + array cap. Prefer the existing `lib/inputValidation.ts` helpers. **Verify each claim against current code first** — this phase's findings were not independently re-confirmed in the audit.

## 5.3 Sentry value-pattern redaction (MEDIUM, defense-in-depth — not independently verified)

**File:** `src/lib/sentry/init/sentryCallbacks.ts:21-36`

**Problem:** `beforeSend` redacts by key NAME only; secret-shaped values appearing in breadcrumb/request payloads pass through unredacted.

**Fix:** Add value-pattern scrubbing for common secret shapes (`sk-…`, `pk_…`, `Bearer …`, long hex/base64 tokens) in addition to key-name matching. Verify current redaction behavior before changing.

## Acceptance criteria

- [ ] `git ls-files` no longer lists `har.json` / `tmp-*.png`; `.gitignore` updated; `${HOME}/` removed.
- [ ] Validators reject out-of-range `daysOfWeek`, malformed `streakReminderTime`, oversized `tags`/`appIcon` (tests).
- [ ] Sentry `beforeSend` scrubs a planted secret-shaped value in a breadcrumb (test).
- [ ] `npm test` and `npm run lint` clean.
