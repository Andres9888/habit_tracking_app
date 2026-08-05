# Unify App-Wide Entrance Animations on Calm Cubic Tween

## Context
The Habit Library audit showed that while commit #1329 calmed the library's section content to a pure 280ms cubic ease-out, entrance animations elsewhere in the app (ScreenHeader, Analytics, Character, HabitEdit, Onboarding, Settings, modals, empty states, etc.) still use `.springify().damping(18)`, which adds a subtle overshoot. The user has approved unifying everything onto the calm tween so entrance motion is consistent app-wide.

## Goal
Every **entrance animation** (`entering={...}` on `Animated.View`) that currently uses `.springify().damping(N)` converts to `.easing(Easing.out(Easing.cubic))` at the duration already in place (default 280ms if unspecified). Durations, delays, and staggers stay as-is. No visual rework beyond replacing the spring settle with cubic ease-out.

## What Stays Unchanged (Explicit Exclusions)
These are NOT entrance animations and must not be touched:
- **`withSpring(...)` press/scale feedback** (AddButton, ListCardAddButton, ExploreHabitRow, ImportHeader press anim, etc.) — these are interaction feedback, springs are correct here.
- **`LinearTransition.springify()` layout transitions** (`CollapsibleCategorySection/animations.ts`, `EmojiGrid.tsx`) — layout continuity, keep.
- **`SlideInDown.springify()` on bottom sheets** (`QuickActionsSheet.tsx:120-121`) — sheet physics precedent; leave unless user says otherwise.
- **Celebration pulses** (`ZoomIn.duration(300).springify().damping(12)` in `CalendarTimeline/components/ProgressText.tsx`, icon glow pulses in `FullsizeTemplatePreview`) — intentional celebratory bounce.
- **Calendar weeks swipe** (`AnimatedWeeksGrid.tsx`) — paged swipe physics; keep.
- **Comment-only references** to `springify().damping(18)` in `theme/index.ts:149`, `DailyProgressRing.tsx:5`, `SortBottomSheet/constants.ts:19` — update wording to reflect the new pattern.

## Approach

### 1. Add canonical entrance helpers in `src/theme/animations.ts`
Expose a single import that all entrance animations use, so future drift is caught by grep.
```ts
// New exports alongside existing durations/springs:
export const enterEasing = Easing.out(Easing.cubic);
export const enterDuration = 280; // mirrors durations.enter, for readability at call sites
```
Add a short doc comment pointing to the cubic tween as the canonical entrance curve (removing the old `springify().damping(18)` guidance).

### 2. Mass conversion (mechanical)
Rewrite every entrance that looks like:
```ts
FadeInDown.duration(280).springify().damping(18)
FadeInUp.delay(d).springify().damping(18)
ZoomIn.springify().damping(18)
FadeInDown.delay(d).duration(durations.enter).springify().damping(springs.standard.damping)
```
to:
```ts
FadeInDown.duration(280).easing(Easing.out(Easing.cubic))
FadeInUp.delay(d).duration(280).easing(Easing.out(Easing.cubic))
ZoomIn.duration(280).easing(Easing.out(Easing.cubic))
FadeInDown.delay(d).duration(durations.enter).easing(Easing.out(Easing.cubic))
```
Where no duration was set (the `.springify()` was providing its own time), set `.duration(durations.enter)` explicitly to preserve a consistent 280ms.

### 3. Files to convert (complete list)
Grouped by surface. Each line is `path — count (line refs)`:

**Global header + shared chrome**
- `src/components/ScreenHeader/ScreenHeader.tsx` — 2 (17, 18)
- `src/features/habits/HabitsApp.tsx` — 1 (32)
- `src/components/auth/AuthGate.tsx` — 1 (25)
- `src/screens/auth/components/AuthError/AuthError.tsx` — 1 (19)

**Templates / library flow**
- `src/screens/TemplatesScreen/views/SeeAllView.tsx` — 1 (~60)
- `src/screens/TemplatesScreen/components/TemplatesLoadingState.tsx` — 1 (40)
- `src/screens/templates/TemplatePreviewModal/ImportHeader.tsx` — 1 (55)
- `src/components/TemplateCard/components/ScrollRevealWrapper.tsx` — 1 (25) — also normalize 350ms → 280ms

**Habit edit / habits app**
- `src/screens/HabitEditScreen/EditHeader.tsx` — 1 (55)
- `src/screens/HabitEditScreen/HabitEditScreen.tsx` — 1 (113)
- `src/screens/HabitEditScreen/NameInputSection.tsx` — 2 (33, 45)
- `src/screens/HabitEditScreen/SectionLabel.tsx` — 1 (24)
- `src/screens/HabitEditScreen/StreakGoalSection.tsx` — 1 (41)
- `src/screens/HabitEditScreen/CustomizeSection.tsx` — 1 (20)
- `src/features/habits/components/SelectionActionBar/SelectionActionBar.tsx` — 1 (15)
- `src/features/habits/components/BottomActionBar/BottomActionBar.styles.ts` — 1 (7)
- `src/features/habits/components/SortChip/SortChip.tsx` — 1 (91)

**Onboarding**
- `src/screens/onboarding/OnboardingScreen.tsx` — 3 (60, 70, 121)
- `src/screens/onboarding/TemplateGrid.tsx` — 1 (37)
- `src/screens/onboarding/StrengthMeter.tsx` — 1 (29)
- `src/screens/onboarding/ChainVisualization.tsx` — 1 (34)

**Analytics / Character**
- `src/screens/AnalyticsScreen/AnalyticsScreen.tsx` — 6 (84, 93, 99, 109, 120, 130)
- `src/screens/CharacterScreen/CharacterScreen.tsx` — 4 (25–28)
- `src/screens/CharacterScreen/components/CharacterCard.tsx` — 1 (24)
- `src/screens/CharacterScreen/components/AchievementsSection.tsx` — 1 (24)
- `src/screens/CharacterScreen/components/AchievementCard.tsx` — 1 (25)
- `src/screens/CharacterScreen/components/AttributesSection.tsx` — 1 (25)
- `src/screens/CharacterScreen/components/AttributeCard.tsx` — 1 (23)
- `src/screens/CharacterScreen/components/StatCard.tsx` — 1 (17)

**Progress / Insights / Charts**
- `src/components/ProgressSection/ProgressSection.tsx` — 1 (43)
- `src/components/ProgressSectionConsolidated/ProgressSectionConsolidated.tsx` — 1 (65)
- `src/components/ProgressSectionConsolidated/ConsistencyIndexCard/ConsistencyIndexCard.tsx` — 1 (51)
- `src/components/ProgressSectionConsolidated/StreakRecordsAccordion/StreakEmptyState.tsx` — 1 (16)
- `src/components/InsightsSection/InsightsSection.tsx` — 1 (64)
- `src/components/InsightsSection/components/EmptyInsightsState.tsx` — 1 (21)
- `src/components/HabitRankingsList/EmptyState.tsx` — 1 (15)
- `src/components/StrengthHistoryChart/components/EmptyState.tsx` — 1 (16)
- `src/components/TrendLineChart/EmptyState.tsx` — 1 (16)
- `src/components/DailyProgressRing/DailyProgressRing.tsx` — 1 (76) + comment at 5

**Settings**
- `src/components/SettingsModal/AccountPage.tsx` — 1 (21)
- `src/components/SettingsModal/SettingsRow.tsx` — 1 (169)
- `src/components/SettingsModal/SortOptionRow.tsx` — 1 (21)
- `src/components/SettingsModal/SortPicker.tsx` — 1 (21)
- `src/components/SettingsModal/SettingsContent.tsx` — 1 (56)
- `src/components/SettingsModal/StreakRemindersSection.tsx` — 2 (81, 205)

**Modals / empty states / misc**
- `src/components/ArchivedHabitsModal/components/ModalHeader.tsx` — 1 (11)
- `src/components/ArchivedHabitsModal/components/StatsSummaryBar.tsx` — 1 (6)
- `src/components/ArchivedHabitsModal/components/LimitBanner.tsx` — 1 (10)
- `src/components/ArchivedHabitsModal/components/ArchiveSelectionBar.tsx` — 1 (19)
- `src/components/ArchivedHabitsModal/components/EmptyState.tsx` — 1 (7)
- `src/components/PausedHabitsModal/PausedHabitsModal.tsx` — 1 (22)
- `src/components/PausedHabitsModal/PausedHabitCard.tsx` — 1 (32)
- `src/components/DraftRecoveryBanner/DraftRecoveryBanner.tsx` — 1 (63)
- `src/components/EmptyState/useReducedMotionEntry.ts` — 1 (22)
- `src/components/CreateHabitModal/components/TemplateListEmpty.tsx` — 1 (7)
- `src/components/AdvancedOptions/AdvancedOptionsSection.tsx` — 1 (105)
- `src/components/MotivationSystem/Activation/ContextAwareViz/EmptyVizState.tsx` — 1 (21)
- `src/components/MotivationSystem/Rescue/FailureViz/EmptyVizState.tsx` — 1 (15)
- `src/components/NotesSection/VisualizationGuide/GuideHeader.tsx` — 1 (20)
- `src/components/NotesSection/VisualizationGuide/KeyInsightBox.tsx` — 1 (20)
- `src/components/NotesSection/VisualizationGuide/VisualizationCard.tsx` — 1 (29)
- `src/components/NotesSection/VisualizationGuide/VisualizationGuide.tsx` — 1 (74)
- `src/components/VisualizationExercise/components/IntroStep.tsx` — 1 (29)
- `src/components/VisualizationExercise/components/PositiveStep.tsx` — 1 (33)
- `src/components/VisualizationExercise/components/NegativeStep.tsx` — 1 (34)
- `src/components/VisualizationExercise/components/SummaryStep.tsx` — 1 (27)

**Comment-only updates (wording reflects new canonical pattern)**
- `src/theme/index.ts:149`
- `src/components/DailyProgressRing/DailyProgressRing.tsx:5`
- `src/features/habits/components/SortBottomSheet/constants.ts:19`

Approximate total: ~70 files, ~85 call sites.

### 4. Reuse the existing imports
All target files already import `Easing` and `FadeInDown/FadeInUp/FadeIn/ZoomIn` from `react-native-reanimated`, or can trivially add `Easing`. Many already import `durations` from `../../theme/animations`. No new packages needed.

## Verification

### Automated
- `npm run lint` — should pass (no new eslint issues; 100-line rule not affected).
- `npm run typecheck` (or `tsc --noEmit`) — no type regressions.
- Post-conversion grep sanity: `grep -rn "springify().damping" src | grep -v "LinearTransition\|SlideInDown\|SlideInLeft\|SlideInRight\|withSpring\|ZoomIn.duration(300)"` should return only the three comment-only files (and any exclusions listed above).

### Manual smoke (on simulator)
1. **Habit Library** — header, search, goal grid, Popular, Explore-All all enter with identical calm curve. Drill into a category → rows match.
2. **Onboarding** — title + step content + CTAs enter without overshoot.
3. **Analytics** — every card fades/slides in, no spring settle.
4. **Character screen** — all 4 sections enter calmly.
5. **Habit Edit** — header + name + streak goal + customize sections all match.
6. **Settings** — rows and checkmark `ZoomIn` feel calm; button press feedback (withSpring) still responsive.
7. **Archived / Paused modals** — headers and rows match.
8. **Reduced motion** — still respected (existing reducedMotion branches untouched).
9. **Celebrations preserved** — calendar "done" pulse, icon glow pulse, bottom-sheet slide physics all still bouncy.

### Side-by-side
Screenshot the Library header at ~140ms into its entrance vs. the first body section at the same frame — motion curves should be visually indistinguishable aside from offset.

## Critical Files
- Source of truth: `src/theme/animations.ts` — add `enterEasing` export + update comments.
- Highest visual impact: `src/components/ScreenHeader/ScreenHeader.tsx` (used on most screens).
- Highest count: `src/screens/AnalyticsScreen/AnalyticsScreen.tsx` (6 call sites), `src/screens/CharacterScreen/CharacterScreen.tsx` + subcomponents (~8 call sites).

## Out of Scope / Follow-ups
- Reviewing whether `SlideInDown.springify()` on `QuickActionsSheet` and the weeks-swipe physics should also be calmed — deliberately left alone.
- Normalizing durations (some files use 150/180/200/300/350/460ms variants) — this plan preserves existing durations and only replaces the easing.
- Removing the `enableScrollReveal` prop on `TemplateCard` (dead flag) — separate cleanup.
