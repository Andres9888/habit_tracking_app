# Clerk Authentication With Convex

## Overview

Use Clerk as the user-facing identity provider and Convex's Clerk JWT validation as the backend authorization boundary.

Recommended path for this app:

1. Keep Clerk for Expo sign-in and session management.
2. Configure Clerk's Convex JWT integration with `applicationID: "convex"`.
3. Send Clerk's Convex JWT to `ConvexReactClient.setAuth`.
4. Enforce ownership in Convex functions with `ctx.auth.getUserIdentity()`.

This matches the current app shape: Expo SDK 54, Convex backend, existing `convex/auth.config.ts`, existing `src/providers/ConvexClerk.provider.tsx`, and existing Clerk session usage.

## Selection Rationale

| Option | Fit | Current signal | Decision |
| --- | --- | --- | --- |
| Clerk Expo SDK + Convex Clerk JWT | Best fit for this repo. Clerk handles native/web auth UI and OAuth, Convex validates Clerk JWTs directly. | Clerk Expo docs were updated July 13, 2026. Convex Clerk docs document `auth.config.ts`, `ConvexProviderWithClerk`, and `ctx.auth.getUserIdentity()`. | Choose this. |
| `@convex-dev/auth` | Good if the product wants auth implemented inside Convex without Clerk/Auth0. | Convex Auth docs say the library is beta. Current npm latest checked July 14, 2026: `@convex-dev/auth@0.0.94`, modified June 9, 2026. | Do not switch now. It would replace, not complement, the existing Clerk stack. |
| Auth0 / `react-native-auth0` | Mature general-purpose IdP, but heavier and less directly wired to this repo's current Clerk code. | Auth0 pricing page lists free up to 25,000 MAU and paid plans from $35/month for Essentials. Current npm latest checked July 14, 2026: `react-native-auth0@5.9.0`, modified July 14, 2026. | Do not switch unless enterprise Auth0 requirements appear. |

Important package-name finding: Clerk Core 3 renamed `@clerk/clerk-expo` to `@clerk/expo`. This repo completed that package-name migration after checking Clerk's Core 3 upgrade notes, including the Expo SDK 53+ requirement, removed direct `Clerk` export, and moved optional Apple/Google hooks.

## Installation

Current repo dependencies already include:

```json
{
  "@clerk/expo": "^3.7.5",
  "convex": "1.21.0",
  "expo-secure-store": "^15.0.7",
  "expo-web-browser": "~15.0.11"
}
```

Current docs for new Expo projects show:

```sh
npx expo install @clerk/expo expo-secure-store
```

For native Clerk components, docs show:

```sh
npx expo install @clerk/expo expo-secure-store expo-dev-client
```

This app should avoid introducing native Clerk components unless it intentionally adopts a development build flow. Browser-based `useSSO()` works for web and native apps and is the safer continuation for the existing custom UI.

## Configuration

### Environment Variables

| Variable | Where | Required | Notes |
| --- | --- | --- | --- |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Expo client | Yes | Clerk publishable key. Safe to expose. Current app reads it in `src/lib/appConfig/clerk.ts`. |
| `EXPO_PUBLIC_CONVEX_URL` | Expo client | Yes | Convex deployment URL used to create the Convex client. |
| `CLERK_AUTH_DOMAIN` | Convex env | Yes in current repo | Current `convex/auth.config.ts` reads this. It should be the Clerk issuer/frontend API domain, for example `https://verb-noun-00.clerk.accounts.dev` in development or `https://clerk.your-domain.com` in production. |
| `CLERK_JWT_ISSUER_DOMAIN` | Convex env | Alternative naming from Convex docs | Convex docs use this name in examples. Pick one name and keep it consistent. |
| `CLERK_SECRET_KEY` | Server-side only | Not needed for Convex JWT validation | Needed only for Clerk Backend API calls or webhooks. Never expose in Expo. |
| Google OAuth client IDs | Expo/app config + Clerk dashboard | Required only for native Google sign-in | Clerk's native component docs require iOS, Android, and Web client IDs when native OAuth is enabled. |
| Apple Team ID / Bundle ID | Apple + Clerk dashboard | Required for Apple Sign-In | Apple sign-in requires matching app identifiers and Clerk social connection setup. |

### Clerk Provider

Current Clerk docs show `tokenCache` from `@clerk/expo/token-cache` so Expo sessions persist securely with `expo-secure-store`.

```tsx
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {children}
    </ClerkProvider>
  );
}
```

Repo note: imports now use `@clerk/expo` after the Core 3 package-name migration.

### Convex Auth Config

Convex validates Clerk JWTs with a provider config in `convex/auth.config.ts`.

```ts
import { AuthConfig } from 'convex/server';

export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: 'convex',
    },
  ],
} satisfies AuthConfig;
```

Current repo equivalent:

```ts
const authDomain = process.env.CLERK_AUTH_DOMAIN;

if (!authDomain) {
  throw new Error('CLERK_AUTH_DOMAIN environment variable is required.');
}

export default {
  providers: [
    {
      applicationID: 'convex',
      domain: authDomain,
    },
  ],
};
```

### Convex Client Init

For web, Convex documents `ConvexProviderWithClerk`:

```tsx
import { ClerkProvider, useAuth } from '@clerk/react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey="pk_test_...">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

For this Expo app, keep the current manual provider pattern because the app already uses `@clerk/expo` and a shared `ConvexReactClient`:

```tsx
import { useAuth } from '@clerk/expo';
import { ConvexProvider } from 'convex/react';
import { useEffect, useRef, useState } from 'react';
import { convexClient } from '../lib/appConfig';

export function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  const getTokenRef = useRef(getToken);
  const [isConvexReady, setIsConvexReady] = useState(false);

  getTokenRef.current = getToken;

  useEffect(() => {
    if (!convexClient) return;

    if (!isSignedIn) {
      convexClient.clearAuth();
      setIsConvexReady(false);
      return;
    }

    const fetchConvexToken = async () => {
      const token = await getTokenRef.current({ template: 'convex' });
      return token ?? null;
    };

    convexClient.setAuth(fetchConvexToken, (isAuthenticated) => {
      setIsConvexReady(isAuthenticated);
    });
  }, [isSignedIn]);

  if (!convexClient) return <>{children}</>;

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
```

## Key Patterns

### Sign In With Google Or Apple Using `useSSO`

Clerk's `useSSO()` returns `startSSOFlow()`. Supported strategy values include `oauth_<provider>`, such as `oauth_google` and `oauth_apple`.

```tsx
import { useSSO } from '@clerk/expo';
import * as WebBrowser from 'expo-web-browser';
import { useCallback } from 'react';

WebBrowser.maybeCompleteAuthSession();

type SocialStrategy = 'oauth_google' | 'oauth_apple';

export function useSocialSignIn() {
  const { startSSOFlow } = useSSO();

  return useCallback(
    async (strategy: SocialStrategy) => {
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy,
          redirectUrl: 'habit-tracker://sso-callback',
        });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        return;
      }

      if (signUp?.status === 'missing_requirements') {
        throw new Error(`Missing sign-up fields: ${signUp.missingFields.join(', ')}`);
      }

      if (signIn?.status && signIn.status !== 'complete') {
        throw new Error(`Sign-in incomplete: ${signIn.status}`);
      }
    },
    [startSSOFlow]
  );
}
```

### Gate Convex Queries On Convex Auth Readiness

Convex docs warn that Clerk's `useAuth()` alone does not prove Convex has received and validated the token. In web apps, prefer `useConvexAuth()` or Convex's auth helper components. In this app, keep using the provider's server-confirmed auth callback before rendering authenticated Convex query surfaces.

```tsx
import { useConvexAuth } from 'convex/react';

export function AuthenticatedContent() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return <HabitsApp />;
}
```

### Require Auth In Convex Functions

```ts
import { query } from './_generated/server';

export const currentUserScopedData = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error('Not authenticated');
    }

    return await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
  },
});
```

Use `identity.subject` as the stable Clerk user identifier unless an existing table already stores another verified Clerk ID. Do not trust client-supplied user IDs.

## API Reference

| API | Package | Purpose | Notes |
| --- | --- | --- | --- |
| `<ClerkProvider>` | `@clerk/expo` | Provides Clerk session/user context. | Pass `publishableKey`; current docs also pass `tokenCache`. |
| `tokenCache` | `@clerk/expo/token-cache` | Secure session persistence for Expo. | Requires `expo-secure-store`. |
| `useAuth()` | Clerk Expo SDK | Reads Clerk auth state and retrieves tokens with `getToken`. | For Convex readiness, do not use this alone. |
| `getToken({ template: 'convex' })` | Clerk Expo SDK | Fetches the Clerk JWT generated from the Convex JWT template. | Must match Clerk's Convex integration/template. |
| `useSSO()` | Clerk Expo SDK | Starts OAuth or enterprise SSO flows. | `startSSOFlow({ strategy: 'oauth_google' })`. |
| `ConvexReactClient.setAuth()` | `convex/react` | Supplies auth token fetcher to Convex client. | Use callback to know when Convex accepted auth. |
| `ConvexProviderWithClerk` | `convex/react-clerk` | Web-oriented Clerk/Convex provider integration. | Official docs show this for React web; this Expo app currently uses manual `setAuth`. |
| `useConvexAuth()` | `convex/react` | Reads Convex-authenticated state. | Prefer over Clerk-only auth state for authenticated Convex UI. |
| `<Authenticated>` / `<Unauthenticated>` / `<AuthLoading>` / `<AuthRefreshing>` | `convex/react` | Auth-aware rendering helpers. | Useful if the app moves to standard Convex auth wrappers. |
| `ctx.auth.getUserIdentity()` | Convex functions | Reads validated JWT identity. | Returns `null` when unauthenticated. |

## Gotchas

1. Package naming changed in Clerk Core 3. This repo now uses `@clerk/expo`; verify Core 3 breaking changes again before adopting new optional Clerk APIs.
2. Clerk auth loaded is not Convex auth ready. A query can run anonymously if rendered after Clerk signs in but before Convex validates the JWT. Use `useConvexAuth()`, Convex auth helper components, or the existing `setAuth` callback readiness gate.
3. The Clerk JWT issuer domain must match the Convex deployment config. Development and production Clerk domains differ.
4. The Clerk Convex JWT template/integration must use audience/application ID `convex`, matching `applicationID: 'convex'` in `convex/auth.config.ts`.
5. Never expose `CLERK_SECRET_KEY` in Expo. Expo `EXPO_PUBLIC_*` variables are public.
6. Native Clerk components and native Google/Apple sign-in require a development build. They do not run in Expo Go.
7. `useSSO()` browser-based OAuth can be used in web and native apps, but redirect schemes must match app config and provider dashboard settings.
8. Apple Sign-In has App Store policy implications. If third-party social login is offered on iOS, Apple Sign-In generally needs to be offered too unless an exception applies.
9. Convex authorization still needs app-level ownership checks. Auth proves identity; it does not automatically scope table rows.
10. `@convex-dev/auth` is beta and is an alternative auth system, not an add-on needed for Clerk JWT validation.

## Rate Limits

| Service | Current public pricing/limit signal checked July 14, 2026 | Practical impact |
| --- | --- | --- |
| Clerk Hobby | Free, up to 50,000 monthly retained users per app; 3 dashboard seats; fixed 7-day session lifetime; application logs with 1-day retention. | Likely enough for early production. Custom session lifetime, MFA, passkeys, user bans, allow/block lists, and removing Clerk branding are paid features. |
| Clerk Pro | $25/month monthly or $20/month billed annually; 50,000 MRUs included per app, then usage pricing. | Budget for Pro if MFA, passkeys, branding removal, or custom sessions matter. |
| Auth0 Free | Up to 25,000 monthly active users; includes unlimited social connections subject to system limitations. | Strong free tier, but integration work is higher for this repo than Clerk. |
| Auth0 Essentials | $35/month at the pricing selector's 500 MAU level. | Costs begin earlier for paid production features. |
| Convex Free/Starter | Free or $0/month plus pay-as-you-go; auth is listed among included features. Free/Starter resource table lists 1M function calls included and $2.20 per additional 1M. | Clerk JWT validation itself is not a separate Convex auth product charge; normal Convex usage applies. |
| Convex Professional | $25 per developer/month; resource table lists 25M function calls included and $2 per additional 1M. | Consider when deployment observability, backups, compliance reports, or higher included usage are needed. |

## Currency

| Item | Version / date checked | Source |
| --- | --- | --- |
| Clerk Expo docs | Last updated July 13, 2026; checked July 14, 2026 | https://clerk.com/docs/expo/getting-started/quickstart |
| Clerk `useSSO()` docs | Last updated July 13, 2026; checked July 14, 2026 | https://clerk.com/docs/reference/expo/native-hooks/use-sso |
| Clerk Expo SDK overview | Last updated July 13, 2026; checked July 14, 2026 | https://clerk.com/docs/reference/expo/overview |
| Convex Clerk docs | Checked July 14, 2026 | https://docs.convex.dev/auth/clerk |
| Convex Auth docs | Beta note checked July 14, 2026 | https://labs.convex.dev/auth |
| Clerk pricing | Checked July 14, 2026 | https://clerk.com/pricing |
| Convex pricing | Checked July 14, 2026 | https://www.convex.dev/pricing |
| Auth0 pricing | Checked July 14, 2026 | https://auth0.com/pricing |
| `@clerk/expo` npm | Latest `3.7.5`; checked with `npm view` using temp cache on July 14, 2026 | https://www.npmjs.com/package/@clerk/expo |
| Clerk Core 3 upgrade guide | Package rename and Expo-specific breaking changes checked July 14, 2026 | https://clerk.com/docs/guides/development/upgrading/upgrade-guides/core-3 |
| `@convex-dev/auth` npm | Latest `0.0.94`, modified June 9, 2026; checked with `npm view` using temp cache on July 14, 2026 | https://www.npmjs.com/package/@convex-dev/auth |
| `react-native-auth0` npm | Latest `5.9.0`, modified July 14, 2026; checked with `npm view` using temp cache on July 14, 2026 | https://www.npmjs.com/package/react-native-auth0 |
| Context7 | Clerk docs queried through `/clerk/clerk-docs` on July 14, 2026. | Local tool discovery |

## References

- Clerk Expo quickstart: https://clerk.com/docs/expo/getting-started/quickstart
- Clerk Expo SDK overview: https://clerk.com/docs/reference/expo/overview
- Clerk `useSSO()` reference: https://clerk.com/docs/reference/expo/native-hooks/use-sso
- Convex Clerk authentication: https://docs.convex.dev/auth/clerk
- Convex Auth beta docs: https://labs.convex.dev/auth
- Clerk pricing: https://clerk.com/pricing
- Convex pricing: https://www.convex.dev/pricing
- Auth0 pricing: https://auth0.com/pricing
- npm `@clerk/expo`: https://www.npmjs.com/package/@clerk/expo
- npm `@convex-dev/auth`: https://www.npmjs.com/package/@convex-dev/auth
- npm `react-native-auth0`: https://www.npmjs.com/package/react-native-auth0
