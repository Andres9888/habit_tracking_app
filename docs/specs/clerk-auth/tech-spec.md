# Clerk Authentication Integration - Technical Specification

**Author:** Jane
**Date:** 2025-12-20
**Project Level:** Level 1 (Coherent Feature)
**Project Type:** Mobile application (React Native + Expo + Convex)
**Development Context:** Brownfield — adding to existing clean codebase

---

## Source Tree Structure

```
src/
├── App.tsx                          # UPDATE: Wrap with ClerkProvider + ConvexProviderWithClerk
├── providers/
│   └── AuthProvider.tsx             # NEW: Auth context and provider setup
├── screens/auth/
│   ├── WelcomeScreen.tsx            # UPDATE: Integrate with new auth flow
│   ├── SignInScreen.tsx             # UPDATE: Add social login buttons
│   ├── SignUpScreen.tsx             # UPDATE: Add social login buttons
│   └── ForgotPasswordScreen.tsx     # NEW: Password reset flow
├── components/auth/
│   ├── SocialLoginButtons.tsx       # NEW: Google + Apple sign-in buttons
│   ├── AuthGate.tsx                 # NEW: Protect routes requiring auth
│   └── AuthLoadingScreen.tsx        # NEW: Loading state during auth check
├── hooks/
│   └── useAuth.ts                   # NEW: Auth state and actions hook
└── lib/
    └── clerk.ts                     # NEW: Clerk configuration

convex/
├── auth.config.ts                   # UPDATE: Configure Clerk JWT provider
├── schema.ts                        # UPDATE: Add users table
├── users.ts                         # NEW: User CRUD operations
└── http.ts                          # NEW: Clerk webhook handler (optional)

.env.local                           # UPDATE: Add Clerk keys
app.json                             # UPDATE: Add OAuth scheme
```

---

## Technical Approach

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        React Native App                      │
├─────────────────────────────────────────────────────────────┤
│  ClerkProvider (expo-secure-store token cache)              │
│    └── ConvexProviderWithClerk (JWT auth)                   │
│          └── AuthGate                                        │
│                ├── Authenticated → HabitsApp                │
│                └── Unauthenticated → WelcomeScreen          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Clerk Backend                           │
│  • JWT issuance                                              │
│  • OAuth providers (Google, Apple)                           │
│  • Email/password management                                 │
│  • Session management                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Convex Backend                          │
│  • JWT validation via auth.config.ts                         │
│  • ctx.auth.getUserIdentity() for user info                  │
│  • users table for app-specific user data                    │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

1. **App Launch** → ClerkProvider initializes, checks SecureStore for session
2. **No Session** → Show WelcomeScreen with Sign In / Sign Up options
3. **Sign Up Flow**:
   - Email/password → Clerk creates user → Email verification → Session created
   - Social (Google/Apple) → OAuth flow → Session created
4. **Sign In Flow**:
   - Email/password → Clerk validates → Session created
   - Social → OAuth flow → Session created
5. **Session Created** → Convex receives JWT → User synced to `users` table → HabitsApp loads
6. **Subsequent Launches** → Session restored from SecureStore → Auto-authenticated

---

## Implementation Stack

### Dependencies to Install

```json
{
  "@clerk/clerk-expo": "^2.5.0",
  "expo-auth-session": "~6.2.1",
  "expo-web-browser": "~15.0.1"
}
```

**Note:** `expo-secure-store` already installed (used for token caching).

### Clerk Dashboard Configuration

- **Instance Name:** habit-tracking-app
- **Enabled Auth Methods:**
  - Email/password (with email verification)
  - Google OAuth
  - Apple OAuth (Sign in with Apple)
- **JWT Template:** Create custom template for Convex with `convex` audience
- **Allowed Redirect URLs:**
  - `exp://` (Expo Go development)
  - `habit-tracker://` (production deep link scheme)

### Environment Variables

```bash
# .env.local
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...  # For Convex backend only
```

---

## Technical Details

### 1. Clerk Provider Setup (`src/App.tsx`)

```tsx
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import * as SecureStore from 'expo-secure-store';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
  async clearToken(key: string) {
    return SecureStore.deleteItemAsync(key);
  },
};

export default function App() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <AuthGate />
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
```

### 2. Convex Auth Configuration (`convex/auth.config.ts`)

```ts
export default {
  providers: [
    {
      domain: "https://your-clerk-instance.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
```

### 3. Users Table Schema (`convex/schema.ts`)

```ts
users: defineTable({
  clerkId: v.string(),          // Clerk user ID (subject from JWT)
  email: v.string(),
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  createdAt: v.number(),
  lastLoginAt: v.number(),
})
  .index("by_clerk_id", ["clerkId"])
  .index("by_email", ["email"]),
```

### 4. User Sync on First Login (`convex/users.ts`)

```ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existing) {
      // Update last login
      await ctx.db.patch(existing._id, { lastLoginAt: Date.now() });
      return existing._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email!,
      name: identity.name,
      imageUrl: identity.pictureUrl,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    });
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});
```

### 5. Social Login Buttons Component

```tsx
// src/components/auth/SocialLoginButtons.tsx
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export function SocialLoginButtons() {
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: 'oauth_apple' });

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleFlow({
        redirectUrl: Linking.createURL('/'),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error('Google OAuth error:', err);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startAppleFlow({
        redirectUrl: Linking.createURL('/'),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error('Apple OAuth error:', err);
    }
  };

  return (
    <View>
      <Button onPress={handleGoogleSignIn}>Continue with Google</Button>
      <Button onPress={handleAppleSignIn}>Continue with Apple</Button>
    </View>
  );
}
```

### 6. Auth Gate Component

```tsx
// src/components/auth/AuthGate.tsx
import { useAuth } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  useEffect(() => {
    if (isSignedIn) {
      getOrCreateUser(); // Sync user to Convex on sign-in
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return <AuthLoadingScreen />;
  }

  if (!isSignedIn) {
    return <WelcomeScreen />;
  }

  return <>{children}</>;
}
```

---

## Development Setup

### 1. Clerk Dashboard Setup

1. Create Clerk application at dashboard.clerk.com
2. Enable Email/Password authentication
3. Enable Google OAuth (add Google Cloud OAuth credentials)
4. Enable Apple OAuth (add Apple Developer credentials)
5. Create JWT template for Convex:
   - Name: `convex`
   - Audience: `convex`
   - Claims: default (includes `sub`, `email`, `name`, `picture`)
6. Copy Publishable Key and Secret Key

### 2. Environment Configuration

```bash
# Add to .env.local
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

### 3. App Configuration (`app.json`)

```json
{
  "expo": {
    "scheme": "habit-tracker",
    "plugins": [
      "expo-secure-store"
    ]
  }
}
```

### 4. Convex Backend Deployment

```bash
npx convex env set CLERK_SECRET_KEY=sk_test_xxxxx
npx convex deploy
```

---

## Implementation Guide

### Phase 1: Setup (Stories 1-2)

1. **Install dependencies** and configure environment
2. **Set up Clerk Dashboard** with OAuth providers
3. **Configure Convex auth** with Clerk JWT validation
4. **Add users table** to schema

### Phase 2: Core Auth (Stories 3-5)

5. **Update App.tsx** with ClerkProvider + ConvexProviderWithClerk
6. **Create AuthGate** component for route protection
7. **Implement user sync** mutation in Convex

### Phase 3: Auth Screens (Stories 6-8)

8. **Update SignInScreen** with social login buttons
9. **Update SignUpScreen** with social login buttons
10. **Create ForgotPasswordScreen** for password reset

### Phase 4: Polish (Stories 9-10)

11. **Handle edge cases** (session expiry, network errors)
12. **Add loading states** and error handling
13. **Test all auth flows** end-to-end

---

## Testing Approach

### Unit Tests

- `useAuth` hook behavior
- User sync mutation logic
- Token cache operations

### Integration Tests

- Email/password sign-up flow
- Email/password sign-in flow
- Google OAuth flow
- Apple OAuth flow
- Session persistence across app restarts
- Convex queries with authenticated user

### Manual Testing Checklist

- [ ] Sign up with email → verify email → lands in app
- [ ] Sign in with email/password → lands in app
- [ ] Sign in with Google → lands in app
- [ ] Sign in with Apple → lands in app
- [ ] Kill app → reopen → still authenticated
- [ ] Sign out → returns to welcome screen
- [ ] Sign in → user appears in Convex users table
- [ ] Existing habits load for authenticated user

---

## Deployment Strategy

### Development

1. Use Clerk test instance (`pk_test_*`)
2. Test OAuth flows in Expo Go and dev builds
3. Verify Convex integration in development deployment

### Staging

1. Create Clerk staging instance (or use test mode)
2. Test with production OAuth credentials in sandbox mode
3. Verify deep link handling on physical devices

### Production

1. Switch to Clerk production keys (`pk_live_*`)
2. Ensure OAuth redirect URLs include production scheme
3. Deploy Convex with production Clerk secret
4. Monitor auth errors in Clerk dashboard

### Rollback Plan

If issues arise:
1. Clerk has instance-level kill switch for OAuth
2. Can revert to email-only auth quickly
3. Convex auth config change is instant (no deploy needed)

---

## Stories Breakdown

| # | Story | Points | Dependencies |
|---|-------|--------|--------------|
| 1 | Set up Clerk Dashboard with OAuth providers | 2 | None |
| 2 | Install dependencies and configure env | 1 | 1 |
| 3 | Add users table to Convex schema | 1 | None |
| 4 | Configure Convex JWT validation for Clerk | 2 | 1, 3 |
| 5 | Update App.tsx with auth providers | 2 | 2, 4 |
| 6 | Create AuthGate with user sync | 2 | 5 |
| 7 | Add social login to SignInScreen | 2 | 5 |
| 8 | Add social login to SignUpScreen | 2 | 5 |
| 9 | Create ForgotPasswordScreen | 2 | 5 |
| 10 | End-to-end testing and polish | 3 | 6-9 |

**Total:** 19 points (~3-5 days)

---

_This tech spec is for Level 1 projects (BMad Method v6). Ready for implementation._
