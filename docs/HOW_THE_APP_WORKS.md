# How the App Works

A developer onboarding guide to the Habit Tracking App architecture.

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Authentication (Clerk)](#2-authentication-clerk)
3. [Payments & Premium (RevenueCat)](#3-payments--premium-revenuecat)
4. [Backend (Convex)](#4-backend-convex)
5. [Offline Sync System](#5-offline-sync-system)
6. [Data Model](#6-data-model)
7. [Key File Map](#7-key-file-map)

---

## 1. High-Level Architecture

**Stack:** React Native (Expo) + Convex (real-time DB) + Clerk (auth) + RevenueCat (payments)

### Provider Hierarchy (src/App.tsx)

The app wraps everything in a nested provider tree. Order matters:

```
App
├── SentryErrorBoundary          ← Error tracking
├── SafeAreaProvider             ← Device safe areas
├── PaperProvider                ← Material Design theme
├── ClerkProvider                ← Auth (token cache + publishable key)
│   ├── SentryUserSync           ← Sends anonymous user ID to Sentry
│   └── ConvexClerkProvider      ← Syncs Clerk JWT → Convex client
│       ├── ThemeColorProvider   ← Dark/light mode
│       └── LazyProviders        ← Deferred 100ms for faster startup
│           ├── NetworkStatusProvider
│           ├── OfflineProvider
│           ├── SyncStatusProvider
│           ├── PurchasesProvider   ← RevenueCat
│           └── StreakMilestoneProvider
└── AuthGate                     ← Routes: login vs onboarding vs main app
```

### Screen Routing

There is **no React Navigation router**. The app uses conditional rendering via `AuthGate`:

```
AuthGate logic:
  if (!isLoaded)         → BrandedLoadingScreen
  if (!isSignedIn)       → WelcomeScreen (login/signup)
  if (!onboardingDone)   → OnboardingScreen
  if (isSignedIn)        → HabitsApp (main app)
```

Inside `HabitsApp`, all screens are modals managed by hook state in `useHabitsApp()` and `useHabitsAppHandlers()`. Opening a "screen" just sets a state variable that renders a modal overlay.

### State Management

No Redux or Zustand. Three patterns:

| Pattern | What it manages | Example |
|---------|----------------|---------|
| **Convex subscriptions** | Server data (habits, templates, analytics) | `useQuery(api.habits.list)` |
| **React Context** | Cross-cutting concerns | NetworkStatus, SyncStatus, Theme |
| **Local hook state** | UI state (modals, animations, forms) | `useHabitsApp()`, `useHabitsAppHandlers()` |

---

## 2. Authentication (Clerk)

### How Clerk is Set Up

**Config:**
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` env var (pk_test_... or pk_live_...)
- Token cache uses `expo-secure-store` (native keychain, not AsyncStorage)
- Configured in `src/lib/appConfig.ts`

**Provider:** `ClerkProvider` wraps the entire app in `src/App.tsx`.

### Auth Flows

#### Sign In (email/password)
```
SignInScreen → useSignInFlow() hook
  1. signIn.create({ identifier: email, password })
  2. On success: setActive({ session: createdSessionId })
  3. AuthGate detects isSignedIn=true → shows HabitsApp
```
**File:** `src/screens/auth/hooks/useSignInFlow.ts`

#### Sign Up (email/password)
```
SignUpScreen → useSignUpFlow() hook
  1. signUp.create({ emailAddress, password })
  2. signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
  3. User enters 6-digit code → VerificationView
  4. signUp.attemptEmailAddressVerification({ code })
  5. On success: setActive({ session: createdSessionId })
```
**File:** `src/screens/auth/hooks/useSignUpFlow.ts`

#### OAuth (Apple / Google)
```
SocialSignInButton → useOAuthSignIn() hook
  1. Uses useSSO() from @clerk/clerk-expo
  2. startSSOFlow({ strategy: 'oauth_google', redirectUrl: 'habit-tracker://sso-callback' })
  3. Native browser opens for OAuth consent
  4. On success: setActive({ session: createdSessionId })
```
**File:** `src/screens/auth/hooks/useOAuthSignIn.ts`

#### Sign Out
```
SettingsModal → AccountSection
  1. Confirmation dialog
  2. signOut() from useClerk()
  3. AuthGate detects isSignedIn=false → shows WelcomeScreen
```
**File:** `src/components/SettingsModal/AccountSection.tsx`

### How Auth Tokens Reach the Backend

```
Clerk SDK (client)
    ↓ getToken({ template: 'convex' })
ConvexClerkProvider
    ↓ convexClient.setAuth(tokenFetcher)
Convex SDK (auto-includes JWT in every request)
    ↓
Convex Server
    ↓ ctx.auth.getUserIdentity()
    → Returns { subject: clerkId, email, name }
```

**File:** `src/providers/ConvexClerkProvider.tsx`

The Convex server validates JWTs against Clerk's public keys. Configuration is in `convex/auth.config.ts`.

### How Auth is Enforced Server-Side

Every Convex function checks identity:

```typescript
// convex/habits/get.ts (example pattern)
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error('Not authenticated');
```

### User Record Sync

On first sign-in, `AuthGate` calls the `getOrCreateUser` mutation:
1. Extracts identity from JWT
2. Looks up user by `clerkId` index
3. If new → creates user record
4. If existing → updates `lastLoginAt`

**File:** `convex/users.ts`

---

## 3. Payments & Premium (RevenueCat)

### How RevenueCat is Set Up

**Config:**
- `EXPO_PUBLIC_REVENUECAT_IOS_KEY` and `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` env vars
- SDK lazy-loaded to avoid crashes in Expo Go

**Three layers:**
| File | Purpose |
|------|---------|
| `src/lib/purchases/client.ts` | Lazy-loads `react-native-purchases` |
| `src/lib/purchases/init.ts` | SDK lifecycle: initialize, identify user, logout |
| `src/lib/purchases/facade.ts` | Safe wrapper: getOfferings, purchasePackage, etc. |

**Provider:** `PurchasesProvider` in `src/components/providers/PurchasesProvider.tsx`
- Initializes SDK via `requestIdleCallback` (non-blocking)
- Auto-identifies user with Clerk ID when signed in
- Auto-logs out when user signs out

### How RevenueCat Connects to Clerk

The Clerk user ID is set as RevenueCat's `appUserID`:

```
Clerk signs user in → user.id available
  ↓
PurchasesProvider calls identifyUser(user.id)
  ↓
Purchases.logIn(user.id)  ← Sets RevenueCat appUserID = Clerk ID
  ↓
All purchases tied to this Clerk ID
  ↓
Webhook events include app_user_id = Clerk ID
```

This enables cross-device purchase sync.

### Product / Offering Structure

| Offering | Entitlement | Price |
|----------|-------------|-------|
| `default` | `premium` | $6.99/month (7-day free trial) |

Yearly package is optional (configured in RevenueCat dashboard).

### Purchase Flow

```
User taps "Start Free Trial"
  ↓
usePremiumActions().purchasePackage(monthlyPackage)
  ↓
Native App Store / Play Store sheet opens
  ↓
User completes purchase
  ↓
SDK returns updated customerInfo
  ↓
Client: usePremium() → isPremium=true (instant)
  ↓
Server: RevenueCat fires webhook → Convex
  ↓
Webhook handler verifies HMAC-SHA256 signature
  ↓
grantPremium() mutation → updates subscriptions + userSettings tables
```

### Checking Premium Status

**Client-side** (instant, from RevenueCat SDK):
```typescript
const { isPremium, status } = usePremium();
// status: 'loading' | 'free' | 'trialing' | 'active' | 'error'
```
**File:** `src/hooks/usePremium/usePremium.ts`

**Server-side** (authoritative, from database):
```typescript
const premium = await hasPremiumAccess(ctx, userId);
```
**File:** `convex/subscriptions/premiumCheck.ts`

### What's Gated Behind Premium

| Feature | Free Limit | Premium |
|---------|-----------|---------|
| Voice notes | 1 per habit | Unlimited |
| Vision board images | 4 per habit | Unlimited |
| Analytics screen | Locked | Full access |
| Habit limit | Limited | Unlimited |

### Paywall Components

Two paywall approaches exist:

1. **Custom paywalls** (`src/components/PremiumPaywall/PremiumPaywall.tsx`)
   - Variants: `motivation`, `benefits`, `analytics`
   - Custom UI with blur overlay

2. **RevenueCat native paywall** (`src/components/RevenueCatPaywall/RevenueCatPaywall.tsx`)
   - Uses `react-native-purchases-ui` component
   - Remotely configurable (no app update needed)
   - Built-in A/B testing

### Webhook Processing (Server-Side)

**File:** `convex/webhooks/revenuecat.ts`

RevenueCat sends events when subscription status changes:

| Event | Action |
|-------|--------|
| `INITIAL_PURCHASE`, `RENEWAL`, `UNCANCELLATION` | `grantPremium()` |
| `EXPIRATION` | `revokePremium()` |
| `CANCELLATION` | Update status (user keeps access until expiry) |
| `BILLING_ISSUE` | Mark billing issue (keep access during grace) |

Signature verification uses HMAC-SHA256 with `REVENUECAT_WEBHOOK_SECRET`.

---

## 4. Backend (Convex)

### What Convex Is

Convex is a real-time database + serverless functions platform. Think Firebase but with TypeScript functions, schema validation, and real-time subscriptions built in.

### How It Connects

```
React Client
  ↓ useQuery() / useMutation() from 'convex/react'
Convex SDK (auto-manages WebSocket connection)
  ↓
Convex Cloud (validates JWT, runs server function, returns data)
  ↓
Real-time: UI auto-updates when data changes (no polling)
```

**Config:** `src/lib/appConfig.ts` creates the Convex client with `EXPO_PUBLIC_CONVEX_URL`.

### Key Function Types

| Type | Purpose | Example |
|------|---------|---------|
| `query` | Read data (cached, real-time) | `api.habits.list` |
| `mutation` | Write data (transactional) | `api.habits.toggle` |
| `action` | Side effects (external APIs) | Calling OpenAI |
| `httpAction` | HTTP endpoints | RevenueCat webhook |

### Database Schema

Defined in `convex/schema.ts`. Key tables:

- `habits` - Core habit records
- `tracking` - Completion history (one row per habit per day)
- `users` - Auth + profile
- `subscriptions` - RevenueCat subscription data
- `userSettings` - Preferences + `hasPremium` flag
- `templates` - Pre-built habit templates
- `habitStrength` - Psychology-based strength calculations
- `affirmations`, `letters`, `voiceNotes`, `notes` - Premium features

---

## 5. Offline Sync System

### Architecture

Located in `src/lib/offline/`. The app is offline-first: UI updates optimistically, operations queue locally, and sync when reconnected.

```
User Action (e.g., toggle habit)
  ↓
Optimistic UI Update (instant feedback)
  ↓
Queue Operation (persisted to AsyncStorage)
  ↓
If Online → Process immediately
If Offline → Wait for reconnection
  ↓
SyncOrchestrator detects connectivity
  ↓
Circuit Breaker checks API health
  ↓
Process queue with retry strategy
  ↓
Success → Remove from queue
Failure → Retry with exponential backoff (1s, 2s, 4s, 8s, 16s)
```

### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| Queue Manager | `src/lib/offline/queueManager/` | Stores/deduplicates pending operations |
| Sync Orchestrator | `src/lib/offline/sync/useSyncOrchestrator.ts` | Coordinates sync timing |
| Error Classifier | `src/lib/offline/errorClassifier/` | Determines if errors are retryable |
| Circuit Breaker | `src/lib/offline/circuitBreaker/` | Prevents hammering a down API |
| Retry Strategy | `src/lib/offline/retryStrategy/` | Exponential backoff logic |
| Persistence | `src/lib/offline/persistence/` | AsyncStorage for queue survival |

### UI Indicators

Sync status is shown via `SyncStatusContext` and `SyncStatusOverlays`:
- Pending changes indicator
- Sync-in-progress spinner
- Error banners with retry option

---

## 6. Data Model

### Habit (simplified)

```
habit {
  name, icon, color, tags
  identity                    ← "I am a healthy person" (James Clear)
  why                         ← Motivation/reason

  frequency                   ← daily | weekly | custom
  daysOfWeek                  ← [0,1,2,3,4,5,6]
  cueTime, cueLocation        ← Habit cue triggers
  cueAfterBehavior            ← "After I pour coffee"

  currentStreak, bestStreak    ← Streak tracking
  totalCompletions, totalMisses

  strength                    ← 0-1 (psychology-based, Zhang et al. 2021)
  strengthLevel               ← starting | building | strong | automatic

  woopWish, woopOutcome       ← WOOP framework (Oettingen, 2014)
  woopObstacle, woopPlan

  vizSuccess*, vizFailure*    ← Dual visualization (Huberman Protocol)

  paused, archived            ← Soft-delete states
  userId                      ← Clerk ID (ownership)
  order                       ← Sort position (drag-to-reorder)
}
```

### Tracking

One row per habit per day:
```
tracking {
  habitId, userId, date (YYYY-MM-DD), completed, completedAt
}
```

### User

```
users {
  clerkId, email, name, imageUrl, lastLoginAt
}
```

### Subscription

```
subscriptions {
  clerkId, status, planType, startedAt, expiresAt, hasBillingIssue
}
```

---

## 7. Key File Map

### Auth
| File | What it does |
|------|-------------|
| `src/App.tsx` | Provider hierarchy, ClerkProvider setup |
| `src/lib/appConfig.ts` | Token cache (expo-secure-store) |
| `src/components/auth/AuthGate.tsx` | Routes: login vs app |
| `src/screens/auth/WelcomeScreen.tsx` | Login/signup landing |
| `src/screens/auth/hooks/useSignInFlow.ts` | Email/password sign-in |
| `src/screens/auth/hooks/useSignUpFlow.ts` | Sign-up + email verification |
| `src/screens/auth/hooks/useOAuthSignIn.ts` | Apple/Google OAuth |
| `src/providers/ConvexClerkProvider.tsx` | Syncs Clerk JWT → Convex |
| `convex/auth.config.ts` | Clerk config for Convex server |
| `convex/users.ts` | User create/update on login |

### Payments
| File | What it does |
|------|-------------|
| `src/lib/purchases/client.ts` | Lazy-loads RevenueCat SDK |
| `src/lib/purchases/init.ts` | SDK init, identify user, logout |
| `src/lib/purchases/facade.ts` | Safe wrapper for SDK calls |
| `src/components/providers/PurchasesProvider.tsx` | Initializes SDK on app start |
| `src/hooks/usePremium/usePremium.ts` | Main hook: isPremium, packages, actions |
| `src/hooks/usePremium/usePremiumData.ts` | Fetches customer info + offerings |
| `src/hooks/usePremium/usePremiumActions.ts` | Purchase, restore, refresh |
| `src/components/PremiumPaywall/PremiumPaywall.tsx` | Custom paywall UI |
| `src/components/RevenueCatPaywall/RevenueCatPaywall.tsx` | Native paywall UI |
| `convex/webhooks/revenuecat.ts` | Webhook handler |
| `convex/subscriptions/premiumCheck.ts` | Server-side premium check |

### Backend
| File | What it does |
|------|-------------|
| `convex/schema.ts` | All table definitions |
| `convex/habits/` | Habit CRUD, toggle, stats |
| `convex/users.ts` | User management |
| `convex/templates.ts` | Habit template library |
| `convex/subscriptions.ts` | Premium mutations |

### Offline
| File | What it does |
|------|-------------|
| `src/lib/offline/queueManager/` | Queue state management |
| `src/lib/offline/sync/useSyncOrchestrator.ts` | Sync coordination |
| `src/lib/offline/circuitBreaker/` | Prevents API hammering |
| `src/lib/offline/retryStrategy/` | Exponential backoff |
| `src/contexts/SyncStatusContext/` | Sync status for UI |

### Main App
| File | What it does |
|------|-------------|
| `src/features/habits/HabitsApp.tsx` | Main screen orchestrator |
| `src/features/habits/hooks/useHabitsApp.ts` | Habits list state |
| `src/features/habits/hooks/useHabitsAppHandlers.ts` | Modal/action handlers |
| `src/features/habits/components/HabitsAppOverlays.tsx` | All modal screens |
| `src/features/habits/components/BottomActionBar/` | FAB + navigation bar |
| `src/components/CalendarTimeline/` | Week view + day cells |
| `src/theme/` | Colors, typography, spacing |

---

## Quick Mental Model

```
┌─────────────────────────────────────────────────┐
│  Clerk handles who you are                      │
│  Convex handles what you see (real-time data)   │
│  RevenueCat handles what you can access (premium)│
│  Offline system handles when you're disconnected │
└─────────────────────────────────────────────────┘

Data flow:
  Clerk JWT → Convex (every request is authenticated)
  Clerk ID → RevenueCat (purchases tied to identity)
  RevenueCat webhook → Convex (server-side premium sync)
  Offline queue → Convex (syncs when reconnected)
```
