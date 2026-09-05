# habit_tracking_app

Copy of this file into `.deepsec/data/habit_tracking_app/INFO.md` before
`deepsec scan` / `deepsec process`. The `.deepsec/` workspace is gitignored
and gets wiped, so this is the durable copy.

## What this codebase does

ChainDay, a React Native / Expo habit tracker (iOS first, web export) with a
Convex backend and Clerk auth. Users create habits, toggle daily completions,
see strength/streak analytics, import habits from a server-seeded template
catalog, and buy one premium tier through RevenueCat.

## Auth shape

- Every Convex `query`/`mutation` calls `ctx.auth.getUserIdentity()` and
  compares `identity.subject` to the row's `userId` / `clerkId`. No shared
  `requireAuth` helper: the check is inline at the top of each handler.
- `hasPremiumAccess(ctx, userId)` in `convex/subscriptions/premiumCheck.ts`
  is the only premium check. `userSettings.hasPremium` is written only by the
  RevenueCat webhook path (`convex/subscriptions/helpers.ts`), never from a
  public mutation argument. `entitlementWriteGuard.test.ts` enforces this.
- `enforceRateLimit(ctx, userId, action)` in `convex/lib/rateLimit.ts` with
  the action allowlist `RATE_LIMITS`.
- HTTP surface is `convex/router.ts`: `/image-upload` (bearer JWT, streamed
  10 MB cap, magic-byte sniff, internal admission + commit mutations) and the
  RevenueCat webhook (`t=..,v1=..` HMAC over `ts.body`, 300 s skew, event-id
  replay table).
- Client tokens live in `expo-secure-store` via `src/lib/appConfig/tokenCache.ts`.

## Threat model

An attacker is an authenticated free user. What they want, in order: read or
mutate another user's habits/tracking (IDOR on `habitId`/`storageId` args),
self-grant premium (`hasPremium`), and abuse write mutations for cost or
quota (habit creation, uploads). Unauthenticated exposure is limited to the
public template catalog, which is intentionally readable.

## Project-specific patterns to flag

- A public `mutation`/`query` that takes an id argument and does not compare
  the loaded row's `userId` to `identity.subject`. Example of correct shape:
  `convex/habits/pause.ts`.
- Any write of `hasPremium` outside `convex/subscriptions/helpers.ts`.
- A mutation that inserts into `habits` without `enforceRateLimit(...,
  'habit.create')`. `convex/templates/importTemplate.ts` is the second
  creation path besides `convex/habits/create.ts`.
- Exported `mutation`/`query` with no caller in `src/`. Convex publishes every
  export, including barrel re-exports like `convex/habitStrength.ts`, so dead
  exports are public attack surface. `convex/publicSurface.security.test.ts`
  pins the ones that were moved to internal.
- `Linking.openURL` on a server-provided string. Route through
  `openExternalLink` / `isSafeExternalUrl` in `src/utils/openExternalLink.ts`.

## Known false-positives

- `insecure-crypto` fires on `description`/`desc` identifiers and on
  `Math.random` in UI animation code. None of it is cryptography.
- `EXPO_PUBLIC_*` keys (`clerk.ts`, `purchases/client.ts`) are publishable
  by design. `CONVEX_SITE_URL` is a Convex built-in.
- `figma-mcp-server.js`, `convex-mcp-server.js`, `scripts/performance/*` are
  local developer tooling, not shipped in the app bundle.
- `docs/api/assets/*.js`, `docs/design-refs/support.js`, `dist/`,
  `.superdesign/` are generated or reference artifacts.
- `.env.taskmaster.example`, `.env.example` hold placeholders only.
- `convex/imageUpload.ts` CORS `*` is intentional: the endpoint requires a
  bearer token, and the web build runs on a different origin than Convex.
- Public catalog reads (`templates.queries.list`, `categories.list`) need no
  auth on purpose.
