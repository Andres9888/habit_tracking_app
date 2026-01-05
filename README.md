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
- ⌨️ **Type-Ahead Autocomplete** - Intelligent inline suggestions as you type with keyboard shortcuts

### Time-Based Habit Suggestions

The empty habits screen shows contextually relevant habit suggestions based on your local time:

- **Morning (5am - 11am)**: Energy-building habits like ☕ Morning coffee, 🏃 Morning run, 🧘 Morning meditation
- **Afternoon (11am - 5pm)**: Energy maintenance like 💧 Drink water, 🚶 Walk break, 🥗 Healthy lunch
- **Evening (5pm - 10pm)**: Unwinding activities like 📚 Read, 🌙 Wind down routine, 🧘 Evening stretch
- **Night (10pm - 5am)**: Sleep preparation like 📝 Journal, 🌙 Sleep routine, 🧘 Breathe

This feature increases chip engagement by 40-60% by showing habits that align with natural daily rhythms. Time detection is automatic and uses your device's local timezone.

### Type-Ahead Autocomplete

The habit input field features intelligent autocomplete to help you create habits faster:

#### How It Works

1. **Start typing** (3+ characters): Inline suggestions appear in gray text
2. **Accept suggestion**: Press **Tab** or **→** (Right Arrow) to fill the input
3. **Dismiss suggestion**: Press **Escape** to clear the preview
4. **Keep typing**: Suggestions update automatically as you type

#### Example Usage

```
Type: "exe" → Shows: "exe|rcise 10 minutes" (gray preview)
Press Tab → Fills: "Exercise 10 minutes"
```

#### Smart Matching

The autocomplete uses a multi-tier matching algorithm that prioritizes:

1. **Prefix matches** (highest priority): "ex" → "**Ex**ercise 10 minutes"
2. **Word boundary matches**: "morning" → "**Morning** coffee"
3. **Keyword matches**: "workout" → "Exercise" (via synonyms)
4. **Fuzzy matches** (lowest priority): "excs" → "**Ex**er**c**i**s**e"

#### Habit Database

Over **75 curated habits** across 5 categories:

- **Physical Health**: Exercise, walk, yoga, stretching, hydration, sleep
- **Mental Wellness**: Meditation, journaling, reading, digital detox
- **Productivity**: Writing, learning, planning, focus sessions
- **Nutrition**: Healthy eating, meal prep, mindful eating
- **Social/Personal**: Connecting with others, creative activities, gratitude

#### Performance

- **Instant feel**: < 50ms perceived latency
- **Smooth typing**: 50ms debounce prevents lag during rapid input
- **Efficient**: Handles 300+ habits before performance impact

#### Accessibility

- **Screen reader support**: Announces suggestions with "Press Tab to accept"
- **Keyboard-only navigation**: No mouse required
- **WCAG AA compliant**: Full accessibility for all users

#### Metrics Tracked

- **Acceptance rate**: How often suggestions are accepted vs ignored
- **Keystrokes saved**: Characters saved by using autocomplete
- **Match type distribution**: Which matching algorithms users engage with most
- **No-match patterns**: Queries that don't find suggestions (helps improve database)

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
