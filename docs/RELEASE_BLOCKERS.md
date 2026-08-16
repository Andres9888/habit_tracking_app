# Release blockers — 16 Aug 2026

Snapshot of `main` at `19b0d8fe0` (after #1434 habit-bug sweep and #1435 splash / notification copy). This list is what actually blocks App Store submission today. Older checklists in this repo are partly stale; prefer this file until the next audit.

**Verdict: not ready to submit.** Production subscriptions, legal URLs, account deletion, and advertised premium claims are incomplete. Several in-app CTAs can already open a paywall.

---

## P0 — Apple will reject, or the binary cannot ship honestly

### 1. Production subscriptions are not set up (#1426–#1430)

All five `prod-launch` issues are still open and unchecked:

| Issue | What is missing |
| --- | --- |
| [#1426](https://github.com/Andres9888/habit_tracking_app/issues/1426) | Paid Apps Agreement, banking/tax, subscription group, monthly + annual products, sandbox tester |
| [#1427](https://github.com/Andres9888/habit_tracking_app/issues/1427) | Convex **production** deploy, prod env vars, template seed, `EXPO_PUBLIC_CONVEX_URL` |
| [#1428](https://github.com/Andres9888/habit_tracking_app/issues/1428) | Clerk **production** instance, Apple + Google Sign-In, live publishable key |
| [#1429](https://github.com/Andres9888/habit_tracking_app/issues/1429) | RevenueCat app, offerings, webhook → Convex, EAS `EXPO_PUBLIC_REVENUECAT_IOS_KEY` |
| [#1430](https://github.com/Andres9888/habit_tracking_app/issues/1430) | Client gating, flag flip, TestFlight build 17, device QA |

`eas.json` already has `ascAppId: 6758899638`. That only means the ASC record exists. Products are not “Ready to Submit.”

Home still has a **Start Free Trial** path (`handleUpgradeIntent` → `RevenueCatPaywall`) even though `FEATURE_FLAGS.PAYWALL_ENABLED` is `false`. A reviewer who taps it will hit an empty or broken IAP flow (Guideline 3.1.1 / 2.1).

### 2. Advertised premium is not true on `main`

`src/constants/featureFlags.ts`:

- `ONBOARDING_V2_ENABLED: false`
- `PAYWALL_ENABLED: false`

On current `main` (not #1437):

- Creating a habit **does not** enforce the 3-habit cap (`useHabitsAppHandlers` always opens create).
- Template `guardImport` is a no-op (`useImportFeedback.ts` always returns `false`).
- Convex seed has **zero** `isPremium: true` templates. Server `FREE_HABIT_LIMIT = 3` only blocks restoring archived habits.
- Analytics is built but not mounted from Settings (`SettingsModalSection` does not pass `onPremiumUpsell` or an analytics entry).
- Copy still promises “unlimited habits”, a 7-day trial, and “AI-powered insights” (`MonetizationHero`).

Draft [#1437](https://github.com/Andres9888/habit_tracking_app/pull/1437) implements the client gating from #1430. It is **not merged**; CI on that PR is red (TypeScript + tests). Flags stay `false` even in that PR.

### 3. Account deletion can destroy data without deleting the identity (#1433)

`useAccountDangerActions` runs Convex `deleteCurrentUserData` then `user.delete()` with no durable state. If Clerk fails after Convex succeeds, the person keeps a Clerk login and loses all app data. The UI only says “Failed to delete account.”

Guideline 5.1.1(v) requires working account deletion for apps that create accounts. This is both a rejection risk and a data-loss bug.

### 4. Canonical privacy / support URLs do not resolve

| URL | Status 16 Aug 2026 |
| --- | --- |
| `https://chainday.app/privacy` (`app.json` `extra.privacyUrl`) | **503** |
| `https://chainday.app/support` (`app.json` `extra.supportUrl`) | **503** |
| `https://chainday.app` | fetch timeout |
| `https://andres9888.github.io/chainday-landing/privacy.html` (in-app `EXTERNAL_URLS.PRIVACY`) | **200**, last updated 30 Jan 2026 |
| `https://andres9888.github.io/chainday-landing/terms.html` | **200** |

Apple requires a working privacy-policy URL in App Store Connect. Do not list `chainday.app/privacy` until it serves the policy.

The GitHub Pages policy **does not mention Sentry**, while `PrivacyInfo.xcprivacy` declares crash and performance data. That mismatch is H-004 from `docs/APPSTORE-01-pre-submission-fixes.md` and is still open.

### 5. Production Info.plist still looks like a dev client

`ios/ChainDay/Info.plist` / entitlements on `main`:

- `aps-environment` = **`development`** — production push will not work; EAS/Xcode must emit `production` for a store build.
- `NSAllowsLocalNetworking` = true, plus `NSLocalNetworkUsageDescription` and `_expo._tcp` Bonjour — Expo Dev Launcher leftovers. Reviewers ask why a habit app needs the local network.
- `NSFaceIDUsageDescription` is present, but app lock / `expo-local-authentication` was pulled (`convex/schema.ts` comment). Unused permission strings are a 5.1.1 rejection pattern.
- `LSMinimumSystemVersion` = 12.0 (Expo/RN current stack effectively needs a higher floor; confirm what the binary actually requires).

Splash and notification usage copy from #1435 are done. Those are no longer blockers.

### 6. App Store listing assets and review notes are missing

Still unchecked in `docs/App Store Submission Checklist.md` (and still true):

- Screenshots (6.7" / 6.5" at minimum; iPad if `supportsTablet: true`, which it is)
- App Store Connect metadata (subtitle, description, keywords, category, age rating, pricing)
- Demo / reviewer account documented in review notes
- TestFlight production build (current iOS `buildNumber` is **16**; #1430 wants **17** after cutover)

---

## P1 — Ship-blocking product bugs (merge + device-verify before review)

### 7. Home freeze after Habit Library add (#1423)

Open, `priority: high`. Root cause is a overlapping native-modal handoff (Library close + Habit Detail present).

[#1436](https://github.com/Andres9888/habit_tracking_app/pull/1436) implements close → `onHidden` → open. It is **not merged**. Device verification on a physical iPhone (10 consecutive runs) is still the remaining gate per the issue comment. Do not submit while Home can become untappable after add.

Related UX work (#1424 / #1425) is **not** a release blocker. Do not wait on it.

### 8. Onboarding persistence is in DEV/REVIEW mode

`useOnboardingV2State` ignores AsyncStorage on launch so every cold start shows Welcome. Fine while the flag is off; **must be reverted before** `ONBOARDING_V2_ENABLED: true`.

### 9. Three paywalls still exist

Live surfaces:

- `RevenueCatPaywall` (home upgrade, AuthGate when the flag is on)
- `PremiumPaywall` (Analytics)
- `PaywallSheet` (Habit Library)

Guideline 3.1.2 / 2.3.1: one purchase flow, claims that match entitlements. #1437 consolidates to RevenueCat only.

---

## P2 — Quality gates on `main` (do not treat as App Review, but they block merging)

Latest `main` push (`Merge pull request #1435`, run 16 Aug 2026):

| Workflow | Result | Actual cause |
| --- | --- | --- |
| Code Quality CI | fail | TypeScript + Test Suite |
| Security Scanning | fail | npm Audit |
| Performance Budget | pass | — |
| pages-build-deployment | fail | GitHub Pages for this repo |

TypeScript: ~25 errors, almost all `Property 'at' does not exist` (CI `lib` older than ES2022) plus `Namespace 'global.NodeJS' has no exported member 'Timeout'`. Runtime is fine; CI is not.

Tests: many suites fail on `main` (ProgressSection, CreateHabitModal, BinaryHeatmap, FullsizeTemplatePreview, HabitStrengthHistory, offline e2e, and others). Not a store-review item, but it hides regressions in gating PRs.

npm audit (`npm audit --omit=dev` locally): **14 high**, 0 critical. Packages are Expo / Metro / RN toolchain (`brace-expansion`, `image-size`, `js-yaml`, `nanoid`, `postcss`, `react-native`, …). Unlikely user-facing, but the Security Scanning workflow is red.

[#1382](https://github.com/Andres9888/habit_tracking_app/issues/1382) quarterly security audit is still open with empty scores. Not a store blocker unless it hides a real finding; close it after a real pass or mark it hygiene.

---

## Explicitly not blockers (stale checklist vs current `main`)

These show as open in older docs but are already done:

- Splash screen 2048×2048 and `NSUserNotificationsUsageDescription` — done in #1435
- Bundle ID `com.chainday.app` (iOS + Android) — already in `app.json`. `APPSTORE-01` still says `org.name.DailyHabits`; ignore that
- Privacy manifest (`PrivacyInfo.xcprivacy`) — present; crash data declared
- Restore purchases + dynamic `priceString` — implemented in the RevenueCat hook
- Sentry user PII — `sentryReporter.setUser` sends **id only** (SR-2026-04-17-02 fixed)
- File-length / decomposition work — not a submission requirement

---

## Suggested order

1. **Human / Apple / dashboards (cannot be done in this repo alone)**  
   Sign Paid Apps Agreement (#1426) → Convex prod (#1427) → Clerk prod + Sign in with Apple (#1428) → RevenueCat products + webhook (#1429).
2. **Legal URLs**  
   Host privacy + support on `chainday.app` (or change `app.json` + ASC to the GitHub Pages URLs). Add Sentry to the policy. Pick one canonical origin.
3. **Code on `main`**  
   Merge #1436 after device QA. Finish #1433. Land #1437 (or equivalent gating) only after products exist. Revert onboarding DEV/REVIEW. Strip unused Face ID / local-network plist keys from the **production** profile. Confirm `aps-environment` is `production` on the EAS store build.
4. **Flags**  
   Flip `PAYWALL_ENABLED` and `ONBOARDING_V2_ENABLED` only after 1–3. Never flip flags against sandbox-missing products.
5. **Listing**  
   Screenshots, metadata, reviewer account, TestFlight build 17, then submit.

**Absolute minimum for a paid-subscription 1.0:** working IAP + honest gating + live privacy URL + working account deletion + TestFlight smoke of sign-up → purchase → restore.

---

## Open issues / PRs this audit used

- Prod launch: #1426 #1427 #1428 #1429 #1430
- Bugs: #1423 (freeze), #1433 (deletion)
- PRs: #1436 (freeze fix, unmerged), #1437 (gating, unmerged, CI red)
- Do not block launch on: #1424 #1425 (library UX), Dependabot PRs, design mock PRs
