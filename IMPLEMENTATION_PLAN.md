# Implementation Plan

<!-- Release: Subscription, Auth, Reminder, and Observability Readiness -->
<!-- Audience: ChainDay users who want reliable sign-in, paid access, reminders, profile media, offline sync, and crash-safe habit tracking across native builds. -->

## END_RESULT

ChainDay keeps its existing Expo + Clerk + Convex + RevenueCat + Sentry stack, but the release closes the launch-critical gaps: signed-in users enter only after Convex auth is ready, paid access is enforced from verified subscription state, local reminders behave predictably through create/edit/archive/delete/restore flows, uploads remain user-owned, background sync is registered safely, and monitoring captures privacy-safe errors in native builds.

### Acceptance Criteria

- [ ] AC1: A signed-in Clerk user can open the native app, Convex queries wait for server-confirmed auth readiness, and switching/signing out clears user-scoped Convex and background-sync auth state per `specs/clerk-convex-auth.md`.
- [ ] AC2: Apple/Google OAuth sign-in reaches the authenticated habit list with the configured `habit-tracker://sso-callback` scheme, and auth failures produce recoverable UI states per `specs/clerk-expo-auth.md`.
- [ ] AC3: RevenueCat purchases and restores initialize only on supported native platforms, use the Clerk user ID as the RevenueCat app user ID, and the UI never treats client state as authoritative premium access per `specs/revenuecat-iap.md`.
- [ ] AC4: RevenueCat webhooks reject unsigned/stale/malformed payloads, dedupe retries, update Convex subscription state idempotently, and handle cancellation/expiration/refund/transfer cases according to `specs/revenuecat-iap.md`.
- [ ] AC5: Creating or editing a habit with reminders schedules one local reminder, tapping it opens the correct habit detail screen, and foreground notification behavior is initialized once per `specs/expo-notifications.md`.
- [ ] AC6: Archiving, deleting, restoring, and unarchiving habits cancel or reschedule reminders only after the related Convex mutation succeeds per `specs/expo-notifications.md`.
- [ ] AC7: Offline background sync registers through `expo-background-task`, flushes the queued mutation path when auth/network preconditions pass, and does not crash web/Expo Go per `specs/expo-notifications-background.md`.
- [ ] AC8: Profile image uploads use Convex File Storage with server-side ownership, validation, URL return only after authorization, and cleanup on delete/account deletion per `specs/convex-file-storage.md`.
- [ ] AC9: Sentry initializes lazily with privacy scrubbing, syncs only opaque user IDs, records handled errors/breadcrumbs, and has native-build source-map configuration documented per `specs/sentry-react-native.md`.
- [ ] AC10: Expo/EAS config remains compatible with SDK 54 native builds, required plugins are present, and release validation includes a dev-client/TestFlight path per `specs/expo-mobile-runtime.md`.

## Phase 1 - MVP Launch Guards

- [ ] Remove or quarantine stale `convex/auth.ts` `@convex-dev/auth` surface per `specs/clerk-convex-auth.md` [wave:1]
- [ ] Add `ConvexClerkProvider` tests for template token fetch, `setAuth` readiness, sign-out `clearAuth`, and background token provider cleanup per `specs/clerk-convex-auth.md` [wave:1]
- [ ] Tighten RevenueCat webhook signature verification to the active dashboard header/signing mode and keep raw-body verification per `specs/revenuecat-iap.md` [wave:1]
- [ ] Add startup notification handler initialization and route all permission prompts through channel-first permission helpers per `specs/expo-notifications.md` [wave:1]
- [ ] Add Sentry startup/init smoke tests for DSN-disabled behavior, privacy scrubbing, and user-context clearing per `specs/sentry-react-native.md` [wave:1]

## Phase 2 - Subscription Authority

- [ ] Make `subscriptions` the durable premium source for backend gates and keep `userSettings.hasPremium` derived UI state per `specs/revenuecat-iap.md` [wave:2]
- [ ] Handle RevenueCat `TRANSFER`, `REFUND`, and `REFUND_REVERSED` webhook events idempotently per `specs/revenuecat-iap.md` [wave:2]
- [ ] Add canonical subscriber-state reconciliation after webhook receipt or document the deferred API-secret requirement per `specs/revenuecat-iap.md` [needs:RevenueCat webhook signature verification]
- [ ] Add Convex tests for stale webhook ordering, cancellation without early revoke, expiration revoke, refund/transfer handling, and premium gate trust boundaries per `specs/revenuecat-iap.md` [needs:subscriptions source of truth]
- [ ] Add native purchase/restore validation checklist for dev-client or TestFlight and web fallback behavior per `specs/revenuecat-iap.md` [wave:2]

## Phase 3 - Reminder Reliability

- [ ] Persist scheduled notification identifiers or add an equivalent deterministic reconciliation strategy for habit reminders per `specs/expo-notifications.md` [wave:3]
- [ ] Move archive/delete reminder cancellation after successful Convex mutations across single, batch, and archived-habit flows per `specs/expo-notifications.md` [needs:reminder identifier strategy]
- [ ] Reschedule reminders on restore/unarchive when saved reminder settings are enabled per `specs/expo-notifications.md` [needs:reminder identifier strategy]
- [ ] Include habit deep-link data in scheduled reminder payloads and test notification-tap routing to habit detail per `specs/expo-notifications.md` [wave:3]
- [ ] Add notification utility and flow tests for schedule, cancel, permission options, channel-before-permission, archive, delete, restore, and unarchive behavior per `specs/expo-notifications.md` [needs:reminder identifier strategy]
- [ ] Extend background task coverage for registration status/error paths and queued flush preconditions per `specs/expo-notifications-background.md` [wave:3]

## Phase 4 - Storage, Monitoring, and Native Release Proof

- [ ] Audit profile-image upload and deletion flows against Convex storage ownership invariants per `specs/convex-file-storage.md` [wave:4]
- [ ] Add or update storage ownership tests for cross-user storage reuse, invalid metadata cleanup, no-op reattach, and account deletion cleanup per `specs/convex-file-storage.md` [needs:storage ownership audit]
- [ ] Verify Sentry native plugin, Metro config, release naming, source-map upload settings, and EAS secret requirements per `specs/sentry-react-native.md` [wave:4]
- [ ] Verify Expo SDK 54/EAS config for notifications, background task, RevenueCat native module, Clerk OAuth scheme, and Sentry plugin per `specs/expo-mobile-runtime.md` [wave:4]
- [ ] Run release readiness checks: `npx convex env list`, Convex typecheck/codegen, targeted Jest suites for auth/subscriptions/reminders/storage/Sentry, `npm run lint` or scoped typecheck, and a native dev-client/TestFlight smoke path per specs [needs:Phase 1 - MVP Launch Guards]

## Low Priority - Future Release

- [ ] Add Expo push-token registration and remote push server flow only if the product needs remote messaging per `specs/expo-notifications.md`.
- [ ] Add reminder reconciliation/prefetch work to the background task beyond offline queue flushing per `specs/expo-notifications-background.md`.
- [ ] Evaluate Clerk package-name migration from `@clerk/clerk-expo` to the newer documented package only after reading migration notes per `specs/clerk-expo-auth.md`.
- [ ] Evaluate RevenueCat SDK v10 upgrade separately from launch hardening per `specs/revenuecat-iap.md`.
- [ ] Evaluate Convex SDK upgrade from `1.21.0` only after changelog review per `specs/convex-backend-realtime.md`.
- [ ] Enable Sentry replay/profiling/logs only after privacy, quota, and store-label review per `specs/sentry-react-native.md`.

## Planning Notes

- `convexGuidelines.md` was requested but is not present in this checkout; planning used `ARCHITECTURE.md`, `specs/convex-backend-realtime.md`, and current Convex code instead.
- `.env.local` contains local Convex, Clerk, and iOS RevenueCat public configuration; `npx convex env list` confirmed `CLERK_AUTH_DOMAIN` exists server-side. Server output also included unrelated secret values, so they are intentionally not copied here.
- Current scope is inferred because `AUDIENCE_JTBD.md` still contains placeholders. The plan is limited to readiness gaps in the provided stack specs and treats Advanced Options / Strength Curve UI work as outside this release.
- Relevant tools/skills for implementation: use explorer subagents for independent auth/subscription/reminder audits, use XcodeBuildMCP for simulator/native proof when available, and use frontend design review only for user-facing paywall/auth/reminder UI changes.
