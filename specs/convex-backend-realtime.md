# Convex Backend and Realtime Data

## Overview

ChainDay should continue using Convex for backend data, realtime subscriptions, server functions, HTTP webhooks, scheduled work, and file storage.

This is not a greenfield choice. The app already has a `convex/` backend, Expo + React Native client code, Clerk JWT integration, RevenueCat webhooks, scheduled jobs, and Convex file storage patterns. Replacing it with Supabase or Firebase would mean rewriting the backend API surface, auth integration, realtime subscriptions, cron/workflow logic, storage ownership, and generated TypeScript types.

Checked date: 2026-07-14.

Context7 note: the requested Context7 tools (`mcp__context7__resolve-library-id` and `mcp__context7__query-docs`) were not exposed in this Codex session after tool discovery. The required query areas were covered directly from current official Convex docs instead:

- Convex React Native Expo setup
- Convex reactive queries, mutations, and actions
- Convex scheduled functions, crons, HTTP actions, and file storage

## Selection Rationale

Selected: Convex.

| Option | Fit for this app | Current pricing / limits signal | Breaking-change / currency signal | Decision |
| --- | --- | --- | --- | --- |
| Convex | Best fit. Built around reactive queries, TypeScript server functions, scheduled jobs, HTTP actions, and file storage. Already implemented in this repo. | Free/Starter includes reactive DB, file storage, text/vector search, crons, auth, Node.js actions, 1,000 concurrent sessions, 16 concurrent queries, 64 concurrent actions; Professional is $25/developer/month with 10,000 concurrent sessions, 256 concurrent queries, 512 concurrent actions. Usage pricing includes function calls, action compute, storage, I/O, and egress. | Convex 1.0 announced semantic versioning and wire-compatibility guarantees. Current npm `convex` latest checked via `npm view` is `1.42.1`, modified 2026-07-11. Repo currently pins `convex` `1.21.0`, so upgrades need changelog review. | Keep. |
| Supabase | Strong Postgres backend with auth, storage, realtime, edge functions. Better if relational SQL and direct Postgres access are the main requirement. Less direct fit for the current Convex function/query architecture. | Free includes unlimited API requests, 50,000 MAU, 500 MB database, 5 GB egress, 1 GB file storage, 2 active projects, and pauses after 1 week inactivity. Pro starts at $25/month. Realtime has its own quotas/limits. | Fast-moving platform. Migration would require schema/API/RLS/realtime rewrite and separate edge function patterns. | Do not switch. |
| Firebase | Mature Google BaaS with Firestore, Realtime Database, Auth, Storage, Functions, and broad ecosystem. Good for Google-centric teams. | Spark free tier and Blaze pay-as-you-go. Firestore quotas include free daily reads/writes/deletes plus detailed document, index, transaction, and request limits. Pricing is granular and can become read/write/listener driven. | Stable but proprietary and NoSQL-first. Rewriting Convex functions and TypeScript API contracts to Firestore/Functions is high cost. | Do not switch. |

Practical conclusion: Convex is the best current option for ChainDay because realtime data is a core product behavior, Convex already owns the backend surface, and its TypeScript function model maps directly to the existing Expo app. Supabase and Firebase are viable platforms, but neither offers enough benefit to justify a full backend rewrite.

## Installation

Current repo dependency:

```json
{
  "convex": "1.21.0"
}
```

Latest npm version checked on 2026-07-14:

```text
convex@1.42.1
time.modified: 2026-07-11T00:18:23.305Z
```

Install or update only after reviewing the Convex changelog from the currently pinned version to the target:

```bash
npm install convex
npx convex dev
```

For Expo/React Native, Convex's official quickstart uses:

```bash
npx create-expo-app my-app
cd my-app && npm install convex
npx convex dev
```

`npx convex dev` logs in, creates/selects a project, writes deployment URLs, creates the `convex/` folder if needed, and keeps syncing backend functions to the dev deployment.

## Configuration

### Environment Variables

Client-visible Expo variables:

| Variable | Required | Where | Notes |
| --- | --- | --- | --- |
| `EXPO_PUBLIC_CONVEX_URL` | Yes | `.env.local`, Expo runtime | Public Convex deployment URL, e.g. `https://<deployment>.convex.cloud`. Used by `ConvexReactClient`. |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes for signed-in app | `.env.local`, Expo runtime | Clerk publishable key. Public by design. |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | Yes for iOS subscriptions | `.env.local`, Expo runtime | Public RevenueCat SDK key. |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | Yes for Android subscriptions | `.env.local`, Expo runtime | Public RevenueCat SDK key. |
| `EXPO_PUBLIC_SENTRY_DSN` | Optional but expected | `.env.local`, Expo runtime | Public Sentry DSN. |

Server-side Convex environment variables:

| Variable | Required | Where | Notes |
| --- | --- | --- | --- |
| `CLERK_AUTH_DOMAIN` | Yes for Convex auth | Convex dashboard or `npx convex env set` | Used by `convex/auth.config.ts` to verify Clerk JWT issuer. Do not rely on Expo client env for backend auth config. |
| `REVENUECAT_WEBHOOK_SECRET` | Yes for RevenueCat webhooks | Convex dashboard or `npx convex env set` | Server-only shared secret. Never expose to client. |
| `CONVEX_DEPLOYMENT` | Local tooling | `.env.local` / Convex CLI | CLI deployment selector, not a client runtime API key. |

Example server env setup:

```bash
npx convex env set CLERK_AUTH_DOMAIN "https://your-domain.clerk.accounts.dev"
npx convex env set REVENUECAT_WEBHOOK_SECRET "your_webhook_secret"
npx convex env list --names-only
```

### Expo Client Init

Convex docs show React Native using the same React client library. In Expo, create one client outside render and wrap the app tree:

```tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <Stack />
    </ConvexProvider>
  );
}
```

If Clerk auth is active, keep using the repo's existing Clerk + Convex provider integration instead of replacing it with a bare `ConvexProvider`.

### Backend Schema

Use a Convex schema for habit data, user-scoped indexes, and bounded query access:

```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  habits: defineTable({
    userId: v.string(),
    name: v.string(),
    archivedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  habitCompletions: defineTable({
    userId: v.string(),
    habitId: v.id("habits"),
    date: v.string(),
    completedAt: v.number(),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_habit_date", ["habitId", "date"]),
});
```

## Key Patterns

### Reactive Query

Queries are deterministic reads. React `useQuery` subscribes to results and rerenders when underlying data changes.

```ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const listForDate = query({
  args: { userId: v.string(), date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("habitCompletions")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).eq("date", args.date),
      )
      .collect();
  },
});
```

```tsx
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function DayCompletions({
  userId,
  date,
}: {
  userId: string;
  date: string;
}) {
  const completions = useQuery(api.habits.listForDate, { userId, date });

  if (completions === undefined) return null;
  return completions.map((completion) => completion.date).join(", ");
}
```

Use `"skip"` for conditional queries so hooks stay unconditional:

```tsx
const result = useQuery(
  api.habits.listForDate,
  userId ? { userId, date } : "skip",
);
```

### Mutation

Mutations write data transactionally and can return IDs or structured results:

```ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createHabit = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("habits", {
      userId: args.userId,
      name: args.name,
      createdAt: args.now,
    });
  },
});
```

```tsx
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const createHabit = useMutation(api.habits.createHabit);

await createHabit({
  userId,
  name: "Walk 20 minutes",
  now: Date.now(),
});
```

### Action

Actions are for side effects and third-party APIs. They can call queries and mutations indirectly:

```ts
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

export const syncExternalReminder = action({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const habit = await ctx.runQuery(api.habits.getHabit, {
      habitId: args.habitId,
    });
    if (!habit) return { ok: false };

    await fetch("https://example.com/reminders", {
      method: "POST",
      body: JSON.stringify({ habitId: args.habitId, name: habit.name }),
    });

    return { ok: true };
  },
});
```

Do not call `fetch` from queries. Put external API calls in actions or HTTP actions.

### Scheduled Function

Use scheduled functions for one-off durable work, such as delayed reminder cleanup:

```ts
import { internal } from "./_generated/api";
import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";

export const archiveHabit = mutation({
  args: { habitId: v.id("habits"), archivedAt: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.habitId, { archivedAt: args.archivedAt });
    await ctx.scheduler.runAfter(5000, internal.habits.cleanupArchive, {
      habitId: args.habitId,
    });
  },
});

export const cleanupArchive = internalMutation({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit?.archivedAt) return;
    // Perform idempotent cleanup.
  },
});
```

Convex docs state a single function can schedule up to 1000 functions with total argument size of 8 MB.

### Cron Jobs

Define recurring jobs in `convex/crons.ts`:

```ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "recalculate stale habit strength",
  { hourUTC: 8, minuteUTC: 0 },
  internal.habits.recalculateStaleStrength,
);

crons.interval(
  "flush retry queue",
  { minutes: 5 },
  internal.sync.flushRetryQueue,
);

export default crons;
```

Cron syntax uses UTC. Prefer idempotent internal mutations/actions because jobs can be retried or overlap with user activity.

### HTTP Action

Use `convex/http.ts` for webhooks and public HTTP endpoints:

```ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/revenuecat-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const expected = process.env.REVENUECAT_WEBHOOK_SECRET;
    const actual = request.headers.get("authorization");
    if (!expected || actual !== `Bearer ${expected}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await request.json();
    await ctx.runMutation(api.subscriptions.handleRevenueCatWebhook, {
      payload,
    });

    return new Response("ok");
  }),
});

export default http;
```

HTTP actions are exposed at:

```text
https://<deployment-name>.convex.site
```

HTTP actions do not use Convex argument validation automatically; parse and validate the incoming `Request` yourself.

### File Storage

Use file IDs in tables, not raw URLs. Generate URLs only after an authorization check:

```ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateProfileUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getProfileImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    // Check app-level access before returning the URL.
    return await ctx.storage.getUrl(args.storageId);
  },
});
```

Important storage security behavior from Convex docs:

- `Id<"_storage">` values are safe to store and pass through Convex functions.
- URLs returned by `storage.getUrl()` are bearer URLs. Anyone with the URL can access the file.
- The only way to revoke a generated file URL is to delete the file.
- If access can change over time, use an HTTP action to check permissions before returning file bytes. Convex notes HTTP action responses are limited to 20 MB.

## API Reference

| API / file | Purpose | Use in ChainDay | Source |
| --- | --- | --- | --- |
| `ConvexReactClient` | Maintains client connection to Convex backend. | Initialize once with `EXPO_PUBLIC_CONVEX_URL`. | Convex React / React Native docs |
| `ConvexProvider` | Makes client available to React hooks. | Wrap app tree, or use existing Clerk-aware provider. | Convex React / React Native docs |
| `useQuery(api.module.fn, args)` | Reactive subscribed query. Returns `undefined` while initially loading. | Habit lists, completion state, settings, templates. | Convex React docs |
| `useQuery(..., "skip")` | Disables conditional query without conditional hooks. | Auth-gated or missing-param reads. | Convex React docs |
| `useMutation(api.module.fn)` | Calls transactional backend mutation. | Create/update/archive habits, toggle completions. | Convex React docs |
| `useAction(api.module.fn)` | Calls action with side effects. | Third-party sync, long-running server work. | Convex React / Actions docs |
| `query({ args, handler })` | Deterministic backend read. | Realtime app data. | Convex Queries docs |
| `mutation({ args, handler })` | Transactional backend write. | User data changes. | Convex Mutations docs |
| `action({ args, handler })` | Side-effectful backend function. | External APIs and non-deterministic work. | Convex Actions docs |
| `internalMutation` / `internalAction` | Backend-only function. | Scheduled cleanup, crons, private workflows. | Convex scheduling docs |
| `ctx.scheduler.runAfter(ms, fn, args)` | Schedule one-off future work. | Reminder cleanup, delayed maintenance. | Convex scheduled functions docs |
| `ctx.scheduler.runAt(timestamp, fn, args)` | Schedule at exact time/date. | Time-specific server workflows. | Convex scheduled functions docs |
| `convex/crons.ts` + `cronJobs()` | Recurring backend jobs. | Daily recalculation and retry queues. | Convex cron docs |
| `httpRouter()` / `httpAction()` | Public HTTP endpoints. | RevenueCat webhooks and integrations. | Convex HTTP actions docs |
| `ctx.storage.generateUploadUrl()` | Generate upload target for a file. | Profile/media uploads. | Convex file storage docs |
| `ctx.storage.getUrl(storageId)` | Generate accessible file URL. | Serve authorized media URLs. | Convex file storage docs |
| `ctx.storage.delete(storageId)` | Delete stored file. | Revoke file access and cleanup orphans. | Convex file storage docs |

## Gotchas

- Do not invent Convex APIs from memory. Check current docs before upgrading or adding new runtime patterns.
- The repo pins `convex@1.21.0`; latest checked is `1.42.1`. Review changelog entries before upgrading, especially CLI behavior, file storage deprecations, local deployment commands, and auth/client changes.
- Queries must be deterministic. Do not call third-party APIs from queries.
- `useQuery` returns `undefined` while loading. Treat `undefined` separately from empty arrays or `null`.
- Use `"skip"` for conditional queries instead of conditionally calling hooks.
- Keep query reads bounded with indexes, pagination, and date/user scopes. Realtime is only as cheap as the query it reruns.
- Mutations are transactions. Schedule follow-up work from mutations when the schedule must commit atomically with the write.
- Actions are not database transactions. If an action schedules work and later fails, scheduled work may still run. Make action workflows idempotent.
- Cron times are UTC. Do not encode local-time product behavior without explicit timezone handling.
- HTTP actions parse raw `Request` objects and do not get automatic Convex `args` validation. Validate body, method, headers, and webhook signatures/secrets.
- Convex file URLs are bearer URLs. Returning a URL is an authorization decision.
- Deleting a file is the revocation mechanism for file URLs. If users can lose access but the file must remain available to others, route file serving through a permission-checking HTTP action or use another storage component with expiring URLs.
- Expo client env vars prefixed with `EXPO_PUBLIC_` are public. Put webhook secrets and auth verifier config in Convex env, not client env.
- Generated files under `convex/_generated/` must be refreshed after backend API/schema changes.
- This repo has a history of Convex bundling sensitivity to stray emitted `.js` files beside `.ts` sources in `src/` or `convex/`. Keep TypeScript set to no emit and avoid committing generated JS artifacts outside intended build output.

## Rate Limits

Convex plan/resource limits checked 2026-07-14 from official pricing:

| Limit / resource | Free & Starter | Professional | Notes |
| --- | --- | --- | --- |
| Developers | 1-6 | 1-20 | Business/Enterprise supports 50+. |
| Deployment limit | 40 | 300 | Business/Enterprise unlimited. |
| Deployment class | S16 | S256 | Business/Enterprise custom. |
| Concurrent sessions | 1,000 | 10,000 | Business/Enterprise custom. |
| Concurrent queries | 16 | 256 | Business/Enterprise custom. |
| Concurrent actions | 64 | 512 | Business/Enterprise custom. |
| Function calls | 1M included, then $2.20/additional 1M | 25M included, then $2/additional 1M | Region multiplier may apply. |
| Action compute | 20 GB-hours included, then $0.33/additional GB-hour | 250 GB-hours included, then $0.30/additional GB-hour | Query/mutation compute listed as free on pricing page. |
| Database storage | 0.5 GB included, then $0.22/additional GB | 50 GB included, then $0.20/additional GB | Region multiplier may apply. |
| File storage | 1 GB included, then $0.033/additional GB | 100 GB included, then $0.03/additional GB | Region multiplier may apply. |
| Database I/O | 1 GB included, then $0.22/additional GB | 50 GB included, then $0.20/additional GB | Keep hot queries indexed and bounded. |
| Data egress | 1 GB included, then $0.132/additional GB | 50 GB included, then $0.12/additional GB | Realtime and file URLs can drive egress. |
| Scheduled functions per function call | Up to 1000 scheduled functions, 8 MB total argument size | Same documented function limit | From scheduled functions docs. |
| HTTP action response for permission-checked file serving | 20 MB | 20 MB | From file storage docs. |

Supabase comparison checked 2026-07-14:

- Free: unlimited API requests, 50,000 monthly active users, 500 MB database, shared CPU/500 MB RAM, 5 GB egress, 5 GB cached egress, 1 GB file storage, 2 active projects, paused after 1 week inactivity.
- Pro: starts at $25/month; first project included; additional projects from $10/month.
- Realtime has separate quotas and project limits.

Firebase comparison checked 2026-07-14:

- Firebase uses Spark free tier and Blaze pay-as-you-go.
- Firestore has granular daily free quotas and hard limits around document size, indexes, transaction time, request size, writes, and security rules evaluation.
- Billing risk is more directly tied to reads/writes/listeners than Convex's selected app-level backend model.

## Currency

| Item | Version / date | Checked date | Source |
| --- | --- | --- | --- |
| Local repo Convex package | `1.21.0` | 2026-07-14 | `package.json` |
| Latest npm Convex package | `1.42.1`, modified 2026-07-11T00:18:23.305Z | 2026-07-14 | `npm view convex version time.modified --json --cache /private/tmp/npm-cache-codex` |
| Convex 1.0 stability note | 1.0 announced 2023-07-21; semantic versioning and wire compatibility guarantees | 2026-07-14 | Convex News |
| Convex pricing and resource limits | Pricing page copyright 2026; current plan table read 2026-07-14 | 2026-07-14 | Convex pricing |
| Supabase pricing | Current pricing page read 2026-07-14 | 2026-07-14 | Supabase pricing |
| Firebase pricing / Firestore quotas | Current docs read 2026-07-14 | 2026-07-14 | Firebase pricing and Firestore quotas |
| Convex docs used instead of Context7 | Context7 tools unavailable in this session | 2026-07-14 | Official Convex docs |

## References

- Convex React Native docs: https://docs.convex.dev/client/react-native
- Convex React Native Quickstart: https://docs.convex.dev/quickstart/react-native
- Convex React client docs: https://docs.convex.dev/client/react
- Convex Queries docs: https://docs.convex.dev/functions/query-functions
- Convex Mutations docs: https://docs.convex.dev/functions/mutation-functions
- Convex Actions docs: https://docs.convex.dev/functions/actions
- Convex Scheduled Functions docs: https://docs.convex.dev/scheduling/scheduled-functions
- Convex Cron Jobs docs: https://docs.convex.dev/scheduling/cron-jobs
- Convex HTTP Actions docs: https://docs.convex.dev/functions/http-actions
- Convex File Storage docs: https://docs.convex.dev/file-storage/overview
- Convex Environment Variables docs: https://docs.convex.dev/production/environment-variables
- Convex pricing: https://www.convex.dev/pricing
- Convex JavaScript changelog: https://github.com/get-convex/convex-js/blob/main/CHANGELOG.md
- Convex 1.0 announcement: https://news.convex.dev/announcing-convex-1-0/
- Supabase pricing: https://supabase.com/pricing
- Supabase Realtime limits: https://supabase.com/docs/guides/realtime/limits
- Firebase pricing: https://firebase.google.com/pricing
- Firestore quotas and limits: https://firebase.google.com/docs/firestore/quotas
