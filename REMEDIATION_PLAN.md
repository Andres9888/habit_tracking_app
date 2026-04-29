# Design Consistency Remediation Plan

**Date:** 2026-04-23
**Source audit:** `DESIGN_CONSISTENCY_REVIEW.md` (2026-04-23, 22/24)
**Companion:** `.planning/ui-reviews/full-app-UI-REVIEW-2026-04-23.md` (6-pillar)
**Status:** Plan only — no implementation.

Each wave ships with explicit "Done when" criteria tied to token-adoption counts so progress is measurable.

---

## Wave 0 — Visual Bug Fixes & Dead Code (< 1 hour)

Low-risk, targeted, measurable.

### 0.1 Remove the lone raw `fontWeight: '600'` in production code

- **File:** `src/screens/HabitDetailScreen/HabitDetailScreen.tsx:100`
- **Change:** `titleStyle={{ fontSize: 17, fontWeight: '600', letterSpacing: -0.2, lineHeight: 22 }}` → `titleStyle={{ ...typography.button, letterSpacing: -0.2 }}` (or equivalent tokenized form).
- **Done when:** `grep -rnE "fontWeight:\s*['\"][0-9]" src --include='*.tsx' | grep -vE '(CelebrationExample|__tests__)'` returns zero lines.

### 0.2 Remove `@expo/vector-icons` dependency if truly unused

- **Check:** `grep -rlE "from '@expo/vector-icons'" src` returns 0.
- **Action:** Remove `@expo/vector-icons` from `package.json` dependencies (currently `^15.0.2`).
- **Done when:** `npm install` succeeds; app build runs without regression; bundle size decreases.
- **Risk:** Very low — already unused per grep. Verify there's no dynamic require or iOS-native dependency first.

### 0.3 Delete legacy `src/screens/templates/styles/` — **CORRECTED 2026-04-24**

**Status:** Removed from Wave 0 — not dead code. Initial scoping (absolute-path grep only) missed that `src/screens/templates/templatesScreenStyles.ts` is a barrel re-exporting from `./styles`, and **12 files under `src/screens/TemplatesScreen/` consume that barrel** (SearchResults, SearchBar, TemplatesEmptyState, ScrollShadows, CategoryHeader, FilterControls, SortDropdown, TabBar, TemplatesListEmpty, MainBrowseView, CategorySearchView, TemplatesList).

**Two additional consumers of `src/screens/templates/` exist:**
- `src/components/CollapsibleCategorySection/CollapsibleCategorySection.tsx` imports `CATEGORY_COLORS`, `DEFAULT_CATEGORY_COLORS` from `templates/constants`
- `src/screens/TemplatesScreen/*` (12 files) imports via `templates/templatesScreenStyles.ts` barrel

**Reclassified to Wave 3/4** as a consumer-migration + folder consolidation. True Wave 0 scope was a false positive.

**Secondary win remains valid** (20 raw values scattered in legacy folder), but now gated on the migration.

---

## Wave 1 — High-ROI Quick Wins (< 1 day each)

### 1.1 `borderRadius: 9999` → `borderRadius.full` codemod

- **Scope:** 26 call sites listed in `DESIGN_CONSISTENCY_REVIEW.md` New-1.
- **Codemod:** find-and-replace (manual or `jscodeshift`) of `borderRadius: 9999` → `borderRadius: borderRadius.full`. Ensure import at top of each file.
- **Validation:** visual diff of pill shapes at multiple widths (should be identical — `9999` and token value are the same number).
- **Done when:** `grep -rnE 'borderRadius:\s*9999\b' src --include='*.ts' --include='*.tsx' | grep -v theme | wc -l` returns 0.

### 1.2 Shadow token adoption — highest-traffic files first

- **Current:** 83 files use `shadows.*`, 447 files use inline shadow props. Adoption ~15% (flat since Apr 5).
- **Scope:** Migrate the top 20 highest-traffic files (by app-time screen frequency). Candidates: `HabitCard`, `TodaysFocusCard`, `CalendarTimeline`, `ChainVisualizer`, `Button`, any card with elevation.
- **Target:** 83 → 200 files (~35% adoption).
- **Done when:** `grep -rlE 'shadows\.' src --include='*.ts' --include='*.tsx' | wc -l` ≥ 200 AND inline shadow-prop count drops below 300.

### 1.3 Remaining `ICON_COLOR` constants in SyncStatus → theme tokens

- **Files:**
  - `src/components/SyncStatus/OfflineIndicator/OfflineIndicator.tsx` — `const ICON_COLOR = '#a8a29e'` → `colors.gray[400]`
  - `src/components/SyncStatus/SyncingIndicator/SyncingIndicator.tsx` — `const ICON_COLOR = '#d97706'` → `colors.warning` (which resolves to `#D97706` in light mode)
- **Done when:** `grep -rnE "#[0-9A-Fa-f]{6}" src/components/SyncStatus/` returns 0.

### 1.4 `CustomColorButton.tsx:60` hardcoded border color

- **File:** `src/components/CreateHabitModal/components/ColorPickerSection/CustomColorButton.tsx:60`
- **Change:** `borderColor: '#a8a29e'` → `borderColor: colors.gray[400]` (via `useThemeColors()`)
- **Done when:** File has `useThemeColors` import and no hardcoded hex.

### 1.5 Raw icon sizes not in token scale (14, 18, 22, 28) → nearest token

- **Current:** 86 raw `size={N}` remain. Values typically: 14 (→ `iconSizes.small=16`), 18 (→ `iconSizes.medium=20`), 22/28 (new token variants or `iconSizes.large=24` / `.xl=32`).
- **Action:** decide one-way migration (snap to nearest token) vs. extending token scale with a couple of odd values. Recommend snap to nearest.
- **Done when:** raw `size={N}` count < 20 AND `iconSizes.*` reference count > 450.

---

## Wave 2 — Systematic Token Migrations (1–3 days each)

### 2.1 `fontSize: N` migration to `typography.*`

- **Current:** 304 raw `fontSize: N` across ~110 files.
- **Approach:** manual review (many need judgment — 15/16/18 could each map differently). Start with the highest-count files:
  - `NextHabitSuggestion/styles.ts` (raw 36, 32)
  - `FullsizeTemplatePreview/styles/*` (13, 14, 17)
  - `ErrorBoundary/errorFallbackStyles.ts` (34 emoji, 13)
  - `CharacterScreen/components/AttributeCard.tsx` (16 at L122, L139)
  - `HabitDetailScreen/components/DetailViewTabButton.tsx:41` (13)
- **Token scale for reference:** `displayLarge=34, heading1=22, heading2=22, heading3=20, body=17, bodySmall=14, caption=13, tabBar=10`. Values `15, 16, 18, 32, 36` don't map cleanly — decision needed: snap or extend scale.
- **Done when:** raw `fontSize: N` count < 100; `typography.*` references > 600.

### 2.2 Custom `text-[Npx]` Tailwind classes → standard sizes

- **Current:** 155 custom classes (down from 192).
- **Approach:** codemod. Map to nearest Tailwind standard size or migrate to `<Text style={typography.*}>` pattern.
- **Done when:** `text-[Npx]` count < 50.

### 2.3 Canonical spring migration

- **Current:** ~30 non-canonical spring configs (both Reanimated `damping/stiffness` and legacy `Animated.spring` `friction/tension`).
- **Approach:** use `springs.*` presets from `src/theme/animations.ts`. Canonical personas: `standard`, `button`, `micro`, `snappy` (all `damping:18, stiffness:150`), plus specialized `bottomSheet`, `gesture`, `celebration`, `exit`.
- **Secondary benefit:** also clears most of the 31 legacy `Animated.Value` sites (migrating spring config often requires Reanimated migration).
- **Validation:** motion QA — compare before/after for each touched component. Minor personality drift is expected & desirable.
- **Done when:** all `withSpring` / `Animated.spring` configs reference `springs.*` presets or pass canonical values; `grep -rnE '(friction|tension):\s*[0-9]+' src --include='*.ts' --include='*.tsx' | grep -v theme | wc -l` = 0.

### 2.4 `borderRadius: N` remainder

- **Current:** 110 raw + 328 token references.
- **Scope:** sweep the raw values into tokens (`xs=4, small/chip=8, medium/button=12, large/card=16, xl=24, full=9999`).
- **Done when:** raw `borderRadius: N` count < 40.

### 2.5 Remaining raw hex cleanup (long-tail)

- **Current:** 757 raw hex values (down from 1,101).
- **Scope:** component files outside the "legitimate" constants exemption list.
- **Approach:** prioritize by file frequency. Many single-use hex values are probably fine (e.g., a specific gradient endpoint); the ones that matter are backgrounds, borders, text colors.
- **Done when:** raw hex count < 400 (~65% further reduction).

---

## Wave 3 — Architectural (multi-day)

### 3.1 Button size variants — shared primitive

- **Problem:** 10+ distinct `px-N`/`py-N` combinations; 290 files use inline `Pressable`/`TouchableOpacity`.
- **Target state:** A `Button` (or `InteractiveTile`) primitive with `size: 'sm' | 'md' | 'lg'` and `variant: 'primary' | 'secondary' | 'ghost' | 'icon'`. Padding tokens already exist in `componentSpacing.button`.
- **Migration strategy:** opt-in per component. New code uses primitive; existing code migrated when touched for other reasons.
- **Done when:** new `Button` primitive shipped with 3 size variants × 4 style variants; documented in `src/theme/README.md`; 10+ migrations landed.

### 3.2 Empty state consolidation

- **Problem:** 17 distinct `EmptyState` implementations.
- **Approach:**
  1. Audit the 17 and categorize (chart-specific / form-specific / screen-level / modal-level).
  2. Extend the canonical `src/components/EmptyState/EmptyState.tsx` with variant props.
  3. Migrate simple cases (`PausedEmptyState`, `ArchivedEmptyState`, `GoalTabEmptyState`, `HabitRankingsList/EmptyState`) first.
  4. Leave chart-specific ones (`StrengthTimelineChart/EmptyStates`, etc.) alone or extract to a dedicated `ChartEmptyState`.
- **Done when:** `find src -iname '*EmptyState*.tsx' | wc -l` drops from 17 → ≤10; canonical `EmptyState` covers the simple cases.

### 3.3 Legacy `Animated.Value` → Reanimated migration

- **Current:** 31 files with `new Animated.Value(`.
- **Overlaps heavily with Wave 2.3** (spring migration). Do as one pass.
- **Done when:** `grep -rlE 'new Animated\.Value\(' src --include='*.ts' --include='*.tsx' | wc -l` < 5.

### 3.4 NativeWind + StyleSheet dual system — decision

- **Problem:** 300+ files mix both styling systems; another 80+ use only className.
- **Not a mechanical fix.** Requires a decision conversation:
  - **Option A:** pick one system (likely StyleSheet + tokens) and deprecate className in new code.
  - **Option B:** keep both but establish boundary rules (className for layout/Tailwind semantic utilities, StyleSheet for component-specific styling, theme tokens always win over Tailwind).
  - **Option C:** migrate to a different system (e.g. `nativewind v4`, `unistyles`, `tamagui`) — largest lift.
- **Done when:** `docs/DESIGN_SYSTEM.md` (or similar) documents the decision; new code follows; linter enforces rules where possible.

---

## Wave 4 — Long-Tail Cleanup

### 4.1 Off-grid spacing values

- **Examples:** `paddingHorizontal: 14`, `paddingVertical: 10`, `gap: 6`, `padding: 20`, `paddingHorizontal: 18`, `padding: 28`.
- **Approach:** case-by-case — some are intentional (e.g., 14 for tight icon buttons), others are drift. Snap drift to grid; keep intentional as-is with a comment explaining why.
- **Done when:** named call sites in `DESIGN_CONSISTENCY_REVIEW.md` (inherited from Mar 19 finding list) are either fixed or annotated as intentional.

### 4.2 Button padding standardization (follows Wave 3.1)

- **Done when:** fewer than 5 distinct `px-N`/`py-N` combinations remain outside the `Button` primitive.

### 4.3 Onboarding CTA completion

- **Decision first:** which onboarding flow is live — legacy `OnboardingScreen.tsx` or the new 13-step `src/screens/questionnaire/`?
- **If legacy is live:** extend `STEP_CTA_LABELS` to cover every step; change "Skip" visible text to "I'll explore later" per Mar 19 finding.
- **If questionnaire is live:** audit the questionnaire for the same pattern; legacy can be deleted.
- **Done when:** every step has step-specific CTA copy OR legacy onboarding deleted.

### 4.4 `GoalWhyAnchor` / `GoalCoachLine` semantic palette tokens

- **When:** before dark-mode unlock. Currently acceptable for light-mode-only shipping.
- **Action:** introduce `colors.parchment.*` (5 values) and `colors.tone.*` (6 tone palettes × 3–4 shades each) semantic namespaces. Migrate call sites.
- **Done when:** `GoalWhyAnchor.tsx`, `GoalCoachLine.tsx`, and any other motivation-layer components have zero hardcoded hex.

### 4.5 `CelebrationExample.tsx` — decide fate

- **Current:** example file with 4 raw `fontWeight: 'N'` values. Not production code, but contributes to scan noise and teaches the wrong pattern.
- **Options:**
  - Migrate to tokens (example should model best practice).
  - Move under `__examples__/` so scans exclude it.
  - Delete if no longer referenced.
- **Done when:** `grep -rnE "fontWeight:\s*['\"][0-9]" src --include='*.ts' --include='*.tsx' | grep -vE '(__tests__)'` returns zero lines across ALL of production + examples.

---

## Wave Dependency Graph

```
Wave 0 ──┬──→ Wave 1 ──┬──→ Wave 2 ──┬──→ Wave 4
         │             │             │
         └──→ Wave 3 ←─┴─────────────┘
              (architectural, any time after W0)
```

- **W0** is independent and low-risk — can ship immediately.
- **W1** builds on the counts from W0 but has no hard dependency.
- **W2** is most efficient after W1 closes out the highest-adoption-velocity gaps.
- **W3** (architectural) can ship in parallel with any wave; its scoping conversation should start during W1 so it's ready when capacity opens.
- **W4** depends on W2 & W3 decisions.

---

## Overall Progress Targets

| Metric | Apr 23 (now) | After W0 | After W1 | After W2 | After W3+W4 |
|--------|-------------|---------|---------|---------|-------------|
| Raw `fontSize: N` | 304 | 303 | ~280 | **<100** | <50 |
| Raw `fontWeight: 'N'` | 5 (4 in examples) | **0 in prod** | 0 in prod | 0 total | 0 |
| `iconSizes.*` adoption | 82% | 82% | **>95%** | >95% | >98% |
| `borderRadius: 9999` | 26 | 17 (W0.3) | **0** (W1.1) | 0 | 0 |
| `shadows.*` adoption | 15% | 15% | **35%** | 45% | 60%+ |
| Non-canonical springs | ~30 | 30 | 30 | **<5** | 0 |
| Raw hex (excl. legit) | 757 | 740 | 720 | **<600** | <400 |
| Overall score | 22/24 | 22/24 | 22.5/24 | **23/24** | 24/24 |

---

## Verification After Each Wave

Run the same grep commands that produced the metrics in `DESIGN_CONSISTENCY_REVIEW.md` and append a row to the "Token Adoption" table showing the new numbers. The audit table becomes a progress log.
