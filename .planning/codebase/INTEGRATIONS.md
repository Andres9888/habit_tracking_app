# External Integrations

**Analysis Date:** 2025-03-19

## APIs & External Services

**Authentication & User Identity:**
- Clerk - User authentication and session management
  - SDK/Client: `@clerk/clerk-expo` v2.19.25
  - Configuration: `src/lib/appConfig/clerk.ts`
  - Auth domain: `CLERK_AUTH_DOMAIN` environment variable
  - Publishable key: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` environment variable
  - Token storage: `src/lib/appConfig/tokenCache.ts` (platform-specific secure storage)
  - Provider setup: `src/app/AppProviders.tsx` (ClerkProvider wraps app)

**Error Tracking & Monitoring:**
- Sentry - Error tracking and performance monitoring
  - SDK/Client: `@sentry/react-native` v7.2.0
  - Initialization: `src/lib/sentry/init/init.ts`
  - Configuration: `src/lib/sentry/config.ts`
  - Features: Native crash handling, session tracking, breadcrumbs, performance traces
  - Integration: `src/app/initializeAppMonitoring.ts` (initialized at app startup)
  - Provider setup: `src/providers/SentryUserSync.tsx` (syncs user context with Sentry)
  - Environment-based DSN configuration (dev/staging/prod)

**AI/LLM APIs:**
- OpenAI - AI capabilities for Claude Code integration
  - SDK/Client: `openai` v4.77.0 (installed but usage not detected in app code)
  - Purpose: Available for extended functionality and Claude Code features
  - API key: `OPENAI_API_KEY` environment variable (optional)

**Payments & Monetization:**
- RevenueCat - In-app purchases and subscription management
  - SDK/Client: Lazy-loaded native `react-native-purchases` (not in package.json)
  - UI Component: `react-native-purchases-ui` v9.7.1
  - Initialization: `src/lib/purchases/init.ts`
  - Client lazy-loading: `src/lib/purchases/client.ts` (loads only on native platforms, not Expo Go)
  - API keys:
    - iOS: `EXPO_PUBLIC_REVENUECAT_IOS_KEY`
    - Android: `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`
  - User management: `identifyUser()` syncs Clerk user ID with RevenueCat
  - Availability check: `isPurchasesAvailable()` confirms native module loaded

## Data Storage

**Databases:**
- Convex - Backend-as-a-service with real-time database
  - Connection: `EXPO_PUBLIC_CONVEX_URL` environment variable
  - Client: `ConvexReactClient` from `convex/react`
  - Client initialization: `src/lib/appConfig/convexClient.ts`
  - Authentication: Clerk JWT tokens exchanged via `@convex-dev/auth` v0.0.90
  - Auth configuration: `convex/auth.config.ts`
  - Schema: `convex/schema.ts` (93+ backend TypeScript files in `convex/` directory)
  - Key tables: habits, users, templates, subscriptions, analytics, completions
  - Code-generated API: `convex/_generated/api.d.ts` (auto-generated from schema)
  - Real-time subscriptions: Built-in via Convex React hooks (`useQuery`, `useMutation`)
  - Provider setup: `src/providers/ConvexClerk.provider.tsx` (syncs Clerk auth with Convex)

**Local Storage:**
- AsyncStorage (React Native) - Local device persistence
  - Package: `@react-native-async-storage/async-storage` v2.2.0
  - Purpose: Offline support, local caching, settings
  - Implementation: `src/lib/optimistic/` directory for offline mutations
  - Offline queue: `src/providers/OfflineProvider/` manages queued mutations during offline periods

**Secure Token Storage:**
- Expo Secure Store - Platform-native credential storage
  - Package: `expo-secure-store` v15.0.7
  - Purpose: Storing Clerk auth tokens securely
  - Used by: `src/lib/appConfig/tokenCache.ts` (provides `tokenCache` for ClerkProvider)

## Authentication & Identity

**Auth Provider:**
- Clerk - Primary authentication system
  - Implementation: JWT-based with Expo Secure Store for token persistence
  - Token exchange: Clerk tokens converted to Convex tokens via `@convex-dev/auth`
  - Clerk domain configuration: `CLERK_AUTH_DOMAIN` environment variable (required)
  - Publishable key: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` (required)
  - User sync: `AuthGate.tsx` calls `getOrCreateUser` mutation on sign-in
  - User context: Synced to Sentry via `SentryUserSync.tsx` provider

**Token Flow:**
1. User authenticates via Clerk
2. Clerk JWT stored in secure device storage (Expo Secure Store)
3. Convex client requests token via getToken({ template: 'convex' })
4. Clerk exchanges JWT for Convex-specific JWT
5. Convex validates JWT and allows database access
6. User context synced to Sentry for error tracking

## Monitoring & Observability

**Error Tracking:**
- Sentry - Production error tracking and performance monitoring
  - Configuration: `src/lib/sentry/config.ts`
  - Initialization: `src/lib/sentry/init/init.ts`
  - Features:
    - Native crash handling via `enableNativeCrashHandling: true`
    - Auto session tracking via `enableAutoSessionTracking: true`
    - React Navigation integration
    - Performance traces with configurable sample rates
    - Breadcrumb filtering via `beforeBreadcrumb` callback
    - Error filtering via `beforeSend` callback
  - User context: Synced from Clerk via `SentryUserSync.tsx`
  - Environment configuration: Auto-detected or explicitly set
  - DSN sourced from environment variables

**Logs:**
- Console logging - Development only via `__DEV__` checks
  - Used for integration debugging (Clerk, Convex, Sentry, RevenueCat, Purchases)
  - Errors logged before exceptions thrown
  - Warnings for missing environment variables

**Performance:**
- Sentry performance monitoring - Built into Sentry SDK
- Real-time updates: Via Convex real-time subscriptions (WebSocket-based)

## CI/CD & Deployment

**Hosting:**
- Expo for mobile - iOS/Android app deployment via Expo Application Services
- Convex cloud - Backend deployment at `convex deploy --prod` or `convex deploy --preview`
- Website subdirectory - Next.js app in `website/` folder (separate from mobile app)

**Deployment Commands:**
- Mobile: `npm run deploy` → `convex deploy --prod`
- Mobile Preview: `npm run deploy:preview` → `convex deploy --preview`
- Frontend dev: `npm run dev` → Expo dev server + Convex dev server
- Web export: `npm run lint` includes `expo export -p web`

**CI Pipeline:**
- Pre-commit hooks: eslint --fix + prettier (via husky + lint-staged)
- Tests: `npm run test`, `npm run test:watch`, `npm run test:coverage`
- Security: `npm run test:security` runs security-focused tests
- Audits: `npm run audit:deps`, `npm run audit:licenses`, `npm run audit:security`

## Environment Configuration

**Required env vars:**
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication key (pk_test_... or pk_live_...)
- `EXPO_PUBLIC_CONVEX_URL` - Convex backend URL (https://...)
- `CLERK_AUTH_DOMAIN` - Clerk authentication domain (https://your-domain.clerk.accounts.dev)

**Optional AI API keys:**
- `ANTHROPIC_API_KEY` - Anthropic Claude API (for extended features)
- `OPENAI_API_KEY` - OpenAI GPT models
- `PERPLEXITY_API_KEY` - Perplexity research model
- `GOOGLE_API_KEY` - Google Gemini models
- `MISTRAL_API_KEY` - Mistral AI models
- `XAI_API_KEY` - xAI Grok models
- `GROQ_API_KEY` - Groq models
- `OPENROUTER_API_KEY` - Multiple model aggregator
- `AZURE_OPENAI_API_KEY` - Azure OpenAI deployment
- `OLLAMA_API_KEY` - Local Ollama server authentication
- `GITHUB_API_KEY` - GitHub API for import/export

**Optional monetization vars:**
- `EXPO_PUBLIC_REVENUECAT_IOS_KEY` - RevenueCat iOS app key
- `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` - RevenueCat Android app key

**Secrets location:**
- `.env.local` - Local development (git-ignored)
- `.env.example` - Template with required/optional keys documented
- `.env.mcp.example` - MCP server configuration template
- Convex deployment: Secrets via Convex environment variables
- Pre-commit hooks ensure no secrets committed

## Webhooks & Callbacks

**Incoming:**
- Clerk webhooks - Not detected in codebase (handled by @convex-dev/auth integration)
- RevenueCat webhooks - Not detected in codebase (handled by RevenueCat dashboard)

**Outgoing:**
- Sentry events - Sent to Sentry DSN for error tracking
- Convex mutations - Real-time database updates to Convex backend

**User Lifecycle:**
- Sign-up: Clerk → Convex (getOrCreateUser mutation)
- Sign-in: Clerk → Convex sync
- Sign-out: Convex → RevenueCat (logoutPurchases)
- Error events: App → Sentry (contextual user information)

## Platform-Specific Considerations

**Web (Expo Web + Vite):**
- RevenueCat: Disabled (native SDK unavailable)
- Purchases: Not initialized on web platform
- Device APIs: Limited to browser capabilities
- Build: Uses Vite + React instead of Metro

**Expo Go:**
- RevenueCat: Disabled (native modules not available in managed service)
- Native modules: Requires compiled Expo app (.ipa/.apk) for RevenueCat
- Development: Uses Expo Go app for rapid testing

**iOS/Android (Native):**
- RevenueCat: Fully enabled, manages subscriptions
- Native modules: Loaded dynamically to avoid Expo Go errors
- Push notifications: Via expo-notifications with native handlers

---

*Integration audit: 2025-03-19*
