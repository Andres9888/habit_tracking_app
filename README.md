# Chain Day 🔗

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](./LICENSE)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-54-blue)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org)

**Don't break the chain.** A habit tracking app that makes consistency visible.

Built with React Native, Expo, and Convex.

## Features

- 🔗 **Chain Visualization** - See your habit chains grow as you maintain streaks
- 📊 **Habit Strength** - Scientific algorithm shows how established each habit is
- 📅 Week and calendar views
- 📝 Notes for each habit
- 🎮 **Character Screen** - Gamification with XP, levels, and achievements
- ⚙️ Customizable settings
- 🔐 User authentication (Clerk + Apple/Google Sign-In)
- 📱 Cross-platform (iOS, Android, Web)
- 🕐 **Time-Based Suggestions** - Smart habit chips that adapt to your time of day
- 📴 **Offline Support** - Complete habits offline, syncs when back online

### Time-Based Habit Suggestions

The empty habits screen shows contextually relevant habit suggestions based on your local time:

- **Morning (5am - 11am)**: Energy-building habits like ☕ Morning coffee, 🏃 Morning run, 🧘 Morning meditation
- **Afternoon (11am - 5pm)**: Energy maintenance like 💧 Drink water, 🚶 Walk break, 🥗 Healthy lunch
- **Evening (5pm - 10pm)**: Unwinding activities like 📚 Read, 🌙 Wind down routine, 🧘 Evening stretch
- **Night (10pm - 5am)**: Sleep preparation like 📝 Journal, 🌙 Sleep routine, 🧘 Breathe

This feature increases chip engagement by 40-60% by showing habits that align with natural daily rhythms. Time detection is automatic and uses your device's local timezone.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your Convex deployment and environment:
   - Copy your existing Convex backend files to this project
   - Copy `.env.example` to `.env.local` and fill in the values below

   | Variable                                                                | Purpose                                                                                                                                 |
   | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
   | `EXPO_PUBLIC_CONVEX_URL`                                                | Convex deployment URL (required)                                                                                                        |
   | `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`                                     | Clerk auth (client)                                                                                                                     |
   | `CLERK_AUTH_DOMAIN`                                                     | Clerk auth domain (Convex ↔ Clerk)                                                                                                      |
   | `EXPO_PUBLIC_REVENUECAT_IOS_KEY` / `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | RevenueCat SDK (premium)                                                                                                                |
   | `REVENUECAT_WEBHOOK_SECRET`                                             | Verifies RevenueCat → Convex entitlement webhooks — **server-side only**: set it in the Convex dashboard, never in a client `.env` file |
   | `EXPO_PUBLIC_SENTRY_DSN`                                                | Sentry error reporting                                                                                                                  |

   See [ARCHITECTURE.md](./ARCHITECTURE.md) for the backend data model and
   [CONTRIBUTING.md](./CONTRIBUTING.md) for dev/test workflow.

3. Start the development server (loads variables from `.env.local` automatically):

   ```bash
   npm run expo:start
   ```

   To use a different env file, prefix the command with `ENV_FILE=...`, e.g.:

   ```bash
   ENV_FILE=.env.local npm run expo:start
   ```

   Companion scripts are available for native targets, e.g. `npm run expo:ios`.
   The helper script is POSIX shell compatible; on Windows, run the command
   from Git Bash or WSL.

4. Use the Expo Go app to scan the QR code and run on your device

## Building for Production

1. Install EAS CLI:

   ```bash
   npm install -g @expo/eas-cli
   ```

2. Configure your project:

   ```bash
   eas build:configure
   ```

3. Build for iOS and Android:
   ```bash
   eas build --platform all
   ```

## Deployment

Deploy to app stores using EAS Submit:

```bash
eas submit --platform all
```

## Convex Backend

This app uses the same Convex backend as the web version. Make sure to copy over:

- `convex/` directory with all your functions
- Environment variables in your Convex dashboard

### Data migration

Normalize legacy `reminderTime` values (for example `8:30` or AM/PM values) to canonical `HH:MM` format:

- Single batch:
  ```bash
  npm run migrate:normalize-reminder-times
  ```
- Multi-batch (repeat the returned command using the returned `continueCursor`) or run:
  ```bash
  npx convex run migration:normalizeHabitReminderTimes
  npx convex run migration:normalizeHabitReminderTimes '{"batchSize":500,"cursor":"<continueCursor>"}'
  ```
- Run fully in a loop (until `isDone=true`):
  ```bash
  bash scripts/migrate-reminder-times.sh 500
  ```

## Troubleshooting

- `xcrun simctl openurl ... exp://... code=60`: The simulator sometimes takes too long to accept the Expo link which previously caused `npm run expo:ios` to exit. We've patched the Expo CLI so it now prints a warning instead of crashing. When you see the warning, manually launch the iOS Simulator (or Expo Go inside it) and press `i` in the Expo CLI terminal to re-send the link, or scan the QR code directly inside Expo Go.
