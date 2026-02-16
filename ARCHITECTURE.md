# Architecture

This document provides an overview of the Chain Day application architecture.

## Tech Stack

- **Frontend**: React Native with Expo SDK 54
- **Backend**: Convex (real-time database and serverless functions)
- **Authentication**: Clerk + Apple/Google Sign-In
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Animations**: react-native-reanimated v4
- **State Management**: React Context + Convex queries/mutations

## Project Structure

```
src/
├── components/     # Reusable UI components
├── constants/     # App-wide constants
├── contexts/      # React Context providers
├── features/      # Feature-based modules
├── hooks/         # Custom React hooks
├── lib/           # Third-party library configurations
├── providers/     # Global providers
├── screens/       # Screen components
├── theme/         # Design system (colors, typography, spacing)
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

### Key Directories

- **`components/`**: 100+ reusable components organized by feature (HabitsList, CreateHabitModal, CharacterScreen, etc.)
- **`convex/`**: Backend functions (schema, queries, mutations, scheduled tasks)
- **`hooks/`**: Custom hooks for business logic (useHabits, useAuth, useTheme, etc.)
- **`theme/`**: Design tokens following 34/22/17/13 typography scale and consistent color system
- **`utils/`**: Helper functions for dates, formatting, calculations

## Data Flow

1. **User Actions** → React Components
2. **Components** → Convex Mutations/Queries
3. **Convex** → Real-time Database (persisted)
4. **Updates** → Automatic re-render via React Query-like hooks

## Authentication Flow

1. User signs in via Clerk (web) or Apple/Google (mobile)
2. Clerk token exchanged for Convex session
3. All data operations authenticated via Convex auth

## Offline Support

- AsyncStorage for local habit cache
- Background sync when online
- Conflict resolution via server timestamp

## Design System

- **Typography**: 34/22/17/13 (display/title/body/caption)
- **Colors**: Semantic naming (primary-500, surface-100, etc.)
- **Animation**: Spring physics (damping: 18, stiffness: 180)
- **Border Radius**: 16px cards, 12px buttons
