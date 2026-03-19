# Full-App UI Review — Chain Day Habit Tracker

**Audited:** 2026-03-19
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md present)
**Screenshots:** Not captured (no dev server detected on ports 3000, 5173, 8080)
**Scope:** 9 screens, 1,081 TSX files, warm-minimal design system

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | CTAs are contextual and specific; onboarding "Next"/"Skip" are generic |
| 2. Visuals | 3/4 | Strong hierarchy and animation polish; CharacterCard has hardcoded trophy count |
| 3. Color | 2/4 | 613 occurrences of off-palette Tailwind color classes bypass design tokens |
| 4. Typography | 2/4 | 30+ distinct font sizes found; type scale not consistently enforced |
| 5. Spacing | 3/4 | 8pt grid largely observed; ~20 off-grid values scattered across components |
| 6. Experience Design | 4/4 | Comprehensive state coverage — loading skeletons, error boundaries, empty states, disabled states, and destructive action confirmations all present |

**Overall: 17/24**

---

## Top 3 Priority Fixes

1. **Color token bypass across 613 component instances** — Users experience inconsistent brand identity across light/dark modes because Tailwind utility classes (`text-stone-*`, `text-amber-*`, `text-violet-*`, `bg-red-*`, etc.) hardcode specific color values instead of routing through theme tokens. These won't update when theme switches and will break dark mode in 195 `text-stone-*` usages alone. Fix: Replace all `text-stone-N`/`bg-stone-N` usages with `colors.text.primary`, `colors.text.secondary`, etc., from `useThemeColors()`. Highest-impact files: `SocialProofCard.tsx`, `UpgradePrompt.tsx`, `PremiumBenefitsRow.tsx`, `MonetizationHero.tsx`, and the entire `MotivationSystem/Workshop` subtree.

2. **Typography scale fragmentation — 30+ unique pixel sizes outside the design token set** — The declared scale is 34/22/17/13px, but component-level inspections reveal 40, 30, 24, 18, 16, 15, 14, 12, 10px in widespread use via both inline `fontSize:` and Tailwind `text-[Npx]` classes. This creates visual inconsistency between screens and makes future type-scale changes require hunting down dozens of one-off values. Fix: Standardize all body-adjacent sizes to the token system (`typography.body` = 17, `typography.bodySmall` = 14, `typography.caption` = 13). Replace `fontSize: 15`, `fontSize: 16`, `fontSize: 18` inline values with the nearest token. CharacterCard alone uses 12, 14, 16, 18, 30 — none from the token set (`CharacterCard.tsx` lines 108–216).

3. **Onboarding navigation uses bare "Next" and "Skip" labels** — The last CTA in the funnel says "Let's Build Your First Habit →" (excellent), but the in-between steps say only "Next" (`OnboardingScreen.tsx` line 155). Generic labels create weaker action commitment and lower conversion. Fix: Replace "Next" with step-specific forward momentum copy such as "See How It Works →" on step 1 and "See Your Progress →" on step 2. Replace "Skip" with "I'll explore later" to reduce abandonment anxiety.

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

**Strengths:**

- Destructive action dialogs use specific, helpful copy. Archive dialog says "This habit will be hidden from your daily list. You can restore it anytime from Settings." Cancel button says "Keep Active" — not generic "Cancel". Delete dialog says "This cannot be undone" with "Keep Habit"/"Delete Forever" labels. (`DangerZone.tsx` lines 40–59) — excellent.
- Auth screen CTAs read "Continue with Apple" / "Continue with Google" — action-oriented, not generic (`SocialSignInButton.tsx` line 18–20).
- Welcome screen hero copy: "Chain Day" / "Build habits that last" — memorable and brand-consistent.
- Analytics empty state title "No Analytics Yet" + contextual instruction card with numbered steps (`EmptyState.tsx` lines 57–103) — exceeds abstract standards.
- ErrorBoundary uses "{screenName} encountered an error, but your data is safe." — personalizes the generic fallback (`ScreenErrorFallback.tsx` line 111).
- Auth error fallback includes `onDismiss` dismiss action — no stranded errors (`WelcomeScreen.tsx` line 61).
- Onboarding final CTA: "Let's Build Your First Habit →" — specific, motivating, and contextual (`OnboardingScreen.tsx` line 139).

**Issues:**

- `OnboardingScreen.tsx` line 155: Mid-flow CTA is bare "Next" — does not tell the user what they'll see next. With only 3–4 onboarding pages, each should have a unique forward verb (e.g., "See Your Streak →", "Meet Your Character →").
- `OnboardingScreen.tsx` line 91: "Skip" appears without context — functionally correct but framing it as avoidance ("I'll explore later") lowers perceived opt-out cost.
- `AnalyticsScreen.tsx` line 88: subtitle reads "Track your habit journey" — slightly generic. Consider "Your habit insights, since day one." for more specificity.
- `AccountSection.tsx` line 44: Error alert text "Failed to delete account. Please try again or contact support." — "contact support" has no link or email, making it a dead-end instruction.
- `CharacterCard.tsx` line 65: Trophy count is hardcoded as the literal "10" (`<Text style={styles.trophyText}>10</Text>`). This will always display 10 regardless of the user's actual achievement count — misleading gamification.

---

### Pillar 2: Visuals (3/4)

**Strengths:**

- All 9 screens wrap in `ScreenErrorBoundary` — prevents blank screens on crashes.
- Consistent modal presentation pattern: bottom-sheet with `rounded-t-3xl`, backdrop Pressable to dismiss, swipe-dismiss gesture via `useSwipeDismiss`.
- LinearGradient used on WelcomeScreen, HabitDetailScreen, and CharacterCard to create visual depth without overloading with color.
- Animation enter/exit choreography is well-staggered (FadeInDown with 60ms increments per section) — creates clear visual hierarchy in time dimension.
- Icon-only actions are consistently paired with `accessibilityLabel` (1,213 total occurrences in TSX files) — good for screen reader users.
- Visual hierarchy progression: displayLarge (34) → heading1 (22) → body (17) → caption (13) is architecturally correct even if not consistently applied.
- Animated pressable scale feedback (0.97 on press-in) on interactive elements creates tactile feel without being distracting.
- HabitsEmptyStateMinimal has a breathing seedling animation with a progression ring — engaging onboarding moment.

**Issues:**

- `CharacterCard.tsx` line 65: The trophy badge always shows "10" — a hardcoded placeholder that was never wired to `data.trophyCount` or equivalent. This breaks the gamification narrative (users who've earned 0 or 25 trophies both see "10").
- The CharacterScreen lacks a true empty/zero-state for brand new users: if a user has zero habits and zero tracking, `CharacterCard` still renders with `Level 1` and `0/100 XP` but no guidance on how XP is earned. There's no "Start earning XP" prompt.
- `AnalyticsScreen.tsx` line 87: The Analytics screen header subtitle ("Track your habit journey") is below the header title, but the visual weight is very low — secondary text sits at 13–15px in a near-identical color to the header background, potentially invisible at default Dynamic Type.
- The `MotivationSystem/Workshop` voice note UI uses `teal-*` as its primary brand color (play/pause, waveform, playback bar) — this is a distinct visual language from the rest of the app (green primary) and creates a perceived "different product" feeling within the same feature set.

---

### Pillar 3: Color (2/4)

**Issues (critical):**

The design system defines a warm minimal palette: forest green primary (`#059669`), warm stone neutrals (`#F5F1ED`→`#2D2A26`), burnished gold streak (`#8B6208`). The theme tokens in `useThemeColors()` expose this correctly. However, 613 component instances bypass these tokens and use raw Tailwind semantic color classes:

| Color family | Occurrences | Affected areas |
|---|---|---|
| `text-stone-*` / `bg-stone-*` | 195 | SocialProofCard, UpgradePrompt, PremiumBenefitsRow, SocialSignInButton, LegalFooter |
| `text-amber-*` / `bg-amber-*` | 28 | PremiumBenefitsRow, SettingsSection badge |
| `text-violet-*` / `bg-violet-*` | 19 | UpgradePrompt CTA |
| `text-emerald-*` / `bg-emerald-*` | 20 | VisualizationGuide, SortOptionRow |
| `text-teal-*` / `bg-teal-*` | 8 | MotivationSystem/Workshop voice UI |
| `text-rose-*` / `bg-rose-*` | 29 | Various error states |

The stone palette (`text-stone-500`, `text-stone-800`) aligns with the warm palette semantically, but routes around the theme context — meaning dark mode toggles will not affect these values. In dark mode, `text-stone-800` stays dark even when the background switches to `#111827`, breaking text contrast.

Additional hardcoded color instances outside theme:

- `ValueProps.tsx` line 25–26: `backgroundColor: '#D1FAE5'`, `color: '#059669'` — these match theme values but are not referenced through tokens.
- `HabitsEmptyStateMinimal/SeedlingIcon.tsx` lines 19–22: Four hardcoded hex values for SVG drawing (acceptable — SVG colors are not semantically themeable).
- `DangerZone.tsx` lines 62–99: Dark mode colors defined inline as `rgba(146,64,14,0.15)`, `#FBBF24`, `#F87171` rather than from `darkColors` token set. Works visually but is not maintainable.
- `BottomActionBar/ProgressRingFAB.tsx` line 84: `color='#ffffff'` on icon inside primary green button — acceptable since the relationship is always primary/inverse.
- `HapticTestModalSection.tsx` line 21: `backgroundColor: '#111827'` hardcoded — this is a debug/dev component, acceptable.

`colors.accent` is referenced 15 times across WeeklySummaryCard components, but `accent` is only defined in `darkColors` (as `#34D399`) — not in the light-mode `colors` object. This means `colors.accent` is `undefined` in light mode, causing icon color to fall back to black/undefined in WeeklySummaryCard (`WeeklySummaryCard.tsx`, `CardHeader.tsx`, `StatsGrid.tsx`, etc.).

**Registry audit:** shadcn `components.json` present, uses official shadcn registry only. No third-party blocks. No flags.

---

### Pillar 4: Typography (2/4)

The declared type scale is: `displayLarge` (34), `heading1/2` (22), `heading3` (20), `body` (17), `bodySmall` (14), `caption` (13), `tabBar` (10).

**Observed font sizes in use (from code scan — not from token system):**

| Size (px) | Location |
|---|---|
| 48 | `SuccessIcon.tsx` (emoji) |
| 40 | `DetailHero.tsx` emoji |
| 34 | `NameInputSection.tsx` (inline), `DetailHero.tsx` (inline) |
| 30 | `CharacterCard.tsx` avatarEmoji |
| 24 | `UpgradePrompt.tsx`, `StatCard.tsx`, `AchievementCard.tsx` |
| 22 | Various (from token via className `text-[22px]`) |
| 18 | `CharacterCard.tsx`, `TemplatesButton.tsx`, `InlineHint.tsx`, emoji sizes |
| 17 | Many — body text, but often via inline rather than `typography.body` |
| 16 | `AttributeCard.tsx`, `CharacterCard.tsx`, `PremiumPackCard.tsx` |
| 15 | `ValueProps.tsx`, `SortOptionRow.tsx`, `SocialSignInButton.tsx` |
| 14 | `CharacterCard.tsx`, `SortChip.tsx`, `SelectAllRow.tsx`, `HeaderButton.tsx` |
| 13 | Many — caption usage |
| 12 | `CharacterCard.tsx` xpRemaining |
| 11 | `PremiumPackCard.tsx` |
| 10 | `QuickStatsRow.tsx`, tab bar |

This is 15+ distinct pixel values. The declared scale has 8 steps. Even accounting for emoji sizes (non-semantic), there are approximately 10 non-emoji sizes outside the declared scale: 15, 16, 18, 24, 30, 40, 48.

**Font weight usage via Tailwind className:**

| Weight | Count |
|---|---|
| `font-semibold` | 189 |
| `font-medium` | 152 |
| `font-bold` | 129 |
| `font-normal` | 11 |
| `font-extrabold` | 4 |

The declared font weights are regular (400), medium (500), semibold (600), bold (700). The presence of `font-extrabold` (800) in 4 locations exceeds the declared range. `fontWeight: 'normal'` appears as a string literal in `CharacterCard.tsx` levels/title/xp text (lines 152, 162, 180) — this maps to 400 but is less legible than the token `fontWeights.regular`.

**Mixing of styling approaches:** The codebase uses three concurrent type-styling methods:
1. `typography.*` token objects from `src/theme/typography.ts` — correct
2. Inline `fontSize:` + `fontFamily:` + `fontWeight:` in StyleSheet — fragmented
3. NativeWind `className='text-[Npx] font-semibold'` — bypasses typography tokens entirely

The `CharacterScreen` components (`CharacterCard.tsx`, `AttributeCard.tsx`, `StatCard.tsx`, `AchievementCard.tsx`, `AchievementsSection.tsx`) do not use any typography tokens — all text is styled via inline `StyleSheet.create` with custom pixel values.

---

### Pillar 5: Spacing (3/4)

**Strengths:**

- The 8pt grid spacing token system (`xs:4, sm:8, md:12, base:16, lg:24, xl:32, 2xl:48, 3xl:64`) is well-defined and widely referenced.
- CharacterCard, CharacterScreen, and most screen-level containers use `spacing.*` tokens (`spacing.lg`, `spacing.md`, `spacing.sm`) from the theme — correct.
- Border radius tokens are consistently used (`borderRadius.xl = 24`, `borderRadius.large = 16`, `borderRadius.medium = 12`) across modals, cards, and buttons.
- Screen-level horizontal padding (`spacing.base = 16`) is respected as the canonical margin.

**Issues (off-grid values found):**

| Value | Location | Standard alternative |
|---|---|---|
| `paddingHorizontal: 14` | `ValueProps.tsx:55`, `Chip.tsx:64`, `QuickFilterChips.tsx:89`, `HeaderButton.tsx:94` | `spacing.md (12)` or `spacing.base (16)` |
| `paddingVertical: 10` | `SocialProofBadge.tsx:62`, `ValueProps.tsx:56`, `PremiumPackCard.tsx:59` | `spacing.sm (8)` or `spacing.md (12)` |
| `gap: 6` | `Chip.tsx:62`, `QuickStatsRow.tsx:99`, `CalendarSummary.tsx:73`, `ProgressDots.tsx:56` | `spacing.sm (8)` or `spacing.xs (4)` |
| `gap: 5` | `CalendarSummary.tsx:73` | `spacing.xs (4)` or `spacing.sm (8)` |
| `paddingHorizontal: 6` | `QuickStatsRow.tsx:85`, `SwipeGripLines.tsx:51` | `spacing.xs (4)` or `spacing.sm (8)` |
| `padding: 20` | `EmptyState.tsx:84`, `StreakEmptyState.tsx:30`, multiple example files | `spacing.base (16)` or `spacing.lg (24)` |
| `paddingHorizontal: 18` | `PremiumPackCard.tsx:58` | `spacing.base (16)` or `spacing.lg (24)` |
| `padding: 28` | `BatchDeleteConfirmModal.tsx:57` | `spacing.xl (32)` or `spacing.lg (24)` |
| `paddingHorizontal: 28` | `RetryableErrorView.tsx:78` | `spacing.xl (32)` or `spacing.lg (24)` |
| `paddingVertical: 14` | Multiple (`ReminderTimePicker.tsx:25`, `ConflictNotification.tsx:168`, `ScreenErrorFallback.tsx:66`) | `spacing.md (12)` or `spacing.base (16)` |
| `paddingVertical: 6` | Multiple | `spacing.xs (4)` or `spacing.sm (8)` |

Most violations are in the 6/10/14/18/20/28px range — generally within one step of a grid value. None are egregiously off-system (no arbitrary 37px or 53px values). This is a maintenance concern, not a perceptible visual problem at normal use.

---

### Pillar 6: Experience Design (4/4)

**Loading states:** Comprehensive. `HabitsPageSkeleton`, `HabitEditSkeleton`, `AnalyticsScreenSkeleton`, `ChartLoadingSkeleton`, `TemplatesLoadingState`, `ShimmerBox`, `SkeletonCard` all present. `ActivityIndicator` used correctly in button loading states (`SocialSignInButton`, `EditHeader`, `TrendingCard/AddButton`). Loading gated behind `isLoading && habits.length === 0` pattern prevents skeleton flash when data is already cached (`HabitsApp.tsx` line 78).

**Error boundaries:** Every screen wraps in `ScreenErrorBoundary` with the screen name (`WelcomeScreen`, `Onboarding`, `Habits`, `Habit Details`, `Edit Habit`, `Analytics`, `Templates`, `Character`). Error fallback is personalized with screen name and guarantees data-safety messaging (`ScreenErrorFallback.tsx` line 110). Retry and optional Go Back actions both present. Sentry `ErrorBoundary` layer also present at lib level.

**Empty states:** All major data surfaces have dedicated empty states:
- Habits list: `HabitsEmptyStateMinimal` with animated seedling, progress ring, and inline habit creation flow — well above baseline.
- Analytics: `EmptyState` with step-by-step "Get Started" card.
- Templates: `TemplatesEmptyState` with seed action.
- AnalyticsScreen empty (no habits): `hasNoHabits` renders `EmptyState` component.

**Disabled states:** Auth buttons set `accessibilityState={{ busy: isLoading, disabled: isDisabled }}` and apply `opacity-40` class (`SocialSignInButton.tsx` line 75). Onboarding CTA is `disabled={isLoading}` with `ActivityIndicator` replacing text. EditHeader "Save" button is disabled when `habitName.trim().length < 2` with visual opacity change.

**Destructive action confirmation:** All destructive paths use `Alert.alert` with two-step confirmation (`DangerZone.tsx` lines 38–59), batch delete uses `confirmDeleteVisible` modal pattern (`HabitsApp.tsx`), and archive undo toast provides recoverability post-action.

**Haptic feedback:** Used contextually — `triggerSelection` on selection mode entry, `triggerWarning` on limit hit, haptic feedback on destructive actions. Respects `reduceMotionPreference` throughout.

**Reduced motion:** `useReducedMotion()` from `react-native-reanimated` called in `SocialSignInButton`, `OnboardingScreen`, and throughout `HabitsEmptyStateMinimal`. Animation entering is conditionally set to `undefined` when reduce-motion is active — correct pattern (737 occurrences of motion/motion-preference checks).

**Score: 4/4** — Experience design is the strongest pillar. State coverage is comprehensive and thoughtful.

---

## Registry Safety

`components.json` found. Registry is `https://ui.shadcn.com/schema.json` (official shadcn only). No third-party registry blocks identified. Registry audit complete: 0 third-party blocks checked, no flags.

---

## Files Audited

**Theme system:**
- `src/theme/colors/core.ts`
- `src/theme/colors/semantic.ts`
- `src/theme/typography.ts`
- `src/theme/spacing.ts`
- `src/theme/darkColors.ts`
- `src/theme/animations.ts`

**Screens (9 main screens):**
- `src/screens/auth/WelcomeScreen.tsx`
- `src/screens/auth/components/SocialSignInButton/SocialSignInButton.tsx`
- `src/screens/auth/components/ValueProps/ValueProps.tsx`
- `src/screens/auth/components/AuthError/AuthError.tsx`
- `src/screens/onboarding/OnboardingScreen.tsx`
- `src/features/habits/HabitsApp.tsx`
- `src/screens/HabitDetailScreen/HabitDetailScreen.tsx`
- `src/screens/HabitEditScreen/HabitEditScreen.tsx`
- `src/screens/HabitEditScreen/DangerZone.tsx`
- `src/screens/AnalyticsScreen/AnalyticsScreen.tsx`
- `src/screens/AnalyticsScreen/components/EmptyState.tsx`
- `src/screens/CharacterScreen/CharacterScreen.tsx`
- `src/screens/CharacterScreen/components/CharacterCard.tsx`
- `src/screens/TemplatesScreen/TemplatesScreen.tsx`

**Shared components:**
- `src/components/ErrorBoundary/ScreenErrorFallback.tsx`

**Additional grep-based scan of 1,081 TSX files** for copywriting, color, typography, spacing, and experience-design patterns.
