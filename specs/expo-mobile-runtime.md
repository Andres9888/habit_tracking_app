# Expo Mobile Runtime and EAS Spec

## Overview

Use Expo SDK 54 with EAS Build, EAS Submit, and optional EAS Update as the mobile runtime path for ChainDay.

Current repo state, checked 2026-07-14:

- `package.json`: `expo` `~54.0.34`, `react-native` `0.81.5`, `react` `19.1.0`, `expo-updates` `~29.0.18`.
- `app.json`: app name `ChainDay`, slug `daily-habits-981f52`, owner `andres9888`, scheme `habit-tracker`, iOS bundle ID `com.chainday.app`, Android package `com.chainday.app`, EAS project ID `32c36f06-6185-42ca-aee8-5a939ad68d75`.
- `eas.json`: EAS CLI `>= 7.8.4`, `appVersionSource: remote`, `development`, `preview`, and `production` build profiles, production submit `ascAppId: 6758899638`.

Decision: keep Expo. Do not migrate to React Native CLI or Flutter unless a future requirement makes Expo's managed/prebuild workflow untenable.

## Selection Rationale

| Option | Current signal | Recency | Breaking changes / operational risk | Pricing / limits | Fit |
| --- | --- | --- | --- | --- | --- |
| Expo + EAS | Expo SDK 54 was released 2025-09-10 and includes React Native 0.81. EAS is already configured in this repo. | Current repo is on SDK 54. Context7 also exposes SDK 55 docs, but this spec targets SDK 54 because the app is pinned there. | SDK 54 targets Android 16/API 36, always enables Android edge-to-edge behavior, changes autolinking behavior, and is the final Expo SDK release with Legacy Architecture support. | Expo pricing page lists plan limits for projects, EAS Hosting, and support; EAS Build has fixed worker CPU/memory limits, with larger resource classes available. | Best fit. Minimal migration cost, native modules supported through development builds/config plugins, EAS handles credentials/build/submission. |
| React Native CLI | React Native 0.81 was released 2025-08-12 with Android 16 support and experimental faster iOS builds. | Same underlying RN version as Expo SDK 54. | More native ownership: Android 16 edge-to-edge, SafeAreaView deprecation, predictive back/native-code migration risk, more manual credentials/CI/release work. | Framework is open source; build infrastructure, signing, OTA, and submission automation must be self-managed or bought elsewhere. | Not worth switching. It removes Expo guardrails while keeping most RN upgrade risks. |
| Flutter | Flutter docs list 3.44.0 as latest stable on the release index checked 2026-07-14. | Very current. | Breaking-change index for 3.44 includes Material/widget/API/project changes; migration would rewrite the app from React/TypeScript to Dart/Flutter. | Flutter SDK is open source; CI, release, OTA equivalent, and app services are separate choices. | Poor fit for this repo because it is a full rewrite with no matching existing codebase. |

## Installation

The repo is already installed for Expo SDK 54. For a clean machine:

```sh
npm install
npx expo doctor
```

Development server:

```sh
npm run expo:start
npm run expo:ios
npm run expo:android
```

EAS build commands:

```sh
npx eas build --profile development --platform ios
npx eas build --profile preview --platform ios
npx eas build --profile production --platform ios
npx eas build --profile production --platform android
```

If adding native modules that are not available in Expo Go, use a development build:

```sh
npx expo install expo-dev-client
npx eas build --profile development --platform ios
```

## Configuration

### Required files

`app.json` should remain the source for portable Expo app config in this repo:

```json
{
  "expo": {
    "name": "ChainDay",
    "slug": "daily-habits-981f52",
    "scheme": "habit-tracker",
    "ios": {
      "bundleIdentifier": "com.chainday.app",
      "buildNumber": "16"
    },
    "android": {
      "package": "com.chainday.app"
    },
    "extra": {
      "eas": {
        "projectId": "32c36f06-6185-42ca-aee8-5a939ad68d75"
      }
    }
  }
}
```

`eas.json` should continue to keep build-only variables under profile `env`:

```json
{
  "cli": {
    "version": ">= 7.8.4",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "SENTRY_DISABLE_AUTO_UPLOAD": "true"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "SENTRY_DISABLE_AUTO_UPLOAD": "true"
      }
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "SENTRY_DISABLE_AUTO_UPLOAD": "true"
      }
    }
  }
}
```

### Environment variables

Documented/used variables:

| Variable | Where | Purpose |
| --- | --- | --- |
| `SENTRY_DISABLE_AUTO_UPLOAD` | `eas.json` build profiles | Current repo sets this to `true` to prevent automatic Sentry upload during EAS builds. |
| `APP_ENV` | Optional `app.config.js` | Expo docs show using it to vary name/bundle ID by environment. |
| `APP_VARIANT` | Optional `eas.json` + `app.config.js` | Expo docs show using it to select development/staging/production variants. |
| `ENVIRONMENT` | Optional `eas.json` | Expo docs show profile-specific environment labels. |
| `PLATFORM` | Optional platform-specific `eas.json` env | Expo docs show setting platform-specific env values. |
| `EXPO_UNSTABLE_LIVE_BINDINGS` | Optional local/CI env | SDK 54 docs mention setting it to `false` to disable Metro live bindings, but warn that disabling can break circular import support. |

If the app needs per-environment identifiers, convert `app.json` to `app.config.js` and keep secrets out of source:

```js
export default () => ({
  name: process.env.APP_ENV === 'production' ? 'ChainDay' : 'ChainDay (DEV)',
  slug: 'daily-habits-981f52',
  scheme: 'habit-tracker',
  ios: {
    bundleIdentifier:
      process.env.APP_ENV === 'production' ? 'com.chainday.app' : 'com.chainday.app-dev',
  },
  android: {
    package: process.env.APP_ENV === 'production' ? 'com.chainday.app' : 'com.chainday.app.dev',
  },
});
```

## Key Patterns

### EAS Update channels

Add channels before using EAS Update:

```json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "preview": {
      "channel": "staging",
      "distribution": "internal"
    }
  }
}
```

Publish an update to a channel:

```sh
npx eas update --channel preview
```

Pin compatible updates with a runtime version:

```json
{
  "expo": {
    "runtimeVersion": "1.0.0"
  }
}
```

### Manual update check

Use this only after `expo-updates` is configured in a build; it does not apply to Expo Go.

```ts
import * as Updates from 'expo-updates';

export async function applyAvailableUpdate() {
  if (__DEV__) {
    return false;
  }

  const update = await Updates.checkForUpdateAsync();
  if (!update.isAvailable) {
    return false;
  }

  await Updates.fetchUpdateAsync();
  await Updates.reloadAsync();
  return true;
}
```

### SDK 54 update header override

SDK 54 and `expo-updates` 0.29.0+ support overriding update request headers without overriding the update URL:

```ts
import * as Updates from 'expo-updates';

export async function switchTesterUpdateChannel(channel: 'preview' | 'production') {
  Updates.setUpdateRequestHeadersOverride({ 'expo-channel-name': channel });
  await Updates.fetchUpdateAsync();
  await Updates.reloadAsync();
}
```

### Development build for native modules

Use Expo SDK modules when possible. For custom native code or libraries unavailable in Expo Go, add `expo-dev-client` and build a development client.

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

Optional variant-specific dev-client plugin:

```js
const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  plugins: [
    [
      'expo-dev-client',
      {
        addGeneratedScheme: !!IS_DEV,
      },
    ],
  ],
};
```

### Config plugin for native configuration

Use config plugins for repeatable native changes:

```ts
import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
  withInfoPlist,
} from 'expo/config-plugins';

const withMyApiKey: ConfigPlugin<{ apiKey: string }> = (config, { apiKey }) => {
  config = withInfoPlist(config, config => {
    config.modResults.MY_CUSTOM_API_KEY = apiKey;
    return config;
  });

  config = withAndroidManifest(config, config => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'MY_CUSTOM_API_KEY',
      apiKey
    );
    return config;
  });

  return config;
};

export default withMyApiKey;
```

## API Reference

| API / file | Use | Notes |
| --- | --- | --- |
| `app.json` / `app.config.js` | Expo app identity, permissions, plugins, EAS project ID | Use `app.config.js` only when values must vary by env. |
| `eas.json` `build.*.env` | Build profile variables | Expo docs state these are used to evaluate `app.config.js` locally during `eas build` and are set on EAS builders. |
| `eas.json` `build.*.channel` | EAS Update channel selection | Required for channel-based OTA update routing. |
| `runtimeVersion` | Native/JS compatibility boundary for updates | Use fixed values for explicit control; bump when native runtime changes. |
| `Updates.checkForUpdateAsync()` | Check whether an update is available | Requires configured `expo-updates` in a built app. |
| `Updates.fetchUpdateAsync()` | Download an available update | Pair with `reloadAsync()` when applying immediately. |
| `Updates.reloadAsync()` | Reload into downloaded update | SDK 54 adds reload screen options. |
| `Updates.setUpdateRequestHeadersOverride()` | Override update request headers at runtime | SDK 54 supports header-only override for patterns like tester channel switching. |
| `expo-dev-client` | Development build runtime | Required for custom native modules and many native-library workflows. |
| `expo/config-plugins` | Repeatable native project modification | Prefer plugins over hand-editing generated native files. |

## Gotchas

- SDK 54 is the final Expo release with Legacy Architecture support. Plan for New Architecture-only support in later SDKs.
- Android 16/API 36 edge-to-edge behavior affects all Android apps on SDK 54/RN 0.81. Audit safe-area usage and avoid deprecated React Native `SafeAreaView`.
- React Native 0.81 deprecates built-in `SafeAreaView`; use `react-native-safe-area-context`, already present in this repo.
- Expo SDK 54 autolinking changed how native modules are discovered. If native modules disappear or duplicates appear, run `npx expo-modules-autolinking verify -v` and `npx expo doctor`.
- Expo Go is not enough for custom native modules. Use development builds with `expo-dev-client`.
- EAS Update can only deliver JS/assets compatible with the installed native runtime. Bump `runtimeVersion` when changing native modules, Expo SDK, or native config.
- Do not use `Updates.setUpdateURLAndRequestHeadersOverride()` in production unless the build-time anti-bricking flag and risk are explicitly accepted. Prefer SDK 54's header-only `setUpdateRequestHeadersOverride()`.
- EAS Build workers have fixed CPU/memory limits. Use larger resource classes when builds fail from resource pressure.
- This repo has a checked-in native iOS project in prior release workflows. When native folders exist, verify whether native files or Expo config are the effective source of truth before changing bundle IDs or entitlements.

## Rate Limits

Expo/EAS limits are plan-dependent and can change. Checked 2026-07-14:

- EAS Build: official limitation is fixed build worker CPU/memory; use larger resource classes for heavy builds.
- Expo pricing page lists project limits of 25/50/100/300 across Free/Starter/Production/Enterprise.
- EAS Hosting pricing on the same page lists 100,000 monthly requests included; paid plans list overage at `$2 per 1M requests`.
- EAS Hosting also lists 1 GB storage included; paid plans list overage at `$0.04 per GB`.
- Hosting CPU-ms: Free lists 1,000,000; paid plans list 1,000,000 then `$0.04 per 1M CPU-ms`.
- Hosting CPU-ms per request: Free lists 10; paid plans list 30,000.
- Hosting subrequests: Free lists 10; paid plans list 1,000.
- Hosting log retention: Free lists 7 days; paid plans list 3 months.

No React Native CLI or Flutter platform pricing applies directly because both are open-source runtimes; build minutes, signing, submission, OTA delivery, hosting, and observability depend on separately chosen services.

## Currency

| Item | Version / page | Checked date | Source |
| --- | --- | --- | --- |
| Expo SDK | SDK 54, released 2025-09-10 | 2026-07-14 | https://expo.dev/changelog/sdk-54 |
| Expo docs via Context7 | `/expo/expo/__branch__sdk-54` | 2026-07-14 | https://github.com/expo/expo/tree/sdk-54/docs |
| EAS docs | EAS overview and build limitations | 2026-07-14 | https://docs.expo.dev/eas/ and https://docs.expo.dev/build-reference/limitations/ |
| EAS pricing | Expo pricing page | 2026-07-14 | https://expo.dev/pricing |
| React Native | 0.81, released 2025-08-12 | 2026-07-14 | https://reactnative.dev/blog/2025/08/12/react-native-0.81 |
| Flutter | 3.44.0 listed as latest stable | 2026-07-14 | https://docs.flutter.dev/release/release-notes |
| Flutter breaking changes | 3.44/3.41/3.38/3.35 indexes | 2026-07-14 | https://docs.flutter.dev/release/breaking-changes |

## References

- Expo SDK 54 changelog: https://expo.dev/changelog/sdk-54
- Expo EAS docs: https://docs.expo.dev/eas/
- EAS Build limitations: https://docs.expo.dev/build-reference/limitations/
- Expo pricing: https://expo.dev/pricing
- React Native 0.81 release notes: https://reactnative.dev/blog/2025/08/12/react-native-0.81
- Flutter release notes: https://docs.flutter.dev/release/release-notes
- Flutter breaking changes: https://docs.flutter.dev/release/breaking-changes
- Context7 Expo SDK 54 docs queried from `/expo/expo/__branch__sdk-54`:
  - Expo SDK app config and EAS Build
  - Expo Updates setup
  - Expo development builds and native modules
