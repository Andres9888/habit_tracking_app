# EAS Build & App Store Submission Guide

## Overview

ChainDay uses **Expo Application Services (EAS)** for building, signing, and submitting to the App Store.

---

## Prerequisites

1. **EAS CLI** installed globally:
   ```bash
   npm install -g eas-cli
   ```
2. **Expo account** linked to the project:
   ```bash
   eas login
   ```
3. **Apple Developer account** with an active membership ($99/year)
4. **App Store Connect** app record created with bundle ID `com.chainday.app`

---

## Build Profiles

| Profile | Purpose | Distribution | Channel |
|---------|---------|-------------|---------|
| `development` | Dev client with debugging | Internal (Ad Hoc) | `development` |
| `development-simulator` | iOS Simulator build | Internal | `development` |
| `preview` | TestFlight / internal testing | Internal (Ad Hoc) | `preview` |
| `production` | App Store release | App Store | `production` |

---

## iOS Code Signing Setup

EAS handles code signing automatically. On your **first build**, EAS will prompt you to:

1. Log in to your Apple Developer account
2. Select or create a **Distribution Certificate**
3. Select or create a **Provisioning Profile**

### Manual Setup (if needed)

1. Go to [Apple Developer Portal](https://developer.apple.com/account/resources/certificates/list)
2. Create an **Apple Distribution** certificate
3. Create an **App Store** provisioning profile for `com.chainday.app`
4. Upload credentials to EAS:
   ```bash
   eas credentials
   ```

### Credential Management
```bash
# View current credentials
eas credentials --platform ios

# Reset credentials (if compromised or expired)
eas credentials --platform ios
# Then select "Remove" and re-run a build to regenerate
```

---

## Build Commands

```bash
# Development build (physical device)
npm run eas:build:dev

# Simulator build
npx eas build --profile development-simulator --platform ios

# Preview build (TestFlight internal testing)
npm run eas:build:preview

# Production build (App Store)
npm run eas:build:ios

# Production build + auto-submit to App Store Connect
npm run eas:build:submit:ios
```

---

## Submission Flow

### First-Time Setup

1. **Create the app in App Store Connect:**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Apps → "+" → New App
   - Bundle ID: `com.chainday.app`
   - Name: ChainDay

2. **Update `eas.json`:**
   - Replace `REPLACE_WITH_APP_STORE_CONNECT_APP_ID` with your App Store Connect App ID
   - Replace `REPLACE_WITH_TEAM_ID` with your Apple Team ID

### Submitting a Release

```bash
# 1. Bump version in app.json if needed (buildNumber auto-increments)

# 2. Build for production
npm run eas:build:ios

# 3. Submit to App Store Connect
npm run eas:submit:ios

# OR build + submit in one step:
npm run eas:build:submit:ios
```

4. Go to **App Store Connect** → select the build → submit for review

### Version Management

- `version` in `app.json` → user-facing version (e.g., "1.0.0")
- `buildNumber` → auto-incremented by EAS on production builds (`autoIncrement: true`)
- Bump `version` for new App Store releases; `buildNumber` handles the rest

---

## OTA Updates (expo-updates)

After your app is live, push JS-only updates without a new App Store review:

```bash
# Push an update to production users
npm run eas:update "fix: resolve crash on habit completion"

# Push to preview channel (TestFlight users)
eas update --branch preview --message "test: new onboarding flow"

# Check update status
eas update:list
```

### How It Works

- `runtimeVersion` policy is set to `appVersion` — updates are scoped to the current app version
- `checkAutomatically: "ON_LOAD"` — checks for updates every app launch
- `fallbackToCacheTimeout: 0` — app loads immediately, update applies next launch

### When to Use OTA vs New Build

| Change Type | Method |
|------------|--------|
| Bug fix (JS only) | `eas update` (OTA) |
| New feature (JS only) | `eas update` (OTA) |
| Native dependency added | New EAS build required |
| SDK version bump | New EAS build + version bump |
| Asset changes (icons, splash) | New EAS build |

---

## Environment Variables

Set secrets in EAS (never commit them):

```bash
eas secret:create --name SENTRY_AUTH_TOKEN --value "your-token"
eas secret:create --name CONVEX_DEPLOY_KEY --value "your-key"
```

The `APP_VARIANT` env var is set per profile and can be used to switch API endpoints:
- `development` → dev Convex backend
- `staging` → preview Convex deployment
- `production` → production Convex deployment

---

## Troubleshooting

### Build fails with signing errors
```bash
eas credentials --platform ios
# Select "Remove existing" and rebuild — EAS will regenerate
```

### "Missing compliance" warning in App Store Connect
Already handled — `ITSAppUsesNonExemptEncryption: false` is set in `app.json`.

### OTA update not appearing
- Ensure the `runtimeVersion` matches between build and update
- Check: `eas update:list` to verify the update was published
- Users need to fully close and reopen the app

---

## CI/CD (Future)

To automate builds via GitHub Actions, see [EAS + GitHub Actions docs](https://docs.expo.dev/build/building-on-ci/).

Key steps:
1. Add `EXPO_TOKEN` as a GitHub secret
2. Use `expo/expo-github-action` in your workflow
3. Trigger builds on `main` push or release tags
