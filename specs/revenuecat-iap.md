# RevenueCat In-App Purchases

## Overview

Use RevenueCat's `react-native-purchases` SDK for iOS and Android subscriptions, with Convex webhooks as the authoritative server-side entitlement path. The app should use the client SDK for storefront UI, purchases, restore, and optimistic customer-info display; durable premium access must be written only from verified RevenueCat webhooks.

Checked date: 2026-07-14.

## Selection Rationale

Selected option: RevenueCat `react-native-purchases`.

| Option | Current evidence | Pricing / limits | Breaking-change risk | Fit |
| --- | --- | --- | --- | --- |
| RevenueCat `react-native-purchases` | Latest GitHub release checked via GitHub API: `10.4.2`, published 2026-07-08. Official React Native docs require iOS deployment target at least 13.4, Android at least 6.0/API 23, and React Native greater than 0.64. | RevenueCat pricing page checked 2026-07-14: free up to $2,500 monthly tracked revenue, then 1% of tracked revenue; Enterprise is custom. | Low for this app. The repo already uses RevenueCat patterns and has `react-native-purchases` installed at `9.7.1`; v10 upgrade still needs changelog review and native rebuild. | Best practical choice. It handles StoreKit, Google Play Billing, unified entitlements, restore, SDK updates, dashboard products, and webhooks without building our own receipt infrastructure. |
| Adapty React Native SDK | Latest GitHub release checked via GitHub API: `v4.0.0`, published 2026-07-13. Release notes include breaking changes: Paywall entities renamed to Flow, legacy WebView onboarding deprecated, minimum React Native bumped to 0.75, minimum iOS to 15, iOS dependencies via Swift Package Manager/dynamic frameworks. | Adapty pricing page checked 2026-07-14: free under $5K/month tracked revenue, then 1%; add-ons have separate pricing. | High right now because the latest major version is a fresh breaking release and this app already has RevenueCat code. | Good growth/paywall platform, but not the lowest-risk IAP infrastructure choice for this repo today. |
| StoreKit 2 directly | Apple StoreKit 2 docs checked 2026-07-14 describe modern Swift/SwiftUI APIs for purchases across Apple platforms. | No third-party SaaS fee beyond Apple/Google platform fees, but no cross-platform subscription backend is included. | High implementation burden for React Native: iOS-only StoreKit 2 does not cover Google Play, restore/receipt sync, webhook-style backend state, analytics, entitlement sharing, or support tooling by itself. | Not chosen. Use StoreKit 2 through RevenueCat rather than maintaining custom IAP infrastructure. |

## Installation

Current repo state:

```json
"react-native-purchases": "9.7.1"
```

Recommended install command for a new or upgraded implementation:

```bash
npm install --save react-native-purchases
```

For Expo native builds:

```bash
expo install react-native-purchases
```

Native requirements from current RevenueCat docs:

- iOS deployment target: 13.4 or newer.
- Android: 6.0/API 23 or newer.
- React Native: greater than 0.64.
- Android manifest must include billing permission:

```xml
<uses-permission android:name="com.android.vending.BILLING" />
```

- Android `Activity` launch mode should be `standard` or `singleTop`; other modes can cause Google Play purchase verification flows to cancel when the app is backgrounded.
- iOS target must enable the In-App Purchase capability.
- Native SDK changes require a development build/TestFlight build; Expo Go cannot load the native module.

## Configuration

### Environment Variables

Use public SDK keys in the app bundle and secrets only on the server.

| Variable | Scope | Required | Notes |
| --- | --- | --- | --- |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | Mobile client | Yes for iOS | Public RevenueCat SDK key for the iOS app. Safe to ship in the app bundle. |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | Mobile client | Yes for Android | Public RevenueCat SDK key for the Android app. Safe to ship in the app bundle. |
| `REVENUECAT_WEBHOOK_SECRET` | Convex/server | Yes | Server-only webhook signing secret. Never expose through `EXPO_PUBLIC_`. |
| `CONVEX_URL` / deployment URL | Client/server config | Yes elsewhere in app | Webhook URL should be configured in RevenueCat dashboard as `https://<deployment-name>.convex.site/revenuecat-webhook`. |

### Client Init Code

Minimal setup from RevenueCat docs:

```ts
import Purchases from 'react-native-purchases';

Purchases.configure({
  apiKey: 'test_1234567890',
});
```

Repo-aligned initialization should stay lazy so web and Expo Go do not crash on native import:

```ts
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

const keys = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
};

export function configureRevenueCat(appUserID: string) {
  if (Platform.OS === 'web') return false;

  const apiKey = Platform.OS === 'ios' ? keys.ios : keys.android;
  if (!apiKey) return false;

  Purchases.configure({ apiKey, appUserID });
  return true;
}
```

For this app, `appUserID` should be the Clerk user subject used by Convex premium records, so webhook `event.app_user_id` maps directly to the user.

## Key Patterns

### Fetch Offerings and Entitlement Status

RevenueCat docs show fetching `CustomerInfo`, app user ID, offerings, and anonymous state together:

```ts
import Purchases from 'react-native-purchases';

export async function loadPaywallData() {
  const customerInfo = await Purchases.getCustomerInfo();
  const appUserID = await Purchases.getAppUserID();
  const offerings = await Purchases.getOfferings();
  const isAnonymous = await Purchases.isAnonymous();

  return { appUserID, customerInfo, offerings, isAnonymous };
}
```

Use active entitlements for display, but do not make server authorization decisions from client state:

```ts
const isPremium =
  customerInfo.entitlements.active.premium?.isActive === true;
```

### Purchase a Package

RevenueCat docs show `purchasePackage(pkg)` returning purchase/customer info and user-cancelled errors:

```ts
import Purchases, { type PurchasesPackage } from 'react-native-purchases';

export async function purchasePremiumPackage(pkg: PurchasesPackage) {
  try {
    const result = await Purchases.purchasePackage(pkg);
    return result.customerInfo.entitlements.active.premium?.isActive === true;
  } catch (error: any) {
    if (!error.userCancelled) {
      throw error;
    }
    return false;
  }
}
```

Analytics gotcha: treat client purchase success as UI feedback only. RevenueCat-confirmed purchase success belongs on the verified webhook/server path so retries, refunds, transfers, billing issues, and expiration are handled consistently.

### Restore Purchases

RevenueCat docs:

```ts
import Purchases from 'react-native-purchases';

export async function restorePurchases() {
  const customerInfo = await Purchases.restorePurchases();
  return customerInfo.entitlements.active.premium?.isActive === true;
}
```

Expose this from Settings. After restore, refresh customer info and let RevenueCat webhooks update Convex entitlement state.

### Webhook Handler Shape

RevenueCat recommends verifying every webhook and, after receiving any webhook, calling `GET /subscribers` to sync the customer's state in a consistent format instead of hardcoding every event-specific payload shape.

Current HMAC docs use this delivery header format:

```txt
X-RevenueCat-Webhook-Signature: t=<unix_timestamp>,v1=<hmac_sha256_hex>
```

The signed payload is:

```txt
<timestamp>.<raw_json_body>
```

Node-style verification pattern:

```ts
import crypto from 'node:crypto';

export function verifyRevenueCatWebhookSignature(
  rawBody: Buffer,
  header: string,
  secret: string,
  toleranceSeconds = 300
) {
  const parts = Object.fromEntries(
    header.split(',').map((part) => part.split('=', 2))
  );
  const timestamp = parts.t;
  const expected = parts.v1;
  if (!timestamp || !expected) return false;

  const signedPayload = Buffer.concat([
    Buffer.from(`${timestamp}.`, 'utf8'),
    rawBody,
  ]);
  const computed = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  const fresh =
    Math.abs(Date.now() / 1000 - Number(timestamp)) <= toleranceSeconds;
  return fresh && crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(expected));
}
```

Webhook events to handle at minimum:

| Event | Server action |
| --- | --- |
| `INITIAL_PURCHASE` | Grant premium and store product/expiration metadata. |
| `RENEWAL` | Extend premium expiration. |
| `PRODUCT_CHANGE` | Update product and expiration metadata. |
| `UNCANCELLATION` | Clear pending cancellation/billing flags if entitlement remains active. |
| `CANCELLATION` | Mark cancellation status; do not revoke early unless RevenueCat subscriber state says entitlement is inactive. |
| `EXPIRATION` | Revoke premium. |
| `BILLING_ISSUE` | Mark billing issue; keep or revoke access based on subscriber entitlement state. |
| `TRANSFER` | Re-fetch subscriber/customer state before mutating ownership. |
| `REFUND` / `REFUND_REVERSED` | Re-fetch subscriber/customer state and update entitlement/product event records idempotently. |

## API Reference

| API / Surface | Source | Use in app | Notes |
| --- | --- | --- | --- |
| `Purchases.configure({ apiKey, appUserID })` | `react-native-purchases` | Initialize once after auth user is known. | Must run before other SDK calls. Use platform-specific public SDK key. |
| `Purchases.logIn(appUserID)` | `react-native-purchases` | Identify user after auth changes if SDK initialized anonymously first. | Prefer configuring with Clerk subject when possible. |
| `Purchases.logOut()` | `react-native-purchases` | Clear SDK identity on sign-out. | Avoid carrying entitlements across users on shared devices. |
| `Purchases.getOfferings()` | `react-native-purchases` | Load current paywall products/packages. | Dashboard offerings can change without app release. |
| `Purchases.purchasePackage(pkg)` | `react-native-purchases` | Start native purchase flow. | Check `error.userCancelled` before surfacing errors. |
| `Purchases.getCustomerInfo()` | `react-native-purchases` | Refresh client entitlement display. | Not authoritative for server-gated features. |
| `Purchases.restorePurchases()` | `react-native-purchases` | Settings restore action. | Returns `CustomerInfo`; also expect webhook/customer sync. |
| RevenueCat webhook integration | RevenueCat dashboard/API | Server-side entitlement writes. | Verify authorization/HMAC, require event id, dedupe retries. |
| `GET /subscribers` | RevenueCat REST API | Recommended follow-up after any webhook. | Keeps database sync based on canonical customer state. |

## Gotchas

- Current docs use `X-RevenueCat-Webhook-Signature` with `t=...,v1=...` and HMAC over `"<timestamp>.<raw_json_body>"`. The current repo code references `X-RevenueCat-Signature` and signs only the body. Before launch, reconcile this with the dashboard's active webhook signing mode.
- Keep webhook verification on the raw request body. Parsing then re-stringifying JSON changes bytes and breaks valid signatures.
- Return `400` for permanently malformed payloads; return `500` only for transient processing failures that RevenueCat should retry.
- Do not trust client-writable settings for premium access. Only the webhook/server path should write durable `hasPremium` or subscription records.
- `CANCELLATION` does not always mean entitlement is inactive immediately. A user can cancel renewal while keeping access until expiration. Prefer fetching subscriber state before revoking.
- Web and native purchases are separate. RevenueCat React Native web requires RevenueCat Billing/Stripe setup, and docs list unsupported web operations including `getProducts`, `purchaseProduct`, and `restorePurchases`.
- Expo Go cannot exercise native IAP. Use a dev client, simulator StoreKit testing where appropriate, TestFlight, or Google Play internal testing.
- Store product IDs, RevenueCat offering/package IDs, entitlement IDs, and Clerk user IDs as constants with tests. A typo silently produces empty offerings or missing entitlements.
- RevenueCat public SDK keys are not secrets; webhook signing secrets and REST secret keys are server-only secrets.
- Idempotency is required. RevenueCat retries failed webhooks, so event IDs must be recorded before side effects can be repeated.

## Rate Limits

No numeric RevenueCat API rate limit was found in the checked public docs. Practical guardrails:

- Avoid polling `getCustomerInfo()` in render loops; call it on app foreground, after purchase/restore, and when opening premium UI.
- Cache offerings for the current session and refresh on paywall open or app foreground.
- Webhooks should acknowledge quickly and do minimal synchronous work. For heavier sync, persist event metadata and fan out internally.
- Treat webhook `5xx` as retry-triggering. Permanent validation failures should be `4xx`.
- If adding RevenueCat REST calls such as `GET /subscribers`, use server-side backoff and avoid calling it more than once per webhook event unless a retry is intentional.

## Currency

Version · checked date · source:

- `react-native-purchases` latest release: `10.4.2` · checked 2026-07-14 · GitHub API / GitHub releases.
- App currently installed: `react-native-purchases` `9.7.1` · checked 2026-07-14 · `package.json`.
- RevenueCat React Native install docs · checked 2026-07-14 · RevenueCat docs.
- RevenueCat pricing: free up to $2,500 monthly tracked revenue, then 1% · checked 2026-07-14 · RevenueCat pricing page.
- Adapty React Native latest release: `v4.0.0` · checked 2026-07-14 · GitHub API / GitHub releases.
- Adapty pricing: free under $5K/month tracked revenue, then 1% · checked 2026-07-14 · Adapty pricing page.
- StoreKit 2 docs · checked 2026-07-14 · Apple Developer docs.
- Context7 library IDs used: `/revenuecat/react-native-purchases` and `/revenuecat/docs` · checked 2026-07-14.

## References

- RevenueCat React Native installation: https://www.revenuecat.com/docs/getting-started/installation/reactnative
- RevenueCat webhook docs: https://www.revenuecat.com/docs/integrations/webhooks
- RevenueCat pricing: https://www.revenuecat.com/pricing
- RevenueCat React Native releases: https://github.com/RevenueCat/react-native-purchases/releases
- RevenueCat React Native latest release API: https://api.github.com/repos/RevenueCat/react-native-purchases/releases/latest
- RevenueCat React Native SDK docs via Context7: `/revenuecat/react-native-purchases`
- RevenueCat webhook docs via Context7: `/revenuecat/docs`
- Adapty pricing: https://adapty.io/pricing/
- Adapty React Native releases: https://github.com/adaptyteam/AdaptySDK-React-Native/releases
- Adapty React Native latest release API: https://api.github.com/repos/adaptyteam/AdaptySDK-React-Native/releases/latest
- Apple StoreKit 2: https://developer.apple.com/storekit/
- Apple StoreKit documentation: https://developer.apple.com/documentation/storekit
