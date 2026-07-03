# Security Remediation Specs

> Source: manual audit triggered by `deepsec` scan (Jul 2026). deepsec's regex scan produced only false positives on high-signal slugs; the two real findings below came from manual investigation of the Convex mutation surface and CI workflows — areas deepsec's matchers did **not** cover. Specs are ordered by priority; implement P0 first.

---

## P0 — Premium self-grant via settings mass-assignment (CRITICAL)

**Status: ✅ FIXED (2026-07-03).** Three layers: (1) removed `hasPremium` from `updateArgsValidator` (server rejects the arg); (2) defense-in-depth `'hasPremium' in args` guard in the `settings.update` handler; (3) regression test `convex/settings/validators.security.test.ts` (8 assertions, green). **Self-review follow-up:** also removed `hasPremium` from the client-side `sanitizeSettingsPayload` allowlist (`src/lib/settings/sanitizeSettingsPayload.ts`) — it was still forwarding the field, which was inconsistent with the server and would have broken `updateSettingsWithFallback`'s retry path (the sanitized fallback payload would still carry the now-rejected field). Client allowlist and server args are now aligned. tsc clean; my test surface 32/32 green. Live prod check: 0 users had `hasPremium=true` — never exploited.

**Severity:** Critical — full paywall bypass, direct revenue loss, trivially exploitable by any authenticated user.

**Location:**

- `convex/settings/validators.ts:82` — `updateArgsValidator` declares `hasPremium: v.optional(v.boolean())`
- `convex/settings/settings.ts:63-81` — handler spreads `{ ...args }` into `normalizedArgs` and `ctx.db.patch(existing._id, normalizedArgs)` with no field strip
- `convex/subscriptions/premiumCheck.ts:29` — `hasPremiumAccess()` returns `settings?.hasPremium ?? false` (this is the entitlement source of truth)

**Exploit:**

```ts
// any signed-in user, from the client:
await convex.mutation(api.settings.update, { hasPremium: true });
// → userSettings.hasPremium = true
// → hasPremiumAccess() now returns true → all premium gates unlocked
```

The `settings.update` mutation authenticates the caller (SEC-001) but does not restrict _which_ fields they may write. Because `hasPremium` lives on the same `userSettings` doc the user legitimately edits, it is mass-assignable. The only legitimate writer is the RevenueCat webhook (`convex/subscriptions/helpers.ts:19`).

**Invariant violated:** `hasPremium` is webhook-only; never accept entitlement fields in a public mutation's args.

**Fix:**

1. Remove `hasPremium` from `updateArgsValidator` (`validators.ts:82`) so the public mutation cannot even receive it. Keep it in `settingsReturnValidator` (read shape) and in `schema.ts` (storage).
2. Defense-in-depth in the handler: after building `normalizedArgs`, delete any entitlement fields before write, e.g. drop `hasPremium` (and any future entitlement keys) from the object regardless of validator. A single `stripEntitlementFields(args)` helper keeps this enforced in one place.
3. Audit for sibling vectors: confirm no other public mutation accepts entitlement/role fields (grep `hasPremium|isPremium|entitlement|role|isAdmin` across `convex/**/*` mutation args). Current audit found only this one.

**Acceptance criteria:**

- `settings.update` rejects or ignores a client-supplied `hasPremium` — the field cannot be written from a public mutation.
- Calling `settings.update({ hasPremium: true })` leaves `userSettings.hasPremium` unchanged (still `false` for a free user).
- RevenueCat webhook path still sets `hasPremium` correctly (regression check on `subscriptions/helpers.ts`).
- `tsc` clean.

**Test / verification:**

- Add a Convex unit/integration test: authenticate as a free user, call `settings.update({ hasPremium: true })`, assert `hasPremiumAccess(ctx, userId) === false` afterward.
- Add a regression test asserting the webhook helper still flips it to `true`.
- Manual: sim-verify a free account cannot unlock a premium-gated action (e.g. archive beyond free limit) after calling the mutation.

**Effort:** S (≤1 hr). Isolated to two files + one test.

---

## P1 — Unpinned third-party GitHub Actions (supply-chain)

**Status: ✅ FIXED (2026-07-03).** Pinned all 3 to commit SHAs: `dependency-check/Dependency-Check_Action` → `75ba02d…600` (v1.1.0) in security.yml:159 + dependency-vulnerability-scan.yml:289; `snyk/actions/setup` → `9adf32b…c04` (v1.0.0) in dependency-vulnerability-scan.yml:208. Grep confirms no remaining `@main`/`@master` third-party refs.

**Severity:** Low–Medium — a compromised upstream tag executes arbitrary code in CI with repo/secret access. Higher irony/risk because these are the _security_ workflows.

**Location:**

- `.github/workflows/security.yml:159` — `dependency-check/Dependency-Check_Action@main`
- `.github/workflows/dependency-vulnerability-scan.yml:289` — `dependency-check/Dependency-Check_Action@main`
- `.github/workflows/dependency-vulnerability-scan.yml:208` — `snyk/actions/setup@master`

**Fix:** Pin each action to a full-length commit SHA (not a tag — tags are mutable). Add a trailing `# vX.Y.Z` comment for readability. Consider Dependabot `package-ecosystem: github-actions` to keep pins current.

**Acceptance criteria:**

- No `uses:` reference in `.github/workflows/**` resolves to `@main` / `@master` / a mutable tag for third-party (non-`actions/*`) actions.
- CI still passes on the pinned SHAs.

**Test / verification:** `grep -rnE 'uses:.*@(main|master)' .github/workflows/` returns nothing; trigger the two workflows and confirm green.

**Effort:** S (≤30 min). Look up current release SHAs, replace 3 refs.

---

## P2 — Harden the mutation surface + make the scanner usable (preventive)

**Status: ✅ mostly done (2026-07-03).** (1) Entitlement-write guard shipped — `convex/subscriptions/entitlementWriteGuard.test.ts` scans the Convex tree and fails if `hasPremium` is written via `ctx.db.patch/insert` anywhere except the webhook helper; verified it catches an injected violation and doesn't false-positive on read shapes/defaults/schema. (3) Ownership audit **complete and clean** — all 10 habit/strength write mutations enforce `habit.userId !== identity.subject`; all id-taking read queries (stats, tracking, strength) enforce the same; only 1 HTTP endpoint (the webhook), fully secured; Clerk `auth.config.ts` correct. (2) deepsec enablement remains documented below, not automated.

**Severity:** Preventive — no active vuln; closes the gap that let P0 exist and lets future scans actually run.

**Scope:**

1. **Entitlement-write lint/guard:** add a lightweight check (test or ESLint rule) that fails if any file under `convex/` outside the webhook/subscriptions module writes `hasPremium`. Makes the P0 class un-reintroducible.
2. **deepsec enablement:** the AI `process` step cannot authenticate inside a Claude Code session (SDK no-ops, 0 tokens; codex binary broken). To get real deepsec findings, provide `ANTHROPIC_API_KEY` or `AI_GATEWAY_API_KEY` in `.deepsec/.env.local`, or run `deepsec process --agent claude` from a plain terminal. Document in repo if the team will use it. (Note: deepsec's `missing-auth` matcher only scans client files — it will not catch server-side mass-assignment; do not rely on it for the Convex surface.)
3. **Ownership-check audit (stretch):** 27 public mutations, 52 auth checks, 0 missing auth — good. Spot-verify that mutations taking a document `id` arg (`habits/*`, `habitStrength/*`) also assert `doc.userId === identity.subject` before patch/delete, not just that the caller is authenticated. 17 files already do explicit `.userId` comparison; confirm the remaining `db.patch/delete`-by-id sites are covered.

**Acceptance criteria:**

- Guard/test rejects any new `hasPremium` write outside the webhook module.
- A documented, working path exists to run a full deepsec `process`.
- Every `db.patch/delete`-by-arg-id mutation has a verified ownership assertion.

**Effort:** M (half day, mostly the ownership audit).

---

## P3 — Hygiene items (surfaced during full-surface review)

Low severity; no active exploit. Batch when convenient.

1. **`seedTemplates` is a public `mutation`** (`convex/templates/seedMutations.ts`) while every sibling seed/curate/clear op is `internalMutation`. **PARTIALLY DONE (2026-07-03):** it is client-wired — the empty-state "load templates" button in `TemplatesScreen` (`useTemplatesData.ts:80` → `useSeedHandlers.ts:20` → `TemplatesEmptyState.tsx`). Full internalization would remove a user-facing button and there is no admin-role system to gate it, so instead of silently regressing UX it was **hardened in place**: inlined the auth check and added `enforceRateLimit(…, 'templates.seed')` (5/min) on top of the existing idempotent empty-catalog guard. This neutralizes the realistic abuse (spamming seed-job scheduling). Full internalization + empty-state UX rework remains a product decision.
2. **Thin rate-limit coverage.** **DONE (2026-07-03):** added `enforceRateLimit` to `settings.update` (60/min) and `habits/update` + `habits/updateNotes` (60/min — the `habit.update` key existed but was never wired), plus `templates.seed` above. New keys added to `convex/lib/rateLimit.ts`. Combined with the existing coverage (habit.create, habit.toggle, user.getOrCreate, user.updateProfileImage), the write-heavy public paths are now throttled.

## Dependency vulnerabilities (npm audit) — PARTIALLY DONE

`npm audit` reported 28 (1 critical, 8 high), nearly all transitive **dev/build** tooling (shell-quote, vite, tmp, ws-in-metro, form-data) with no app-facing surface; the one auth-relevant item, `@clerk/*` (authorization bypass), applies only when combining Clerk organizations/billing/reverification — **this app uses none**, so real impact is negligible. **DONE (2026-07-03):** ran `npm audit fix --legacy-peer-deps` (works around the pre-existing `eslint@10` peer conflict). Cleared 8 (28 → 20 remaining: 15 moderate, 5 high) with **no `package.json` change** — only transitive lockfile resolutions; top-level `react-native`/`expo`/`metro` versions unchanged, `npm ls` tree valid, `tsc` clean. Committed separately for easy revert. **⚠️ Needs a Metro/sim smoke-test before merge** — the lockfile churned ~310 transitive versions and native bundling can't be verified via tsc alone. The remaining 20 need `npm audit fix --force` (installs `@expo/cli@57`, a breaking major) — deliberately **not** applied; do that as a deliberate, build-verified upgrade.

**Acceptance criteria:** `seedTemplates` no longer callable from the public client API; rate limits applied to the high-frequency public mutations.

**Effort:** S.

---

## Surface coverage (audited clean — for the record)

The manual review swept the full Convex + CI surface, not just deepsec's candidates. Verified sound:

- **Auth:** all 27 public mutations perform an identity check.
- **Ownership / IDOR:** `getUser` enforces `clerkId === identity.subject`; profile-image and settings mutations patch only the caller's own looked-up record; `habits/*` mutations compare `.userId`; `userId`-arg functions (`generateWeeklyInsights`, `deleteTrackingChunk`) are `internalMutation` (scheduler-only).
- **Entitlement writes:** `grantPremium` / `revokePremium` / `setBillingIssue` are all `internalMutation` — reachable only from the verified webhook. (The P0 is the sole path that bypasses this.)
- **Webhook (`webhooks/revenuecat.ts`):** HMAC-SHA256 signature verified with timing-safe compare, returns 401 before any mutation; 400 (non-retryable) on malformed JSON; replay protection via required `event.id` dedup; timestamp validation.
- **Storage:** `generateUploadUrl` and `validateImageUpload` are authenticated; uploads are content-type/size validated and cleaned up on rejection.
- **Queries:** the only identity-unscoped queries return shared catalog data (`categories`, `templatesDataSeed`), not user data.
- **CI:** no `pull_request_target`; no `${{ github.event.* }}` interpolation inside `run:` blocks (no script-injection sink).
