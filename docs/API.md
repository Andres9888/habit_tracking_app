# Convex API Reference

The backend is [Convex](https://convex.dev). All app data access goes through
typed functions in `convex/`, called from the client via `useQuery` /
`useMutation` with the generated `api` object (`convex/_generated/api`). There
is no REST layer except one webhook (below). ~62 public functions.

## Conventions (read before adding functions)

- **Auth:** every public mutation calls `ctx.auth.getUserIdentity()` and throws
  if unauthenticated. Identity comes from Clerk (`convex/auth.config.ts`).
- **Ownership:** mutations/queries that take a document id verify
  `doc.userId === identity.subject` before reading/writing. Never trust an id
  arg alone.
- **Entitlements:** `userSettings.hasPremium` is the premium source of truth and
  is **webhook-only** — never accept it (or any entitlement field) in a public
  mutation's args. Enforced by `convex/subscriptions/entitlementWriteGuard.test.ts`.
- **Rate limits:** hot write paths call `enforceRateLimit(ctx, userId, action)`
  (`convex/lib/rateLimit.ts`; keys in `RATE_LIMITS`).
- **Internal work:** background/seed/webhook logic is `internalMutation` /
  `internalQuery`, never public.

## Public surface by module

| Module              | Key functions                                                                                                                                       | Notes                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `habits/*`          | `create`, `update`, `updateNotes`, `remove`, `archive`, `pause`, `resume`, `reorder`, `toggle` (`toggleHabit`), `list`, `get`, `getById`, batch ops | all auth + ownership-checked                     |
| `tracking/*`        | `getTracking`, `getCompletionStatus`, `toggleHabit`                                                                                                 | per-user + date-scoped                           |
| `habitStrength/*`   | `getHabitStrengthInfo`, `getAllHabitsStrengthStats`, `updateStrength`, `updateParams`, `recalculate`                                                | momentum/decay model                             |
| `settings/settings` | `get`, `update`                                                                                                                                     | `update` rejects `hasPremium` (see Entitlements) |
| `subscriptions`     | `getCurrentUserSubscription`; `grantPremium`/`revokePremium`/`setBillingIssue` are **internal** (webhook only)                                      |                                                  |
| `users`             | `getOrCreateUser`, `currentUser`, `getUser`, `getByClerkId`, `updateProfileImage`                                                                   | ownership via `clerkId`                          |
| `templates/*`       | `list`, `getById`, `getPopular`, `importTemplate`, `seedTemplates`, usage stats                                                                     | catalog is shared/global                         |
| `storage`           | `generateUploadUrl`, `validateImageUpload`                                                                                                          | authed; image content/size validated             |
| `analytics*`        | `getAnalyticsDashboard`, `get30DayTrend`, `getWeeklyInsights`, `getComplianceData`                                                                  | user-scoped, ownership-checked                   |

## HTTP endpoints

Exactly one, defined in `convex/router.ts`:

- `POST /revenuecat-webhook` → `webhooks/revenuecat.ts`. Verifies an
  HMAC-SHA256 `X-RevenueCat-Signature` (timing-safe), rejects invalid (401) and
  malformed (400) before any write, dedups on `event.id` (replay protection),
  then routes to the internal grant/revoke mutations. This is the **only** path
  that may set premium entitlements.

## Generating types

`npm run lint` runs `convex codegen`; the typed `api` object and data model
types are emitted to `convex/_generated/`. Never edit `_generated` by hand.
