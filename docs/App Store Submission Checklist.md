# App Store Submission Checklist

> **Daily Habits App** - Pre-Submission Tasks
> Created: 2026-01-18
> Target: iOS App Store (Apple)

---

## 🚨 Critical Blockers (Must Fix Before Submission)

These items will cause immediate rejection if not addressed:

- [x] **Create proper splash screen** - `assets/splash.png` is 2048×2048 generated from the shipping app icon. Expo `splash` + `expo-splash-screen` point at it (`#059669`, contain, 200pt). Committed iOS `SplashScreenLogo` imageset matches.
- [ ] **Write and host Privacy Policy** - Required by Apple. Must cover: data collection, Convex backend, Clerk auth, third-party services, data retention
- [ ] **Capture App Store screenshots** - Need 3-10 screenshots in required sizes (1290×2796 for 6.7", 1242×2688 for 6.5")
- [x] **Add notification permission description** - `NSUserNotificationsUsageDescription` in `app.json` `ios.infoPlist` and `ios/ChainDay/Info.plist` (habit reminders and streak alerts)

---

## 📱 App Store Connect Setup

- [ ] Log into [App Store Connect](https://appstoreconnect.apple.com)
- [ ] Create new app with Bundle ID: `com.andres9888.daily-habits`
- [ ] Fill in app metadata:
  - [ ] App name: "Daily Habits"
  - [ ] Subtitle (30 characters max)
  - [ ] Promotional text (170 characters max)
  - [ ] Description (4000 characters max)
  - [ ] Keywords (100 characters total, comma-separated)
  - [ ] Support URL
  - [ ] Marketing URL (optional)
  - [ ] Privacy Policy URL ⚠️
- [ ] Upload app icon (1024×1024, no transparency, no rounded corners)
- [ ] Set app category (Health & Fitness or Productivity)
- [ ] Set age rating (likely 4+)
- [ ] Configure pricing (Free, Freemium, or Paid)

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
- [x] Splash screen 2048×2048 generated from the app icon (`assets/splash.png`)

---

## ⚙️ iOS Configuration Updates

### Info.plist (`ios/ChainDay/Info.plist`)
- [x] Add `NSUserNotificationsUsageDescription` with user-friendly message
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

### Privacy Policy (Required)
- [ ] Draft privacy policy document
- [ ] Cover these topics:
  - [ ] What data is collected (habits, completion data, profile info)
  - [ ] How data is used
  - [ ] Third-party services (Convex, Clerk, RevenueCat if used)
  - [ ] Data retention and deletion policies
  - [ ] Contact information
- [ ] Host on publicly accessible URL
- [ ] Add URL to App Store Connect

### Terms of Service (Recommended)
- [ ] Draft ToS document
- [ ] Host on publicly accessible URL

### Support
- [ ] Create support email address
- [ ] Create support webpage or FAQ
- [ ] Add support URL to App Store Connect

---

## 💰 Monetization (RevenueCat)

> See detailed checklist: `/docs/REVENUECAT-CHECKLIST.md`

- [ ] Decide on pricing model:
  - [ ] Free with no premium features
  - [ ] Freemium (free tier + premium subscription)
  - [ ] Paid upfront
- [ ] If using subscriptions:
  - [ ] Configure products in App Store Connect
  - [ ] Set up RevenueCat dashboard
  - [ ] Implement SDK in app (currently installed but not implemented)
  - [ ] Test purchase flow in sandbox
- [ ] Update app to reflect pricing decision (currently hardcoded `isPremium: false`)

---

## 🔐 Authentication & Demo Account

- [ ] Test Clerk auth flows end-to-end:
  - [ ] Apple Sign-In
  - [ ] Email/password (if enabled)
  - [ ] Social logins (if any)
- [ ] Create demo/reviewer account for Apple review team
  - [ ] Username: `apple-reviewer@yourdomain.com` (example)
  - [ ] Password: (secure, documented for submission)
- [ ] Document login instructions in App Review notes

---

## 🧪 Testing

### Internal Testing
- [ ] Run full test suite (`npm test`)
- [ ] Manual smoke test all features:
  - [ ] User registration/login
  - [ ] Create habit
  - [ ] Complete habit
  - [ ] View statistics/charts
  - [ ] Edit/delete habit
  - [ ] Notifications (if implemented)
- [ ] Test on real iOS device (not just simulator)
- [ ] Test on multiple screen sizes (iPhone SE, Pro Max, iPad)

### TestFlight Beta
- [ ] Build production .ipa: `eas build --platform ios --profile production`
- [ ] Submit to TestFlight: `eas submit --platform ios`
- [ ] Invite internal testers
- [ ] Collect and address feedback
- [ ] Invite external beta testers (optional)

---

## 🏗️ Build & Submission

### Pre-Build Checklist
- [ ] Commit all changes to `main` branch
- [ ] Ensure no uncommitted changes: `git status`
- [ ] Merge `dev` branch if needed
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
  - [ ] Contact info for questions

---

## 📋 Code Quality (Optional but Recommended)

> See: `/docs/DECOMPOSITION_PATTERNS.md`

- [ ] Run lint: `npm run lint`
- [ ] Fix TypeScript errors: `npm run typecheck`
- [ ] Address files over 100 lines (7 files exceed 1000 lines):
  - [ ] `TemplateScienceModal.tsx` (1,375 lines)
  - [ ] `LettersSection.tsx` (1,320 lines)
  - [ ] `AffirmationsSection.tsx` (1,133 lines)
  - [ ] `HabitsEmptyState.tsx` (1,094 lines)
  - [ ] `FullsizeTemplatePreview.tsx` (1,047 lines)
  - [ ] `TemplatesScreen.tsx` (1,039 lines)
  - [ ] `TodaysFocusCard.tsx` (991 lines)

---

## ✅ Final Submission Checklist

Before clicking "Submit for Review":

- [ ] All critical blockers resolved
- [ ] App Store Connect listing complete
- [ ] All screenshots uploaded
- [ ] Privacy policy URL working
- [ ] Support URL working
- [ ] Demo account documented in App Review notes
- [ ] Production build tested on TestFlight
- [ ] No known crashes or blocking bugs
- [ ] Export compliance answered (usually "No" for encryption)
- [ ] Content rights confirmed
- [ ] Advertising ID usage declared (if applicable)

---

## 📆 Post-Submission

- [ ] Monitor App Store Connect for review status
- [ ] Respond promptly to any reviewer questions
- [ ] If rejected:
  - [ ] Read rejection reason carefully
  - [ ] Address all issues mentioned
  - [ ] Resubmit with explanation
- [ ] Once approved:
  - [ ] Set release date (manual or automatic)
  - [ ] Announce launch!
  - [ ] Monitor for crashes (Sentry, etc.)
  - [ ] Respond to user reviews

---

## 📚 Reference Documents

- [[app-store-submission-requirements]] - Full App Store requirements
- [[REVENUECAT-CHECKLIST]] - RevenueCat integration guide
- [[PHASE3_FINAL_LAUNCH_CHECKLIST]] - Internal testing procedures
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

**Estimated Time to Submission:** 5-7 days (assuming 4-6 hours/day)
**Expected Review Time:** 1-3 days

---

#app-store #submission #checklist #ios #daily-habits
