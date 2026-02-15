# ChainDay 🔗

> **Don't break the chain.** Build lasting habits through the power of visible consistency.

ChainDay is a beautifully crafted habit tracking app that combines behavioral science with delightful user experience. Track your habits, visualize your progress, and build the life you want — one chain at a time.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React_Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-purple.svg)](https://expo.dev/)

---

## ✨ Why ChainDay?

Building habits is hard. **ChainDay makes it visual, engaging, and rewarding.**

- **See Your Streaks Grow** — Watch your chains extend day by day, creating powerful visual motivation
- **Science-Backed Tracking** — Habit strength algorithm based on memory accessibility research (Tobias, 2009; Zhang et al., 2021)
- **Gamified Progress** — Earn XP, level up your character, and unlock achievements as you build consistency
- **Smart Suggestions** — Time-aware habit chips that adapt to your daily rhythm (40-60% higher engagement)
- **Offline-First** — Complete habits anywhere, syncs automatically when you're back online

---

## 🎯 Key Features

### 📊 **Habit Tracking & Visualization**
- 🔗 **Chain Visualization** — See your habit chains grow as you maintain streaks
- 📈 **Habit Strength Score** — Scientific algorithm shows how established each habit is (0-100%)
- 📅 **Multiple Views** — Calendar heatmap, weekly view, and daily timeline
- 🎨 **Customizable Habits** — Add emojis, colors, notes, and custom schedules
- ⏰ **Smart Scheduling** — Daily, weekdays, custom patterns, or X times per week

### 🎮 **Gamification & Motivation**
- 🏆 **Character System** — Level up with XP, unlock achievements, view trophies
- 🎯 **Daily Momentum** — Track your completion rate and build consistency
- 🌅 **Time-Based Suggestions** — Morning routines, afternoon breaks, evening wind-downs
- 💬 **Affirmations** — Scheduled positive reinforcement (premium)
- 📝 **Future Self Letters** — Write to your future self, receive them later (premium)
- 🎨 **Vision Board** — Visual goal setting with image uploads (premium)

### 📈 **Analytics & Insights**
- 📊 **Detailed Analytics** — Completion rates, streaks, trends, and distribution
- 🔥 **Heatmaps** — Binary, compliance, and calendar views of your progress
- 📉 **Trend Analysis** — See your improvement over time with victory-native charts
- 🏅 **Milestone Tracking** — Celebrate 7, 30, 100+ day streaks

### 💎 **Premium Features**
- 🚫 **Unlimited Habits** — Free tier limited to 3 habits
- 📬 **Scheduled Affirmations** — Daily motivational notifications
- 💌 **Future Self Letters** — Time-delayed self reflection
- 🖼️ **Vision Board** — Upload and organize your goal images
- 📤 **Data Export** — GDPR-compliant full data export
- 🎨 **Advanced Customization** — More themes, colors, and personalization

### 🌙 **Premium Experience**
- 🌓 **Dark Mode** — Full dark theme support across all screens
- ♿ **Accessibility** — VoiceOver support, reduce motion, dynamic type
- 🌐 **Offline Support** — Complete habits without internet, auto-sync later
- 🔐 **Privacy-First** — Your data is yours, encrypted and secure
- 🔔 **Smart Notifications** — Contextual reminders that respect Do Not Disturb
- 📱 **Cross-Platform** — iOS, Android, and Web (coming soon)

---

## 🛠️ Tech Stack

ChainDay is built with modern, production-ready technologies:

### **Frontend**
- ⚛️ **React Native 0.81** — Cross-platform mobile framework
- 🎪 **Expo 54** — Development tooling and native integrations
- 💨 **NativeWind 4** — Tailwind CSS for React Native
- 🎭 **React Native Reanimated 4** — High-performance animations with spring physics
- 🎨 **Lucide React Native** — Beautiful, consistent iconography
- 📊 **Victory Native** — Data visualization and charts

### **Backend & Services**
- 🔥 **Convex** — Real-time serverless database with optimistic updates
- 🔐 **Clerk** — Authentication with Apple, Google, and email sign-in
- 💳 **RevenueCat** — Subscription management and paywall
- 📬 **Expo Notifications** — Push notification scheduling and delivery
- 🐛 **Sentry** — Error tracking and performance monitoring

### **Development**
- 📘 **TypeScript** — Type-safe development
- 🧪 **Jest** — Unit and integration testing
- 🎨 **Prettier** — Code formatting
- 🔍 **ESLint** — Linting with Unicorn, React, and custom rules
- 🪝 **Husky** — Git hooks for pre-commit checks
- 🔧 **Patch Package** — Dependency patches

---

## 📸 Screenshots

> _Screenshots coming soon — app currently in App Store review_

<div align="center">
  <img src="./docs/screenshots/home.png" width="200" alt="Home Screen" />
  <img src="./docs/screenshots/character.png" width="200" alt="Character Screen" />
  <img src="./docs/screenshots/analytics.png" width="200" alt="Analytics" />
  <img src="./docs/screenshots/detail.png" width="200" alt="Habit Detail" />
</div>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Expo CLI** — Install globally: `npm install -g @expo/eas-cli`
- **iOS Simulator** (macOS) or **Android Studio** (for Android development)
- **Convex Account** — [Sign up for free](https://convex.dev)
- **Clerk Account** — [Sign up for free](https://clerk.com)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Andres9888/habit_tracking_app.git
   cd habit_tracking_app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   # Convex
   EXPO_PUBLIC_CONVEX_URL=your_convex_deployment_url

   # Clerk
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

   # RevenueCat (optional for testing subscriptions)
   EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_api_key

   # Sentry (optional)
   SENTRY_DSN=your_sentry_dsn
   ```

4. **Set up Convex**

   ```bash
   npx convex dev
   ```

   Follow the prompts to create a new Convex project or link to an existing one.

5. **Start the development server**

   ```bash
   npm run expo:start
   ```

   - Press **`i`** for iOS simulator
   - Press **`a`** for Android emulator
   - Scan the QR code with **Expo Go** on your physical device

### Development Commands

```bash
# Start dev environment (frontend + backend)
npm run dev

# Frontend only
npm run dev:frontend

# Backend only (Convex)
npm run dev:backend

# Run on iOS
npm run expo:ios

# Run on Android
npm run expo:android

# Type checking
npm run lint

# Format code
npm run format

# Run tests
npm test
```

---

## 🏗️ Architecture

### **Data Flow**

```
┌─────────────┐
│   React     │
│  Component  │
└──────┬──────┘
       │
       │ useQuery / useMutation
       │
┌──────▼──────┐
│   Convex    │ ◄─── Real-time subscriptions
│   Queries   │
└──────┬──────┘
       │
       │ Optimistic updates
       │
┌──────▼──────┐
│  Convex DB  │ ◄─── Serverless functions
│  (Backend)  │
└─────────────┘
```

### **Key Architectural Patterns**

- **Optimistic Updates** — UI responds instantly, syncs in background
- **Atomic Operations** — Habit completions use Convex transactions
- **Memory Accessibility Algorithm** — Scientific habit strength calculation (accessibility decay)
- **Time-Based Suggestions** — Client-side timezone detection with contextual filtering
- **Offline Queue** — Pending mutations stored in AsyncStorage, replayed on reconnect

### **Project Structure**

```
habit_tracking_app/
├── app/                          # Expo Router (coming soon)
├── assets/                       # Images, fonts, icons
├── convex/                       # Backend functions & schema
│   ├── schema.ts                 # Database tables & indexes
│   ├── habits.ts                 # Habit queries & mutations
│   ├── analytics.ts              # Analytics calculations
│   └── subscriptions/            # RevenueCat webhook handlers
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── HabitCard.tsx
│   │   ├── CalendarHeatmap.tsx
│   │   └── ...
│   ├── screens/                  # Top-level screens
│   │   ├── HomeScreen.tsx
│   │   ├── CharacterScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   └── ...
│   ├── hooks/                    # Custom React hooks
│   │   ├── useHabits.ts
│   │   ├── useThemeColors.ts
│   │   └── useOptimisticUpdate.ts
│   ├── theme/                    # Design system tokens
│   │   ├── colors.ts             # Color palette
│   │   ├── typography.ts         # Font scales
│   │   └── shadows.ts            # Elevation system
│   ├── utils/                    # Helper functions
│   ├── contexts/                 # React Context providers
│   └── App.tsx                   # Root component
├── docs/                         # Documentation & specs
├── scripts/                      # Build & deployment scripts
└── tests/                        # Jest tests
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Security tests
npm run test:security

# Performance tests
npm run test:performance
```

### **Test Coverage**

- ✅ **Unit Tests** — Convex functions, utilities, hooks
- ✅ **Integration Tests** — Habit completion flow, streak calculation
- ✅ **Security Tests** — Rate limiting, input validation
- ⏳ **E2E Tests** — Coming soon (Detox)

---

## 📦 Building for Production

### **iOS**

```bash
# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### **Android**

```bash
# Build for Android
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

### **Environment Setup**

Ensure you have:
- Apple Developer Account (iOS)
- Google Play Developer Account (Android)
- EAS credentials configured (`eas credentials`)

---

## 🤝 Contributing

We welcome contributions! ChainDay is being actively developed and there's lots of room for improvement.

### **How to Contribute**

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feat/amazing-feature`)
3. **Make your changes**
   - Follow existing code style (Prettier + ESLint)
   - Add tests for new features
   - Update documentation as needed
4. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
   - Use [Conventional Commits](https://www.conventionalcommits.org/)
5. **Push to your fork** (`git push origin feat/amazing-feature`)
6. **Open a Pull Request**

### **Commit Convention**

We use semantic commit messages:

- `feat:` — New features
- `fix:` — Bug fixes
- `docs:` — Documentation changes
- `ui:` — UI/UX improvements
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `perf:` — Performance improvements
- `a11y:` — Accessibility improvements

### **Development Guidelines**

- **Design System First** — Use theme tokens from `src/theme/`
- **Accessibility Matters** — Add labels, reduce-motion support, contrast ratios
- **Spring Animations** — Use Reanimated `.springify().damping(18)` for micro-interactions
- **Dark Mode** — Always test both light and dark themes
- **Type Safety** — No `any` types without good reason

### **Need Help?**

- 📖 Check existing [Issues](https://github.com/Andres9888/habit_tracking_app/issues)
- 💬 Ask questions in [Discussions](https://github.com/Andres9888/habit_tracking_app/discussions)
- 📧 Email: [your-email@example.com]

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### **Behavioral Science Research**

- **Tobias (2009)** — Memory accessibility and habit formation
- **Zhang et al. (2021)** — Adaptive decay parameters for skill retention
- **Steele (1988)** — Self-affirmation theory
- **Hatzigeorgiadis et al. (2011)** — Self-talk and performance

### **Design Inspiration**

- **Apple Human Interface Guidelines** — iOS design patterns
- **Material Design 3** — Android design system
- **Streaks App** — Minimalist habit tracking inspiration

### **Open Source**

Built with amazing open source tools:
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Convex](https://convex.dev/)
- [Clerk](https://clerk.com/)
- [NativeWind](https://nativewind.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

## 🔮 Roadmap

- [ ] **Apple Watch App** — Quick habit logging from your wrist
- [ ] **Widgets** — iOS 14+ home screen widgets
- [ ] **Social Features** — Share streaks with accountability partners
- [ ] **Habit Templates Gallery** — Browse and import community templates
- [ ] **Smart Reminders** — Location-based and context-aware notifications
- [ ] **Internationalization** — Support for multiple languages
- [ ] **Web Dashboard** — Desktop companion experience
- [ ] **Habit Insights** — AI-powered personalized tips (premium)

---

## 📬 Contact

**Developer:** [Your Name]  
**Email:** [your-email@example.com]  
**GitHub:** [@Andres9888](https://github.com/Andres9888)  
**Twitter:** [@YourTwitter](https://twitter.com/yourhandle)

---

<div align="center">

**[Download on the App Store](#)** • **[Get it on Google Play](#)**

Made with ❤️ and ☕ by the ChainDay team

⭐ **Star this repo if you find it helpful!** ⭐

</div>
