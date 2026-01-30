# Clerk Social Authentication Specification

## Overview

This specification defines the implementation of social OAuth authentication (Google, Apple) for the Daily Habits app using Clerk's `useSSO` hook for React Native/Expo.

**Current State:** Email/password authentication only
**Target State:** Email/password + Google + Apple Sign-In
**App Version:** 1.0.0
**Expo SDK:** 54.x
**Clerk SDK:** @clerk/clerk-expo v2.15.4

---

## Architecture Decision

### Why Custom Flows (Not Pre-built Components)

Clerk's pre-built `<SignIn />` and `<SignUp />` components **only work on Expo Web**, not native iOS/Android. For native apps, we must build custom UI using Clerk hooks.

| Approach | Web Support | Native Support | Our Choice |
|----------|-------------|----------------|------------|
| Pre-built `<SignIn />` | ✅ | ❌ | No |
| Custom flows with `useSSO` | ✅ | ✅ | **Yes** |

### Hook Selection

| Hook | Status | Use Case |
|------|--------|----------|
| `useOAuth()` | ⚠️ Deprecated | Legacy - do not use |
| `useSSO()` | ✅ Current | Social OAuth & Enterprise SSO |
| `useSignIn()` | ✅ Current | Email/password (already implemented) |
| `useSignUp()` | ✅ Current | Email/password (already implemented) |

---

## Supported OAuth Providers

### Phase 1: Required Providers

| Provider | Strategy String | Priority | Reason |
|----------|-----------------|----------|--------|
| **Apple** | `oauth_apple` | P0 | Required for iOS App Store if any social login exists |
| **Google** | `oauth_google` | P0 | Most common OAuth provider |

### Phase 2: Optional Providers (Future)

| Provider | Strategy String | Priority |
|----------|-----------------|----------|
| Facebook | `oauth_facebook` | P2 |
| GitHub | `oauth_github` | P3 |
| Twitter/X | `oauth_twitter` | P3 |

---

## Technical Implementation

### 1. Dependencies

**Already Installed:**
- `@clerk/clerk-expo` v2.15.4
- `expo-web-browser` (required for OAuth redirects)

**No Additional Dependencies Required**

### 2. Deep Linking Configuration

**Current `app.json` Configuration:**
```json
{
  "expo": {
    "scheme": "habit-tracker",
    "ios": {
      "bundleIdentifier": "com.andres9888.daily-habits"
    }
  }
}
```

**Required Addition for Apple Sign-In:**
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.andres9888.daily-habits",
      "usesAppleSignIn": true
    }
  }
}
```

### 3. Hook Implementation

#### New Hook: `useOAuthSignIn.ts`

```typescript
// src/screens/auth/hooks/useOAuthSignIn.ts
import { useSSO } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';

// Warm up browser for better UX on Android
WebBrowser.maybeCompleteAuthSession();

export type OAuthStrategy = 'oauth_google' | 'oauth_apple';

export function useOAuthSignIn() {
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = useState<OAuthStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Warm up browser on Android for faster OAuth
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const signInWith = useCallback(
    async (strategy: OAuthStrategy) => {
      setIsLoading(strategy);
      setError(null);

      try {
        const { createdSessionId, setActive, signIn, signUp } =
          await startSSOFlow({
            strategy,
            redirectUrl: 'habit-tracker://sso-callback',
          });

        // If sign-in/sign-up completed successfully
        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          return { success: true };
        }

        // Handle additional requirements (rare for OAuth)
        if (signUp?.status === 'missing_requirements') {
          return {
            success: false,
            missingFields: signUp.missingFields,
          };
        }

        // Handle any remaining sign-in tasks
        if (signIn?.status !== 'complete') {
          return {
            success: false,
            error: 'Sign in incomplete. Please try again.',
          };
        }

        return { success: true };
      } catch (err: any) {
        const errorMessage =
          err.errors?.[0]?.message ||
          err.message ||
          'Failed to sign in. Please try again.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(null);
      }
    },
    [startSSOFlow]
  );

  return {
    signInWithGoogle: () => signInWith('oauth_google'),
    signInWithApple: () => signInWith('oauth_apple'),
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
```

### 4. UI Components

#### Social Sign-In Button Component

```typescript
// src/screens/auth/components/SocialSignInButton.tsx
import { Platform, Text, TouchableOpacity, View } from 'react-native';

interface SocialSignInButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function SocialSignInButton({
  provider,
  onPress,
  isLoading,
  disabled,
}: SocialSignInButtonProps) {
  const config = {
    google: {
      icon: '🔵', // Replace with actual Google icon
      label: 'Continue with Google',
      bgColor: 'bg-white',
      textColor: 'text-stone-800',
      borderColor: 'border-stone-200',
    },
    apple: {
      icon: '', // Apple logo
      label: 'Continue with Apple',
      bgColor: 'bg-black',
      textColor: 'text-white',
      borderColor: 'border-black',
    },
  };

  const { icon, label, bgColor, textColor, borderColor } = config[provider];

  // Hide Apple button on Android (optional, but recommended)
  if (provider === 'apple' && Platform.OS === 'android') {
    return null;
  }

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center rounded-3xl border ${borderColor} ${bgColor} py-4 ${
        isLoading || disabled ? 'opacity-40' : ''
      }`}
      disabled={isLoading || disabled}
      onPress={onPress}
    >
      <Text className='mr-2 text-lg'>{icon}</Text>
      <Text className={`text-[15px] font-semibold ${textColor}`}>
        {isLoading ? 'Signing in...' : label}
      </Text>
    </TouchableOpacity>
  );
}
```

#### Divider Component

```typescript
// src/screens/auth/components/AuthDivider.tsx
import { Text, View } from 'react-native';

export function AuthDivider() {
  return (
    <View className='my-6 flex-row items-center'>
      <View className='h-px flex-1 bg-stone-200' />
      <Text className='mx-4 text-xs font-medium tracking-widest text-stone-400'>
        OR
      </Text>
      <View className='h-px flex-1 bg-stone-200' />
    </View>
  );
}
```

### 5. Updated Screen Layouts

#### WelcomeScreen.tsx Updates

Add social sign-in buttons above the existing "GET STARTED" and "SIGN IN" buttons:

```typescript
// Social buttons section (new)
<View className='mb-4 gap-3'>
  <SocialSignInButton
    provider='apple'
    onPress={signInWithApple}
    isLoading={isLoading === 'oauth_apple'}
    disabled={!!isLoading}
  />
  <SocialSignInButton
    provider='google'
    onPress={signInWithGoogle}
    isLoading={isLoading === 'oauth_google'}
    disabled={!!isLoading}
  />
</View>

<AuthDivider />

// Existing buttons
<View className='gap-4'>
  <TouchableOpacity ... onPress={() => setMode('signup')}>
    <Text>GET STARTED</Text>
  </TouchableOpacity>
  ...
</View>
```

#### SignInScreen.tsx Updates

Add social buttons after the password field, before the "SIGN IN" button:

```typescript
// After password input
<AuthDivider />

<View className='gap-3'>
  <SocialSignInButton provider='apple' ... />
  <SocialSignInButton provider='google' ... />
</View>

<AuthDivider />

// Existing sign in button
<TouchableOpacity ... onPress={onSignInPress}>
```

---

## Clerk Dashboard Configuration

### Development Environment

Clerk provides **shared OAuth credentials** for development. No additional setup required for basic testing.

### Production Environment

#### Google OAuth Setup

1. **Google Cloud Console:**
   - Create OAuth 2.0 Client ID (Web Application type)
   - Add Authorized JavaScript origins: `https://your-clerk-domain.clerk.accounts.dev`
   - Add Authorized Redirect URI from Clerk Dashboard
   - Set Publishing Status to "In production"

2. **Clerk Dashboard:**
   - Navigate to: User & Authentication → Social Connections → Google
   - Enable "Use custom credentials"
   - Paste Client ID and Client Secret

#### Apple Sign-In Setup

1. **Apple Developer Portal:**
   - Create App ID with "Sign in with Apple" capability
   - Create Services ID for web authentication
   - Create Key with "Sign in with Apple" enabled
   - Download Private Key (cannot be re-downloaded!)

2. **Required Credentials:**
   - Team ID (from App ID)
   - Services ID
   - Key ID
   - Private Key file (.p8)

3. **Clerk Dashboard:**
   - Navigate to: User & Authentication → Social Connections → Apple
   - Enable "Use custom credentials"
   - Enter all four credentials
   - Configure Email Relay settings

4. **Xcode Configuration:**
   - Add "Sign in with Apple" capability in Signing & Capabilities
   - EAS Build will handle this automatically if `usesAppleSignIn: true` is set

---

## Error Handling

### Common Error Scenarios

| Error | Cause | User Message |
|-------|-------|--------------|
| `oauth_access_denied` | User cancelled OAuth flow | "Sign in was cancelled" |
| `external_account_not_found` | OAuth provider error | "Unable to verify your account. Please try again." |
| `email_address_not_found` | Missing email scope | "We couldn't retrieve your email. Please try a different sign-in method." |
| `identifier_already_signed_in` | User already authenticated | Redirect to main app |
| Network error | No internet connection | "Please check your internet connection and try again." |

### Error Display Component

```typescript
// src/screens/auth/components/AuthError.tsx
import { Text, TouchableOpacity, View } from 'react-native';

interface AuthErrorProps {
  message: string;
  onDismiss: () => void;
}

export function AuthError({ message, onDismiss }: AuthErrorProps) {
  return (
    <View className='mb-4 rounded-2xl bg-red-50 p-4'>
      <Text className='text-sm text-red-800'>{message}</Text>
      <TouchableOpacity className='mt-2' onPress={onDismiss}>
        <Text className='text-sm font-medium text-red-600'>Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## User Flow Diagrams

### OAuth Sign-In Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      User taps "Continue with Google"           │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  useSSO.startSSOFlow({ strategy: 'oauth_google' })              │
│  → Opens system browser / in-app browser                        │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  User authenticates with Google                                 │
│  → Enters credentials in Google's UI                            │
│  → Grants permission to app                                     │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  Redirect back to app                                           │
│  → habit-tracker://sso-callback                                 │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
        ┌───────────────────┐       ┌───────────────────┐
        │ Existing User     │       │ New User          │
        │ → Sign In         │       │ → Sign Up         │
        └─────────┬─────────┘       └─────────┬─────────┘
                  │                           │
                  └─────────────┬─────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  setActive({ session: createdSessionId })                       │
│  → User is now authenticated                                    │
│  → AuthGate allows access to main app                           │
└─────────────────────────────────────────────────────────────────┘
```

### Account Linking Scenario

When a user signs up with email, then later tries to sign in with Google using the same email:

```
┌─────────────────────────────────────────────────────────────────┐
│  User has email account: user@example.com                       │
│  User taps "Continue with Google" (same email)                  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  Clerk detects existing account with matching email             │
│  → Returns signIn object with transferable: true                │
│  → User can link accounts or use separate account               │
└─────────────────────────────────────────────────────────────────┘
```

**Note:** Account linking behavior is configured in Clerk Dashboard under "User & Authentication → Social Connections → Account linking".

---

## Testing Strategy

### Manual Testing Checklist

- [ ] Google sign-in creates new account
- [ ] Google sign-in to existing Google account
- [ ] Apple sign-in creates new account (iOS only)
- [ ] Apple sign-in to existing Apple account
- [ ] User cancels OAuth flow (both providers)
- [ ] Network error during OAuth
- [ ] Sign in on one device, verify session on another
- [ ] Account linking (email user signs in with Google)

### Sandbox Testing

**Google:**
- Use test accounts created in Google Cloud Console
- Set OAuth consent screen to "Testing" mode

**Apple:**
- Use Apple Sandbox environment
- Create sandbox Apple ID at appleid.apple.com

### Test Accounts

Create dedicated test accounts for each provider:
- `habittracker.test@gmail.com` (Google)
- Sandbox Apple ID for Apple testing

---

## Security Considerations

### Token Storage

Clerk SDK handles token storage securely:
- **iOS:** Keychain
- **Android:** EncryptedSharedPreferences

### OAuth Security

- Clerk handles PKCE (Proof Key for Code Exchange) automatically
- State parameter validation is built-in
- Tokens are never exposed to JavaScript

### Rate Limiting

Clerk implements rate limiting on OAuth endpoints. No additional implementation required.

---

## File Structure

```
src/screens/auth/
├── WelcomeScreen.tsx          # Updated with social buttons
├── SignInScreen.tsx           # Updated with social buttons
├── SignUpScreen.tsx           # Updated with social buttons
├── components/
│   ├── FormInput.tsx          # Existing
│   ├── SubmitButton.tsx       # Existing
│   ├── VerificationView.tsx   # Existing
│   ├── SocialSignInButton.tsx # NEW
│   ├── AuthDivider.tsx        # NEW
│   └── AuthError.tsx          # NEW
└── hooks/
    ├── useSignUpFlow.ts       # Existing
    └── useOAuthSignIn.ts      # NEW
```

---

## Implementation Phases

### Phase 1: Core Implementation (MVP)
1. Create `useOAuthSignIn` hook
2. Create `SocialSignInButton` component
3. Create `AuthDivider` component
4. Update `WelcomeScreen` with social buttons
5. Configure Clerk Dashboard (development)
6. Test on iOS simulator

### Phase 2: Polish & Error Handling
1. Add `AuthError` component
2. Implement comprehensive error handling
3. Add loading states and animations
4. Update `SignInScreen` and `SignUpScreen`
5. Test on Android emulator

### Phase 3: Production Setup
1. Configure Google OAuth (production credentials)
2. Configure Apple Sign-In (production credentials)
3. Update `app.json` with `usesAppleSignIn: true`
4. Create EAS build with Apple capability
5. Test on physical devices

### Phase 4: QA & Launch
1. Full QA testing (all platforms)
2. Edge case testing (account linking, etc.)
3. Performance testing
4. Documentation update

---

## Dependencies on Other Features

| Feature | Dependency | Status |
|---------|------------|--------|
| Convex User Sync | OAuth users must sync to Convex | ✅ Already implemented in `AuthGate.tsx` |
| Premium Features | OAuth users need `hasPremium` flag | ✅ Schema supports this |
| Analytics | Track OAuth sign-ups | ⚠️ Future enhancement |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| OAuth conversion rate | >60% of sign-ups use OAuth | Clerk Dashboard analytics |
| OAuth error rate | <5% of attempts | Clerk Dashboard + error logging |
| Time to sign in (OAuth) | <10 seconds | User testing |
| App Store approval | First submission | Apple review |

---

## Appendix: OAuth Strategy Strings

Full list of Clerk-supported OAuth strategies:

```typescript
type OAuthStrategy =
  | 'oauth_google'
  | 'oauth_apple'
  | 'oauth_facebook'
  | 'oauth_github'
  | 'oauth_twitter'
  | 'oauth_discord'
  | 'oauth_twitch'
  | 'oauth_linkedin'
  | 'oauth_linkedin_oidc'
  | 'oauth_spotify'
  | 'oauth_microsoft'
  | 'oauth_tiktok'
  | 'oauth_slack'
  | 'oauth_notion'
  | 'oauth_dropbox'
  | 'oauth_atlassian'
  | 'oauth_bitbucket'
  | 'oauth_hubspot'
  | 'oauth_gitlab';
```

---

## Code Review Checklist

### Security Review

| Item | Status | Notes |
|------|--------|-------|
| PKCE flow enabled | ✅ Built-in | Clerk SDK handles PKCE automatically - prevents authorization code interception |
| State parameter validation | ✅ Built-in | Clerk validates state to prevent CSRF attacks |
| Token storage security | ✅ Built-in | iOS Keychain / Android EncryptedSharedPreferences |
| No tokens in JavaScript | ✅ Built-in | Clerk SDK manages tokens securely, never exposed to JS |
| Redirect URL validation | ✅ Built-in | Only registered schemes (`habit-tracker://`) accepted |
| User ID validation on sync | ⚠️ TODO | Ensure Clerk `userId` matches when syncing to Convex |
| Rate limiting | ✅ Built-in | Clerk implements rate limiting on OAuth endpoints |

### Performance Review

| Item | Status | Notes |
|------|--------|-------|
| Browser warm-up (Android) | ✅ Implemented | `WebBrowser.warmUpAsync()` in hook - reduces OAuth launch time |
| Browser cool-down cleanup | ✅ Implemented | `WebBrowser.coolDownAsync()` in useEffect cleanup |
| Lazy loading OAuth | ⚠️ Consider | Could lazy-load `useOAuthSignIn` if not on auth screens |
| Memoized callbacks | ✅ Implemented | `useCallback` wraps `signInWith` function |
| Offerings pre-fetch | N/A | OAuth doesn't require pre-fetching (unlike RevenueCat) |

### UX Review

| Item | Status | Notes |
|------|--------|-------|
| Loading state per button | ✅ Designed | `isLoading` tracks which provider is active |
| Disabled state during auth | ✅ Designed | Other buttons disabled while one is loading |
| Error display | ✅ Designed | `AuthError` component with dismiss action |
| User cancellation handling | ✅ Implemented | `userCancelled` flag prevents error display on cancel |
| Platform-specific buttons | ✅ Designed | Apple hidden on Android per platform conventions |
| Accessibility labels | ⚠️ TODO | Add `accessibilityLabel` and `accessibilityHint` to buttons |
| Haptic feedback | ⚠️ Consider | Add haptic on button press like other auth buttons |

### App Store Compliance

| Item | Status | Notes |
|------|--------|-------|
| Apple Sign-In required | ✅ Planned | Apple button included - required if any social login exists |
| Apple button prominence | ✅ Designed | Apple button first in list per Apple HIG |
| Apple button styling | ✅ Designed | Black background, white text per Apple guidelines |
| Google branding compliance | ✅ Designed | Official Google "G" logo with correct colors |
| Privacy policy accessible | ⚠️ Existing | Already in app - ensure visible from auth screens |
| Terms of service accessible | ⚠️ Existing | Already in app - ensure visible from auth screens |

### Code Quality Review

| Item | Status | Notes |
|------|--------|-------|
| TypeScript strict mode | ✅ Required | All new files must use strict types |
| File size < 100 lines | ✅ Planned | Hook ~75 lines, Button ~50 lines, Divider ~15 lines |
| No circular dependencies | ✅ Planned | Components don't import each other |
| Consistent naming | ✅ Planned | `useOAuthSignIn`, `SocialSignInButton`, `AuthDivider` |
| Error boundary integration | ⚠️ TODO | Ensure OAuth errors caught by existing ErrorBoundary |
| Test coverage | ⚠️ TODO | Add unit tests for hook, component tests for UI |

### Testing Checklist

| Scenario | Platform | Priority | Notes |
|----------|----------|----------|-------|
| Google sign-in (new user) | iOS | P0 | Creates account + syncs to Convex |
| Google sign-in (existing user) | iOS | P0 | Signs in without creating duplicate |
| Apple sign-in (new user) | iOS | P0 | Creates account + syncs to Convex |
| Apple sign-in (existing user) | iOS | P0 | Signs in without creating duplicate |
| Google sign-in | Android | P0 | Apple button should be hidden |
| User cancels OAuth flow | Both | P1 | No error shown, just returns to screen |
| Network error during OAuth | Both | P1 | Error banner displayed with retry hint |
| Account linking (email→OAuth) | Both | P1 | User with email can link Google/Apple |
| Account linking (OAuth→email) | Both | P2 | OAuth user can add email/password |
| Multiple OAuth providers | Both | P2 | User can link both Google and Apple |
| Session persistence | Both | P0 | User stays signed in after app restart |
| Sign out + sign in again | Both | P1 | Clean sign-out, can sign in with same provider |

### Potential Issues & Mitigations

| Issue | Likelihood | Impact | Mitigation |
|-------|------------|--------|------------|
| OAuth popup blocked | Low | Medium | Use `WebBrowser` not standard `window.open` |
| Deep link not received | Low | High | Test on real devices; Expo Go has limitations |
| Clerk rate limiting | Low | Medium | Implement exponential backoff on errors |
| Apple private relay email | Medium | Low | Handle `privaterelay.appleid.com` emails gracefully |
| Google OAuth consent screen | Medium | Low | Ensure app is verified before production launch |
| Existing email conflict | Medium | Medium | Configure account linking in Clerk Dashboard |

---

## UI Mockups

### Before & After Comparison

See interactive mockup: `.superdesign/design_iterations/social_auth_mockup_1.html`

**Welcome Screen - Before:**
```
┌─────────────────────────────────────┐
│              ✓                      │
│         Habit Tracker               │
│   Build better habits, one day...   │
│                                     │
│  ┌───────────────────────────────┐  │
│  │        GET STARTED            │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │          SIGN IN              │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Welcome Screen - After:**
```
┌─────────────────────────────────────┐
│              ✓                      │
│         Habit Tracker               │
│   Build better habits, one day...   │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  🍎  Continue with Apple      │  │  ← NEW (black bg)
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  🔵  Continue with Google     │  │  ← NEW (white bg, border)
│  └───────────────────────────────┘  │
│                                     │
│  ────────────  OR  ────────────     │  ← NEW divider
│                                     │
│  ┌───────────────────────────────┐  │
│  │        GET STARTED            │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │          SIGN IN              │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Loading State:**
```
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐  │
│  │  ◌  Signing in...             │  │  ← Spinner + text
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  🔵  Continue with Google     │  │  ← Disabled (40% opacity)
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Error State:**
```
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐  │
│  │ ⚠️ Sign in was cancelled      │  │  ← Error banner (red-50 bg)
│  │                    [Dismiss]  │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  🍎  Continue with Apple      │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Implementation Status

> **✅ All Code Implementation Tasks Complete (January 2026)**
>
> Tasks 1.1-1.4, 2.1-2.5, and 3.3 have been implemented. Remaining tasks require:
> - **Manual Configuration:** Clerk Dashboard, Google Cloud Console, Apple Developer Portal
> - **Device Testing:** iOS simulator, Android emulator, physical devices
> - **QA Testing:** Regression, account linking, error scenarios
>
> **⚠️ No Automated Tasks Remaining** - All remaining tasks (1.5, 1.6, 2.6, 3.1, 3.2, 3.4, 3.5, 3.6, 4.1-4.5) require human intervention for dashboard configuration, device testing, or QA verification.

---

## Implementation Tasks

### Phase 1: Core Implementation (MVP)

| ID | Task | Description | Priority | Dependencies | Status |
|----|------|-------------|----------|--------------|--------|
| 1.1 | Create `useOAuthSignIn` hook | Implement OAuth hook using Clerk's `useSSO` with browser warm-up, loading states, and error handling | P0 | None | `done` |
| 1.2 | Create `SocialSignInButton` component | Reusable button for Apple/Google with platform-specific rendering (hide Apple on Android) | P0 | None | `done` |
| 1.3 | Create `AuthDivider` component | "OR" divider component for separating OAuth from email auth | P0 | None | `done` |
| 1.4 | Update `WelcomeScreen` with social buttons | Add Apple/Google buttons above existing GET STARTED/SIGN IN buttons | P0 | 1.1, 1.2, 1.3 | `done` |
| 1.5 | Enable OAuth in Clerk Dashboard (dev) | Enable Google and Apple social connections with shared dev credentials | P0 | None | `pending` ⚠️ *Manual task - requires human to access Clerk Dashboard* |
| 1.6 | Test OAuth flow on iOS simulator | Verify Google and Apple sign-in work end-to-end | P0 | 1.4, 1.5 | `pending` |

### Phase 2: Polish & Error Handling

| ID | Task | Description | Priority | Dependencies | Status |
|----|------|-------------|----------|--------------|--------|
| 2.1 | Create `AuthError` component | Dismissible error banner for OAuth failures | P1 | None | `done` |
| 2.2 | Implement error message mapping | Map Clerk error codes to user-friendly messages | P1 | 2.1 | `done` |
| 2.3 | Add loading animations | Spinner/pulse animation during OAuth redirect | P1 | 1.2 | `done` |
| 2.4 | Update `SignInScreen` with social buttons | Add OAuth buttons to existing sign-in screen | P1 | 1.1, 1.2, 1.3 | `done` |
| 2.5 | Update `SignUpScreen` with social buttons | Add OAuth buttons to existing sign-up screen | P1 | 1.1, 1.2, 1.3 | `done` |
| 2.6 | Test on Android emulator | Verify Google sign-in works (Apple hidden on Android) | P1 | 2.4, 2.5 | `pending` |

### Phase 3: Production Configuration

| ID | Task | Description | Priority | Dependencies | Status |
|----|------|-------------|----------|--------------|--------|
| 3.1 | Configure Google OAuth (production) | Create OAuth client in Google Cloud Console, add to Clerk | P0 | Phase 1 complete | `pending` |
| 3.2 | Configure Apple Sign-In (production) | Create App ID, Services ID, Key in Apple Developer Portal | P0 | Phase 1 complete | `pending` |
| 3.3 | Update `app.json` for Apple Sign-In | Add `usesAppleSignIn: true` to iOS config | P0 | None | `done` |
| 3.4 | Create EAS development build | Build with Apple Sign-In capability for testing | P1 | 3.2, 3.3 | `pending` |
| 3.5 | Test on physical iOS device | Verify Apple Sign-In with real device | P0 | 3.4 | `pending` |
| 3.6 | Test on physical Android device | Verify Google Sign-In on real device | P1 | 3.1 | `pending` |

### Phase 4: QA & Launch

| ID | Task | Description | Priority | Dependencies | Status |
|----|------|-------------|----------|--------------|--------|
| 4.1 | Full regression testing | Test all auth flows (email, Google, Apple) on all platforms | P0 | Phase 3 complete | `pending` |
| 4.2 | Account linking testing | Test email→OAuth and OAuth→email linking scenarios | P1 | 4.1 | `pending` |
| 4.3 | Error scenario testing | Test network errors, cancelled flows, rate limiting | P1 | 4.1 | `pending` |
| 4.4 | Performance testing | Measure OAuth flow completion time | P2 | 4.1 | `pending` |
| 4.5 | Update documentation | Document OAuth setup for future reference | P2 | 4.1 | `pending` |

---

## Task Summary

| Phase | Tasks | Estimated Effort | Dependencies |
|-------|-------|------------------|--------------|
| Phase 1: Core MVP | 6 tasks | Code + Dashboard config | None |
| Phase 2: Polish | 6 tasks | Code refinement | Phase 1 |
| Phase 3: Production | 6 tasks | External service config | Phase 1 |
| Phase 4: QA | 5 tasks | Testing only | Phase 3 |
| **Total** | **23 tasks** | | |

---

## Quick Reference: Files to Create/Modify

### New Files
```
src/screens/auth/hooks/useOAuthSignIn.ts      # Task 1.1
src/screens/auth/components/SocialSignInButton.tsx  # Task 1.2
src/screens/auth/components/AuthDivider.tsx   # Task 1.3
src/screens/auth/components/AuthError.tsx     # Task 2.1
src/screens/auth/utils/mapOAuthError.ts       # Task 2.2
src/screens/auth/utils/index.ts               # Task 2.2
```

### Modified Files
```
src/screens/auth/WelcomeScreen.tsx            # Task 1.4
src/screens/auth/SignInScreen.tsx             # Task 2.4
src/screens/auth/SignUpScreen.tsx             # Task 2.5
app.json                                       # Task 3.3
```

### External Configuration
```
Clerk Dashboard → Social Connections           # Tasks 1.5, 3.1, 3.2
Google Cloud Console → OAuth Credentials       # Task 3.1
Apple Developer Portal → Identifiers & Keys    # Task 3.2
```

---

*Specification Version: 1.2*
*Created: January 2026*
*Last Updated: January 2026*
*Code Review Added: January 2026*
