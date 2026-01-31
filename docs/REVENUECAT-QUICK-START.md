# RevenueCat Quick Start (30 min)

Step-by-step for Andres. Just follow these, screenshots included in links.

---

## Part 1: App Store Connect (15 min)

### 1.1 Create Subscription Product

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **Daily Habits** (or create app if not exists)
3. Left sidebar: **Subscriptions** → **Create Subscription Group**
   - Group Name: `Premium`
4. Inside group, click **Create Subscription**:
   - Reference Name: `Monthly Premium`
   - Product ID: `premium_monthly` ← remember this!
   - Duration: 1 Month
   - Price: Tier 5 ($6.99)
   - Free Trial: 7 days (optional)
5. Fill in localization:
   - Display Name: `Premium Monthly`
   - Description: `Unlimited habits, offline mode, voice notes, and more`

### 1.2 Get Shared Secret

1. App Store Connect → Your App → **App Information** (left sidebar)
2. Scroll to **App-Specific Shared Secret** → Generate
3. Copy it → you'll paste in RevenueCat

---

## Part 2: RevenueCat Dashboard (10 min)

### 2.1 Create Account & Project

1. Go to [RevenueCat](https://app.revenuecat.com) → Sign up
2. **Create New Project** → Name: `Chain Day`

### 2.2 Add iOS App

1. Click **+ Add App** → iOS
2. Fill in:
   - App Name: `Chain Day`
   - Bundle ID: `com.andres9888.daily-habits`
3. **Copy the Public API Key** (starts with `appl_`) → save for later!

### 2.3 Connect to App Store

1. Click your iOS app → **App Store Connect Configuration**
2. Paste the **Shared Secret** from step 1.2

### 2.4 Create Entitlement

1. Left sidebar: **Entitlements** → **+ New**
2. Identifier: `premium`

### 2.5 Create Product

1. Left sidebar: **Products** → **+ New**
2. Identifier: `premium_monthly`
3. Store: App Store

### 2.6 Attach Product to Entitlement

1. Click on `premium` entitlement
2. **Attach Products** → select `premium_monthly`

### 2.7 Create Offering

1. Left sidebar: **Offerings** → click `default`
2. Add Package → Monthly → attach `premium_monthly`

---

## Part 3: Connect to Your App (5 min)

### 3.1 Add API Key to Environment

Create/edit `.env.local` in your habit app root:

```bash
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxx
```

Replace with your actual key from step 2.2.

### 3.2 Set Up Webhook (for backend sync)

1. RevenueCat → **Integrations** → **Webhooks** → **+ New**
2. URL: `https://YOUR_CONVEX_DEPLOYMENT.convex.site/revenuecat-webhook`
3. Enable events:
   - INITIAL_PURCHASE
   - RENEWAL
   - CANCELLATION
   - EXPIRATION

---

## Part 4: Test (before App Store submission)

### 4.1 Create Sandbox Tester

1. App Store Connect → **Users and Access** → **Sandbox Testers**
2. Add new tester with a real email you control
3. On your iPhone: Settings → App Store → Sandbox Account → sign in with tester

### 4.2 Test Purchase

1. Build app with `npx expo run:ios` (or EAS build)
2. Open app, go to upgrade screen
3. Tap "Start Trial" or "Subscribe"
4. Complete sandbox purchase (no real charge)
5. Check RevenueCat dashboard shows the purchase

---

## Checklist

- [ ] Subscription product in App Store Connect
- [ ] Shared secret copied
- [ ] RevenueCat project created
- [ ] iOS app added with API key
- [ ] Entitlement `premium` created
- [ ] Product attached to entitlement
- [ ] Offering configured
- [ ] API key in `.env.local`
- [ ] Webhook configured (optional but recommended)
- [ ] Sandbox tester created
- [ ] Test purchase works

---

## Quick Reference

| Thing          | Value                         |
| -------------- | ----------------------------- |
| Bundle ID      | `com.andres9888.daily-habits` |
| Product ID     | `premium_monthly`             |
| Entitlement ID | `premium`                     |
| Price          | $6.99/month                   |
| Free Trial     | 7 days                        |

---

_This replaces the full REVENUECAT-CHECKLIST.md with just the essential steps._
