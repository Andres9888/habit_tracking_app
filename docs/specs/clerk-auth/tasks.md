# Clerk Authentication Integration - Tasks

**Spec:** [tech-spec.md](./tech-spec.md)
**Total Points:** 19
**Estimated Duration:** 3-5 days

---

## Epic: Clerk Authentication Integration

### Phase 1: Setup

#### Task 1: Set up Clerk Dashboard
**Priority:** High | **Points:** 2 | **Dependencies:** None

**Description:**
Set up Clerk Dashboard with OAuth providers and email/password authentication.

**Acceptance Criteria:**
- [ ] Create Clerk application at dashboard.clerk.com
- [ ] Enable Email/Password authentication with email verification
- [ ] Configure Google OAuth with Google Cloud credentials
- [ ] Configure Apple OAuth with Apple Developer credentials
- [ ] Create JWT template named `convex` with audience `convex`
- [ ] Add allowed redirect URLs:
  - `exp://` (Expo Go development)
  - `habit-tracker://` (production deep link)
- [ ] Copy Publishable Key and Secret Key

**BLOCKED - Manual Setup Required:**
This task requires manual configuration in the Clerk Dashboard (dashboard.clerk.com) and cannot be automated. A human must complete the following:
1. Create Clerk account and application
2. Configure OAuth providers with external credentials (Google Cloud, Apple Developer)
3. Set up JWT templates
4. Copy API keys to local environment

---

#### Task 2: Install dependencies and configure environment
**Priority:** High | **Points:** 1 | **Dependencies:** Task 1
**Status:** Partially Complete (2025-12-20)

**Description:**
Install Clerk Expo SDK and configure environment variables.

**Acceptance Criteria:**
- [x] Install `@clerk/clerk-expo@^2.5.0` *(v2.15.4 already installed)*
- [x] Install `expo-auth-session@~6.2.1` *(v7.0.9 already installed)*
- [x] Install `expo-web-browser@~15.0.1` *(v15.0.9 already installed)*
- [ ] Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env.local` *(BLOCKED: requires Task 1)*
- [x] Add `scheme: "habit-tracker"` to `app.json`
- [x] Verify `expo-secure-store` already installed *(v15.0.7 installed)*

**Implementation Notes:**
- All npm dependencies are already installed with compatible versions
- Deep link scheme added to app.json
- Environment variable placeholder exists in .env.example
- BLOCKED: Cannot add Clerk publishable key until Task 1 (Clerk Dashboard setup) is complete

---

#### Task 3: Add users table to Convex schema
**Priority:** High | **Points:** 1 | **Dependencies:** None
**Status:** ✅ COMPLETED (2025-12-20)

**Description:**
Add users table to Convex schema for storing user data synced from Clerk.

**Acceptance Criteria:**
- [x] Add `users` table to `convex/schema.ts` with fields:
  - `clerkId: v.string()`
  - `email: v.string()`
  - `name: v.optional(v.string())`
  - `imageUrl: v.optional(v.string())`
  - `createdAt: v.number()`
  - `lastLoginAt: v.number()`
- [x] Add index `by_clerk_id` on `clerkId`
- [x] Add index `by_email` on `email`
- [x] Run `npx convex dev` to apply schema

**Implementation Notes:**
- Fields made optional for backwards compatibility with existing anonymous users (isAnonymous: true)
- Added `isAnonymous` field to schema for legacy support
- Schema deployed successfully to development environment

---

#### Task 4: Configure Convex JWT validation for Clerk
**Priority:** High | **Points:** 2 | **Dependencies:** Task 1, Task 3

**Description:**
Configure Convex to validate Clerk JWTs for authentication.

**Acceptance Criteria:**
- [ ] Update `convex/auth.config.ts` with Clerk domain and applicationID
- [ ] Set `CLERK_SECRET_KEY` in Convex environment (`npx convex env set`)
- [ ] Verify `ctx.auth.getUserIdentity()` returns user info in a test query
- [ ] Deploy to Convex

---

### Phase 2: Core Auth

#### Task 5: Update App.tsx with auth providers
**Priority:** High | **Points:** 2 | **Dependencies:** Task 2, Task 4

**Description:**
Wrap app with ClerkProvider and ConvexProviderWithClerk for authentication.

**Acceptance Criteria:**
- [ ] Import `ClerkProvider`, `ClerkLoaded` from `@clerk/clerk-expo`
- [ ] Import `ConvexProviderWithClerk` from `convex/react-clerk`
- [ ] Create `tokenCache` object using `expo-secure-store`
- [ ] Wrap app with `ClerkProvider` → `ClerkLoaded` → `ConvexProviderWithClerk`
- [ ] Remove old Convex provider setup
- [ ] Verify app loads without errors

---

#### Task 6: Create AuthGate with user sync
**Priority:** High | **Points:** 2 | **Dependencies:** Task 5

**Description:**
Create AuthGate component that protects routes and syncs user to Convex on sign-in.

**Acceptance Criteria:**
- [ ] Create `src/components/auth/AuthGate.tsx`
- [ ] Use `useAuth()` from Clerk to check authentication state
- [ ] Create `convex/users.ts` with `getOrCreateUser` mutation
- [ ] Call `getOrCreateUser` on sign-in to sync user to Convex
- [ ] Show `AuthLoadingScreen` while loading
- [ ] Show `WelcomeScreen` when not signed in
- [ ] Show `HabitsApp` when signed in
- [ ] Create `currentUser` query to fetch current user data

---

### Phase 3: Auth Screens

#### Task 7: Add social login to SignInScreen
**Priority:** Medium | **Points:** 2 | **Dependencies:** Task 5

**Description:**
Add Google and Apple sign-in buttons to the existing SignInScreen.

**Acceptance Criteria:**
- [ ] Create `src/components/auth/SocialLoginButtons.tsx`
- [ ] Implement `useOAuth` hook for Google OAuth flow
- [ ] Implement `useOAuth` hook for Apple OAuth flow
- [ ] Add `WebBrowser.maybeCompleteAuthSession()` for OAuth completion
- [ ] Add social login buttons to `SignInScreen`
- [ ] Handle OAuth errors with user-friendly messages
- [ ] Test Google sign-in flow
- [ ] Test Apple sign-in flow

---

#### Task 8: Add social login to SignUpScreen
**Priority:** Medium | **Points:** 2 | **Dependencies:** Task 7

**Description:**
Add Google and Apple sign-up buttons to the existing SignUpScreen.

**Acceptance Criteria:**
- [ ] Reuse `SocialLoginButtons` component from Task 7
- [ ] Add social login buttons to `SignUpScreen`
- [ ] Ensure OAuth creates new user if not exists
- [ ] Test sign-up with Google
- [ ] Test sign-up with Apple

---

#### Task 9: Create ForgotPasswordScreen
**Priority:** Medium | **Points:** 2 | **Dependencies:** Task 5

**Description:**
Create password reset flow for email/password users.

**Acceptance Criteria:**
- [ ] Create `src/screens/auth/ForgotPasswordScreen.tsx`
- [ ] Use `useSignIn().signIn.create()` with `strategy: "reset_password_email_code"`
- [ ] Implement email input → send code → verify code → set new password
- [ ] Add navigation from SignInScreen to ForgotPasswordScreen
- [ ] Handle errors (invalid email, expired code, etc.)
- [ ] Test password reset flow end-to-end

---

### Phase 4: Polish

#### Task 10: End-to-end testing and polish
**Priority:** Medium | **Points:** 3 | **Dependencies:** Task 6, Task 7, Task 8, Task 9

**Description:**
Test all auth flows, handle edge cases, and polish the experience.

**Acceptance Criteria:**
- [ ] Test: Sign up with email → verify → lands in app
- [ ] Test: Sign in with email/password → lands in app
- [ ] Test: Sign in with Google → lands in app
- [ ] Test: Sign in with Apple → lands in app
- [ ] Test: Kill app → reopen → still authenticated
- [ ] Test: Sign out → returns to welcome screen
- [ ] Test: User appears in Convex users table after sign-in
- [ ] Test: Existing habits load for authenticated user
- [ ] Handle session expiry gracefully
- [ ] Handle network errors with retry/offline messaging
- [ ] Add loading states to all auth buttons
- [ ] Verify deep links work on physical devices

---

## Summary

| Phase | Tasks | Points |
|-------|-------|--------|
| Phase 1: Setup | 1, 2, 3, 4 | 6 |
| Phase 2: Core Auth | 5, 6 | 4 |
| Phase 3: Auth Screens | 7, 8, 9 | 6 |
| Phase 4: Polish | 10 | 3 |
| **Total** | **10 tasks** | **19 points** |

---

## Dependency Graph

```
Task 1 (Clerk Dashboard)
    └── Task 2 (Install deps)
    │       └── Task 5 (App.tsx)
    │               └── Task 6 (AuthGate)
    │               └── Task 7 (SignIn social)
    │               │       └── Task 8 (SignUp social)
    │               └── Task 9 (Forgot password)
    └── Task 4 (Convex JWT)
            └── Task 5 (App.tsx)

Task 3 (Users table)
    └── Task 4 (Convex JWT)

Task 6, 7, 8, 9 → Task 10 (E2E testing)
```

---

_Generated from tech-spec.md | Ready for implementation_
