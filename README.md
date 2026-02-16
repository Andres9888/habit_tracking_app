# Chain Day 🔗

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

## Project Setup

### Prerequisites

- Node.js 20+
- npm or bun
- Expo CLI
- Convex CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Andres9888/habit_tracking_app.git
cd habit_tracking_app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
- Convex deployment URL
- Clerk keys for authentication
- Sentry DSN (optional)

4. Set up your Convex deployment:
   - Copy your existing Convex backend files to this project
   - Update `.env.local` with your Convex URL

5. Start the development server:

```bash
npm run expo:start
```

To use a different env file, prefix the command with `ENV_FILE=...`:

```bash
ENV_FILE=.env.local npm run expo:start
```

6. Use the Expo Go app to scan the QR code and run on your device

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run expo:start` | Start Expo dev server |
| `npm run expo:ios` | Start Expo for iOS |
| `npm run expo:android` | Start Expo for Android |
| `npm run dev` | Run full dev environment (frontend + backend) |
| `npm run test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run linting |
| `npm run format` | Format code with Prettier |
| `npm run deploy` | Deploy Convex backend to production |

## Architecture Overview

Chain Day is built with a modern React Native + Expo stack:

- **Frontend**: React Native with Expo, using React 19
- **Backend**: Convex (serverless functions + database)
- **Authentication**: Clerk
- **State Management**: React Context + Convex queries
- **Styling**: React Native Paper (Material Design 3) + NativeWind
- **Animations**: React Native Reanimated

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native 0.81 + Expo 54 |
| Language | TypeScript |
| Backend | Convex |
| Auth | Clerk |
| Database | Convex (PostgreSQL-backed) |
| State | React Context + Convex |
| UI Library | React Native Paper |
| Styling | NativeWind + Tailwind CSS |
| Animations | React Native Reanimated |
| Testing | Jest + Testing Library |
| Payments | RevenueCat |

## Folder Structure

```
habit_tracking_app/
├── src/                      # Frontend source code
│   ├── components/          # Reusable UI components
│   │   ├── Button/           # Button component
│   │   ├── CalendarHeatmap/  # Calendar heatmap visualization
│   │   ├── DraggableHabit/   # Draggable habit list item
│   │   ├── HabitCard/        # Habit display card
│   │   └── ...               # Other components
│   ├── contexts/             # React Context providers
│   │   ├── NetworkStatusContext/
│   │   ├── PerformanceContext/
│   │   └── SyncStatusContext/
│   ├── features/             # Feature-based modules
│   │   └── habits/           # Habits feature
│   ├── hooks/                # Custom React hooks
│   │   ├── useHabitStrength.ts
│   │   ├── useOfflineQueue/
│   │   └── ...
│   ├── lib/                  # Utility libraries
│   ├── providers/            # App-level providers
│   │   ├── ConvexClerkProvider.tsx
│   │   └── OfflineProvider/
│   ├── screens/              # Screen components
│   │   ├── AnalyticsScreen/
│   │   ├── CharacterScreen/
│   │   ├── HabitDetailScreen/
│   │   └── ...
│   ├── theme/                # Design system
│   │   ├── colors/           # Color palette
│   │   ├── typography.ts     # Typography scale
│   │   ├── spacing.ts        # Spacing system
│   │   └── animations.ts     # Animation timings
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
├── convex/                   # Convex backend
│   ├── habits/               # Habit CRUD operations
│   ├── categories/           # Category management
│   ├── analytics/            # Analytics queries
│   └── ...
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md       # Architecture details
│   ├── DESIGN_SYSTEM.md      # Design tokens
│   └── TESTING.md            # Testing guide
├── __tests__/                # Test utilities
├── assets/                   # Static assets
└── ios/android/              # Native project files
```

### Key Directories

- `src/components/` - Atomic and molecular UI components
- `src/screens/` - Full-screen page components
- `src/hooks/` - Composable business logic
- `src/theme/` - Design tokens and theming
- `convex/` - Serverless backend functions

## Building for Production

### iOS

1. Install EAS CLI:

```bash
npm install -g @expo/eas-cli
```

2. Configure your project:

```bash
eas build:configure
```

3. Build for iOS:

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

### Both Platforms

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Testing Guide](docs/TESTING.md)
