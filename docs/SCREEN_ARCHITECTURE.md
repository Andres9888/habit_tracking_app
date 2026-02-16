# Screen Architecture

Navigation map and documentation for all screens in Chain Day app.

## Overview

The app uses a **conditional rendering** approach in `AuthGate` rather than traditional stack navigation. Screens are lazy-loaded based on authentication state.

## Navigation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                           AuthGate                                   │
│                 (Authentication State Manager)                       │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ WelcomeScreen │  │OnboardingScreen│  │  HabitsApp    │
│   (unauth)    │  │ (first-time)   │  │  (authenticated)
└───────────────┘  └───────────────┘  └───────┬───────┘
                                              │
                                              ▼
                              ┌───────────────────────────────┐
                              │     Main App Screens          │
                              │  (Bottom Tab Navigation)       │
                              └───────────────────────────────┘
```

## Screen Details

### Authentication Flow

| Screen | File | Lines | Purpose |
|--------|------|-------|---------|
| WelcomeScreen | `src/screens/auth/WelcomeScreen.tsx` | 136 | Landing page with sign-in/sign-up options |
| SignInScreen | `src/screens/auth/SignInScreen.tsx` | 374 | Email/password sign-in |
| SignUpScreen | `src/screens/auth/SignUpScreen.tsx` | 201 | Account creation with verification |
| OnboardingScreen | `src/screens/onboarding/OnboardingScreen.tsx` | 598 | 3-page first-time user carousel |

### Main App Screens

| Screen | File | Lines | Purpose |
|--------|------|-------|---------|
| HabitsApp | `src/features/habits/HabitsApp.tsx` | - | Main app container with tabs |
| AnalyticsScreen | `src/screens/AnalyticsScreen/AnalyticsScreen.tsx` | 148 | Statistics, charts, insights |
| CharacterScreen | `src/screens/CharacterScreen/CharacterScreen.tsx` | 52 | Gamification profile |
| TemplatesScreen | `src/screens/TemplatesScreen/TemplatesScreen.tsx` | 102 | Browse habit templates |

### Modal Screens

| Screen | File | Lines | Purpose |
|--------|------|-------|---------|
| HabitDetailScreen | `src/screens/HabitDetailScreen/HabitDetailScreen.tsx` | 124 | View habit details, calendar |
| HabitEditScreen | `src/screens/HabitEditScreen/HabitEditScreen.tsx` | 128 | Edit habit name, color, emoji |

## Component Architecture

### Auth Screens (`src/screens/auth/`)

```
auth/
├── WelcomeScreen.tsx          # Lazy-loads SignInScreen/SignUpScreen
├── SignInScreen.tsx           # Sign in with email + OAuth
├── SignUpScreen.tsx           # Sign up + verification
├── components/
│   ├── AuthDivider.tsx
│   ├── AuthError.tsx
│   ├── BackButton.tsx
│   ├── ForgotPasswordModal.tsx
│   ├── FormInput.tsx
│   ├── PasswordInput.tsx
│   ├── SignInFormSection.tsx
│   ├── SignUpHeader.tsx
│   ├── SocialSignInButton.tsx
│   ├── SubmitButton.tsx
│   └── VerificationView.tsx
├── hooks/
│   ├── useOAuthSignIn.ts
│   ├── useSignInFlow.ts
│   ├── useSignUpFlow.ts
│   └── useWelcomeAnimations.ts
└── utils/
    └── getClerkErrorMessage.ts
```

### Onboarding (`src/screens/onboarding/`)

```
onboarding/
├── OnboardingScreen.tsx       # 3-page carousel (⚠️ needs refactor)
├── components/                 # Extracted sub-components
│   ├── ChainVisualization.tsx
│   ├── DotIndicators.tsx
│   ├── StrengthMeter.tsx
│   └── TemplateGrid.tsx
└── useOnboardingStatus.ts    # AsyncStorage state management
```

### Analytics (`src/screens/AnalyticsScreen/`)

```
AnalyticsScreen/
├── AnalyticsScreen.tsx        # Main orchestration
├── AnalyticsScreen.hooks.ts   # State management
├── AnalyticsScreen.styles.ts
└── components/
    ├── AnalyticsHeader.tsx
    ├── ChartLoadingSkeleton.tsx
    ├── ChartSections.tsx
    ├── EmptyState.tsx
    ├── ExportButton.tsx
    ├── ExportMenu.tsx
    ├── InsightsSections.tsx
    ├── OverviewStats.tsx
    └── StatCard.tsx
```

### Habit Screens (`src/screens/HabitDetailScreen/`, `HabitEditScreen/`)

```
HabitDetailScreen/
├── HabitDetailScreen.tsx      # Modal with calendar view
├── HabitDetailScreen.types.ts
├── HabitDetailScreen.constants.ts
├── useHabitDetailScreenState.ts
├── useCalendarHandlers.ts
├── useNotesHandlers.ts
└── components/
    ├── DetailHeader.tsx
    ├── DetailLoadingState.tsx
    ├── HabitDetailContent.tsx
    ├── HabitDetailModals.tsx
    ├── HeroSection.tsx
    ├── NotesEditorModal.tsx
    └── NotesListModal.tsx

HabitEditScreen/
├── HabitEditScreen.tsx        # Edit habit modal
├── types.ts
├── useHabitEditScreen.ts
└── components/
    ├── CustomizeSection.tsx
    ├── DangerZone.tsx
    ├── EditHeader.tsx
    ├── HabitEditSkeleton.tsx
    ├── NameInputSection.tsx
    └── SectionLabel.tsx
```

### Templates (`src/screens/TemplatesScreen/`)

```
TemplatesScreen/
├── TemplatesScreen.tsx        # Main orchestration
├── TemplatesScreen.types.ts
├── hooks/
│   └── useTemplatesScreenProps.ts
├── views/
│   ├── BrowseView.tsx         # Category browse tab
│   ├── BrowseAllTab.tsx
│   ├── BrowseCategoriesTab.tsx
│   ├── CategorySearchView.tsx # Search/category detail
│   ├── TemplateListCard.tsx
│   └── TemplatesList.tsx
└── components/
    ├── BrowseHeader.tsx
    ├── CategoryHeader.tsx
    ├── FilterControls.tsx
    ├── SearchBar.tsx
    ├── TabBar.tsx
    ├── TemplateModals.tsx
    └── ... (loading, empty states)
```

## State Management Patterns

### Pattern 1: Hook-based State (Most screens)

```typescript
// Screen uses custom hook for all state
function ScreenContent() {
  const { state, handlers, data } = useScreenHook();
  // Render...
}
```

Used by: AnalyticsScreen, TemplatesScreen, HabitDetailScreen, HabitEditScreen

### Pattern 2: Props-based (Simple screens)

```typescript
// Screen receives data via props
function ScreenContent({ data, onAction }) {
  // Render...
}
```

Used by: CharacterScreen

### Pattern 3: Local State Only (Onboarding)

```typescript
// Screen manages its own state
function OnboardingScreenContent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // ...
}
```

## Screens Flagged for Refactoring

| Screen | Lines | Issue | Recommendation |
|--------|-------|-------|----------------|
| OnboardingScreen | 598 | Too large, multiple sub-components inline | Extract to `components/` folder |
| SignInScreen | 374 | Form + UI in single file | Split into BrandSection, AuthForm, etc. |
| SignUpScreen | 201 | Similar to SignInScreen | Extract SignUpHeader + form card |

## Key Dependencies

- **react-native-reanimated**: All screens use animated entrances
- **react-native-safe-area-context**: All screens use `useSafeAreaInsets()`
- **ScreenErrorBoundary**: All screens wrapped for error handling
- **lucide-react-native**: Icon library for auth screens

## Notes

- All screens are wrapped in `ScreenErrorBoundary` for graceful error handling
- Auth screens use lazy loading to reduce initial bundle size
- Main app screens use bottom tab navigation (inside HabitsApp)
- Modals use `KeyboardAvoidingView` for better UX
