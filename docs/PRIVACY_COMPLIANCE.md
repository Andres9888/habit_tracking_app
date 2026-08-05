# Privacy Compliance Documentation

**Last Updated:** February 16, 2026

## Overview

This document outlines Chain Day's privacy practices and compliance with Apple's App Store requirements.

---

## 1. Privacy Manifest (PrivacyInfo.xcprivacy)

**Status:** ✅ Compliant

The app includes a properly configured `PrivacyInfo.xcprivacy` file in the iOS project.

### Declared Items:

#### NSPrivacyTracking
- **Value:** `false`
- **Meaning:** The app does NOT track users across apps or websites for advertising purposes.

#### NSPrivacyTrackingDomains
- **Value:** `[]` (empty array)
- **Meaning:** No tracking domains are used.

#### NSPrivacyAccessedAPITypes

| API Type | Reason Codes | Purpose |
|----------|--------------|---------|
| NSPrivacyAccessedAPICategoryUserDefaults | CA92.1 | React Native AsyncStorage, preferences, RevenueCat |
| NSPrivacyAccessedAPICategoryFileTimestamp | C617.1, 0A2A.1, 3B52.1 | Metro bundler, Expo updates, Sentry |
| NSPrivacyAccessedAPICategoryDiskSpace | E174.1, 85F4.1 | React Native runtime, file operations |
| NSPrivacyAccessedAPICategorySystemBootTime | 35F9.1 | React Native timing functions |

#### NSPrivacyCollectedDataTypes

| Data Type | Linked | Tracking | Purpose |
|------------|--------|----------|---------|
| NSPrivacyCollectedDataTypePurchaseHistory | true | false | App Functionality (RevenueCat subscriptions) |
| NSPrivacyCollectedDataTypeCrashData | false | false | App Functionality (Sentry crash monitoring) |
| NSPrivacyCollectedDataTypePerformanceData | false | false | App Functionality (Sentry performance monitoring) |
| NSPrivacyCollectedDataTypeProductInteraction | false | false | Analytics (in-app usage data) |

---

## 2. Tracking SDKs

**Status:** ✅ Compliant

The app does NOT use any advertising or tracking SDKs:

- ❌ No Mixpanel
- ❌ No Amplitude
- ❌ No Firebase Analytics
- ❌ No Facebook SDK
- ❌ No Adjust
- ❌ No AppsFlyer

**Installed Monitoring SDKs (Non-Tracking):**

| SDK | Purpose |
|-----|---------|
| @sentry/react-native | Crash reporting and performance monitoring |
| react-native-purchases-ui | In-app subscription management (RevenueCat) |

---

## 3. App Tracking Transparency (ATT)

**Status:** ✅ Compliant (Not Required)

The app does NOT implement ATT because:
- The app does not track users
- The app does not use advertising
- No IDFA is requested

Apple requires ATT only if you track users across apps/websites for advertising purposes. Chain Day does not.

---

## 4. Data Collection

**Status:** ⚠️ Needs Privacy Policy Page

### Data Collected:

| Data Type | Collection Method | Storage | Third Parties |
|-----------|-------------------|---------|---------------|
| Email Address | Clerk authentication | Clerk (encrypted) | Clerk |
| User ID | Clerk authentication | Clerk + Convex | Clerk, Convex |
| Username | Clerk authentication | Clerk | Clerk |
| Purchase History | RevenueCat | RevenueCat | RevenueCat |
| Crash Data | Sentry | Sentry | Sentry |
| Performance Data | Sentry | Sentry | Sentry |
| App Usage | Sentry breadcrumbs | Sentry | Sentry |
| Habit Data | App functionality | Convex (encrypted) | Convex |

### Data NOT Collected:
- ❌ Location data
- ❌ Contacts
- ❌ Photos (except user-selected for Vision Board)
- ❌ Microphone (except user-initiated voice notes)
- ❌ Health data

---

## 5. Sentry Configuration

**Status:** ⚠️ PII Issue - FIXED

**Issue Found:** Previously, the app was sending user PII (email, id, username) to Sentry via the `SentryUserSync` component.

**Fix Applied:** Modified `SentryUserSync` to only send an anonymous user ID, not email or username. This maintains ability to correlate errors across sessions without exposing PII.

**Before:**
```typescript
useSentryUser({
  email: user.primaryEmailAddress?.emailAddress,  // PII - REMOVED
  id: user.id,
  username: user.username ?? undefined,  // PII - REMOVED
});
```

**After:**
```typescript
useSentryUser({
  id: user.id,  // Anonymous ID only - no email or username
});
```

**Sentry Data Retention:** Configured per Sentry organization's data retention policy (default: 90 days).

---

## 6. Clerk Authentication

**Status:** ✅ Compliant

Clerk is used for user authentication. Data stored by Clerk:

| Data | Stored | Purpose |
|------|--------|---------|
| Email | Yes | Authentication, password reset |
| User ID | Yes | Unique identification |
| Username | Optional | Display name |
| Password | Encrypted | Authentication |

**Clerk Privacy:** Clerk is a SOC 2 Type II certified identity provider. Refer to [Clerk Privacy Policy](https://clerk.com/legal/privacy).

---

## 7. Privacy Policy

**Status:** ⚠️ Needs Implementation

**Current State:** The app.json specifies `"privacyUrl": "https://chainday.app/privacy"` but the page does not currently exist.

**Required Action:** Create a privacy policy page at the website.

**Privacy Policy Contents:**
The privacy policy should include:
1. Data collected and how it's used
2. Third-party services (Clerk, RevenueCat, Sentry, Convex)
3. User rights (data access, deletion)
4. Contact information
5. Effective date

---

## 8. Required Disclosures

### For App Store Review:

1. **No Tracking:** The app does not track users across apps or websites.
2. **No IDFA:** The app does not request IDFA or use ATT.
3. **Data Collection:** The app collects:
   - Account data (email, username) for authentication
   - Purchase history for subscription management
   - Crash/performance data for app quality
4. **Third Parties:**
   - Clerk (authentication)
   - RevenueCat (subscriptions)
   - Sentry (crash reporting)
   - Convex (backend/database)

---

## 9. Compliance Checklist

- [x] PrivacyInfo.xcprivacy exists and is properly configured
- [x] No tracking SDKs installed
- [x] No ATT implementation (not needed)
- [x] Data collection declared in privacy manifest
- [x] Sentry configured to not send PII
- [ ] Privacy policy page created
- [ ] Privacy policy URL in app.json is accessible

---

## 10. Recommendations

1. **Create Privacy Policy Page:** Add `/privacy` route to the website with comprehensive privacy information.

2. **User Data Deletion:** Implement a data deletion flow that allows users to request data deletion (required for GDPR/CCPA compliance).

3. **Clerk Data Export:** Use Clerk's member data export feature to fulfill data access requests.

4. **RevenueCat Data:** Use RevenueCat's data deletion endpoint for purchase history.

5. **Sentry Data:** Use Sentry's data deletion features for crash data.

---

## References

- [Apple App Store Review Guidelines - Privacy](https://developer.apple.com/app-store/review/guidelines/#privacy)
- [Apple Privacy Details](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
- [Clerk Privacy Policy](https://clerk.com/legal/privacy)
- [RevenueCat Privacy](https://www.revenuecat.com/privacy)
- [Sentry Privacy](https://sentry.io/legal/privacy/)
