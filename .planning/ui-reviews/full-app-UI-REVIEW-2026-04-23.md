# Full-App UI Review — Chain Day Habit Tracker

**Audited:** 2026-04-23
**Rubric:** 6-pillar abstract standards (same as 2026-03-19 baseline)
**Screenshots:** Deferred (no `.env.local` available; dev server blocked). Code-only audit this cycle.
**Scope:** 9 screens, ~1,100 TSX files, warm-minimal design system, `src/theme/*` canonical

**Prior:** 2026-03-19 = **17/24**, 2026-04-05 = **21/24**, now **22/24**.

---

## Pillar Scores

| Pillar               | Score  | Key Finding                                                                                                                     |
| -------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| 1. Copywriting       | 4/4    | Strong contextual CTAs; onboarding partial fix (only 2 of N steps have step-specific copy)                                      |
| 2. Visuals           | 3.5/4  | CharacterCard trophy fixed; new surfaces (scrollspy / rank tiles / material tiers) add polish; 30+ non-canonical spring configs |
| 3. Color             | 3.75/4 | 31% drop in raw hex; `colors.accent` light-mode added; Tailwind↔theme aligned                                                   |
| 4. Typography        | 3.5/4  | fontWeight effectively solved (98% drop); icon-size tokens from 0% → 82%; 304 raw fontSize remain                               |
| 5. Spacing           | 3/4    | Off-grid values still present; 26 files use `borderRadius: 9999` instead of `borderRadius.full`                                 |
| 6. Experience Design | 4/4    | State coverage preserved; accessibility strong                                                                                  |

**Overall: 22/24 (+1 vs Apr 5, +5 vs Mar 19).**

---

## Top 3 Priority Fixes

1. **`borderRadius: 9999` workaround in 26 files** — Same intent as the now-fixed `borderRadius: 999` bug, just at larger scale. The theme exports `borderRadius.full = 9999`; these files hardcode the number instead of referencing the token. File:line list in `docs/archive/DESIGN_CONSISTENCY_REVIEW.md` (New-1). One-pass codemod.

2. **Non-canonical spring configs (~30 locations)** — The canonical spring is `damping: 18, stiffness: 150` (or equivalent presets). 11+ locations use custom `damping/stiffness` values and 14+ still use the legacy `Animated.spring({ friction, tension })` API. Symptom: subtly different motion personality per component, most visible when adjacent animations fire together (e.g. `WeeklySummaryCard` vs `CalendarTimeline/CompletionDot`). Remediation: migrate legacy sites to Reanimated + `springs.*` presets from `src/theme/animations.ts`.

3. **304 raw `fontSize` values** — Typography token adoption jumped dramatically this cycle but this is the last big cleanup. Biggest concentrations: `HabitDetailScreen.tsx:100` (only raw `fontWeight: 'N'` left in production code), `NextHabitSuggestion/styles.ts` display sizes (36, 32), `FullsizeTemplatePreview` evidence/footer styles (13, 14, 17), `DetailViewTabButton.tsx:41`. Many map directly to existing tokens — others need new scale entries (e.g. `displayHero: 36` for large numerics).

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)

**Strengths carried over from Apr 5:**

- Destructive action dialogs use specific copy (`DangerZone.tsx:40–59`)
- Auth CTAs action-oriented (`SocialSignInButton.tsx`)
- Error boundaries personalize by screen name (`ScreenErrorFallback.tsx:110`)
- Empty states contextual, especially Analytics numbered "Get Started"

**New this cycle:**

- `HabitDetailScreen` scrollspy tabs labels are contextual ("Calendar", "Strength", "Goals") — appropriate.
- Character screen rank tiles (LoL-style) — labels clean, medal emojis are emotive without being twee.
- `CharacterCard.tsx:67` now uses `{data.recentAchievements.length}` for trophy count (was hardcoded "10" — Mar 19 bug; **FIXED**).
- Habit Library: "Popular" (renamed from "Trending") is clearer user-facing label.

**Partial fix — Mar 19 onboarding finding:**

- `OnboardingScreen.tsx:26` defines `STEP_CTA_LABELS = ['See the Science →', 'Browse Templates →']` with `?? 'Next'` fallback.
  - Steps 0, 1 have specific CTAs ✓
  - Any step beyond index 1 falls back to **"Next"** (the original complaint)
- Skip button visible text still "Skip" — `accessibilityLabel` updated but visible copy not
- Caveat: the newer 13-step questionnaire in `src/screens/questionnaire/` may have its own CTA system. Confirm which flow is active for new users.

Score holds at **4/4** — the copywriting remaining to fix is localized and well-understood.

---

### Pillar 2: Visuals (3.5/4, +0.5)

**Strengths this cycle:**

- `CharacterScreen` rank tiles + medal growth emojis add visual richness without losing hierarchy (`90c04a2ea`)
- Habit Detail scrollspy tabs + pinned parchment pill provide sticky context during long scrolls (`7237e160c`)
- Material tier cross-fade on chain and timeline creates progression visibility (`eb5d44da0`, `507d93c44`, `9fbd1dbe2`)
- Designer-review polish pass (`1338c89c5`) swept buckets A/B/D/E of visual inconsistencies

**Issues:**

- **Non-canonical spring configs (~30)** — The canonical `damping: 18, stiffness: 150` spring in `src/theme/animations.ts` is bypassed by `HabitChainVisualizer`, `WeeklySummaryCard`, `StrengthRing`, `DraggableHabit`, `CreateHabitModal/EnhancedReminderSelector`, `ColorPickerSection`, and others. Full list in `docs/archive/DESIGN_CONSISTENCY_REVIEW.md` (New-2).
- **31 files still use legacy `Animated.Value`** (vs 516 using Reanimated). Mixed animation APIs in the same app create maintenance overhead and subtle motion-personality drift.
- **`GoalWhyAnchor` parchment pill** hardcodes warm palette (`#FFF5E8`, `#FED7AA`, `#B45309`, `#44312A`). Deliberate aesthetic choice, but creates a palette not expressed in tokens. Acceptable for light-mode-only but blocks future dark-mode unlock.

Score **3.5/4** — the polish pass clearly moved the needle; the remaining work is mostly animation infrastructure.

---

### Pillar 3: Color (3.75/4, +0.25)

**Strengths:**

- `useThemeColors` now in **530 files** (+13% from Apr 5).
- Raw hex down **31%** (1,101 → 757).
- `colors.accent` now defined in both `lightColors` (#059669, `darkColors.ts:177`) and `darkColors` (#34D399, `darkColors.ts:76`) — Mar 19 undefined-in-light-mode bug **FIXED**. `WeeklySummaryCard`, `AnalyticsScreen/EmptyState`, `ConvexConnectionGuard` etc. now render correctly.
- Tailwind config aligned: `card.DEFAULT = #EDEAE5` (matches theme), `borderRadius.card = 16px` (matches `borderRadius.large`). Tailwind `accent` key removed entirely (only `accent-muted` remains) — semantic simplification.
- SyncStatus module reached ~95% token adoption (2 residual `ICON_COLOR` constants).

**Issues:**

- **757 raw hex values remain** — mostly in older components; the long tail of Wave 4.
- **`GoalWhyAnchor` / `GoalCoachLine` / `AchievementCard` / `CustomColorButton`** — five call sites with hardcoded hex, some domain-justified, some not. Full list in `docs/archive/DESIGN_CONSISTENCY_REVIEW.md` (New-4 through New-8).
- **Inline shadow props: 447** (+5% from Apr 5, the only metric that regressed). `shadows.*` token adoption grew only from 77 → 83 files. Shadow system is well-designed but widely ignored.

Score **3.75/4** — any cycle that unifies shadow tokens lifts this to 4/4.

---

### Pillar 4: Typography (3.5/4, +1.0)

The biggest-moving pillar of the cycle.

**Dramatic improvements:**

- `fontWeight: 'N'` raw: 229 → **5** (-98%)
- `fontWeights.*` refs: 56 → **363** (+548%)
- `typography.*` refs: 277 → **472** (+70%)
- `iconSizes.*` refs: 0 → **392** (icon sizing effectively joined the token system in a single cycle)

**Named remediations:**

- `CharacterCard.tsx` — now uses typography tokens (was flagged Mar 19)
- `ErrorBoundary/errorFallbackStyles.ts` — imports `typography, fontWeights`
- `NextHabitSuggestion/styles.ts` — imports `typography, fontWeights`
- 4 of 5 remaining raw `fontWeight` violations are in `CelebrationExample.tsx` (example file, not production)

**Remaining:**

- **304 raw `fontSize`** — the last systematic cleanup. Common deviations: `13, 14, 15, 16, 18, 36`.
- **`HabitDetailScreen.tsx:100`** — the lone production-code raw `fontWeight: '600'`.
- **155 custom `text-[Npx]` Tailwind classes** (down from 192) — Wave 2 codemod candidate.

Score **3.5/4** — clear path to 4/4 with Wave 2's fontSize/text-[Npx] migrations.

---

### Pillar 5: Spacing (3/4, unchanged)

**Strengths:**

- `spacing.*` refs: 419 → **514** (+23%)
- `borderRadius.*` refs: 193 → **328** (+70%)
- Raw `borderRadius: N`: ~180 → **110** (-39%)

**Issues (mostly carried from Apr 5):**

- **`borderRadius: 9999` in 26 files** — new-ish observation, same intent as Apr 5's `borderRadius: 999` bug at 10× scale. One-pass codemod (New-1 in main review).
- Off-grid values still scattered: `paddingHorizontal: 14`, `paddingVertical: 10`, `gap: 6`, `padding: 20`. None are visually egregious; they accumulate.
- `FullsizeTemplatePreview/styles/hero.styles.ts:71` — new off-grid `paddingHorizontal: 14` from the advanced-options PR.

**Button padding variant sprawl** (Apr 5 Wave 3):

- `px-4` (106), `px-3` (44), `py-3` (48), `py-2` (32), `py-4` (30), `py-0.5` (29), `px-2` (27), etc.
- Still 10+ distinct combinations. No architectural `Button` variants shipped this cycle.

Score **3/4** — requires Wave 3 architectural work (size variants) to move up.

---

### Pillar 6: Experience Design (4/4, unchanged)

**Loading states:** `HabitsPageSkeleton`, `HabitEditSkeleton`, `AnalyticsScreenSkeleton`, `ChartLoadingSkeleton`, `TemplatesLoadingState`, `ShimmerBox`, `SkeletonCard` — all present. New-cycle addition: `TemplatesLoadingState.tsx` was added with calm entrance animations.

**Error boundaries:** All screens wrap in `ScreenErrorBoundary` with screen-name personalization. Retry + optional Go Back actions. Sentry integration intact.

**Empty states:** 17 distinct implementations (fragmentation note in CCP-3, not an EX score regression since coverage is comprehensive).

**Disabled states:** Auth buttons set `accessibilityState={{ busy: isLoading, disabled: isDisabled }}` with `opacity-40`. Form validation (e.g. EditHeader "Save" disabled when `habitName.trim().length < 2`) consistent.

**Destructive confirmation:** Two-step Alert.alert for habit delete/archive. Batch delete modal. Archive undo toast. All preserved.

**Haptic feedback:** 121 files. Contextual `triggerSelection`, `triggerWarning`, `triggerSuccess` patterns observed throughout.

**Reduced motion:** `useReducedMotion` in 23 files directly; `reduceMotion` checks propagated widely (203+ references per Mar 19 count). Animations conditionally `undefined` when reduce-motion is active.

Score **4/4** — no regressions.

---

## Registry Safety

`components.json` present, schema `https://ui.shadcn.com/schema.json` (official shadcn registry only). No third-party blocks. No flags.

---

## Files Audited (Key Subset)

**Theme system (confirmed canonical):**

- `src/theme/index.ts`, `colors/core.ts`, `colors/semantic.ts`, `darkColors.ts`
- `src/theme/typography.ts`, `spacing.ts`, `animations.ts`, `iconSizes.ts`
- `src/theme/ThemeContext.tsx` (force-locked light mode confirmed)

**New surfaces (post-Apr 5):**

- `src/screens/HabitDetailScreen/**` (scrollspy + parchment pill)
- `src/screens/CharacterScreen/**` (rank tiles)
- `src/components/CalendarTimeline/**` (material tier cross-fade)
- `src/components/HabitChainVisualizer/**` (growth-curve tiers)
- `src/components/CreateHabitModal/components/ColorPickerSection/**` (swatch fix)
- `src/components/FullsizeTemplatePreview/**` (advanced options)
- `src/screens/TemplatesScreen/**` (Habit Library animations)

**Cross-cutting (grep-based):** 1,100+ TSX files, patterns listed in `docs/archive/DESIGN_CONSISTENCY_REVIEW.md` tokenization table.
