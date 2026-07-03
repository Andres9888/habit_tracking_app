# Technology Stack

**Analysis Date:** 2025-03-19

## Languages

**Primary:**

- TypeScript 5.9.2 - Application logic, types, and build configuration
- JavaScript - Build scripts and configuration files (Babel, Metro, Tailwind)
- GraphQL - Not detected

**Secondary:**

- CSS/Tailwind - Styling via `tailwindcss` 3.4.18 with NativeWind 4.1.23

## Runtime

**Environment:**

- Node.js v22.13.0 (non-homebrew, non-nvm) - Located at `/Users/andres/node-v22.13.0-darwin-arm64/bin`
- React Native 0.81.5 - Cross-platform mobile runtime
- Expo 54.0.33 - Development and deployment platform for React Native apps
- React 19.1.0 - UI framework (web and native)
- React DOM 19.1.0 - Web renderer

**Package Manager:**

- npm - Lockfile present (package-lock.json in `/Users/andres/conductor/workspaces/habit_tracking_app/phoenix/website/`)

## Frameworks

**Core:**

- Expo 54.0.33 - Managed React Native platform for iOS/Android/Web development
- React Native 0.81.5 - Cross-platform mobile framework
- React 19.1.0 - Core UI framework
- React Native Web 0.21.2 - Web compatibility layer for React Native components

**Testing:**

- Jest 29.7.0 - Test runner and assertion library
- jest-expo 54.0.17 - Expo-specific Jest configuration and utilities
- @testing-library/react-native 13.3.3 - Component testing utilities
- (matchers built into @testing-library/react-native v12.4+; deprecated @testing-library/jest-native removed Jul 2026)

**Build/Dev:**

- Vite 6.2.0 - Web bundler and dev server
- Metro (via Expo CLI 54.0.23) - Mobile bundler
- Tailwind CSS 3.4.18 - Utility-first CSS framework
- TypeScript 5.9.2 - Type checking and compilation
- ESLint 9.21.0 - Linting with plugins:
  - eslint-plugin-unicorn 62.0.0 - Best practices
  - eslint-plugin-react 7.37.5 - React-specific rules
  - eslint-plugin-react-hooks 5.1.0 - React Hooks rules
  - eslint-plugin-react-refresh 0.5.0 - Fast refresh rules
  - eslint-plugin-sort-keys-fix 1.1.2 - Key ordering
  - eslint-plugin-eslint-comments 3.2.0 - Comment validation
- Prettier 3.8.1 - Code formatter
- prettier-plugin-tailwindcss 0.7.2 - Tailwind class ordering
- husky 9.1.7 - Git hooks manager
- lint-staged 16.2.7 - Staged file linting

## Key Dependencies

**Critical:**

- convex 1.21.1-alpha.1 - Backend platform and real-time database
- @clerk/clerk-expo 2.19.25 - Authentication provider (Clerk)
- @convex-dev/auth 0.0.90 - Convex auth integration with Clerk
- @sentry/react-native 7.2.0 - Error tracking and performance monitoring
- openai 4.77.0 - OpenAI API client (Claude Code compatibility)

**Mobile/Expo:**

- expo-av 16.0.8 - Audio/video playback (voice notes, sounds)
- expo-notifications 0.32.16 - Push notifications
- expo-image-picker 17.0.10 - Image selection from device
- expo-image-manipulator 14.0.8 - Image processing
- expo-secure-store 15.0.7 - Secure token storage
- expo-web-browser 15.0.9 - Web browser integration
- expo-store-review 9.0.9 - App store review prompts
- expo-haptics 15.0.7 - Haptic feedback
- expo-blur 15.0.7 - Blur effect component
- expo-linear-gradient 15.0.7 - Linear gradient rendering
- expo-network 8.0.8 - Network status detection
- expo-image 3.0.11 - Image component
- expo-sharing 14.0.7 - Native sharing
- @expo/vector-icons 15.0.2 - Icon library

**UI Components:**

- react-native-paper 5.14.5 - Material Design components
- lucide-react-native 0.564.0 - Icon library
- react-native-svg 15.12.1 - SVG rendering
- react-native-reanimated 4.1.1 - Advanced animations
- react-native-gesture-handler 2.28.0 - Gesture recognition
- react-native-safe-area-context 5.6.0 - Safe area handling
- react-native-confetti-cannon 1.5.2 - Confetti animation
- react-native-view-shot 4.0.3 - Screenshot capture
- victory-native 41.20.1 - Chart rendering

**State/Data:**

- @react-native-async-storage/async-storage 2.2.0 - Local storage
- @react-native-community/datetimepicker 8.4.4 - Date/time picker
- react-native-draggable-flatlist 4.0.3 - Reorderable lists
- react-native-purchases-ui 9.7.1 - RevenueCat purchases UI
- date-fns 4.1.0 - Date manipulation

**Utilities:**

- clsx 2.1.1 - Conditional class names
- tailwind-merge 3.1.0 - Merge Tailwind classes
- sonner 2.0.3 - Toast notifications
- nativewind 4.1.23 - Tailwind for React Native
- patch-package 8.0.1 - Patch npm dependencies

**Infrastructure:**

- dotenv 17.2.3 - Environment variable loading
- npm-run-all 4.1.5 - Run multiple npm scripts

## Configuration

**Environment:**

- Variables configured via `.env.local` and `.env.mcp.example`
- Required: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, `EXPO_PUBLIC_CONVEX_URL`, `CLERK_AUTH_DOMAIN`
- Optional: Various AI API keys (ANTHROPIC_API_KEY, OPENAI_API_KEY, PERPLEXITY_API_KEY, etc.)
- Optional: RevenueCat keys (`EXPO_PUBLIC_REVENUECAT_IOS_KEY`, `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`)
- Pre-commit hooks via husky with eslint --fix and prettier (lint-staged)

**Build:**

- `vite.config.ts` - Web bundler configuration with React plugin and `@` alias
- `metro.config.cjs` - React Native Metro bundler configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration:
  - Strict mode enabled
  - ESNext module resolution
  - `@/*` path alias pointing to `src/*`
  - Bundler module resolution
  - JSX factory: `react-jsx`
- `tsconfig.app.json` - App-specific TS configuration
- `convex/tsconfig.json` - Backend-specific TS configuration
- `jest.config.js` - Jest test configuration
- `babel.config.cjs` - Babel transpilation for React Native
- `postcss.config.cjs` - PostCSS for Tailwind processing
- `eslint.config.js` - ESLint configuration with max-lines rule (100 lines)
- `next.config.ts` - Next.js config for website subdirectory

## Platform Requirements

**Development:**

- Node.js v22.13.0 (specific version required)
- npm 10.x or higher
- Xcode (for iOS development)
- Android Studio (for Android development)
- Expo CLI 54.0.23
- Pre-commit hooks via husky (run eslint --fix + prettier)

**Production:**

- iOS 13.0+ via Expo managed service
- Android 8.0+ via Expo managed service
- Web deployment via Expo export or custom Next.js build
- Convex deployment via `convex deploy --prod` or `convex deploy --preview`

---

_Stack analysis: 2025-03-19_
