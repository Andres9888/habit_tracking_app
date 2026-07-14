# Technology Choices

> These choices were made during API Discovery and inform the implementation plan.
>
> **Source of truth:** existing production stack in `package.json`, `ARCHITECTURE.md`, and product SPECs.
> User declined interactive re-selection; **incumbent stack confirmed by best judgment** (no greenfield rewrite).

## Selected Technologies

### Backend / Database: Convex
- **Why**: Already the full backend (schema, queries/mutations, crons, webhooks, file storage). Realtime fits habit tracking; TypeScript end-to-end.
- **SDK**: `convex` (`1.21.0`)
- **API Key / config**: `EXPO_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT` (dashboard deployment)
- **Key Features**: Reactive queries, serverless actions, HTTP routes, file storage, scheduled jobs
- **Docs**: https://docs.convex.dev

### Authentication: Clerk (+ Convex Auth JWT)
- **Why**: Specs and app already use `@clerk/clerk-expo` for email + Apple/Google SSO with Convex `auth.config.ts`. WorkOS would be a full re-auth rewrite for little consumer-app gain.
- **SDK**: `@clerk/clerk-expo`, `@convex-dev/auth`, `@auth/core`
- **API Key**: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_AUTH_DOMAIN` (Convex-side JWT issuer)
- **Key Features**: Custom native flows (`useSSO`), MFA support, session tokens for Convex
- **Docs**: https://clerk.com/docs

### Payments / IAP: RevenueCat
- **Why**: SPEC_revenuecat-integration and `react-native-purchases` already drive premium entitlements via webhook → Convex (`subscriptions` table). Native StoreKit alone would reintroduce receipt validation complexity.
- **SDK**: `react-native-purchases` (`9.7.1`)
- **API Key**: `EXPO_PUBLIC_REVENUECAT_IOS_KEY`, `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`, `REVENUECAT_WEBHOOK_SECRET` (server-only)
- **Key Features**: Cross-platform entitlements, webhooks, analytics, free tier until scale
- **Docs**: https://www.revenuecat.com/docs

### Error monitoring: Sentry
- **Why**: `@sentry/react-native` and `src/lib/sentry` already instrument crashes and error boundaries.
- **SDK**: `@sentry/react-native` (`~7.2.0`)
- **API Key**: `EXPO_PUBLIC_SENTRY_DSN`
- **Key Features**: Crash grouping, source maps, RN performance hooks
- **Docs**: https://docs.sentry.io/platforms/react-native/

### Push notifications: Expo Notifications
- **Why**: Habit reminders use `expo-notifications` + background task APIs already in the dependency tree. No campaign-scale push product requirement.
- **SDK**: `expo-notifications`, `expo-task-manager`, `expo-background-task`
- **API Key**: Expo project credentials / APNs & FCM via EAS (not a third-party push SaaS key)
- **Key Features**: Local + remote notifications, scheduling for reminders
- **Docs**: https://docs.expo.dev/versions/latest/sdk/notifications/

### File storage: Convex File Storage
- **Why**: Profile/media uploads already go through `convex/storage.ts` (+ validation). Keeps auth and files on one backend.
- **SDK**: Convex built-in storage (no extra package)
- **API Key**: Uses Convex deployment credentials (no separate storage key)
- **Key Features**: Auth-aware blobs, generates URLs for clients
- **Docs**: https://docs.convex.dev/file-storage

### Mobile runtime: Expo (React Native)
- **Why**: App is Expo SDK 54 / RN 0.81. Not optional for current shipping path.
- **SDK**: `expo` (`~54.0.34`), `react-native` (`0.81.5`)
- **API Key**: N/A (EAS project for builds)
- **Key Features**: iOS/Android/web, OTA updates (`expo-updates`)
- **Docs**: https://docs.expo.dev

## Alternatives considered (not selected)

| Category | Option 2 | Option 3 | Why not |
|----------|----------|----------|---------|
| Backend | Supabase | Firebase | Full rewrite of `convex/` |
| Auth | WorkOS | Auth0 | Migration cost; B2C already on Clerk |
| Payments | Adapty | Native StoreKit only | RC already webhook-synced to Convex |
| Errors | Bugsnag | Crashlytics | Sentry already wired |
| Push | OneSignal | FCM direct | Expo path sufficient for reminders |
| Storage | R2/S3 | Cloudinary | Extra vendor for profile images |

## Skipped (Not Needed for product)

- **AI / LLM**: No product feature requires chat/completions/embeddings. Task Master keys (`.env.taskmaster.example`) are **dev tooling only**, not runtime.
- **Transactional email SaaS (Resend, etc.)**: Auth emails handled by Clerk; no product marketing-email pipeline in SPECs.
- **Maps / weather / horoscope domain APIs**: Not in product scope.
- **Analytics SaaS (PostHog/Mixpanel)**: First-party analytics live in Convex modules (`analytics*.ts`); no third-party product analytics required by SPECs.

## Environment Variables Summary

Checked against local `.env.local` (values never written into this doc):

| Variable | Service | Status |
|----------|---------|--------|
| `EXPO_PUBLIC_CONVEX_URL` | Convex | ✅ Configured (local) |
| `CONVEX_DEPLOYMENT` | Convex CLI | ✅ Configured (local) |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk | ✅ Configured (local) |
| `CLERK_AUTH_DOMAIN` | Clerk → Convex JWT | ⏳ Pending local (use Convex dashboard in prod) |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | RevenueCat | ✅ Configured (local) |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | RevenueCat | ⏳ Pending local |
| `REVENUECAT_WEBHOOK_SECRET` | RevenueCat → Convex | ⏳ Pending local (**server-only** → Convex env) |
| `EXPO_PUBLIC_SENTRY_DSN` | Sentry | ⏳ Pending local |

### API key collection note

Interactive key paste was **skipped** (user declined AskUserQuestion). Existing `.env.local` and Convex dashboard remain the source of secrets. To add/update later:

```bash
# Client-visible vars → .env.local
# Server secrets → Convex dashboard or:
npx convex env set REVENUECAT_WEBHOOK_SECRET "…"
npx convex env set CLERK_AUTH_DOMAIN "https://….clerk.accounts.dev"
npx convex env list
```

## Discovery conclusion

No new third-party APIs are required for current workstreams (including Advanced Options / Strength Curve UI). Implementation plans should assume the **incumbent stack above**.

---API_DISCOVERY_COMPLETE---
