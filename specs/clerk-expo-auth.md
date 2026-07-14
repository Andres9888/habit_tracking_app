# Overview

Use Clerk's Expo SDK (`@clerk/clerk-expo`) as the native authentication layer for this Expo + Convex app. It supports email/password and email-code flows, native Apple/Google SSO, session persistence through `expo-secure-store`, Clerk hooks for session state, and first-party Convex JWT validation through `ConvexProviderWithClerk`.

Recommendation: keep Clerk. This repo already depends on `@clerk/clerk-expo`, `expo-secure-store`, and `convex`, and `convex/auth.config.ts` already validates Clerk-issued JWTs with `applicationID: "convex"`.

Context7 note: the requested Context7 tools (`resolve-library-id`, `query-docs`) are not exposed in this Codex session after tool discovery. Details below come from official Clerk, Convex, Auth0, WorkOS, npm registry, and this repo's checked-in files.

# Selection Rationale

| Candidate | Fit | Rationale |
| --- | --- | --- |
| Clerk (`@clerk/clerk-expo`) | Chosen | Best fit for native Expo auth plus Convex. Clerk's Expo quickstart documents `ClerkProvider`, `tokenCache`, `AuthView`, custom email/password flows, native Apple/Google setup, and `useSSO()`. Convex documents first-party `ConvexProviderWithClerk` support for React-based Clerk SDKs, including Expo. |
| Auth0 (`react-native-auth0`) | Not chosen | Strong general identity platform, but Expo setup is less aligned with this repo's existing Clerk dependency and Convex Clerk config. Pricing is less favorable for this app's current shape: Auth0 Free lists up to 25,000 MAU; Clerk pricing currently lists 50,000 included MRUs per app. |
| WorkOS | Not chosen | Excellent B2B identity platform, but the current public npm surface is server/web oriented (`@workos-inc/node` was current; no official `@workos-inc/authkit-react-native` package was found in npm). It adds avoidable integration work for a consumer habit app needing native mobile auth. |

Current package checks on 2026-07-14:

| Package | Current npm result | Notes |
| --- | --- | --- |
| `@clerk/clerk-expo` | `2.19.31` latest; `2.19.42` latest-v5 dist-tag | Repo currently has `^2.19.25`. Do not jump to `latest-v5` without reading v5 migration notes. |
| `react-native-auth0` | `5.9.0` latest | Auth0 React Native SDK package. |
| `@workos-inc/node` | `10.7.0` latest | Server SDK; not a native Expo SDK. |
| `@workos-inc/authkit-react-native` | 404 from npm | No official package found by that name. |

# Installation

For this repo, the dependencies are already present in `package.json`:

```bash
npx expo install @clerk/clerk-expo expo-secure-store
```

If using Clerk native components (`AuthView`, `UserButton` from `@clerk/clerk-expo/native`) add `expo-dev-client` and verify the Expo config plugins:

```bash
npx expo install @clerk/clerk-expo expo-secure-store expo-dev-client
```

```json
{
  "expo": {
    "plugins": ["expo-secure-store", "@clerk/clerk-expo"]
  }
}
```

Clerk's Expo docs say native components are beta and require a development build. JavaScript custom flows can run in Expo Go, but native OAuth requires provider-specific native setup.

# Configuration (env vars + init code)

Environment variables used by this app:

| Variable | Where | Required | Purpose |
| --- | --- | --- | --- |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Expo client | Yes | Clerk client publishable key, e.g. `pk_test_...` or `pk_live_...`. Already listed in `.env.example`. |
| `CLERK_AUTH_DOMAIN` | Convex server config | Yes | Current repo-specific name used by `convex/auth.config.ts` as the Clerk issuer domain. Set in Convex dashboard for deployed environments. |
| `CLERK_JWT_ISSUER_DOMAIN` | Convex server config | Official docs name | Convex docs use this name for the same issuer domain. If keeping `CLERK_AUTH_DOMAIN`, document the deviation; if renaming later, update `convex/auth.config.ts` and deployment env together. |
| `EXPO_PUBLIC_CONVEX_URL` | Expo client | Yes | Convex deployment URL for `ConvexReactClient`. |
| Google native client IDs | Expo client / app config | For native Google SSO | Clerk's Google native guide requires iOS Client ID, Android Client ID, Web Client ID, Web Client Secret in Clerk dashboard, and URL scheme/plugin configuration. Name the env vars when implementing the Google guide. |

Root provider setup:

```tsx
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { Slot } from 'expo-router';

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!clerkPublishableKey) {
  throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');
}

if (!convexUrl) {
  throw new Error('Missing EXPO_PUBLIC_CONVEX_URL');
}

const convex = new ConvexReactClient(convexUrl);

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Slot />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

Convex JWT config, matching the current repo:

```ts
const authDomain = process.env.CLERK_AUTH_DOMAIN;

if (!authDomain) {
  throw new Error(
    'CLERK_AUTH_DOMAIN environment variable is required. Set it in the Convex dashboard.'
  );
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

Official Convex docs use `process.env.CLERK_JWT_ISSUER_DOMAIN!` and `applicationID: "convex"`. The value should be Clerk's Frontend API URL / issuer domain, e.g. development `https://verb-noun-00.clerk.accounts.dev` or production `https://clerk.<your-domain>.com`.

# Key Patterns (code examples)

Email/password sign-in:

```tsx
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Button, TextInput, View } from 'react-native';

export function EmailSignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  async function onSignInPress() {
    if (!isLoaded) return;

    const result = await signIn.create({
      identifier: emailAddress,
      password,
    });

    if (result.status === 'complete') {
      await setActive({ session: result.createdSessionId });
      router.replace('/');
      return;
    }

    console.error('Sign-in incomplete:', result.status);
  }

  return (
    <View>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmailAddress}
        value={emailAddress}
      />
      <TextInput onChangeText={setPassword} secureTextEntry value={password} />
      <Button onPress={onSignInPress} title="Sign in" />
    </View>
  );
}
```

Email/password sign-up with email-code verification:

```tsx
import { useSignUp } from '@clerk/clerk-expo';
import * as React from 'react';
import { Button, TextInput, View } from 'react-native';

export function EmailSignUp() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);

  async function createAccount() {
    if (!isLoaded) return;

    await signUp.create({ emailAddress, password });
    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
    setPendingVerification(true);
  }

  async function verifyCode() {
    if (!isLoaded) return;

    const result = await signUp.attemptEmailAddressVerification({ code });

    if (result.status === 'complete') {
      await setActive({ session: result.createdSessionId });
      return;
    }

    console.error('Sign-up incomplete:', result.status);
  }

  return (
    <View>
      {pendingVerification ? (
        <>
          <TextInput keyboardType="numeric" onChangeText={setCode} value={code} />
          <Button onPress={verifyCode} title="Verify" />
        </>
      ) : (
        <>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmailAddress}
            value={emailAddress}
          />
          <TextInput onChangeText={setPassword} secureTextEntry value={password} />
          <Button onPress={createAccount} title="Create account" />
        </>
      )}
    </View>
  );
}
```

Apple/Google SSO with `useSSO()`:

```tsx
import { useSSO } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Button, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export function SocialButtons() {
  const { startSSOFlow } = useSSO();

  const startOAuth = React.useCallback(
    async (strategy: 'oauth_apple' | 'oauth_google') => {
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        return;
      }

      // Handle missing requirements or extra auth steps here.
      console.log({ signInStatus: signIn?.status, signUpStatus: signUp?.status });
    },
    [startSSOFlow]
  );

  return (
    <View>
      <Button onPress={() => startOAuth('oauth_apple')} title="Continue with Apple" />
      <Button onPress={() => startOAuth('oauth_google')} title="Continue with Google" />
    </View>
  );
}
```

Native prebuilt auth surface:

```tsx
import { useAuth } from '@clerk/clerk-expo';
import { AuthView, UserButton } from '@clerk/clerk-expo/native';
import { useState } from 'react';
import { ActivityIndicator, Button, Modal, View } from 'react-native';

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  if (!isLoaded) return <ActivityIndicator />;

  return (
    <View>
      {isSignedIn ? <UserButton /> : <Button onPress={() => setIsAuthOpen(true)} title="Sign in" />}
      <Modal onRequestClose={() => setIsAuthOpen(false)} visible={isAuthOpen}>
        <AuthView onDismiss={() => setIsAuthOpen(false)} />
      </Modal>
    </View>
  );
}
```

Convex authenticated query:

```ts
import { query } from './_generated/server';

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error('Not authenticated');
    }

    return {
      email: identity.email,
      subject: identity.subject,
    };
  },
});
```

# API Reference table

| API | Import | Purpose | Key signature / shape |
| --- | --- | --- | --- |
| `ClerkProvider` | `@clerk/clerk-expo` | Provides Clerk session/user context. | `<ClerkProvider publishableKey={key} tokenCache={tokenCache}>...</ClerkProvider>` |
| `tokenCache` | `@clerk/clerk-expo/token-cache` | Persists active session token securely with `expo-secure-store`. | Pass as `tokenCache` prop. |
| `useAuth` | `@clerk/clerk-expo` | Reads auth state and token helpers. | Returns `isLoaded`, `isSignedIn`, user/session identifiers, token helpers. Native components may need `{ treatPendingAsSignedOut: false }`. |
| `useSignIn` | `@clerk/clerk-expo` | Custom email/password sign-in. | Use `signIn.create({ identifier, password })`, then `setActive({ session })` when complete. |
| `useSignUp` | `@clerk/clerk-expo` | Custom sign-up and verification. | Use `signUp.create(...)`, `prepareEmailAddressVerification({ strategy: 'email_code' })`, `attemptEmailAddressVerification({ code })`. |
| `useSSO` | `@clerk/clerk-expo` | OAuth / enterprise SSO entry point. | `startSSOFlow(params): Promise<StartSSOFlowReturnType>` where `strategy` supports `oauth_<provider>` and `enterprise_sso`. |
| `AuthView` | `@clerk/clerk-expo/native` | Prebuilt native sign-in/sign-up UI. | `<AuthView onDismiss={...} />`; requires dev build and Native API. |
| `UserButton` | `@clerk/clerk-expo/native` | Prebuilt native profile/session button. | `<UserButton />`; requires dev build and Native API. |
| `ConvexProviderWithClerk` | `convex/react-clerk` | Supplies Clerk JWTs to Convex client. | `<ConvexProviderWithClerk client={convex} useAuth={useAuth}>...</ConvexProviderWithClerk>` |
| `useConvexAuth` | `convex/react` | Auth state as validated by Convex. | Prefer over Clerk `useAuth()` when gating Convex queries/mutations. |
| `ctx.auth.getUserIdentity` | Convex function context | Server-side identity lookup from Clerk JWT. | Returns identity or `null`; throw for protected functions. |

# Gotchas

- Native Clerk components are beta and require a development build. They do not run in Expo Go.
- Native components require Clerk Dashboard Native API to be enabled.
- Keep the `AuthView` modal mounted at the same level as signed-in/signed-out content; Clerk warns that auth state can change before session tasks finish.
- For native components, pass `{ treatPendingAsSignedOut: false }` to `useAuth()` so pending session tasks are not treated as signed out.
- `<AuthView />` automatically displays enabled social connections, but native Google/Apple buttons can appear and still fail until provider credentials and native app records are configured in the Clerk Dashboard.
- Google native SSO requires custom credentials: iOS Client ID, Android Client ID, Web Client ID, Web Client Secret in Clerk, Native Applications records, and app URL scheme config.
- Apple native SSO requires the iOS app registered in Clerk Native Applications and Apple enabled as a social connection.
- For sign-up flows, Clerk bot/risk protection can require CAPTCHA/risk handling. Clerk's Expo quickstart includes a `nativeID="clerk-captcha"` mount for JS sign-up examples.
- OAuth can return a `signUp` object with missing requirements. Route the user through a continuation screen and call `signUp.update(...)` before finalizing.
- Use `useConvexAuth()` or Convex `<Authenticated>` boundaries for UI that immediately calls authenticated Convex functions; Clerk `useAuth()` alone can be true before Convex has fetched and validated its token.
- The app currently uses `CLERK_AUTH_DOMAIN`, while Convex docs name this variable `CLERK_JWT_ISSUER_DOMAIN`. Do not set one and read the other by mistake.
- Do not store Clerk secret keys in Expo public env vars. This spec only requires the publishable key on the client.
- `@clerk/clerk-expo` has a `latest-v5` dist-tag newer than `latest`; treat v5 as a separate migration, not a routine patch update.

# Rate Limits

Public pricing/limits checked on 2026-07-14:

| Provider | Free / included usage | Notes |
| --- | --- | --- |
| Clerk | Pricing page lists 50,000 included MRUs per app, unlimited applications, up to 3 social connections on Hobby, and email codes/passwords included. | Clerk defines retained users as users returning 24+ hours after sign-up. SMS has separate costs where applicable. |
| Auth0 | Pricing page lists Free up to 25,000 MAU, unlimited social connections, 1 custom domain, and basic attack protection. | Essentials/Professional paid plans start with lower included MAU tiers but higher feature/API limits. |
| WorkOS | Pricing page exists but was not used for implementation because no official Expo/native SDK package was found. | Re-check pricing if considering B2B/enterprise auth later. |

Operational rate limits for Clerk API endpoints are not fully enumerated in the Expo docs used here. Treat auth attempts, email-code sends, OAuth starts, and backend API calls as rate-limited operations. Surface Clerk error messages in development, avoid automatic resend loops, and debounce sign-in/sign-up buttons while `fetchStatus === "fetching"`.

# Currency (version · checked date · source)

| Item | Version / date | Source |
| --- | --- | --- |
| `@clerk/clerk-expo` | npm latest `2.19.31`; `latest-v5` `2.19.42`; checked 2026-07-14 | `npm view @clerk/clerk-expo version dist-tags --json` |
| Repo dependency | `@clerk/clerk-expo` `^2.19.25`; checked 2026-07-14 | `package.json` |
| Clerk Expo quickstart | Last checked 2026-07-14 | https://clerk.com/docs/expo/getting-started/quickstart |
| Clerk `useSSO()` reference | Page says last updated 2026-06-30; checked 2026-07-14 | https://clerk.com/docs/reference/expo/native-hooks/use-sso |
| Clerk OAuth custom flow | Last checked 2026-07-14 | https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections |
| Convex Clerk auth | Last checked 2026-07-14 | https://docs.convex.dev/auth/clerk |
| Clerk pricing | Last checked 2026-07-14 | https://clerk.com/pricing |
| Auth0 pricing | Last checked 2026-07-14 | https://auth0.com/pricing |
| `react-native-auth0` | npm latest `5.9.0`; checked 2026-07-14 | `npm view react-native-auth0 version dist-tags --json` |
| `@workos-inc/node` | npm latest `10.7.0`; checked 2026-07-14 | `npm view @workos-inc/node version dist-tags --json` |

# References

- Clerk Expo quickstart: https://clerk.com/docs/expo/getting-started/quickstart
- Clerk Expo `useSSO()` reference: https://clerk.com/docs/reference/expo/native-hooks/use-sso
- Clerk OAuth custom flows: https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections
- Convex Clerk authentication: https://docs.convex.dev/auth/clerk
- Clerk pricing: https://clerk.com/pricing
- Auth0 pricing: https://auth0.com/pricing
- WorkOS pricing: https://workos.com/pricing
- Current repo files checked: `package.json`, `.env.example`, `convex/auth.config.ts`
