# App Store Submission Checklist

> **Chain Day App** - Pre-Submission Tasks
> Created: 2026-01-18
> Updated: 2026-01-31
> Target: iOS App Store (Apple)

---

## 🚨 Critical Blockers (Must Fix Before Submission)

These items will cause immediate rejection if not addressed:

- [ ] **Create proper splash screen** - Current `assets/splash.png` is a 1×1px placeholder (68 bytes). Needs 2048×2048 or configure EAS to auto-generate from icon
- [x] **Write and host Privacy Policy** - ✅ LIVE at https://andres9888.github.io/chainday-landing/privacy.html
- [x] **Write and host Terms of Service** - ✅ LIVE at https://andres9888.github.io/chainday-landing/terms.html
- [ ] **Capture App Store screenshots** - Need 3-10 screenshots in required sizes (1290×2796 for 6.7", 1242×2688 for 6.5")
- [ ] **Add notification permission description** - Missing `NSUserNotificationsUsageDescription` in `ios/DailyHabits/Info.plist`

---

## 📱 App Store Connect Setup

- [ ] Log into [App Store Connect](https://appstoreconnect.apple.com)
- [ ] Create new app with Bundle ID: `com.andres9888.daily-habits`
- [ ] Fill in app metadata:
  - [x] App name: "Chain Day" (see PR #137 for copy-paste metadata)
  - [x] Subtitle: "Build lasting habits daily" (see PR #137)
  - [x] Promotional text (see PR #137)
  - [x] Description (see PR #137)
  - [x] Keywords (see PR #137)
  - [x] Support URL: https://andres9888.github.io/chainday-landing/
  - [x] Marketing URL: https://andres9888.github.io/chainday-landing/
  - [x] Privacy Policy URL: https://andres9888.github.io/chainday-landing/privacy.html
- [ ] Upload app icon (1024×1024, no transparency, no rounded corners)
- [ ] Set app category: Health & Fitness (primary), Lifestyle (secondary)
- [ ] Set age rating: 4+
- [ ] Configure pricing: Free with In-App Purchases

---

## 📸 Visual Assets

### Screenshots (Required)

- [ ] iPhone 6.7" (1290×2796) - iPhone 14 Pro Max / 15 Plus
- [ ] iPhone 6.5" (1242×2688) - iPhone 11 Pro Max / XS Max
- [ ] iPhone 5.5" (1242×2208) - iPhone 8 Plus (if supporting older devices)
- [ ] iPad Pro 12.9" (2048×2732) - If `supportsTablet: true`

### App Preview Videos (Optional)

- [ ] 15-30 second video showing key features
- [ ] Capture with iPhone screen recording

### Icon & Splash

- [x] App icon 1024×1024 (`assets/icon.png` ✓)
- [x] Adaptive icon (`assets/adaptive-icon.png` ✓)
- [ ] Splash screen 2048×2048 or auto-generated

---

## ⚙️ iOS Configuration Updates

### Info.plist (`ios/DailyHabits/Info.plist`)

- [ ] Add `NSUserNotificationsUsageDescription` with user-friendly message
- [ ] Remove or disable `NSAllowsLocalNetworking` for production
- [ ] Verify `MinimumOSVersion` (currently 12.0, recommend 13.0+)
- [ ] Ensure all permission descriptions are clear and accurate

### Entitlements

- [ ] Change `aps-environment` from `development` to `production` in:
  - `ios/DailyHabits/DailyHabits.entitlements`
  - Or configure via Xcode capabilities

### app.json / app.config.js

- [ ] Add `privacyPolicyUrl` field
- [ ] Verify `bundleIdentifier` matches App Store Connect
- [ ] Confirm version number (currently 1.0.0)

---

## 📝 Legal & Compliance

### Privacy Policy (Required) ✅ COMPLETE

- [x] Draft privacy policy document
- [x] Cover required topics (data collection, third-party services, etc.)
- [x] Host on publicly accessible URL
- [x] URL: https://andres9888.github.io/chainday-landing/privacy.html

### Terms of Service (Required for Subscriptions) ✅ COMPLETE

- [x] Draft ToS document
- [x] Host on publicly accessible URL
- [x] URL: https://andres9888.github.io/chainday-landing/terms.html

### Support

- [x] Support URL: https://andres9888.github.io/chainday-landing/
- [x] Support email: support@chainday.app (configured in settings)

---

## 💰 Monetization (RevenueCat)

> See detailed guide: `/docs/REVENUECAT-QUICK-START.md` (30 min setup)

- [x] Pricing model decided: Freemium ($6.99/month with 7-day trial)
- [ ] Configure products in App Store Connect
- [ ] Set up RevenueCat dashboard
- [x] SDK integrated in app (react-native-purchases)
- [x] usePremium hook implemented
- [x] Restore Purchases implemented (PR #135)
- [ ] Test purchase flow in sandbox

---

## 🔐 Authentication & Demo Account

- [x] Clerk auth configured:
  - [x] Apple Sign-In
  - [x] Google Sign-In
  - [x] Email/password
- [ ] Create demo/reviewer account for Apple review team
- [ ] Document login instructions in App Review notes

---

## 🧪 Testing

### Internal Testing

- [ ] Run full test suite (`npm test`)
- [ ] Manual smoke test all features
- [ ] Test on real iOS device (not just simulator)
- [ ] Test on multiple screen sizes

### TestFlight Beta

- [ ] Build production .ipa: `eas build --platform ios --profile production`
- [ ] Submit to TestFlight: `eas submit --platform ios`
- [ ] Invite internal testers
- [ ] Collect and address feedback

---

## 🏗️ Build & Submission

### Pre-Build Checklist

- [ ] Merge all approved PRs to `main` branch
- [ ] Ensure no uncommitted changes: `git status`
- [ ] Bump version if necessary
- [ ] Verify environment variables are set

### Build Commands

```bash
# Build for production
eas build --platform ios --profile production

# Submit to App Store Connect
eas submit --platform ios

# Or combined
eas build --platform ios --profile production --auto-submit
```

### App Review Notes

- [ ] Prepare notes for Apple reviewer:
  - [ ] Demo account credentials
  - [ ] Any special instructions for testing
  - [ ] Explanation of features that might not be obvious

---

## ✅ Final Submission Checklist

Before clicking "Submit for Review":

- [x] Privacy policy URL working ✅
- [x] Terms of Service URL working ✅
- [x] Support URL working ✅
- [x] App Store metadata prepared (PR #137)
- [ ] All critical blockers resolved
- [ ] All screenshots uploaded
- [ ] Demo account documented
- [ ] Production build tested on TestFlight
- [ ] No known crashes or blocking bugs
- [ ] Export compliance answered
- [ ] Content rights confirmed

---

## 📆 Post-Submission

- [ ] Monitor App Store Connect for review status
- [ ] Respond promptly to any reviewer questions
- [ ] If rejected: address issues and resubmit
- [ ] Once approved: set release date, announce launch!

---

## 📋 PRs to Merge Before Submission

These PRs contain features/fixes needed for launch:

| PR   | Description                               | Priority  |
| ---- | ----------------------------------------- | --------- |
| #136 | Chain Day branding                        | High      |
| #139 | Settings (sign out, legal links)          | High      |
| #135 | Restore purchases (App Store requirement) | High      |
| #130 | Offline sync                              | Medium    |
| #137 | App Store metadata doc                    | Reference |
| #138 | RevenueCat guide                          | Reference |

---

**Estimated Time to Submission:** 2-3 days (most prep work done)
**Expected Review Time:** 1-3 days

---

#app-store #submission #checklist #ios #chain-day
