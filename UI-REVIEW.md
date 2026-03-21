# Standalone — UI Review

**Audited:** 2026-03-19
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md exists)
**Screenshots:** Not captured (no dev server detected at ports 3000, 5173, 8080 — React Native app requires device/simulator)
**Registry audit:** shadcn initialized (components.json found) — no third-party registry blocks identified, only official shadcn tooling in use

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 4/4 | Specific, action-oriented copy throughout; dynamic CTAs adapt to user input |
| 2. Visuals | 3/4 | Strong hierarchy and icon usage; CharacterScreen mixes NativeWind className styling inconsistently |
| 3. Color | 3/4 | Well-designed token system; 19 occurrences of off-palette font weights and hardcoded hex values outside theme |
| 4. Typography | 2/4 | Theme system is excellent but widely bypassed; 15+ files use `fontSize` and `fontWeight` literals instead of `typography.*` tokens |
| 5. Spacing | 3/4 | 8px grid token system is solid; 26+ files use raw pixel values for spacing outside theme tokens |
| 6. Experience Design | 4/4 | Comprehensive loading skeletons, error boundaries on every screen, empty states, disabled states, and destructive action confirmations |

**Overall: 19/24**

---

## Top 3 Priority Fixes

1. **Raw fontSize/fontWeight literals scattered across 15+ component files** — Users encounter typographic inconsistency when these diverge from the type scale (e.g., `fontSize: 28, fontWeight: '800'` in HeroSection vs the declared `displayLarge` at 34px/700) — Replace all inline `fontSize`/`fontWeight` literals with `typography.*` token references from `src/theme/typography.ts`

2. **Styling split between NativeWind `className` and `StyleSheet` within CharacterScreen** — The inconsistency creates maintenance risk: color tokens are applied via inline `style` (correct) but layout uses arbitrary `className` values like `rounded-3xl` (24px) which differ from the system's `borderRadius.xl` (also 24px but independently duplicated) — Migrate CharacterScreen components to use `StyleSheet.create` with theme tokens, eliminating the className mixing pattern

3. **Hardcoded hex colors in component files outside the theme** — Values like `'#FCD34D'`, `'#F59E0B'`, `'#EF4444'`, and `'#92400e'` appear in EmptyState.tsx, SuccessContent.tsx, and SocialProofBadge.tsx and do not adapt to dark mode — Replace with nearest semantic tokens: `colors.streak[300]` for amber/gold, `colors.error` for red, `colors.warning` for brown-amber

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)

Copy throughout the app is specific, purposeful, and user-centered. No generic "Submit," "OK," or "Cancel" labels found in production UI paths.

**Strengths:**
- Dynamic CTA in HabitsEmptyStateMinimal: `Add "${habitName}" →` adapts to user input (`constants.ts:100`)
- Error state hint: "Enter a habit name first" is context-specific (`CtaButton.tsx:47`)
- Onboarding CTA: "Let's Build Your First Habit →" is motivating and specific (`OnboardingScreen.tsx:139`)
- Success state: `"${habitName}" added — your chain starts now!` references the user's actual habit name (`constants.ts:111`)
- Time-aware suggestion chips (Morning/Afternoon/Evening/Night) demonstrate contextual copy thinking
- Empty state for Analytics: "No Analytics Yet" with instructional step-by-step guidance — clear and actionable

**Minor observations:**
- Generic "Next" label on onboarding next-page button (`OnboardingScreen.tsx:154`) — low impact given it's a common navigation pattern
- Error boundary fallback at `ScreenErrorFallback.tsx:109` uses "Something went wrong" — unavoidable generic phrasing for catch-all errors, acceptable given the retry/recovery actions provided

---

### Pillar 2: Visuals (3/4)

Visual hierarchy is generally strong across all screens. The Warm Minimal aesthetic is well-expressed through the color palette and component structure.

**Strengths:**
- HabitCard uses a left-side accent bar (`HabitCard.tsx:86-94`) providing color-coded habit identity without cluttering the main content area
- StrengthFillBackground creates a progressive visual fill that encodes habit progress in the card background — effective layered communication
- BottomActionBar uses BlurView with a floating capsule design — clear focal point for primary action (`BottomActionBar.tsx:46`)
- All icon-only interactive elements have `accessibilityLabel` + generous `hitSlop` (18pt) (`BottomActionBar.tsx:22-27`)
- WelcomeScreen uses LinearGradient to create depth behind the hero section — clear focal hierarchy
- Completion confetti/shimmer/XP float animations provide meaningful visual feedback without decorative idle motion

**Issues:**

- **CharacterScreen mixes className and StyleSheet:** `CharacterCard.tsx` uses `className='mb-6 overflow-hidden rounded-3xl border'` alongside inline style objects. This creates two sources of truth for layout decisions. The `rounded-3xl` (24px) maps correctly but the pattern breaks when dark-mode-aware colors must be inline (`style={{ borderColor: colors.cardBorder }}`). The visual result is a hybrid that makes auditing and iteration harder.

- **HeroSection uses `fontSize: 28, fontWeight: '800'`** (`HeroSection.tsx:42-43`): The declared `displayLarge` is 34px/700. A 28px/800 headline exists only in the empty state — it does not map to any token in the type scale, creating an unintended visual level between heading1 and displayLarge.

- **FeaturedCollection title uses `fontSize: 24, fontWeight: '800'`** (`FeaturedCollection.styles.ts:83`): 24px exists in the scale (heading2 at 22px DM Sans), but `'800'` is not a declared `fontWeights` value — only `400/500/600/700` exist.

---

### Pillar 3: Color (3/4)

The color system is genuinely well-designed: semantic tokens, warm stone neutrals, WCAG AA compliance, and inverted dark mode palette. The `useThemeColors()` hook is consistently used for adaptive colors across all main screens.

**Strengths:**
- Both `darkColors` and `lightColors` implement `SemanticColors` interface — structural parity guaranteed (`darkColors.ts:222`)
- `colors.primary[600]` (#059669) is correctly used only for primary actions and CTAs
- Burnished gold (`streak.*`) is constrained to streak badges and progress indicators — correct ≤10% usage
- Shadow system uses warm `#2D2A26` tint instead of pure black — tonal consistency maintained
- HabitCard dynamically computes `strengthColor` from the `strength.*` palette — color encodes semantic progress

**Issues:**

- **19 occurrences of `fontWeight: '800'` or `fontWeight: 'bold'`** across 15 files: While not strictly a color issue, these off-palette values accompany hardcoded color literals in the same components, indicating localized style clusters that bypass the design system entirely.

- **Hardcoded hex values in component files** (not in theme/constants files):
  - `EmptyState.tsx:92`: `color: isDark ? '#FCD34D' : '#D97706'` — nearest tokens are `colors.streak[300]` (#E8B94D) and `colors.warning` (#9A5504). The choices are close but inconsistent.
  - `SuccessContent.tsx:93`: `color: '#ffffff'` — should be `colors.text.inverse`
  - `SocialProofBadge.tsx:72`: `color: '#92400e'` — amber-800, no token equivalent; nearest is `colors.warning` (#9A5504)
  - `HabitsEmptyStateMinimal/animations/successAnimations.ts:19-20`: `'#FCD34D'`, `'#F59E0B'` for confetti — decorative use, but still escapes the palette
  - `constants.ts:139` (EmptyState COLORS): `red500: '#EF4444'` is explicitly noted as "Brighter red; design system `error` is #B53030" — a known deviation that should be resolved

- **Tailwind config mismatch:** `tailwind.config.js:57-58` defines `card.DEFAULT: '#FFFFFF'` but the design system card color is `#EDEAE5`. This config divergence means any NativeWind `bg-card` class would produce pure white instead of warm card surface.

---

### Pillar 4: Typography (2/4)

The theme's `typography.ts` defines an excellent 8-level type scale with Literata/DM Sans pairing. However, the scale is widely bypassed in component-level styles, creating an inconsistent typographic surface across screens.

**Token scale (declared):**
- `displayLarge`: 34px Literata Bold
- `heading1`: 22px Literata Bold
- `heading2`: 22px DM Sans Semibold
- `heading3`: 20px DM Sans Semibold
- `body`: 17px DM Sans Regular
- `bodySmall`: 14px DM Sans Regular
- `caption`: 13px DM Sans Medium
- `tabBar`: 10px DM Sans Medium

**Actual usage in components (departures from scale):**

| File | Inline value | Nearest token | Gap |
|------|-------------|---------------|-----|
| `HeroSection.tsx:42-43` | 28px/800 | No token | Off-scale entirely |
| `CtaButton.styles.ts:37-38` | 16px/700 | `monospace` (16px) | Wrong font + weight |
| `HabitInput/inputStyles.ts:41-42` | 15px/500 | No token | Off-scale |
| `Chip/Chip.tsx:81` | 13px (correct, but raw) | `caption` | Should reference token |
| `SecondaryLinks.tsx:53-54` | 13px/400 | `caption` has weight 500 | Weight deviation |
| `BatchDeleteConfirmModal.tsx:58` | 14px/600 | `bodySmall` has weight 400 | Weight deviation |
| `FeaturedCollection.styles.ts:19` | 11px | No token (below `tabBar` at 10px) | Badge text below scale |
| `SuccessContent.tsx:37-38` | 22px/600 | `heading2` (22px/semibold) | Should use token |
| `CharacterCard.tsx` | `text-base/text-sm` (NativeWind classes) | `body`/`bodySmall` | Token bypass via className |

**Concerning pattern:** The `HabitsEmptyStateMinimal` module — the most-used first-time experience — contains at least 9 separate raw `fontSize` literals across its sub-components rather than using `typography.*` tokens. This is the critical user-facing path.

**Font weight inflation:** `fontWeight: '800'` appears in 10+ files. The declared system only goes to `'700'` (bold). The extra weight creates unintended visual emphasis that breaks the hierarchy contract.

---

### Pillar 5: Spacing (3/4)

The spacing token system (`xs:4, sm:8, md:12, base:16, lg:24, xl:32, 2xl:48, 3xl:64`) is correctly defined and used in StyleSheet files for core components like HabitCard and BottomActionBar. However, many component-level files use raw pixel integers.

**Strengths:**
- `HabitCard.styles.ts` correctly uses `spacing.xs`, `spacing.sm`, `spacing.md`, `spacing.base` throughout
- `FeaturedCollection.styles.ts` uses `spacing.lg` for padding and `spacing.base` for margins
- `WelcomeScreen.styles.ts` uses `spacing` system tokens (32, 24, 16, 8) — all on-grid values
- `BottomActionBar.styles.ts` references `shadows.floatingActionButton` and safe area insets correctly
- Component spacing spec is defined (`componentSpacing.button.height: 44, input.height: 44`) and touch targets are met

**Issues:**

- **26+ files with raw spacing integers** that happen to be on-grid but bypass tokens: values like `padding: 20` (`EmptyState.tsx:83`), `paddingHorizontal: 24` (inline in multiple screens), and `gap: 8` throughout CharacterScreen inline styles. These work today but will drift when the grid changes.

- **`EmptyState.tsx:83` uses `padding: 20`** — this is off the 8px grid (closest tokens are `md:12` or `base:16` or `lg:24`). The 20px value is the primary misalignment found.

- **`padding: 20` in StatCard** (`EmptyState.tsx:83`): 20 is not a declared spacing token. Neither is `marginBottom: 12` used loosely (12 = `spacing.md`, so coincidentally correct but should be `spacing.md`).

- **CharacterCard inline values:** `paddingHorizontal: 16, paddingVertical: 10` (`CharacterCard.tsx:72-73`) for the trophy badge — 10 is off-grid (nearest: 8=sm or 12=md).

- **Tailwind config spacing misalignment:** `tailwind.config.js:65-71` defines `md: '16px'` but `spacing.md` in the theme is `12`. The NativeWind classes would produce 16px while `spacing.md` produces 12px for the same conceptual "medium" spacing.

---

### Pillar 6: Experience Design (4/4)

The experience design layer is mature and comprehensive. State coverage across loading/error/empty/disabled/destructive scenarios is excellent.

**Loading states:**
- `HabitsPageSkeleton` for the habits list (`HabitsApp.tsx:94`)
- `AnalyticsScreenSkeleton` for analytics (`AnalyticsScreen.tsx:67-69`)
- `ChartLoadingSkeleton` for charts within analytics
- `LoadingSkeleton` in HabitsEmptyStateMinimal with shimmer animation
- `SkeletonCard` and `TemplatesLoadingState` in TemplatesScreen
- StatCard has per-card loading skeleton with bone UI (`StatCard.tsx:44-60`)
- 534 loading/skeleton/isLoading references across TSX files confirms pervasive coverage

**Error states:**
- `ScreenErrorBoundary` wraps every screen: WelcomeScreen, OnboardingScreen, HabitsApp, AnalyticsScreen, CharacterScreen, TemplatesScreen (`verified across all 6 screens`)
- `RetryableErrorView` provides user-facing error UI with retry actions
- `ErrorMessage` component within HabitsEmptyStateMinimal for inline input errors
- Sentry `ErrorFallback` for unrecoverable errors
- 171 ErrorBoundary/error/catch references in TSX confirm broad coverage

**Empty states:**
- `HabitsEmptyStateMinimal`: Full interactive empty state with animated hero, time-aware chip suggestions, inline input, and success transition
- `EmptyState` in AnalyticsScreen: Step-by-step guidance card
- `TemplatesEmptyState` and `TemplatesListEmpty` for templates flow
- Multiple domain-specific empty states: `EmptyInsightsState`, `EmptyStrengthState`, `EmptyVizState`, `PausedEmptyState`

**Disabled states:**
- Buttons correctly receive `disabled` prop based on loading/validation state (CtaButton, OnboardingScreen CTA)
- HabitCard uses `disabled` prop with 0.5 opacity (`HabitCard.styles.ts:52`) and `accessibilityState={{ disabled }}`
- 162 `disabled` references across TSX files

**Destructive action confirmation:**
- Batch delete has `confirmDeleteVisible` flow with separate confirmation modal (`HabitsApp.tsx:124-125`)
- Batch archive has undo toast with countdown (`batchArchiveUndoVisible`)
- Account deletion uses `Alert.alert` with confirmation step (`AccountSection.tsx:44`)
- Habit deletion in edit screen uses `Alert.alert` pattern

**Haptics and feedback:**
- 7 haptic patterns via `useHapticFeedback` and `useHaptics`
- Completion sounds integrated
- `accessibilityLabel` + `accessibilityHint` + `accessibilityRole` on 1,234 instances across TSX files

**Minor observations:**
- `ScreenErrorFallback.tsx:109` displays "Something went wrong" — generic but acceptable for catch-all boundaries. The recovery flow includes specific retry actions and a "Go back" option.

---

## Registry Safety

shadcn initialized. No third-party registry blocks identified in components.json — only the official shadcn registry is configured. Registry audit: 0 third-party blocks checked, no flags.

---

## Files Audited

**Theme System:**
- `src/theme/index.ts`
- `src/theme/colors/core.ts`
- `src/theme/typography.ts`
- `src/theme/spacing.ts`
- `src/theme/animations.ts`
- `src/theme/darkColors.ts`
- `tailwind.config.js`
- `components.json`

**Core Screens:**
- `src/screens/auth/WelcomeScreen.tsx`
- `src/screens/auth/WelcomeScreen.styles.ts`
- `src/screens/onboarding/OnboardingScreen.tsx`
- `src/features/habits/HabitsApp.tsx`
- `src/screens/AnalyticsScreen/AnalyticsScreen.tsx`
- `src/screens/AnalyticsScreen/components/EmptyState.tsx`
- `src/screens/AnalyticsScreen/components/StatCard.tsx`
- `src/screens/CharacterScreen/CharacterScreen.tsx`
- `src/screens/CharacterScreen/components/CharacterCard.tsx`
- `src/screens/TemplatesScreen/TemplatesScreen.tsx`
- `src/screens/TemplatesScreen/components/FeaturedCollection/FeaturedCollection.tsx`
- `src/screens/TemplatesScreen/components/FeaturedCollection/FeaturedCollection.styles.ts`

**Key Components:**
- `src/features/habits/components/HabitsEmptyStateMinimal/HabitsEmptyStateMinimal.tsx`
- `src/features/habits/components/HabitsEmptyStateMinimal/constants.ts`
- `src/features/habits/components/HabitsEmptyStateMinimal/CtaButton.tsx`
- `src/components/HabitCard/HabitCard.tsx`
- `src/components/HabitCard/HabitCard.styles.ts`
- `src/components/HabitCard/HabitCard.colors.ts`
- `src/features/habits/components/BottomActionBar/BottomActionBar.tsx`

**Grep analysis across:**
- All `src/**/*.tsx` files for font size, font weight, spacing, color, loading, error, disabled, and accessibility patterns
