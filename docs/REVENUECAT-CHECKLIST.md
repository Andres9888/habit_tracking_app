# RevenueCat Integration Checklist

Complete these steps in order. Each section builds on the previous.

---

## 1. Apple Developer / App Store Connect

> **Why:** Apple requires subscription products to be created in App Store Connect before they can be sold. RevenueCat just orchestrates - Apple is the actual payment processor.

- [ ] **1.1** Ensure you have an Apple Developer account ($99/year)
- [ ] **1.2** Ensure your app is registered in App Store Connect with bundle ID: `com.andres9888.daily-habits`
- [ ] **1.3** Accept all agreements in App Store Connect (especially "Paid Apps" agreement)
  - Go to: App Store Connect → Agreements, Tax, and Banking
  - Must have bank account and tax info on file
- [ ] **1.4** Create a Subscription Group
  - App Store Connect → Your App → Subscriptions → Create Subscription Group
  - Name: "Premium" (or "Daily Habits Premium")
- [ ] **1.5** Create the Monthly Subscription Product
  - Inside the subscription group, click "Create Subscription"
  - Reference Name: "Monthly Premium"
  - Product ID: `premium_monthly` (you'll reference this in RevenueCat)
  - Price: $6.99 (Tier 5 in most regions)
  - Duration: 1 Month
  - Free Trial: 7 days (optional but recommended)
- [ ] **1.6** Fill in subscription metadata
  - Display Name: "Premium Monthly"
  - Description: "Unlock unlimited voice notes, letters to self, vision board, and more"
- [ ] **1.7** Create a Sandbox Tester account
  - App Store Connect → Users and Access → Sandbox Testers → Add
  - Use a real email you control (Apple sends verification)
  - This lets you test purchases without real charges

---

## 2. RevenueCat Dashboard

> **Why:** RevenueCat is the middleware that talks to Apple, provides webhooks, and simplifies the SDK.

- [ ] **2.1** Create RevenueCat account at https://app.revenuecat.com
- [ ] **2.2** Create a new Project (name: "Daily Habits")
- [ ] **2.3** Add iOS App
  - Click "Add App" → iOS
  - App name: "Daily Habits"
  - Bundle ID: `com.andres9888.daily-habits`
  - **Copy the Public API Key** (starts with `appl_`)
- [ ] **2.4** Connect to App Store Connect
  - RevenueCat → iOS App → App Store Connect Configuration
  - You'll need: App-Specific Shared Secret (from App Store Connect → Your App → App Information)
- [ ] **2.5** Create Entitlement
  - RevenueCat → Project → Entitlements → New
  - Identifier: `premium`
  - This is what your code checks for access
- [ ] **2.6** Create Products in RevenueCat
  - RevenueCat → Project → Products → New
  - Product ID: `premium_monthly`, Store: App Store
- [ ] **2.7** Attach Products to Entitlement
  - Click on `premium` entitlement → Attach Products
  - Select your iOS product
- [ ] **2.8** Create Offering
  - RevenueCat → Project → Offerings
  - Identifier: `default` (or leave as-is)
  - Add a Package: Select "Monthly" and attach your product
- [ ] **2.9** Note your Convex deployment URL for webhooks
  - You'll configure this after Convex is set up

---

## 3. Environment Variables (Local)

> **Why:** API keys need to be available to your app. The `EXPO_PUBLIC_` prefix exposes them to the JS bundle.

- [ ] **3.1** Create `.env.local` file in project root (if not exists)
- [ ] **3.2** Add RevenueCat iOS key:
  ```
  EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxxxxxxx
  ```
- [ ] **3.3** Add to `.gitignore` (if not already):
  ```
  .env.local
  ```

---

## 4. Expo / React Native Code

> **Why:** This is the actual integration code. SDK is already installed (`react-native-purchases`).

- [ ] **4.1** Create `src/lib/purchases.ts` - SDK initialization
- [ ] **4.2** Create `src/hooks/usePremium/types.ts` - TypeScript types
- [ ] **4.3** Create `src/hooks/usePremium/usePremium.ts` - Main hook
- [ ] **4.4** Create `src/hooks/usePremium/index.ts` - Exports
- [ ] **4.5** Create `src/components/providers/PurchasesProvider.tsx` - Init on auth
- [ ] **4.6** Update `src/App.tsx` - Add PurchasesProvider to provider tree
- [ ] **4.7** Update `MotivationPaywall` - Connect to usePremium hook
- [ ] **4.8** Replace hardcoded `isPremium` values across codebase

---

## 5. Convex Backend

> **Why:** Webhooks from RevenueCat update your database when subscriptions change. This is your source of truth.

- [ ] **5.1** Add `subscriptions` table to `convex/schema.ts`
- [ ] **5.2** Create `convex/subscriptions.ts` - Mutations for webhook handling
- [ ] **5.3** Update `convex/router.ts` - Add webhook endpoint
- [ ] **5.4** Deploy Convex: `npx convex deploy`
- [ ] **5.5** Note your webhook URL: `https://<deployment>.convex.site/revenuecat-webhook`

---

## 6. RevenueCat Webhook Configuration

> **Why:** When a user purchases/cancels/renews, RevenueCat notifies your backend so you can update their access.

- [ ] **6.1** Go to RevenueCat Dashboard → Project → Integrations → Webhooks
- [ ] **6.2** Add webhook URL: `https://<your-convex-deployment>.convex.site/revenuecat-webhook`
- [ ] **6.3** Enable events:
  - `INITIAL_PURCHASE`
  - `RENEWAL`
  - `CANCELLATION`
  - `EXPIRATION`
  - `BILLING_ISSUE`
  - `PRODUCT_CHANGE`
- [ ] **6.4** Test webhook with "Send Test" button
- [ ] **6.5** Verify Convex logs show received webhook

---

## 7. Clerk (No changes needed!)

> **Why:** You're using Clerk user IDs to identify users in RevenueCat. No Clerk configuration changes required.

- [x] **7.1** Clerk is already set up ✓
- [x] **7.2** User IDs are available via `useUser()` hook ✓
- [ ] **7.3** Ensure `PurchasesProvider` passes Clerk user ID to RevenueCat (handled in code)

---

## 8. Testing

> **Why:** You MUST test on a physical device. IAP doesn't work in simulators or Expo Go.

- [ ] **8.1** Build development app: `npx expo run:ios` or use EAS Build
- [ ] **8.2** Sign into sandbox tester account on test device
  - Settings → App Store → Sandbox Account
- [ ] **8.3** Open app, trigger paywall, tap "Start Trial"
- [ ] **8.4** Complete sandbox purchase flow
- [ ] **8.5** Verify premium unlocks in app
- [ ] **8.6** Check RevenueCat dashboard shows the purchase
- [ ] **8.7** Check Convex database has subscription record
- [ ] **8.8** Test restore purchases on a second device/reinstall

---

## 9. Production Launch

> **Why:** Final steps before going live.

- [ ] **9.1** Submit app for App Store review (subscriptions require review)
- [ ] **9.2** Ensure all legal links are in place (Privacy Policy, Terms)
- [ ] **9.3** Switch to production API keys in `.env`
- [ ] **9.4** Verify webhook is configured for production
- [ ] **9.5** Monitor RevenueCat dashboard for first real purchases

---

## Quick Reference: What Goes Where

| Item | Where to Configure |
|------|-------------------|
| Subscription Product | App Store Connect |
| API Keys | RevenueCat Dashboard → Your App |
| Entitlement (`premium`) | RevenueCat Dashboard → Entitlements |
| Webhook URL | RevenueCat Dashboard → Integrations → Webhooks |
| API Keys in Code | `.env.local` file |
| User ID Linking | `PurchasesProvider.tsx` (passes Clerk ID to RevenueCat) |
| Subscription State | Convex `subscriptions` table |

---

## Estimated Time

| Section | Time |
|---------|------|
| 1. Apple Setup | 30-60 min (first time), 10 min (if done before) |
| 2. RevenueCat | 15-20 min |
| 3. Env Variables | 5 min |
| 4. React Native Code | 🤖 Agent handles this |
| 5. Convex Backend | 🤖 Agent handles this |
| 6. Webhook Config | 5 min |
| 7. Clerk | Nothing to do |
| 8. Testing | 30-60 min |
| 9. Production | Depends on App Store review |

---

## 10. Paywall Design (RevenueCat Dashboard)

> **Why:** RevenueCat provides a remote paywall builder. You need to design the actual paywall UI that users will see when prompted to subscribe.

- [ ] **10.1** Design paywall in RevenueCat Dashboard
  - Go to: RevenueCat → Project → Paywalls
  - Choose a template or create from scratch
  - Configure colors, copy, and layout to match app branding
- [ ] **10.2** Set paywall copy
  - Headline (e.g., "Unlock Your Full Potential")
  - Feature list (what premium includes)
  - CTA button text
  - Price display format
- [ ] **10.3** Configure paywall styling
  - Primary/accent colors matching app theme
  - Font choices
  - Image/illustration assets
- [ ] **10.4** Link paywall to offering
  - Ensure the paywall is connected to your `default` offering
- [ ] **10.5** Test paywall appearance on device
- [ ] **10.6** A/B test considerations (optional)
  - Set up paywall variants if needed

---

## 11. Bug Fixes & Final Testing

> **Why:** Ensure the RevenueCat integration is bug-free before release.

- [ ] **11.1** Fix any RevenueCat integration bugs
- [ ] **11.2** Test complete purchase flow end-to-end
- [ ] **11.3** Test paywall displays correctly on all screen sizes
- [ ] **11.4** Test restore purchases functionality
- [ ] **11.5** Verify premium features unlock properly after purchase
- [ ] **11.6** Test subscription expiration handling
- [ ] **11.7** Verify webhook events are processed correctly

---

## Current Status

**You have:**
- ✅ `react-native-purchases` installed
- ✅ Clerk authentication working
- ✅ Convex backend working
- ✅ Premium UI components (MotivationPaywall)
- ✅ `hasPremium` field in userSettings schema
- ✅ RevenueCat paywall component integrated in code

**You need:**
- ⬜ Apple subscription product created
- ⬜ RevenueCat account + project + API keys
- ⬜ SDK initialization code
- ⬜ usePremium hook
- ⬜ Webhook endpoint
- ⬜ **Paywall design in RevenueCat Dashboard** ← PRIORITY
- ⬜ **Bug fixes and testing** ← PRIORITY
- ⬜ Testing on physical device

---

## Priority Tasks (Next Up)

Based on current progress, these are the immediate next steps:

1. **Design the RevenueCat Paywall** (Section 10)
   - Create visual design in RevenueCat Dashboard
   - Match app branding and theme
   - Set compelling copy and feature list

2. **Fix RevenueCat Integration Bugs** (Section 11)
   - Identify and resolve any integration issues
   - Test end-to-end purchase flow

3. **Complete Testing** (Section 8)
   - Test on physical device with sandbox account
   - Verify premium features unlock correctly
