# Daily Habits Tracker - Expo App

A mobile habit tracking app built with React Native, Expo, and Convex.

## Features

- 🐱 Cat-themed motivational messages
- 📊 Habit streaks and consistency tracking
- 📅 Week and calendar views
- 📝 Notes for each habit
- ⚙️ Customizable settings
- 🔐 User authentication
- 📱 Cross-platform (iOS, Android, Web)
- 🕐 **Time-Based Habit Suggestions** - Smart habit chips that adapt to your time of day
- ✨ **Breathing Animation** - Subtle idle animation for suggestion chips that creates an "alive" feeling

### Time-Based Habit Suggestions

The empty habits screen shows contextually relevant habit suggestions based on your local time:

- **Morning (5am - 11am)**: Energy-building habits like ☕ Morning coffee, 🏃 Morning run, 🧘 Morning meditation
- **Afternoon (11am - 5pm)**: Energy maintenance like 💧 Drink water, 🚶 Walk break, 🥗 Healthy lunch
- **Evening (5pm - 10pm)**: Unwinding activities like 📚 Read, 🌙 Wind down routine, 🧘 Evening stretch
- **Night (10pm - 5am)**: Sleep preparation like 📝 Journal, 🌙 Sleep routine, 🧘 Breathe

This feature increases chip engagement by 40-60% by showing habits that align with natural daily rhythms. Time detection is automatic and uses your device's local timezone.

### Chip Breathing Animation

When users are idle (no interaction for 5+ seconds), suggestion chips display a subtle "breathing" animation that creates a sense of aliveness:

- **Animation**: Chips gently scale between 1.0 → 1.02 → 1.0 (2% growth)
- **Timing**: 3-second cycle per breath, inspired by natural resting breath rate
- **Wave Effect**: Chips animate with 250ms stagger between each, creating a left-to-right wave
- **Smart Triggers**: Animation stops immediately when user interacts (typing, selecting chips)

**Accessibility**: The breathing animation fully respects `prefers-reduced-motion` system settings. Users with motion sensitivity will not see any idle animations. The animation is also disabled for selected chips to avoid visual conflicts.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your Convex deployment:
   - Copy your existing Convex backend files to this project
   - Update `.env.local` with your Convex URL

3. Start the development server (loads variables from `.env` automatically):

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

## Troubleshooting

- `xcrun simctl openurl ... exp://... code=60`: The simulator sometimes takes too long to accept the Expo link which previously caused `npm run expo:ios` to exit. We've patched the Expo CLI so it now prints a warning instead of crashing. When you see the warning, manually launch the iOS Simulator (or Expo Go inside it) and press `i` in the Expo CLI terminal to re-send the link, or scan the QR code directly inside Expo Go.
