# App Store Submission Requirements - Daily Habits

## Overview
This document outlines all requirements needed to submit the Daily Habits app to the Apple App Store. Complete each section systematically before submission.

---

## 1. Apple Developer Account & Legal Setup

### 1.1 Apple Developer Program Enrollment
- [ ] **Enroll in Apple Developer Program** ($99/year)
  - Visit: https://developer.apple.com/programs/enroll/
  - Complete enrollment (can take 24-48 hours)
  - Note: Required to distribute apps on the App Store

### 1.2 Legal Entity Setup
- [ ] **Determine business entity**
  - Individual vs Company account
  - Legal name must match payment/tax information
  - Cannot be easily changed later

### 1.3 Tax & Banking Information
- [ ] **Set up banking information in App Store Connect**
  - Required for paid apps or in-app purchases
  - Navigate to: Agreements, Tax, and Banking
  - Complete W-9 (US) or equivalent tax forms

---

## 2. App Configuration & Technical Requirements

### 2.1 Bundle Identifier & App Name
- [x] **Bundle Identifier configured**: `com.andres9888.daily-habits`
  - Location: `app.json` (line 21)
  - ⚠️ Cannot be changed after first submission

- [x] **App Name set**: "Daily Habits"
  - Location: `app.json` (line 3)
  - Must be unique on App Store
  - Max 30 characters

### 2.2 Version & Build Numbers
- [x] **Version**: 1.0.0 (configured in `app.json`)
- [x] **Build number**: 1 (in `ios/DailyHabits/Info.plist`)
- [ ] **Verify semantic versioning** for future updates
  - Major.Minor.Patch format (e.g., 1.0.0)
  - Increment appropriately for updates

### 2.3 iOS Deployment Target
- [x] **Minimum iOS version**: 12.0
  - Location: `ios/DailyHabits/Info.plist` (line 28)
  - Current requirement: iOS 13+ recommended
  - **Action needed**: Consider updating to iOS 13.0+ for better compatibility

### 2.4 Required Permission Descriptions
Since your app uses notifications, you need to add usage descriptions:

- [x] **Add NSUserNotificationsUsageDescription** to `app.json` `ios.infoPlist` and `ios/ChainDay/Info.plist`
  ```xml
  <key>NSUserNotificationsUsageDescription</key>
  <string>Chain Day sends habit reminders and streak alerts you choose to help you stay consistent.</string>
  ```

- [ ] **Verify no other permissions needed**
  - Camera, Photos, Location, Health, etc.
  - Only request permissions actually used

### 2.5 App Transport Security
- [x] **ATS configured** in Info.plist
  - Currently allows local networking (for development)
  - ⚠️ Before submission: Review if `NSAllowsLocalNetworking` should remain enabled

---

## 3. Visual Assets & App Icons

### 3.1 App Icon Requirements
- [ ] **Create proper iOS app icon set** (1024x1024px)
  - Current: `assets/icon.png` exists
  - **Required sizes for iOS**:
    - 1024x1024 (App Store)
    - 180x180 (iPhone @3x)
    - 120x120 (iPhone @2x)
    - 167x167 (iPad Pro @2x)
    - 152x152 (iPad @2x)
    - And more...

  - **Tools**:
    - Use https://www.appicon.co/ or https://icon.kitchen/
    - Or use EAS Build to generate automatically

  - [ ] **No transparency** (PNG with solid background)
  - [ ] **No rounded corners** (iOS adds them automatically)
  - [ ] **Test at different sizes** for clarity

### 3.2 Splash Screen / Launch Screen
- [x] **Splash image exists**: `assets/splash.png`
  - 2048×2048 generated from `assets/icon.png` (current Chain Day brand)
  - Expo `splash` + `expo-splash-screen` use `#059669`, `contain`, `imageWidth` 200
  - [x] **Create proper splash screen** (2048x2048px)
  - [x] **Match app branding** and background color (#059669)
  - [ ] **Test on different device sizes**

### 3.3 App Store Screenshots (REQUIRED)
You'll need screenshots for App Store listing:

- [ ] **iPhone 6.7" Display** (iPhone 15 Pro Max) - REQUIRED
  - Size: 1290 x 2796 pixels
  - 3-10 screenshots

- [ ] **iPhone 6.5" Display** (iPhone 11 Pro Max, XS Max)
  - Size: 1242 x 2688 pixels

- [ ] **iPhone 5.5" Display** (iPhone 8 Plus)
  - Size: 1242 x 2208 pixels

- [ ] **iPad Pro 12.9" Display** (if supporting iPad)
  - Size: 2048 x 2732 pixels

**Screenshot Tips**:
- Use simulator or real device
- Capture key app screens: Home, Habit Detail, Stats, Settings
- Consider adding captions/annotations
- Show app's value proposition clearly
- Use consistent device frame (tools: https://screenshots.pro)

---

## 4. Privacy & Compliance

### 4.1 Privacy Policy (REQUIRED)
- [ ] **Create Privacy Policy document**
  - Must be hosted on publicly accessible URL
  - Required even for free apps
  - Must explain:
    - What data is collected
    - How data is used
    - How data is stored
    - Third-party services (Convex)
    - User data rights

  - [ ] **Host privacy policy**
    - Options: GitHub Pages, your website, notion.so, etc.
    - Example URL: https://yourdomain.com/privacy-policy

- [ ] **Add privacy policy URL to app**
  - In `app.json` under `extra.privacyPolicy`
  - Will be shown in App Store Connect

### 4.2 App Privacy Questionnaire
When submitting, you'll answer Apple's privacy questions:

- [ ] **Data Collection Disclosure**
  - [ ] Contact Info: Email (if collected)
  - [ ] User Content: Habits, notes, goals
  - [ ] Usage Data: App interactions
  - [ ] Identifiers: User ID from Convex

- [ ] **Data Usage Declaration**
  - App functionality
  - Analytics (if implemented)
  - Product personalization

- [ ] **Third-Party Data Sharing**
  - Convex (backend/database service)
  - Any analytics services

- [ ] **Data Retention Policy**
  - How long data is kept
  - How users can delete their data

### 4.3 Terms of Service
- [ ] **Create Terms of Service** (recommended, not always required)
  - Liability disclaimers
  - User responsibilities
  - Service availability
  - Account termination

### 4.4 Age Rating & Content
- [ ] **Determine age rating**
  - Answer questionnaire in App Store Connect
  - Consider: violence, mature themes, user-generated content
  - Likely rating: 4+ (no objectionable content)

---

## 5. App Store Connect Setup

### 5.1 Create App Record
- [ ] **Log into App Store Connect**
  - URL: https://appstoreconnect.apple.com

- [ ] **Create new app**
  - Click "+" → "New App"
  - Select iOS platform
  - Enter app name: "Daily Habits"
  - Select primary language: English
  - Enter Bundle ID: `com.andres9888.daily-habits`
  - SKU: Create unique identifier (e.g., `daily-habits-001`)

### 5.2 App Information
- [ ] **App Store Icon** (1024x1024px)
- [ ] **App Name** (max 30 characters)
- [ ] **Subtitle** (max 30 characters)
  - Example: "Build Better Habits Daily"

- [ ] **Primary Category**: Productivity or Health & Fitness
- [ ] **Secondary Category**: (optional) Lifestyle

### 5.3 Description & Keywords
- [ ] **Promotional Text** (max 170 characters, updatable without review)
  - Highlights, what's new, special offers

- [ ] **Description** (max 4000 characters)
  - What does your app do?
  - Key features
  - Benefits to users
  - Call to action

  **Example structure**:
  ```
  Daily Habits helps you build lasting habits through simple daily tracking and motivational insights.

  KEY FEATURES:
  • Track unlimited habits
  • Visual progress with streak tracking
  • Personalized motivation and insights
  • Beautiful, intuitive interface
  • Private and secure - your data stays yours

  WHY DAILY HABITS?
  [Benefits and value proposition]

  GET STARTED TODAY
  [Call to action]
  ```

- [ ] **Keywords** (max 100 characters, comma-separated)
  - Example: "habit,tracker,productivity,goals,routine,daily,motivation,streak,progress,mindfulness"
  - Research competitors for inspiration
  - Cannot include app name or category
  - No spaces after commas

### 5.4 What's New (for updates)
- [ ] **Version 1.0.0 release notes**
  - First release description
  - Key features to highlight

### 5.5 Support Information
- [ ] **Support URL** (required)
  - Create support page or email link
  - Example: https://yourdomain.com/support
  - Or mailto: support@yourdomain.com

- [ ] **Marketing URL** (optional)
  - Your app's website

- [ ] **Copyright**
  - Format: "2024 Your Name/Company"

### 5.6 App Review Information
- [ ] **Contact Information**
  - First name, Last name
  - Phone number
  - Email address
  - (For Apple reviewers to contact you)

- [ ] **Demo Account** (if app requires login)
  - Username
  - Password
  - Instructions for reviewers

- [ ] **Notes for Reviewer**
  - Any special instructions
  - Features that need explanation
  - Test data locations

### 5.7 Version Release Options
- [ ] **Choose release option**:
  - Automatic release (as soon as approved)
  - Manual release (you choose when to publish)
  - Scheduled release (specific date/time)

---

## 6. Build & Distribution

### 6.1 Signing & Provisioning
- [ ] **Create App Store Connect API Key** (recommended)
  - Users and Access → Keys → App Store Connect API

- [ ] **Or use Apple ID authentication**
  - Less secure, requires 2FA

- [ ] **Generate signing certificates**
  - iOS Distribution Certificate
  - App Store provisioning profile

  **Using EAS (Expo Application Services)**:
  ```bash
  npm install -g eas-cli
  eas login
  eas build:configure
  ```

### 6.2 Build Configuration
- [ ] **Update `app.json` for production**
  ```json
  {
    "expo": {
      "ios": {
        "buildNumber": "1",
        "bundleIdentifier": "com.andres9888.daily-habits",
        "config": {
          "usesNonExemptEncryption": false
        }
      }
    }
  }
  ```

- [ ] **Set environment variables**
  - Production API keys
  - Convex production URL
  - Any feature flags

- [ ] **Disable development tools**
  - Remove console.logs
  - Disable debug overlays
  - Remove test/demo data

### 6.3 Build App
Using EAS Build (recommended for Expo):

```bash
# Production build for iOS
eas build --platform ios --profile production
```

Or configure in `eas.json`:
```json
{
  "build": {
    "production": {
      "ios": {
        "releaseChannel": "production",
        "distribution": "store"
      }
    }
  }
}
```

- [ ] **Build completes successfully**
- [ ] **Download .ipa file** (or auto-submit to App Store Connect)

### 6.4 Upload to App Store Connect
- [ ] **Upload using EAS**
  ```bash
  eas submit --platform ios
  ```

- [ ] **Or use Transporter app**
  - Download from Mac App Store
  - Drag and drop .ipa file
  - Wait for processing (5-30 minutes)

- [ ] **Verify build appears** in App Store Connect
  - TestFlight → iOS → Builds
  - Or App Store → select version → Build

---

## 7. Testing Requirements

### 7.1 TestFlight Beta Testing
- [ ] **Upload build to TestFlight**
  - Automatically available after upload processing

- [ ] **Add beta testers**
  - Internal testers (up to 100)
  - External testers (up to 10,000)

- [ ] **Create testing notes**
  - What to test
  - Known issues
  - Feedback instructions

- [ ] **Test on multiple devices**
  - Different iPhone models
  - Different iOS versions
  - iPad (if supported)

### 7.2 Pre-Submission Testing Checklist
- [ ] **Launch & Stability**
  - [ ] App launches without crashes
  - [ ] No crashes during normal use
  - [ ] Proper error handling

- [ ] **Core Functionality**
  - [ ] Create/edit/delete habits
  - [ ] Mark habits complete
  - [ ] View progress and stats
  - [ ] Notifications work correctly

- [ ] **User Interface**
  - [ ] All screens render correctly
  - [ ] No placeholder text/images
  - [ ] Proper keyboard handling
  - [ ] All buttons/links work
  - [ ] Loading states display properly
  - [ ] Empty states show helpful messages

- [ ] **Performance**
  - [ ] App responds quickly to interactions
  - [ ] Smooth scrolling
  - [ ] No memory leaks
  - [ ] Reasonable app size

- [ ] **Network & Data**
  - [ ] Works with poor internet connection
  - [ ] Offline mode (if applicable)
  - [ ] Data persists correctly
  - [ ] Proper loading/error states

- [ ] **Permissions & Privacy**
  - [ ] Permission requests show proper descriptions
  - [ ] App works if permissions denied
  - [ ] No unexpected data collection

---

## 8. App Review Guidelines Compliance

### 8.1 Common Rejection Reasons to Avoid

#### Design Issues
- [ ] **Complete and polished app**
  - No "beta" or "demo" mentions
  - No placeholder content
  - No broken features

- [ ] **Proper error handling**
  - Graceful failures
  - Helpful error messages
  - No technical jargon for users

#### Business Model
- [ ] **Clear value proposition**
  - App must be useful as-is
  - If freemium, core functionality must be free

- [ ] **In-App Purchases compliance** (if applicable)
  - Must use Apple's IAP system
  - Cannot mention external payment methods

#### Legal
- [ ] **Privacy Policy accessible**
  - URL works and loads
  - Actually covers your app

- [ ] **No copyright violations**
  - Own all assets/content
  - Licensed third-party content
  - Proper attributions

#### Technical
- [ ] **No private APIs**
  - Only use public iOS APIs
  - No workarounds for App Store rules

- [ ] **Proper API usage**
  - Notifications used appropriately
  - Background modes justified

- [ ] **No crashes or major bugs**
  - Extensively tested
  - Handle edge cases

#### Content
- [ ] **Age-appropriate**
  - Accurate age rating
  - No inappropriate content

- [ ] **User-generated content** (if applicable)
  - Moderation system
  - Report/block features
  - Content guidelines

### 8.2 Review Guidelines Reference
Read the full guidelines: https://developer.apple.com/app-store/review/guidelines/

Key sections:
- 2.3 Accurate Metadata
- 4.0 Design
- 5.1 Privacy

---

## 9. Submission Process

### 9.1 Final Pre-Submission Checklist
- [ ] All sections above completed
- [ ] Build uploaded and processed
- [ ] Screenshots added for all required sizes
- [ ] App description finalized
- [ ] Privacy policy URL added
- [ ] Support URL working
- [ ] Keywords optimized
- [ ] Age rating set
- [ ] Pricing/availability configured

### 9.2 Submit for Review
- [ ] **In App Store Connect**:
  1. Select your app
  2. Select version (1.0.0)
  3. Click "Add for Review"
  4. Answer export compliance questions
  5. Submit

- [ ] **Export Compliance**
  - "Does your app use encryption?"
  - If HTTPS only: Select "No"
  - (Unless you implement additional encryption)

### 9.3 Review Timeline
- **Average review time**: 1-3 days
- **Could be longer**: First submission, complex app, holidays
- **Can be expedited**: For critical bug fixes (request in App Review)

### 9.4 Possible Outcomes
- ✅ **Approved**: App goes live (or scheduled release)
- ⏸️ **Waiting for Review**: In queue
- 🔄 **In Review**: Apple is testing
- ❌ **Rejected**: Address issues and resubmit
- ℹ️ **Metadata Rejected**: Fix app info without new build
- ⚠️ **Needs Information**: Apple has questions

---

## 10. Post-Submission Tasks

### 10.1 After Approval
- [ ] **App goes live** (based on release option chosen)
- [ ] **Test live app** from App Store
- [ ] **Monitor crash reports** in App Store Connect
- [ ] **Respond to user reviews**

### 10.2 Marketing Preparation
- [ ] **App Store listing URL**: Share on social media
- [ ] **Press kit**: Screenshots, description, contact info
- [ ] **Website update**: Add App Store badge
- [ ] **Launch announcement**: Blog post, social media

### 10.3 Ongoing Maintenance
- [ ] **Monitor ratings and reviews**
- [ ] **Track analytics** (downloads, retention)
- [ ] **Fix bugs** reported by users
- [ ] **Plan updates** based on feedback

---

## Quick Action Items Summary

### IMMEDIATE (Do First)
1. ✅ Enroll in Apple Developer Program
2. 🎨 Create proper app icon set (1024x1024)
3. 📝 Write Privacy Policy and host it
4. 📸 Take App Store screenshots
5. ⚙️ Add notification permission description to Info.plist

### HIGH PRIORITY (Do Soon)
6. 📱 Test app thoroughly on real devices
7. 📋 Fill out App Store Connect metadata
8. 🏗️ Create production build with EAS
9. 🧪 TestFlight beta testing
10. 🔍 Review App Store Guidelines compliance

### BEFORE SUBMISSION (Final Steps)
11. ✍️ Prepare "What's New" text
12. 🔐 Set up demo account (if needed)
13. 📋 Write reviewer notes
14. ✅ Complete final pre-submission checklist
15. 🚀 Submit for review!

---

## Useful Resources

- **App Store Connect**: https://appstoreconnect.apple.com
- **Developer Portal**: https://developer.apple.com/account
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/
- **EAS Build Documentation**: https://docs.expo.dev/build/introduction/
- **EAS Submit Documentation**: https://docs.expo.dev/submit/introduction/
- **App Icon Generator**: https://www.appicon.co/
- **Screenshot Tools**: https://screenshots.pro/ or https://www.figma.com

---

## Questions or Issues?

As you work through this checklist, document any questions or blockers. Common areas that need decisions:
- Pricing strategy (free vs paid)
- In-app purchases or subscriptions
- Target audience and marketing approach
- Feature prioritization for v1.0

**Next Steps**: Start with the "IMMEDIATE" action items and work through the checklist systematically.
