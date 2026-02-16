# Screen Hierarchy Documentation

## Overview
This document describes the screen structure, navigation flow, and component organization for the Chain Day habit tracking app.

---

## Screen Categories

### 1. Authentication Screens (`src/screens/auth/`)
First-time users and authentication flow.

#### WelcomeScreen
- **Purpose:** Initial landing page for unauthenticated users
- **Navigation:** App entry point (no auth)
- **Child Screens:** SignInScreen, SignUpScreen (inline mode switching)
- **Size:** 125 lines
- **Complexity:** Medium (manages 3 auth modes: welcome, signin, signup)

#### SignInScreen  
- **Purpose:** Email/password authentication
- **Navigation:** From WelcomeScreen "Sign in" link
- **Modals:** ForgotPasswordModal
- **Size:** **374 lines (LARGE - needs refactoring)**
- **Complexity:** High (form validation, OAuth, animations, keyboard handling)
- **Refactor suggestions:** Extract form sections, move animations to hooks

#### SignUpScreen
- **Purpose:** New user registration
- **Navigation:** From WelcomeScreen "Create Free Account"
- **Child Views:** VerificationView (after sign-up)
- **Size:** **201 lines (just over threshold)**
- **Complexity:** Medium (form validation, password strength, verification flow)

---

### 2. Onboarding Screen (`src/screens/onboarding/`)
First-time user education.

#### OnboardingScreen
- **Purpose:** 3-page carousel introducing core concepts
- **Navigation:** Shown once after first sign-up
- **Pages:**
  1. Chain Visualization (animated chain links)
  2. Strength Meter (5-stage progression)
  3. Templates Grid (sample templates)
- **Size:** **598 lines (VERY LARGE - critical refactor needed)**
- **Complexity:** Very High (complex animations, inline components, AsyncStorage)
- **Refactor suggestions:**
  - Extract ChainVisualization component → `components/ChainVisualization.tsx`
  - Extract StrengthMeter component → `components/StrengthMeter.tsx`
  - Extract TemplatesGrid component → `components/TemplatesGrid.tsx`
  - Move styles to `OnboardingScreen.styles.ts`
  - Extract page data to `onboarding/constants.ts`

---

### 3. Main App Screens

#### AnalyticsScreen (`src/screens/AnalyticsScreen/`)
- **Purpose:** Premium analytics dashboard
- **Navigation:** Main tab navigation
- **Components:**
  - AnalyticsHeader
  - OverviewStats
  - ChartSections (strength distribution, 30-day trend, weekly compliance)
  - InsightsSections (weekly insights, ranked habits)
  - ExportButton
  - EmptyState
- **Modals:** ExportMenu, PremiumPaywall
- **Size:** 148 lines
- **Complexity:** Medium (multiple data sources, premium gating)
- **Hook:** `useAnalyticsScreen` - Centralized data fetching and handlers

#### CharacterScreen (`src/screens/CharacterScreen/`)
- **Purpose:** RPG-style character progression
- **Navigation:** Main navigation / Character tab
- **Components:**
  - ScreenHeader
  - CharacterCard (avatar, level, XP)
  - AttributesSection (Strength, Discipline, Wisdom, Vitality)
  - StatsSection (numerical stats)
  - AchievementsSection (achievement badges)
- **Size:** 52 lines (most compact screen!)
- **Complexity:** Low (static presentation, clean composition)
- **Data:** Currently uses MOCK_CHARACTER_DATA (TODO: real backend)

#### TemplatesScreen (`src/screens/TemplatesScreen/`)
- **Purpose:** Browse and import science-backed habit templates
- **Navigation:** Templates tab
- **View Modes:**
  - BrowseView (All / By Category tabs)
  - CategorySearchView (filtered view)
- **Components:**
  - TabBar (All / By Category)
  - SearchBar (with research filter)
  - FilterControls
  - TemplatesList / BrowseAllTab / BrowseCategoriesTab
  - TemplateModals (preview, customize, fullsize)
- **Size:** 102 lines (orchestration only)
- **Complexity:** High (complex state, multiple view modes, prop drilling)
- **Hook:** `useTemplatesScreenProps` - Centralizes all state/handlers
- **Refactor suggestion:** Consider context API to reduce prop drilling

#### HabitDetailScreen (`src/screens/HabitDetailScreen/`)
- **Purpose:** Full-screen habit detail modal
- **Navigation:** Tap habit card in main list
- **Sections:**
  - DetailHeader (name, emoji, edit, close)
  - HeroSection (completion toggle, streak)
  - Calendar (monthly view, completed dates)
  - QuickStatsStrip (streak, strength, completion %)
  - Notes by date
- **Modals:**
  - NotesEditorModal
  - NotesListModal
  - Confirmation modals (archive, delete)
- **Size:** 123 lines
- **Complexity:** High (calendar logic, notes CRUD, modal stacking)
- **Hooks:**
  - `useHabitDetailScreenState` - UI state, completion data
  - `useCalendarHandlers` - Day press, archive, delete
  - `useNotesHandlers` - Notes CRUD operations

#### HabitEditScreen (`src/screens/HabitEditScreen/`)
- **Purpose:** Edit existing habit (bottom sheet modal)
- **Navigation:** From HabitDetailScreen "Edit" button
- **Sections:**
  - EditHeader (Cancel, Save)
  - NameInputSection
  - CustomizeSection (color, emoji, reminders)
  - DangerZone (Archive, Delete)
- **Size:** 119 lines
- **Complexity:** Medium (form state, validation, reminders)
- **Hooks:**
  - `useHabitEditScreen` - Load habit, form state, save/delete
  - `useHabitSaveHandler` - Save operation
  - `useHabitActions` - Delete/archive operations

---

## Navigation Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     APP LAUNCH                               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │   Authenticated?    │
              └─────────────────────┘
                   │            │
              NO   │            │  YES
                   ▼            ▼
         ┌─────────────┐   ┌──────────────────┐
         │ WelcomeScreen│   │ OnboardingScreen │ (first time only)
         └─────────────┘   └──────────────────┘
              │ ↓                    │
    ┌─────────┴─────────┐           ▼
    │                   │       ┌─────────────┐
    ▼                   ▼       │  Main App   │
┌──────────┐      ┌───────────┐ │  Tabs       │
│SignInScreen│    │SignUpScreen│ └─────────────┘
└──────────┘      └───────────┘      │
                        │             │
                        ▼             │
                  ┌─────────────┐    │
                  │Verification │    │
                  │   View      │    │
                  └─────────────┘    │
                        │             │
                        └─────────────┘
                              ▼
                    ┌─────────────────────┐
                    │    Main Tabs        │
                    ├─────────────────────┤
                    │ • Habits (Home)     │
                    │ • Templates         │
                    │ • Analytics         │
                    │ • Character         │
                    └─────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
           ▼                  ▼                  ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │TemplatesScreen│ │AnalyticsScreen│ │CharacterScreen│
    └──────────────┘  └──────────────┘  └──────────────┘
           │                  │
           ▼                  │
    ┌──────────────┐         │
    │Template      │         │
    │Preview Modal │         │
    └──────────────┘         │
                              │
    From Habits List         │
           │                  │
           ▼                  ▼
    ┌──────────────┐  ┌──────────────┐
    │HabitDetail   │  │Premium       │
    │Screen (Modal)│  │Paywall Modal │
    └──────────────┘  └──────────────┘
           │
           ▼
    ┌──────────────┐
    │HabitEdit     │
    │Screen (Modal)│
    └──────────────┘
```

---

## Screen Size Analysis

### Large Screens (>200 lines) - REFACTOR CANDIDATES

1. **OnboardingScreen: 598 lines** ⚠️ CRITICAL
   - Contains 3 major inline components (ChainVisualization, StrengthMeter, TemplatesGrid)
   - Inline styles definitions
   - Complex animation orchestration
   - **ACTION REQUIRED:** Extract components, move styles to separate file

2. **SignInScreen: 374 lines** ⚠️ HIGH PRIORITY
   - Complex form layout with animations
   - OAuth integration
   - Keyboard handling
   - Multiple entrance animations
   - **SUGGESTION:** Extract FormSection, BrandingSection, AnimationHooks

3. **SignUpScreen: 201 lines** ⚠️ MODERATE
   - Just over threshold
   - Could benefit from extracting PasswordStrengthSection

### Well-sized Screens (<200 lines) ✅

- CharacterScreen: **52 lines** (excellent composition!)
- TemplatesScreen: **102 lines** (orchestration only)
- HabitEditScreen: **119 lines**
- HabitDetailScreen: **123 lines**
- AnalyticsScreen: **148 lines**
- WelcomeScreen: **125 lines**

---

## Component Organization Patterns

### Pattern 1: Screen + Components Folder (Best for complex screens)
```
AnalyticsScreen/
├── AnalyticsScreen.tsx          # Orchestration (148 lines)
├── AnalyticsScreen.hooks.ts     # Business logic
├── AnalyticsScreen.styles.ts    # Styles
├── AnalyticsScreen.types.ts     # Types
├── components/
│   ├── AnalyticsHeader.tsx
│   ├── OverviewStats.tsx
│   ├── ChartSections.tsx
│   ├── InsightsSections.tsx
│   ├── ExportButton.tsx
│   ├── ExportMenu.tsx
│   └── EmptyState.tsx
└── index.ts
```

### Pattern 2: Screen + Hooks (For moderate complexity)
```
HabitDetailScreen/
├── HabitDetailScreen.tsx
├── useHabitDetailScreenState.ts
├── useCalendarHandlers.ts
├── useNotesHandlers.ts
├── components/
│   ├── DetailHeader.tsx
│   ├── HeroSection.tsx
│   └── ...
└── index.ts
```

### Pattern 3: Single File (For simple screens)
```
CharacterScreen/
├── CharacterScreen.tsx          # 52 lines total!
├── components/
│   ├── ScreenHeader.tsx
│   ├── CharacterCard.tsx
│   └── ...
├── constants.ts
├── types.ts
└── index.ts
```

---

## Key Learnings & Best Practices

### ✅ Good Patterns Observed:

1. **Consistent staggered animations** (60ms delay increments)
   - Example: AnalyticsScreen (280, 340, 400, 460, 520ms)

2. **Custom hooks for business logic**
   - Keeps screen components focused on presentation
   - Example: `useAnalyticsScreen`, `useHabitDetailScreenState`

3. **Component composition over large files**
   - CharacterScreen is exemplary (52 lines, 5 sub-components)

4. **Consistent error boundaries**
   - All screens wrapped in `<ScreenErrorBoundary>`

5. **Safe area insets handling**
   - Consistent use of `useSafeAreaInsets()` for notched devices

### ⚠️ Areas for Improvement:

1. **OnboardingScreen needs urgent refactoring** (598 lines)
   - Extract inline components
   - Separate styles file
   - Extract page data to constants

2. **SignInScreen could be split** (374 lines)
   - Extract form sections
   - Move animation logic to hooks

3. **TemplatesScreen has prop drilling**
   - Consider context API or composition
   - Too many props passed through layers

4. **MOCK_CHARACTER_DATA** needs backend integration
   - CharacterScreen currently uses mock data

---

## Accessibility Notes

All screens implement:
- ✅ Proper `accessibilityRole` attributes
- ✅ `accessibilityLabel` and `accessibilityHint` on interactive elements
- ✅ `accessibilityState` (disabled states)
- ✅ Reduced motion support (`useReducedMotion()` in OnboardingScreen)
- ✅ Safe area insets for notched devices

---

## Testing Coverage

Test files exist for:
- ✅ `auth/__tests__/` (SignInScreen, snapshot tests)
- ✅ `__tests__/HabitDetailScreen.*.test.tsx`

Missing tests:
- ⚠️ OnboardingScreen
- ⚠️ AnalyticsScreen
- ⚠️ CharacterScreen
- ⚠️ TemplatesScreen
- ⚠️ HabitEditScreen

---

## Summary Statistics

| Category | Count | Avg Size | Largest |
|----------|-------|----------|---------|
| Auth Screens | 3 | 233 lines | SignInScreen (374) |
| Main Screens | 5 | 110 lines | AnalyticsScreen (148) |
| Onboarding | 1 | 598 lines | OnboardingScreen (598) |
| **Total** | **9** | **185 lines** | **OnboardingScreen (598)** |

**Refactor Priority:**
1. 🔴 OnboardingScreen (598 lines) - CRITICAL
2. 🟡 SignInScreen (374 lines) - HIGH
3. 🟢 SignUpScreen (201 lines) - MODERATE
