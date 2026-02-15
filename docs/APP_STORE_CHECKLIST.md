# App Store Submission Checklist — ChainDay

> Last updated: 2026-02-14 by Opus

## ✅ Ready

| Item | Status | Details |
|------|--------|---------|
| Bundle ID | ✅ | `com.chainday.app` |
| App version | ✅ | `1.0.0` |
| Build number | ✅ | `2` (app.json) / `5` (Info.plist) — see ⚠️ below |
| App icon | ✅ | 1024×1024 PNG (no alpha) |
| Splash screen | ✅ | Present (`assets/splash.png`) |
| Privacy Policy URL | ✅ | https://andres9888.github.io/chainday-landing/privacy.html (live) |
| Terms of Service URL | ✅ | https://andres9888.github.io/chainday-landing/terms.html (live) |
| Legal footer in app | ✅ | `LegalFooter.tsx` links both URLs |
| NSCameraUsageDescription | ✅ | "…capture images for your Vision Board." |
| NSMicrophoneUsageDescription | ✅ | "…microphone for voice note recordings." |
| NSPhotoLibraryUsageDescription | ✅ | "…access your photos to create your Vision Board." |
| NSUserNotificationsUsageDescription | ✅ | Detailed habit reminder description |
| Privacy manifest (xcprivacy) | ✅ | UserDefaults, FileTimestamp, DiskSpace, BootTime — all with reasons |
| Privacy manifest plugin | ✅ | `withPrivacyManifest.js` copies xcprivacy into Xcode project |
| No user tracking | ✅ | `NSPrivacyTracking = false`, no ATT prompt needed |
| Collected data types declared | ✅ | Purchase history, crash data, performance data, product interaction |
| EAS production profile | ✅ | `eas.json` has production build + submit config |
| Apple Sign-In | ✅ | `usesAppleSignIn: true` |
| Hermes engine | ✅ | `jsEngine: "hermes"` |
| Sentry integration | ✅ | Configured (SENTRY_DISABLE_AUTO_UPLOAD for builds) |
| RevenueCat (IAP) | ✅ | `react-native-purchases-ui` present |
| App Transport Security | ✅ | `NSAllowsArbitraryLoads: false` (secure) |
| URL scheme | ✅ | `habit-tracker` + `com.chainday.app` |

## ⚠️ Needs Attention

| Item | Issue | Action Required |
|------|-------|-----------------|
| Build number mismatch | app.json says `"buildNumber": "2"` but Info.plist says `5` | Sync to highest value (`5` or higher). EAS managed builds use app.json — update to `"5"` or let EAS auto-increment. |
| `UIUserInterfaceStyle` = Light | Info.plist hardcodes Light mode | If app supports dark mode (many PRs suggest it does), change to `Automatic` or remove key |
| Support URL | Not configured in app.json or eas.json | Add a support URL (e.g., email or landing page) — required for App Store Connect metadata |
| App Store screenshots | Not found in repo | Prepare screenshots for 6.7" (iPhone 15 Pro Max), 6.5" (iPhone 11 Pro Max), 5.5" (iPhone 8 Plus), 12.9" iPad Pro |
| App Store description | Not found in repo | Write compelling description (subtitle, keywords, promotional text) |
| App category | Not set | Choose primary (Health & Fitness) and secondary category in App Store Connect |
| Age rating questionnaire | Not completed | Complete in App Store Connect (no mature content expected) |
| `console.log` statements | ~130 source files contain console calls | Ensure these are stripped in production builds (Babel plugin or __DEV__ guards) |
| `expo-store-review` | Present but no usage description needed | Verify `requestReview()` is called at appropriate moments (not on first launch) |
| `supportsTablet: true` | iPad is supported | Verify iPad layout works — Apple will test on iPad if enabled |

## 🔲 Not Applicable / Low Risk

| Item | Notes |
|------|-------|
| Private API usage | No evidence of private API calls |
| Background modes | Not declared (not needed for current features) |
| Sign in with Apple | Correctly configured (required since app uses third-party sign-in) |
| IDFA / Ad tracking | Not used — no ATT prompt needed |

## 📋 Pre-Submission Steps

1. [ ] Bump build number in `app.json` → `"buildNumber": "5"` (or higher)
2. [ ] Add support URL to App Store Connect
3. [ ] Prepare 4 screenshot sets (6.7", 6.5", 5.5", 12.9" iPad)
4. [ ] Write App Store description, subtitle, keywords
5. [ ] Set `UIUserInterfaceStyle` to `Automatic` if dark mode is supported
6. [ ] Run `eas build --platform ios --profile production`
7. [ ] Run `eas submit --platform ios`
8. [ ] Complete App Store Connect metadata (age rating, category, pricing)
9. [ ] Verify console.log stripping in production bundle
10. [ ] Test on iPad if `supportsTablet` remains `true`
