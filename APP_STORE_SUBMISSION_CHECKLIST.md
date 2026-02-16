# App Store Submission Checklist

**For: Chain Day (Daily Habits)**  
**Created:** 2026-02-16  
**Status:** Pre-submission preparation guide

> 📚 **Related docs:** [`app-store-submission-requirements.md`](./docs/specs/app-store-submission-requirements.md) | [`APPSTORE-01-pre-submission-fixes.md`](./docs/APPSTORE-01-pre-submission-fixes.md)

---

## 🎯 Quick Status Overview

Use this checklist to track your App Store submission readiness. Check off items as you complete them.

---

## 1. Pre-Submission: Certificates & Configuration

### Apple Developer Setup
- [ ] **Enrolled in Apple Developer Program** ($99/year)
  - Enrollment takes 24-48 hours
  - Required before any submission

- [ ] **App Store Connect account active**
  - Access at: https://appstoreconnect.apple.com
  - Team member roles configured

### Bundle ID & App Identity
- [ ] **Bundle ID finalized**
  - Current: `com.andres9888.daily-habits` (from `app.json`)
  - ⚠️ **Cannot be changed after first submission**
  - Coordinate with App Store Connect app record

- [ ] **App Name confirmed**
  - Current: "Daily Habits"
  - Max 30 characters
  - Must be unique on App Store

### Certificates & Provisioning
- [ ] **iOS Distribution Certificate generated**
  - Create in: developer.apple.com → Certificates, IDs & Profiles

- [ ] **App Store provisioning profile created**
  - Links certificate + Bundle ID + App Store distribution

- [ ] **EAS CLI configured** (if using Expo)
  ```bash
  npm install -g eas-cli
  eas login
  eas build:configure
  ```

### Info.plist Requirements
- [ ] **NSUserNotificationsUsageDescription added**
  ```xml
  <key>NSUserNotificationsUsageDescription</key>
  <string>Chain Day sends reminders to help you stay on track with your habits and celebrate your streaks.</string>
  ```

- [ ] **Minimum iOS version set appropriately**
  - Current: iOS 12.0
  - Recommended: iOS 13.0+ for better compatibility

---

## 2. App Store Connect Setup

### Create App Record
- [ ] **New app created in App Store Connect**
  - Platform: iOS
  - Bundle ID: `com.andres9888.daily-habits`
  - SKU: Unique identifier (e.g., `chain-day-001`)
  - Primary language: English

### Basic Information
- [ ] **App Store icon uploaded** (1024×1024px)
  - PNG format
  - No transparency
  - No rounded corners (iOS adds them)
  - Current asset: `assets/icon.png` (verify quality)

- [ ] **App name finalized** (max 30 chars)
  - "Chain Day" or "Daily Habits"

- [ ] **Subtitle added** (max 30 chars)
  - Example: "Build Better Habits Daily"

- [ ] **Primary category selected**
  - Options: Productivity, Health & Fitness, Lifestyle

- [ ] **Secondary category selected** (optional)

### Description & Metadata
- [ ] **Promotional text written** (max 170 chars, updatable)
  - Highlights, what's new, special features

- [ ] **App description written** (max 4000 chars)
  - What the app does
  - Key features
  - Benefits to users
  - Call to action
  
  **Suggested structure:**
  ```
  Chain Day helps you build lasting habits through simple daily tracking, 
  motivational insights, and beautiful visualization of your progress.
  
  KEY FEATURES:
  • Track unlimited habits with daily check-ins
  • Visualize your progress with streak tracking
  • Personalized motivation and insights
  • Beautiful, intuitive interface
  • Private and secure - your data stays yours
  
  WHY CHAIN DAY?
  [Value proposition - consistency, motivation, simplicity]
  
  GET STARTED TODAY
  Download Chain Day and start building the habits that matter.
  ```

- [ ] **Keywords optimized** (max 100 chars, comma-separated)
  - Example: `habit,tracker,productivity,goals,routine,daily,motivation,streak,progress,mindfulness`
  - No spaces after commas
  - Cannot include app name or category

- [ ] **Version 1.0.0 release notes written**
  - Highlight key features for first release

### Support & Legal
- [ ] **Support URL provided**
  - Must be publicly accessible
  - Options: Website, help center, or `mailto:support@example.com`

- [ ] **Marketing URL added** (optional)
  - Your app's landing page

- [ ] **Copyright text added**
  - Format: `2026 [Your Name/Company]`

---

## 3. Required Screenshots

App Store requires screenshots for specific device sizes. Use iPhone simulators or real devices.

### iPhone 6.7" Display (iPhone 15 Pro Max) - **REQUIRED**
- [ ] **3-10 screenshots at 1290×2796 pixels**
  - Screenshot 1: Home screen with habits
  - Screenshot 2: Habit detail / check-in flow
  - Screenshot 3: Progress/stats view
  - Screenshot 4: Settings or profile
  - Screenshot 5: Additional feature highlight

### iPhone 6.5" Display (iPhone 11 Pro Max, XS Max, XR)
- [ ] **3-10 screenshots at 1242×2688 pixels**
  - Can reuse 6.7" if similar enough

### iPhone 5.5" Display (iPhone 8 Plus) - **REQUIRED**
- [ ] **3-10 screenshots at 1242×2208 pixels**
  - Required for older device support

### iPad Display (if supporting iPad)
- [ ] **iPad Pro 12.9" screenshots at 2048×2732 pixels**
  - Only if app supports iPad

### Screenshot Tips
- [ ] **Capture key user flows** (onboarding → habit creation → tracking → progress)
- [ ] **Show app's value** in the first 2-3 screenshots
- [ ] **Use consistent branding** (match splash color #F5F1ED)
- [ ] **Consider captions** to explain features
- [ ] **Use device frames** for polish (optional)
  - Tools: https://screenshots.pro, Apple Keynote, Figma

### Tools for Screenshots
```bash
# Launch iOS Simulator
open -a Simulator

# Or use physical device + QuickTime Player for recording
# File → New Movie Recording → select iPhone as source
```

---

## 4. Privacy Labels: What Data Chain Day Collects

Apple requires detailed privacy disclosure. Answer the App Privacy questionnaire in App Store Connect.

### Data Collection Categories

#### ✅ Data Collected and Linked to User
- [ ] **User Content**
  - What: Habit names, goals, check-in records, notes
  - Why: App functionality
  - Linked to user: Yes

- [ ] **Identifiers**
  - What: User ID (from Convex backend)
  - Why: App functionality, account management
  - Linked to user: Yes

#### 📧 Optional Data (if implemented)
- [ ] **Contact Info: Email Address**
  - Only if you collect email for account creation
  - Why: Account management, support

#### ⚠️ Analytics & Error Tracking
- [ ] **Diagnostics**
  - What: Crash logs, performance data (if using Sentry)
  - Why: App improvement, debugging
  - Disclosure: Mention Sentry in Privacy Policy (see H-004 in APPSTORE-01)

#### ❌ Data NOT Collected
- [ ] Location
- [ ] Contacts
- [ ] Photos/Videos
- [ ] Health data
- [ ] Financial info
- [ ] Browsing history

### Third-Party Data Sharing
- [ ] **Convex** (backend/database)
  - Purpose: Data storage, sync
  - Data shared: All user content

- [ ] **Sentry** (if enabled)
  - Purpose: Error tracking
  - Data shared: Crash reports, device info

### Data Retention & Deletion
- [ ] **Document data retention policy**
  - How long user data is kept
  - User can delete account and data (verify this is implemented)

---

## 5. Privacy Policy (REQUIRED)

- [ ] **Privacy Policy document created**
  - Must cover:
    - What data is collected (see section 4 above)
    - How data is used
    - How data is stored (Convex)
    - Third-party services (Convex, Sentry)
    - User rights (access, deletion, portability)
    - Data retention period
    - Contact information for privacy questions

- [ ] **Privacy Policy hosted publicly**
  - No authentication required
  - Options: GitHub Pages, Notion, your website
  - URL must be stable (not change)

- [ ] **Privacy Policy URL added to app**
  - In `app.json` under `extra.privacyPolicy`
  - In SettingsModal (already implemented ✅)

- [ ] **Privacy Policy URL added to App Store Connect**
  - App Information → Privacy Policy URL

- [ ] **Terms of Service created** (optional but recommended)
  - Liability disclaimers
  - User responsibilities
  - Account termination policy

---

## 6. App Review Guidelines Compliance Check

Review Apple's guidelines and ensure compliance: https://developer.apple.com/app-store/review/guidelines/

### Design (Guideline 4.0)
- [ ] **App is complete and polished**
  - No "beta", "demo", or "coming soon" mentions
  - No placeholder images or lorem ipsum text
  - No broken features or non-functional buttons

- [ ] **Proper error handling**
  - Network errors show helpful messages
  - Empty states provide guidance
  - No crashes or freezes

- [ ] **UI follows iOS conventions**
  - Standard navigation patterns
  - Appropriate use of native UI components
  - Consistent with iOS Human Interface Guidelines

### Business Model (Guideline 3.1)
- [ ] **In-App Purchases use Apple's IAP system**
  - Already using RevenueCat ✅
  - Never mention external payment methods
  - Clear subscription terms (already addressed in PR #203 ✅)

- [ ] **Restore Purchases implemented** ✅
  - Already done in PR #201

- [ ] **Subscription terms visible and clear**
  - Trial period terms
  - Price and renewal terms
  - Cancellation policy

### Legal (Guideline 5.0)
- [ ] **Privacy Policy is accessible** ✅
  - Already linked in app

- [ ] **No copyright violations**
  - Own all assets (icons, images, text)
  - Licensed fonts or using system fonts
  - Proper attribution for third-party content

### Technical (Guideline 2.0)
- [ ] **No use of private APIs**
  - Only public iOS APIs used
  - No workarounds for App Store restrictions

- [ ] **App doesn't crash**
  - Extensively tested on multiple devices
  - Handle edge cases gracefully

- [ ] **Reasonable app size**
  - Under 4GB uncompressed
  - Assets optimized

### Performance
- [ ] **App launches quickly**
  - Under 3 seconds to usable state

- [ ] **Smooth animations and scrolling**
  - 60fps on most devices

- [ ] **Efficient battery usage**
  - No excessive background activity
  - Optimize network requests

---

## 7. TestFlight Setup & Beta Testing

### TestFlight Configuration
- [ ] **Build uploaded to TestFlight**
  - Upload via EAS Submit or Xcode
  - Wait for processing (5-30 minutes)

- [ ] **Export compliance answered**
  - "Does your app use encryption?"
  - If HTTPS only: Answer "No"
  - If additional encryption: Provide details

- [ ] **TestFlight app information completed**
  - Test information for beta testers
  - What to test
  - How to provide feedback

### Internal Testing
- [ ] **Add internal testers** (up to 100)
  - Team members, trusted friends
  - No Apple review required

- [ ] **Internal testing completed**
  - Test all core features
  - Verify no crashes
  - Check performance on different devices

### External Testing (Optional)
- [ ] **Add external testers** (up to 10,000)
  - Requires Beta App Review (shorter than full review)
  - Use for wider testing

- [ ] **External beta testing**
  - Collect feedback
  - Fix critical issues before submission

### Pre-Submission Testing Checklist
- [ ] **Launch & stability**
  - App launches without crashes ✅
  - No crashes during 30+ min session
  - Proper error handling for network issues

- [ ] **Core features work**
  - Create/edit/delete habits
  - Check in on habits
  - View progress and stats
  - Notifications delivered correctly

- [ ] **UI polish**
  - All screens render correctly
  - No placeholder text (check for "Lorem ipsum")
  - All buttons and links work
  - Loading states display
  - Empty states show helpful guidance

- [ ] **Multi-device testing**
  - Test on iPhone 12 or newer
  - Test on iPhone SE (smaller screen)
  - Test on iPad (if supported)
  - Test on iOS 13, 14, 15, 16

- [ ] **Network conditions**
  - Works with slow connection
  - Handles airplane mode gracefully
  - Data syncs correctly when reconnected

- [ ] **Permissions**
  - Notification permission request works
  - App still functions if permission denied

---

## 8. Common Rejection Reasons & How to Avoid Them

### ❌ Rejection: Incomplete App
**Why:** App feels like a demo or beta version.

**How to avoid:**
- [ ] Remove any "beta" or "work in progress" mentions
- [ ] Ensure all advertised features work
- [ ] No "coming soon" placeholders
- [ ] Polish empty states and error messages

### ❌ Rejection: Crashes or Major Bugs
**Why:** App crashes during review or has obvious bugs.

**How to avoid:**
- [ ] Extensive TestFlight testing
- [ ] Test on multiple device types and iOS versions
- [ ] Handle all error cases gracefully
- [ ] Monitor crash logs in TestFlight

### ❌ Rejection: Misleading Metadata
**Why:** Screenshots or description don't match actual app.

**How to avoid:**
- [ ] Screenshots show actual app interface (no mockups)
- [ ] Description accurately reflects features
- [ ] Don't promise features not yet implemented
- [ ] App name matches what's shown in description

### ❌ Rejection: Privacy Policy Issues
**Why:** Privacy policy missing, inaccessible, or doesn't cover app's data usage.

**How to avoid:**
- [ ] Privacy policy URL works without login
- [ ] Policy specifically mentions your app
- [ ] Covers all data collection (see section 4)
- [ ] Mentions third-party services (Convex, Sentry)

### ❌ Rejection: In-App Purchase Issues
**Why:** IAP implementation doesn't meet guidelines.

**How to avoid:**
- [ ] Use Apple's IAP system (RevenueCat does this ✅)
- [ ] Restore purchases works ✅
- [ ] Subscription terms are clear ✅
- [ ] No mention of external payment methods
- [ ] Never ask users to "pay outside the app"

### ❌ Rejection: Insufficient App Content
**Why:** App is too simple or just wraps a website.

**How to avoid:**
- [ ] Provide clear value beyond a mobile website
- [ ] Native iOS experience (not just a WebView)
- [ ] Unique features and polish
- [ ] Demonstrate utility for users

### ❌ Rejection: Business Model Unclear
**Why:** Reviewers don't understand how the app provides value.

**How to avoid:**
- [ ] Clear description of what app does
- [ ] Obvious value proposition
- [ ] If freemium, core functionality works without purchase
- [ ] Demo account provided if login required

### ⚠️ Metadata Rejection (Easier to Fix)
**Why:** App info, screenshots, or keywords violate guidelines.

**Good news:** No new build required, just update metadata.

**How to avoid:**
- [ ] No misleading keywords
- [ ] Screenshots don't include marketing copy
- [ ] Age rating accurate
- [ ] Category appropriate

---

## 9. App Review Information

### Demo Account (if app requires login)
- [ ] **Create test account for reviewers**
  - Username: _______________
  - Password: _______________
  - Pre-populated with sample data

- [ ] **Document in "Demo Account" field**
  ```
  Username: testuser@example.com
  Password: TestPass123!
  
  Note: Account is pre-populated with 5 sample habits and 14 days of history.
  ```

### Review Notes
- [ ] **Add notes for Apple reviewers**
  - Any special instructions
  - Features that need explanation
  - How to test specific functionality

**Example:**
```
Thank you for reviewing Chain Day!

KEY FEATURES TO TEST:
1. Create a new habit (tap + button on home screen)
2. Check in on a habit (tap the habit card)
3. View progress (tap "Progress" tab)
4. Set up notifications (Settings → Notifications)

DEMO ACCOUNT:
Email: demo@chainday.app
Password: Review2026!

The demo account includes sample habits with 14 days of history.

Please note: Notifications require permission when first requested.

For questions: support@chainday.app
```

### Contact Information
- [ ] **First name & last name provided**
- [ ] **Phone number** (for Apple to contact during review)
- [ ] **Email address** (monitored regularly)

---

## 10. Build & Submission

### Production Build Preparation
- [ ] **Environment variables set**
  - Production Convex URL
  - Production API keys (if any)
  - RevenueCat production API key

- [ ] **Development code removed**
  - Console.logs wrapped in `__DEV__` guards ✅ (from PRs #202, #204)
  - Debug overlays disabled
  - Test/demo data removed

- [ ] **Version & build numbers set**
  - Version: 1.0.0
  - Build number: 1 (increment for subsequent builds)

- [ ] **App icons finalized**
  - All required sizes generated
  - No transparency
  - Looks good at small sizes

### Build the App
```bash
# Using EAS (Expo Application Services)
eas build --platform ios --profile production

# Build will:
# 1. Create signing certificates (first time)
# 2. Generate provisioning profile
# 3. Build .ipa file
# 4. Upload to App Store Connect (if configured)
```

- [ ] **Build completes successfully**
- [ ] **No errors or critical warnings**

### Upload to App Store Connect
```bash
# Submit build to App Store Connect
eas submit --platform ios

# Or upload manually with Transporter app:
# 1. Download Transporter from Mac App Store
# 2. Drag .ipa file into Transporter
# 3. Click "Deliver"
# 4. Wait for processing (5-30 minutes)
```

- [ ] **Build uploaded successfully**
- [ ] **Build appears in App Store Connect**
  - Check: App Store → iOS App → [Your Version] → Build
  - Status should change from "Processing" to "Ready"

### Final Pre-Submission Checklist
- [ ] All required screenshots uploaded
- [ ] App description finalized
- [ ] Keywords optimized
- [ ] Privacy policy URL added
- [ ] Support URL working
- [ ] Build selected for version 1.0.0
- [ ] App review information complete
- [ ] Age rating set (likely 4+)
- [ ] Pricing and availability configured

### Submit for Review
- [ ] **Click "Submit for Review"** in App Store Connect
- [ ] **Answer export compliance questions**
  - "Does your app use encryption?"
  - For HTTPS only: "No"

- [ ] **Confirm submission**
  - Status changes to "Waiting for Review"

---

## 11. Post-Submission Monitoring

### Review Process
- **Typical timeline:** 1-3 days
- **Could be longer:** First submission, holidays, complex app
- **Status updates:** Check App Store Connect or email

### Possible Statuses
- ⏳ **Waiting for Review** → In queue
- 🔍 **In Review** → Apple is actively testing
- ✅ **Approved** → Ready to release!
- ❌ **Rejected** → Check Resolution Center for details
- ℹ️ **Needs Information** → Apple has questions (respond quickly)

### If Approved
- [ ] **App goes live** (based on release option)
  - Automatic release: Immediately
  - Manual release: Click "Release this version"
  - Scheduled: At specified date/time

- [ ] **Download and test live app**
  - Search App Store
  - Verify everything works

- [ ] **Monitor crash reports**
  - Check: App Store Connect → Analytics → Crashes

- [ ] **Respond to user reviews**
  - Set up App Store Connect notifications
  - Reply to reviews (especially negative ones)

### If Rejected
- [ ] **Read rejection reason carefully**
  - Check Resolution Center in App Store Connect
  - Understand exactly what needs fixing

- [ ] **Fix the issues**
  - Address all points raised
  - Test thoroughly

- [ ] **Respond to Apple**
  - Explain what you fixed
  - Provide additional information if needed

- [ ] **Resubmit**
  - If code changes: Upload new build
  - If metadata only: Update and resubmit

---

## 12. Post-Launch Tasks

### Immediate (First Week)
- [ ] **Monitor for crashes**
  - Check daily in App Store Connect
  - Fix critical bugs quickly

- [ ] **Respond to reviews**
  - Thank positive reviewers
  - Address concerns in negative reviews
  - Update app based on feedback

- [ ] **Share the launch**
  - Social media announcement
  - Friends and family
  - Product Hunt, Reddit (if appropriate)

### Ongoing (First Month)
- [ ] **Track key metrics**
  - Downloads
  - Daily active users
  - Retention rate
  - Crash-free rate (target: >99%)

- [ ] **Collect user feedback**
  - In-app feedback mechanism
  - Support email
  - Review analysis

- [ ] **Plan first update**
  - Bug fixes
  - Small improvements
  - New features (based on feedback)

### Marketing (Optional)
- [ ] **App Store optimization (ASO)**
  - Monitor keyword rankings
  - A/B test screenshots
  - Update description based on what resonates

- [ ] **Website/landing page**
  - Add App Store badge
  - Screenshots and features
  - Privacy policy and support links

- [ ] **Press kit**
  - App description
  - Screenshots
  - Icon
  - Press contact

---

## 📋 Quick Reference: Required Assets

| Asset | Size | Format | Required? |
|-------|------|--------|-----------|
| App Icon | 1024×1024px | PNG (no alpha) | ✅ Yes |
| iPhone 6.7" Screenshots | 1290×2796px | PNG/JPG | ✅ Yes (3-10) |
| iPhone 5.5" Screenshots | 1242×2208px | PNG/JPG | ✅ Yes (3-10) |
| iPhone 6.5" Screenshots | 1242×2688px | PNG/JPG | ⚠️ Recommended |
| iPad Screenshots | 2048×2732px | PNG/JPG | 📱 If supporting iPad |
| Privacy Policy | - | Web page (URL) | ✅ Yes |
| Support URL | - | Web page or email | ✅ Yes |

---

## 🎯 Success Criteria

Before submitting, ensure:
- ✅ App builds and runs without crashes
- ✅ All required assets uploaded (icon, screenshots)
- ✅ Privacy policy accessible and accurate
- ✅ TestFlight testing completed with no major issues
- ✅ All required metadata filled out
- ✅ Demo account works (if needed)
- ✅ Complies with App Store Review Guidelines
- ✅ Production build ready with correct version/build numbers

---

## 📞 Support & Resources

### Apple Resources
- **App Store Connect:** https://appstoreconnect.apple.com
- **Developer Portal:** https://developer.apple.com/account
- **Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Human Interface Guidelines:** https://developer.apple.com/design/human-interface-guidelines/
- **Contact App Review:** https://developer.apple.com/contact/app-store/

### Tools
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **EAS Submit:** https://docs.expo.dev/submit/introduction/
- **App Icon Generator:** https://www.appicon.co/
- **Screenshot Frames:** https://screenshots.pro/

### Internal Docs
- Full requirements: [`docs/specs/app-store-submission-requirements.md`](./docs/specs/app-store-submission-requirements.md)
- Pre-submission fixes: [`docs/APPSTORE-01-pre-submission-fixes.md`](./docs/APPSTORE-01-pre-submission-fixes.md)

---

**Last updated:** 2026-02-16  
**Next review:** After TestFlight testing phase

Good luck with your submission! 🚀
