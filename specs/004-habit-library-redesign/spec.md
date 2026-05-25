# 004 — Habit Library Workflow Redesign

## 1. Overview

Redesign the habit library (`TemplatesScreen`) so every user segment — first-time, returning, and power — sees a landing tuned to their intent, undecided users get a 3-question guided picker that recommends habits with explainable scoring, the habit detail screen is restructured as a confidence pitch (promise → benefits → cue → identity), and post-add success suggests a clear next step. The goal is to reduce time-to-first-add, help users who don't know what they want, and increase confidence in the chosen habit — all without breaking existing flows.

## 2. Success Criteria

| Goal | Metric | Target |
|---|---|---|
| Fastest path to a relevant habit | Time-to-first-add from library open; taps-to-add | Decrease vs baseline (measured via `library_open` → `library_add` timestamps) |
| Help users who don't know | % of users who start guided flow; guided flow completion rate | ≥10% of library sessions trigger guide; ≥60% complete it |
| Confidence in the choice | % opening detail before add; habit deletion rate within 7d of import | Increase preview-before-add %; decrease 7d deletion rate |
| Personalized per segment | Distinct first-screen for new / returning / power users | 3 variants rendering correctly per segmentation rules |

## 3. Phased Implementation Plan

### Phase 0 — Content Backfill (~1 day)

Fill template data gaps so the confidence screen has content to render. Ensure all 19 schema categories have entries in `categoryMeta.ts`.

### Phase 0.5 — Navigation Stack Refactor (~1 day)

Replace the flat `goBack()`-to-main pattern with a proper view history stack (array-based, push/pop). This is a structural prerequisite for Phases 2-4 which introduce deeper navigation paths.

### Phase 1 — Segment-Aware Landing (~2-3 days)

Add `LandingVariant` switch inside `MainBrowseView` and `HelpMeChoosePill`.

### Phase 2 — Habit Detail Confidence Restructure (~2-3 days)

Replace current `TemplatePreviewModal` internals with confidence-first layout. Includes `handleTemplatePreview` → `openDetail` migration.

### Phase 3 — Guided Picker Flow (~2-3 days)

New `GuidedPickerView` sub-view with progressive results (show after Q1, refine with Q2/Q3) + shared scoring utility.

### Phase 4 — Success "What's Next?" Surface (~1-2 days)

Enhance post-import feedback with contextual next-step recommendations. Replaces the toast path when active.

### Phase 5 — Instrumentation Events (~1 day)

Add all `library_*` analytics events.

### Phase 6 — Polish, Edge Cases, Accessibility (~1-2 days)

Screen reader labels, reduced motion, offline states, error boundaries.

---

## 4. Per-Phase Detailed Spec

---

### Phase 0: Content Backfill

#### Problem

The confidence detail screen (Phase 2) depends on template fields that are mostly empty in the seed data: `suggestedWhy`, `suggestedIdentity`, `benefits`, `suggestedCue`, `startSmallVersion`, `tips`.

Additionally, `categoryMeta.ts` is missing entries for 3 of the 19 categories defined in the schema's category literal union. All categories must be present for the guided picker and segmentation logic to work correctly.

#### Files to Create/Modify

| Action | Path |
|--------|------|
| Create | `src/screens/TemplatesScreen/data/templateContentFallbacks.ts` |
| Modify | `src/screens/TemplatesScreen/data/categoryMeta.ts` |
| Modify | `convex/seedTemplates.ts` (or wherever seed data lives — if inline, update there) |

#### Implementation

1. **Derivation fallback utility** — `templateContentFallbacks.ts`:

```ts
import type { Doc } from '../../../../convex/_generated/dataModel';
import { CATEGORY_META } from './categoryMeta';

export interface TemplateConfidenceContent {
  promise: string;
  benefits: string[];
  cue: string;
  startSmall: string;
  identity: string;
}

export function deriveConfidenceContent(
  template: Doc<'templates'>
): TemplateConfidenceContent {
  const cat = CATEGORY_META[template.category];
  return {
    promise: template.suggestedWhy
      ?? template.description,
    benefits: template.benefits?.length
      ? template.benefits
      : [template.scientificReference],
    cue: template.suggestedCue
      ?? `After I ${template.category === 'morning_routine' ? 'wake up' : 'sit down'}, I will ${template.name.toLowerCase()} for ${template.estimatedMinutes ?? 2} minutes.`,
    startSmall: template.startSmallVersion
      ?? `Just do ${template.name.toLowerCase()} for 1 minute.`,
    identity: template.suggestedIdentity
      ?? `I am a person who ${cat?.subtitle?.toLowerCase() ?? 'builds lasting habits'}.`,
  };
}
```

2. **Backfill seed data** — For every template in the seed script, populate `suggestedWhy`, `suggestedCue`, `suggestedIdentity`, `startSmallVersion`, and `benefits` with concrete per-template content. Use the derivation heuristic above only as a runtime fallback for any templates that still lack fields after the backfill.

3. **Backfill missing CATEGORY_META entries** — Cross-reference the category literal union in `convex/schema.ts` against the keys in `categoryMeta.ts`. Add entries for the 3 missing categories (determine which are missing by checking the schema's union: e.g., `breathing`, `recovery`, `longevity` or similar — the implementer must verify the exact 3). Each entry needs: `label`, `subtitle`, `icon`, `color`.

#### Acceptance Criteria

- Every template in the seed data has non-empty `suggestedWhy`, `suggestedCue`, `suggestedIdentity`, `startSmallVersion`.
- `benefits` has at least 2 items per template (or 1 item derived from `scientificReference`).
- `deriveConfidenceContent()` returns plausible strings for any template, never empty strings.
- No schema changes needed — all fields already exist as optional in `convex/schema.ts`.
- All 19 categories from the schema literal union have corresponding entries in `categoryMeta.ts`.

#### Edge Cases

- Templates with `scientificReference` as only content source — fallback should still produce a readable benefit string.
- New templates added later without these fields — the fallback function handles gracefully.
- Categories with no templates — `CATEGORY_META` entry still required for guided picker chip grid.

#### Testing

- Unit test `deriveConfidenceContent` with a template that has all fields, and one that has none.
- Verify all 19 schema categories are present in `CATEGORY_META` keys (static assertion or test).

---

### Phase 0.5: Navigation Stack Refactor

#### Problem

The current `useViewNavigation` uses a flat `goBack()`-to-main pattern — any back action returns directly to `{ type: 'main' }`. With the addition of `GuidedPickerView` and `HabitDetailView` (which can be reached from multiple parent contexts: goal drill, category, search, guided picker), flat navigation breaks the user's mental model. A detail opened from guided picker should go back to the guided picker, not main.

#### Files to Create/Modify

| Action | Path |
|--------|------|
| Create | `src/screens/TemplatesScreen/hooks/useViewStack.ts` |
| Modify | `src/screens/TemplatesScreen/hooks/useViewNavigation.ts` |
| Modify | `src/screens/TemplatesScreen/views/renderSubView.tsx` |
| Modify | `src/screens/TemplatesScreen/TemplatesScreen.tsx` |

#### Hook Interface

```ts
export interface ViewStackResult {
  current: TemplateViewState;
  canGoBack: boolean;
  push: (view: TemplateViewState) => void;
  pop: () => void;
  reset: () => void;
}

export function useViewStack(
  initialView?: TemplateViewState
): ViewStackResult;
```

**Implementation:**

```ts
export function useViewStack(
  initialView: TemplateViewState = { type: 'main' }
): ViewStackResult {
  const [stack, setStack] = useState<TemplateViewState[]>([initialView]);

  const current = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  const push = (view: TemplateViewState) =>
    setStack(prev => [...prev, view]);

  const pop = () =>
    setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);

  const reset = () => setStack([initialView]);

  return { current, canGoBack, push, pop, reset };
}
```

#### Migration from useViewNavigation

`useViewNavigation` is refactored to wrap `useViewStack`:

- `goBack()` → calls `pop()` (returns to actual previous view, not always main)
- `openGoalDrill(id)` → calls `push({ type: 'goal', goalId: id })`
- `openCategoryDrill(id)` → calls `push({ type: 'category', categoryId: id })`
- `openDetail(templateId, sourcePath)` → calls `push({ type: 'detail', templateId, sourcePath })`
- `openGuidedPicker()` → calls `push({ type: 'guidedPicker' })`
- `resetToMain()` → calls `reset()`

#### renderSubView Contract Update

`renderSubView.tsx` switches on `viewStack.current.type`. All sub-views receive `onBack: viewStack.pop` instead of the current `goBack`-to-main handler.

Sub-views that must use this stack:
- `GoalDrillView`
- `CategoryDrillView`
- `StarterHabitsView`
- `SeeAllView`
- `GuidedPickerView` (Phase 3)
- `HabitDetailView` (Phase 2)

#### Acceptance Criteria

- Navigating Main → Category → Detail → Back returns to Category (not Main).
- Navigating Main → GuidedPicker → Detail → Back returns to GuidedPicker.
- `canGoBack` is `false` when on the main view.
- `reset()` clears the entire stack back to main (used on modal close).
- No regressions in existing GoalDrill/Category/SeeAll/Starter navigation.
- Stack never grows unbounded — max depth is capped at 10 (push no-ops beyond that).

#### Edge Cases

- Deep stack (user drills goal → category → detail → back → another detail) — works as expected.
- Screen rotation during navigation — stack persists (it's in-memory state).
- Modal close while deep in the stack — `reset()` on unmount.

#### Testing

- Unit test `useViewStack`: push 3 views, pop returns to correct parent.
- Unit test: push beyond cap (10) does not grow stack.
- Integration: verify back button behavior across 3+ depth levels.

---

### Phase 1: Segment-Aware Landing

#### Files to Create/Modify

| Action | Path |
|--------|------|
| Create | `src/screens/TemplatesScreen/hooks/useUserSegment.ts` |
| Create | `src/screens/TemplatesScreen/components/HelpMeChoosePill/HelpMeChoosePill.tsx` |
| Create | `src/screens/TemplatesScreen/components/HelpMeChoosePill/index.ts` |
| Modify | `src/screens/TemplatesScreen/views/MainBrowseView.tsx` |
| Modify | `src/screens/TemplatesScreen/views/MainBrowseView.types.ts` |
| Modify | `src/screens/TemplatesScreen/views/BrowseSections.tsx` |
| Modify | `src/screens/TemplatesScreen/TemplatesScreen.tsx` |
| Modify | `src/screens/TemplatesScreen/hooks/useTemplatesScreenProps.ts` |

#### Component API

**`useUserSegment` hook:**

```ts
export type BaseSegment = 'first_time' | 'returning' | 'power';
export type LandingVariant = 'landing-new-user' | 'landing-returning-user' | 'landing-power-user';

export interface UserSegmentResult {
  baseSegment: BaseSegment;
  isLost: boolean;
  landingVariant: LandingVariant;
  helpMeChooseCopy: string;
}

export function useUserSegment(input: {
  userHabitCount: number;
  isPremiumUser: boolean;
}): UserSegmentResult;
```

Segmentation logic (from `segmentation-rules.md`):

| Segment | Rule |
|---------|------|
| `power` | `isPremiumUser === true` OR `userHabitCount >= 6` |
| `returning` | `userHabitCount >= 2 AND userHabitCount <= 5` |
| `first_time` | `userHabitCount <= 1` OR unknown |

`isLost` is deferred to Phase 5 (requires dwell tracking). For Phase 1, `isLost` is always `false`.

**`HelpMeChoosePill` component:**

```ts
interface HelpMeChoosePillProps {
  label: string;   // "Not sure? 30-sec guide" | "Help me choose" | "Need inspiration?"
  onPress: () => void;
}
```

Renders as a fixed-position pill at bottom-right of the screen. Uses `Pressable` + `Animated.View` with subtle pulse animation on first render.

**`MainBrowseView` changes:**

Add `landingVariant` and `segment` to `MainBrowseViewProps`. Switch header title/subtitle based on variant:

| Variant | Title | Subtitle |
|---------|-------|----------|
| `landing-new-user` | "Start one small habit today" | "Pick one that feels easy — you can always add more." |
| `landing-returning-user` | "What do you want to work on?" | "Pick a path — habits proven to work." |
| `landing-power-user` | "Find your next upgrade" | "Search, filter, and add in seconds." |

> **Note:** New users see "Start one small habit today" — low-pressure copy that reduces choice paralysis. Returning users keep "What do you want to work on?" since they have demonstrated intent by already having habits.

**`BrowseSections` changes:**

Add `landingVariant` prop. Rearrange section order:

| Variant | Section Order |
|---------|---------------|
| `landing-new-user` | `StarterHabitList` (or `StartHereCard`) → `BrowseCategoriesLink` |
| `landing-returning-user` | `GoalCollectionGrid` → `PopularSection` → `BrowseCategoriesLink` |
| `landing-power-user` | `PremiumPacksSection` → `GoalCollectionGrid` (compact) → `PopularSection` (reduced) → `BrowseCategoriesLink` |

The existing `isFirstTimeUser` boolean branch is replaced by a `switch` on `landingVariant`.

#### Data Dependencies

- `useTemplatesData().userHabitCount` — already available.
- `useTemplatesData().isPremiumUser` — already available via `useMainBrowseData`.

#### Acceptance Criteria

- `userHabitCount <= 1` → new-user landing renders with `StarterHabitList` and header "Start one small habit today".
- `userHabitCount` 2-5 → returning landing renders `GoalCollectionGrid` + `PopularSection` with header "What do you want to work on?".
- `isPremiumUser` or `userHabitCount >= 6` → power landing renders `PremiumPacksSection` first.
- `HelpMeChoosePill` visible on all variants. Pressing it navigates to guided picker (wired in Phase 3; no-op handler initially).
- Existing search, filter, and drill-down flows remain functional.

#### Edge Cases

- `userHabitCount` undefined or `null` → defaults to `first_time`.
- `isPremiumUser` undefined → treated as `false`.
- Empty template list → existing `TemplatesEmptyState` still renders.
- Error computing segment → fall back to `landing-returning-user`.

#### Testing

- Unit test `useUserSegment` with boundary values: 0, 1, 2, 5, 6, 10, premium=true with count=0.
- Snapshot or visual regression for each variant layout.

---

### Phase 2: Habit Detail Confidence Restructure

#### Files to Create/Modify

| Action | Path |
|--------|------|
| Create | `src/screens/TemplatesScreen/views/HabitDetailView/HabitDetailView.tsx` |
| Create | `src/screens/TemplatesScreen/views/HabitDetailView/HabitDetailView.types.ts` |
| Create | `src/screens/TemplatesScreen/views/HabitDetailView/HabitDetailView.hooks.ts` |
| Create | `src/screens/TemplatesScreen/views/HabitDetailView/index.ts` |
| Create | `src/screens/TemplatesScreen/views/HabitDetailView/components/ConfidencePromiseCard.tsx` |
| Create | `src/screens/TemplatesScreen/views/HabitDetailView/components/FeasibilityMetaRow.tsx` |
| Create | `src/screens/TemplatesScreen/views/HabitDetailView/components/WhyThisWorksSection.tsx` |
| Create | `src/screens/TemplatesScreen/views/HabitDetailView/components/HowYoullDoItSection.tsx` |
| Create | `src/screens/TemplatesScreen/views/HabitDetailView/components/IdentitySection.tsx` |
| Create | `src/screens/TemplatesScreen/views/HabitDetailView/components/CustomizeAccordion.tsx` |
| Create | `src/screens/TemplatesScreen/views/HabitDetailView/components/StickyAddFooter.tsx` |
| Modify | `src/screens/TemplatesScreen/views/renderSubView.tsx` |
| Modify | `src/screens/TemplatesScreen/hooks/useViewNavigation.ts` |
| Modify | `src/screens/TemplatesScreen/TemplatesScreen.tsx` |

#### Architecture Decision: Sub-View, Not Modal

The detail screen renders as a full sub-view via `renderSubView`, not as a modal-on-modal. Rationale:
- The confidence content (7 sections) does not fit well in a bottom sheet.
- Sub-view is consistent with `GoalDrillView`, `CategoryDrillView`.
- The existing `TemplatePreviewModal` is **kept** as a customize-only surface: when the user presses "Customize" from `HabitDetailView`, the modal opens with customization controls only (icon, color, reminder, algorithm).

**Add `'detail'` to `TemplateViewState`:**

```ts
export type TemplateViewState =
  | { type: 'main' }
  | { type: 'seeAll' }
  | { type: 'starters' }
  | { type: 'categories' }
  | { type: 'category'; categoryId: string }
  | { type: 'goal'; goalId: string }
  | { type: 'search' }
  | { type: 'detail'; templateId: string; sourcePath: DetailSourcePath }
  | { type: 'guidedPicker' };  // Added in Phase 3
```

**New types:**

```ts
export type DetailSourcePath =
  | 'goal' | 'category' | 'search'
  | 'guide' | 'trending' | 'starter' | 'pairing';
```

**`HabitDetailView` props:**

```ts
interface HabitDetailViewProps {
  template: Doc<'templates'>;
  sourcePath: DetailSourcePath;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onCustomize: (template: Doc<'templates'>) => void;
}
```

**`HabitDetailView.hooks.ts`:**

```ts
export function useHabitDetailView(template: Doc<'templates'>) {
  const content = deriveConfidenceContent(template);
  // Returns: { content, isExpanded (customize accordion), toggleExpanded }
}
```

#### `handleTemplatePreview` Migration

This is a **refactor prerequisite** that must be completed before `HabitDetailView` ships. The existing `handleTemplatePreview` function opens `TemplatePreviewModal` directly. It must be replaced with `openDetail(templateId, sourcePath)` which pushes the detail view onto the view stack.

**Call sites that use `handleTemplatePreview` (to be migrated):**

| File | Context |
|------|---------|
| `src/screens/TemplatesScreen/views/GoalDrillView.tsx` | Template card tap in goal results |
| `src/screens/TemplatesScreen/views/CategoryDrillView.tsx` | Template card tap in category results |
| `src/screens/TemplatesScreen/views/StarterHabitsView.tsx` | Starter habit card tap |
| `src/screens/TemplatesScreen/views/MainBrowseView.tsx` | Popular/trending template tap |
| `src/screens/TemplatesScreen/components/SearchResults.tsx` | Search result tap |
| `src/screens/TemplatesScreen/hooks/useTemplatesScreenProps.ts` | Handler definition |

**New signature:**

```ts
openDetail: (templateId: string, sourcePath: DetailSourcePath) => void
```

**Migration steps:**
1. Add `openDetail` to `useViewNavigation` (wraps `viewStack.push({ type: 'detail', templateId, sourcePath })`).
2. Replace all `handleTemplatePreview(template)` calls with `openDetail(template._id, <sourcePath>)`.
3. Remove `handleTemplatePreview` from `useTemplatesScreenProps`.
4. `TemplatePreviewModal` is no longer opened directly from browse surfaces — only from `HabitDetailView`'s "Customize" action.

#### Content Staging Order (wireframe contract)

1. **ConfidencePromiseCard** — icon, name, promise (`suggestedWhy`), primary CTA "Add Habit"
2. **FeasibilityMetaRow** — `estimatedMinutes` + `growthType` label
3. **WhyThisWorksSection** — `benefits` bullets + `scientificReference` link
4. **HowYoullDoItSection** — `suggestedCue` + `startSmallVersion` + first `tips` item
5. **IdentitySection** — `suggestedIdentity` in first-person framing
6. **CustomizeAccordion** — collapsed by default; opens `TemplatePreviewModal` in customize-only mode
7. **PairingsSection** — deferred to Phase 4 (renders nothing initially)
8. **StickyAddFooter** — sticky bottom bar with "Add Habit" button

#### Acceptance Criteria

- Tapping a template card from any surface (goal drill, category, search, popular, starter) navigates to `HabitDetailView` as a sub-view with back navigation.
- All 7 content sections render with correct content or fallback.
- "Add Habit" in both the promise card and sticky footer triggers import.
- "Customize" opens the existing `TemplatePreviewModal`.
- Back button returns to the previous view (via view stack `pop()`).
- Already-imported templates show "Added ✓" disabled state.
- All `handleTemplatePreview` call sites have been migrated to `openDetail`.

#### Edge Cases

- Template with no `benefits` → show `scientificReference` as single bullet.
- Template with no `suggestedCue` → show derived fallback.
- Template with no `estimatedMinutes` → show "Quick habit" label.
- Template with no `growthType` → default to "Gentle start".
- Very long `suggestedWhy` (>100 chars) → truncate with "Read more" expand.
- Offline → the template data is already loaded in memory from the parent list; no additional fetch needed.

#### Testing

- Unit test `deriveConfidenceContent` (shared with Phase 0).
- Visual snapshot of `HabitDetailView` with a fully-populated template and one with minimal fields.

---

### Phase 3: Guided Picker Flow

#### Files to Create/Modify

| Action | Path |
|--------|------|
| Create | `src/screens/TemplatesScreen/utils/recommendation/scoreFactors.ts` |
| Create | `src/screens/TemplatesScreen/utils/recommendation/rankTemplates.ts` |
| Create | `src/screens/TemplatesScreen/utils/recommendation/matchExplanation.ts` |
| Create | `src/screens/TemplatesScreen/utils/recommendation/types.ts` |
| Create | `src/screens/TemplatesScreen/utils/recommendation/goalIntentCategories.ts` |
| Create | `src/screens/TemplatesScreen/utils/recommendation/index.ts` |
| Create | `src/screens/TemplatesScreen/views/GuidedPickerView/GuidedPickerView.tsx` |
| Create | `src/screens/TemplatesScreen/views/GuidedPickerView/GuidedPickerView.types.ts` |
| Create | `src/screens/TemplatesScreen/views/GuidedPickerView/GuidedPickerView.hooks.ts` |
| Create | `src/screens/TemplatesScreen/views/GuidedPickerView/index.ts` |
| Create | `src/screens/TemplatesScreen/views/GuidedPickerView/components/QuestionProgress.tsx` |
| Create | `src/screens/TemplatesScreen/views/GuidedPickerView/components/AreaOfLifeQuestion.tsx` |
| Create | `src/screens/TemplatesScreen/views/GuidedPickerView/components/TimePerDayQuestion.tsx` |
| Create | `src/screens/TemplatesScreen/views/GuidedPickerView/components/StyleQuestion.tsx` |
| Create | `src/screens/TemplatesScreen/views/GuidedPickerView/components/GuidedResultsCard.tsx` |
| Create | `src/screens/TemplatesScreen/views/GuidedPickerView/components/GuidedResultsScreen.tsx` |
| Modify | `src/screens/TemplatesScreen/views/renderSubView.tsx` |
| Modify | `src/screens/TemplatesScreen/hooks/useViewNavigation.ts` |
| Modify | `src/screens/TemplatesScreen/components/HelpMeChoosePill/HelpMeChoosePill.tsx` |
| Modify | `src/screens/TemplatesScreen/TemplatesScreen.tsx` |

#### Scoring Utility (`src/screens/TemplatesScreen/utils/recommendation/`)

Located at `src/screens/TemplatesScreen/utils/recommendation/` (consistent with existing code organization — the codebase does not use a top-level `src/shared/` folder).

**File decomposition (100-line limit per file):**

| File | Responsibility |
|------|---------------|
| `scoreFactors.ts` | Weight definitions (`SCORING_WEIGHTS` constant) + individual factor scorer functions (`scoreCategoryFit`, `scoreTimeFit`, `scoreStyleFit`, `scoreEvidence`, `scoreAdherence`, `scorePopularity`) |
| `rankTemplates.ts` | Main `rankTemplatesForUser()` function — orchestrates factor scorers, applies tie-breaking, returns sorted `RankedTemplate[]` |
| `matchExplanation.ts` | `generateWhyThisMatches()` — builds human-readable reason text from top 2-3 non-zero `RecommendationReason` entries |
| `types.ts` | All shared types (`StylePreference`, `TimeBucket`, `RecommendationInput`, `RecommendationReason`, `RankedTemplate`) |
| `goalIntentCategories.ts` | `GOAL_INTENT_TO_CATEGORIES` mapping |
| `index.ts` | Barrel re-export |

**Types (`types.ts`):**

```ts
import type { Doc } from '../../../../../convex/_generated/dataModel';

export type StylePreference = 'gentle' | 'challenging' | 'either';
export type TimeBucket = 'micro' | 'steady' | 'deep' | 'any';

export interface RecommendationInput {
  selectedCategories: string[];
  selectedGoalIds?: string[];
  timeBucket?: TimeBucket;
  stylePreference?: StylePreference;
  limit?: number;  // default 3
}

export interface RecommendationReason {
  key: 'category' | 'goal' | 'time' | 'style' | 'evidence' | 'adherence' | 'popularity';
  label: string;
  contribution: number;
}

export interface RankedTemplate {
  template: Doc<'templates'>;
  score: number;
  reasons: RecommendationReason[];
  whyThisMatches: string;
}
```

**Main ranking function (`rankTemplates.ts`):**

```ts
export function rankTemplatesForUser(
  templates: Doc<'templates'>[],
  input: RecommendationInput
): RankedTemplate[];
```

**Scoring factors (from design doc):**

| Factor | Max Points | Logic |
|--------|-----------|-------|
| Category fit | +45 | Exact match: +45; goal-intent mapped: +18 |
| Time fit | +25 | In bucket: +25; adjacent: +12; missing data: +6 |
| Style fit | +20 | Exact match: +20; adjacent (`average`): +12 |
| Evidence | +6 | Has `scientificReference`: +6 |
| Adherence | +6 | Has `startSmallVersion`: +3; `suggestedCue`: +2; `suggestedIdentity`: +1 |
| Popularity | +8 | Percentile-normalized `popularityScore` |

**Time buckets:** `micro` = 0-5 min, `steady` = 6-15 min, `deep` = 16+ min.

**Tie-breaker order:** More exact matches → higher popularity → has science → lower minutes → newer `createdAt` → lexicographic `_id`.

**`matchExplanation.ts`:** `generateWhyThisMatches(reasons: RecommendationReason[]): string` — builds from top 2-3 non-zero reasons using user-friendly labels.

**`goalIntentCategories.ts`:**

```ts
export const GOAL_INTENT_TO_CATEGORIES: Record<string, string[]> = {
  'more-energy': ['morning_routine', 'health_fitness'],
  'sleep-better': ['sleep', 'recovery', 'breathing'],
  'less-stress': ['mindfulness', 'breathing', 'mental_health'],
  'be-productive': ['productivity', 'learning'],
  'get-healthier': ['health_fitness', 'longevity'],
};
```

#### Guided Picker UI — Progressive Results

**View type:** sub-view via `renderSubView` (consistent with all other drill-downs).

**Key design principle:** Results appear immediately after Q1 (area of life). Questions 2 and 3 are optional refinements, not gates. This reduces abandonment and gives the user value instantly.

**`GuidedPickerView.hooks.ts`:**

```ts
export function useGuidedPicker(allTemplates: Doc<'templates'>[]) {
  // State: currentStep (0 = Q1, 1 = Q2, 2 = Q3),
  //        selectedCategory, timeBucket, stylePreference
  // Computed: results (via rankTemplatesForUser — runs after Q1 with partial input)
  // Progressive: results update as Q2/Q3 are answered
  // Returns: step state, answer handlers, results, hasResults, isRefined
}
```

**Progressive flow:**

1. **Q1: Area of life** — chip grid from `CATEGORY_META` keys. Once answered, results are immediately computed and shown below.
2. **Results appear** with a "Refine results" option (opens Q2/Q3 inline or as expandable section).
3. **Q2: Time per day** (optional refinement) — radio group: `micro` (0-5 min), `steady` (6-15 min), `deep` (16+ min). Answering re-scores and updates results live.
4. **Q3: Style** (optional refinement) — radio group: `gentle`, `challenging`. Answering re-scores and updates results live.

**Results screen elements:**
- 3 `GuidedResultsCard` components, each with rank, template name/icon, `whyThisMatches` text, and "Preview" / "Add" buttons.
- **"Edit answers"** button — scrolls back to questions, allows changing any answer (results re-compute).
- **"Browse all instead"** escape route — navigates back to main landing (calls `viewStack.reset()`).
- "Preview" navigates to `HabitDetailView` with `sourcePath: 'guide'`.
- "Add" triggers direct import.

**Fallback:** If fewer than 3 templates match strict filters, broaden by dropping style, then time, until 3 results are available.

**Component API (`GuidedResultsScreen`):**

```ts
interface GuidedResultsScreenProps {
  results: RankedTemplate[];
  isRefined: boolean;
  onRefine: () => void;
  onEditAnswers: () => void;
  onBrowseAll: () => void;
  onPreview: (template: Doc<'templates'>) => void;
  onAdd: (template: Doc<'templates'>) => void;
  importedTemplateIds: Set<string>;
}
```

#### Acceptance Criteria

- `HelpMeChoosePill` opens `GuidedPickerView` sub-view.
- Answering Q1 alone shows 3 ranked results immediately.
- Answering Q2/Q3 refines results in real-time (results re-rank without page reload).
- Q2 and Q3 are optional — user can add/preview from results without answering them.
- Each result card shows `whyThisMatches` with human-readable reasons.
- "Preview" on a result navigates to `HabitDetailView`.
- "Add" on a result imports the template and shows success feedback.
- "Edit answers" returns user to questions with current answers pre-filled.
- "Browse all instead" navigates back to main landing.
- Back button returns to the landing.
- Always shows exactly 3 results (fallback broadening).

#### Edge Cases

- Category with 0 templates → show warning and allow re-selection.
- All templates already imported → show results with "Added ✓" state.
- Very few templates in the database → relax filters aggressively.
- User changes Q1 answer after seeing results → results re-compute from scratch.

#### Testing

- Unit test `rankTemplatesForUser` with known inputs and expected ordering.
- Unit test tie-breaker determinism.
- Unit test `generateWhyThisMatches` string generation.
- Unit test fallback broadening when strict filters return < 3.
- Unit test progressive scoring: verify results with only `selectedCategories` populated (no time/style).

---

### Phase 4: Success "What's Next?" Surface

#### Files to Create/Modify

| Action | Path |
|--------|------|
| Create | `src/screens/TemplatesScreen/views/ImportSuccessView/ImportSuccessView.tsx` |
| Create | `src/screens/TemplatesScreen/views/ImportSuccessView/ImportSuccessView.types.ts` |
| Create | `src/screens/TemplatesScreen/views/ImportSuccessView/index.ts` |
| Create | `src/screens/TemplatesScreen/views/ImportSuccessView/components/WhatsNextSection.tsx` |
| Create | `src/screens/TemplatesScreen/views/ImportSuccessView/components/FirstImportBranchCard.tsx` |
| Create | `src/screens/TemplatesScreen/data/templatePairings.ts` |
| Modify | `src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.ts` |
| Modify | `src/screens/TemplatesScreen/views/FeedbackOverlays.tsx` |

#### Design

After a successful import, instead of only showing a toast/celebration, navigate to `ImportSuccessView` (or show it inline).

**Two branches:**

1. **First import** (`userHabitCount` was 0 before, now 1):
   - Header: "Habit added 🎉"
   - Subtitle: "[Habit name] is now in your daily plan."
   - Primary CTA: "Take 30-second guide" → opens `GuidedPickerView`
   - Secondary: "View today's plan" → closes library
   - Tertiary: "I'm good for now" → dismisses

2. **Standard** (`userHabitCount > 1`):
   - Header: "Habit added ✓"
   - "What's Next?" section with 1-2 pairing suggestions from `templatePairings.ts`
   - CTAs: "View today's plan" | "Add another habit"

**`templatePairings.ts`:**

> **Note:** This file is named `templatePairings.ts` (template-specific, name-based pairings) to avoid collision with the existing `habitPairings.ts` (category-based pairings used elsewhere in the app). The existing `habitPairings.ts` remains untouched.

```ts
export interface TemplatePairing {
  templateName: string;
  reason: string;
}

export const TEMPLATE_PAIRINGS: Record<string, TemplatePairing[]> = {
  'Drink Water': [
    { templateName: 'Morning Stretch', reason: 'Stacks naturally after hydration' },
    { templateName: '5-Min Walk', reason: 'Builds on the energy boost' },
  ],
  // ... more pairings
};

export function getPairingsForTemplate(
  templateName: string,
  allTemplates: Doc<'templates'>[]
): { template: Doc<'templates'>; reason: string }[];
```

Pairing lookup is best-effort: exact name match in `TEMPLATE_PAIRINGS` first, then category-based fallback (suggest popular templates from the same category).

#### `useImportFeedback` Ownership Clarification

When `ImportSuccessView` is active, it **replaces the toast path entirely**. The existing `useImportFeedback` hook's toast branch is disabled (not called) when the import triggers `ImportSuccessView` navigation. This avoids duplicate feedback (both a toast and a full success view showing simultaneously).

**Implementation:**
- `useTemplateImportHandlers` checks whether `ImportSuccessView` will be shown (always `true` once Phase 4 ships).
- When `ImportSuccessView` is the active feedback surface, `useImportFeedback.showToast()` is not invoked.
- If `ImportSuccessView` is ever disabled (feature flag, error boundary fallback), the toast path re-activates automatically.

#### Acceptance Criteria

- After importing first habit, `ImportSuccessView` renders with first-import branch.
- After importing subsequent habits, standard branch with pairing suggestion.
- "Take 30-second guide" opens `GuidedPickerView`.
- "View today's plan" closes the library.
- "Add another habit" dismisses and returns to landing.
- Pairing suggestions link to templates that exist in the database.
- **No duplicate feedback:** when `ImportSuccessView` is active, no toast from `useImportFeedback` appears.
- `useImportFeedback` toast path re-activates if `ImportSuccessView` is disabled/unreachable.

#### Edge Cases

- Imported template has no pairings in `TEMPLATE_PAIRINGS` → show category-based suggestion.
- No templates left to suggest → show only "View today's plan".
- Rapid double-import → debounce; show success for the latest import.

#### Testing

- Unit test `getPairingsForTemplate` with known and unknown template names.
- Integration test: import a template, verify success view renders correct branch.
- Integration test: verify no toast fires when `ImportSuccessView` is active.

---

### Phase 5: Instrumentation Events

#### Files to Create/Modify

| Action | Path |
|--------|------|
| Create | `src/screens/TemplatesScreen/hooks/useLibraryAnalytics.ts` |
| Modify | `src/screens/TemplatesScreen/hooks/useUserSegment.ts` (add dwell tracking for `isLost`) |
| Modify | `src/screens/TemplatesScreen/TemplatesScreen.tsx` |
| Modify | `src/screens/TemplatesScreen/views/HabitDetailView/HabitDetailView.tsx` |
| Modify | `src/screens/TemplatesScreen/views/GuidedPickerView/GuidedPickerView.tsx` |

#### Analytics Hook

```ts
export function useLibraryAnalytics(segment: BaseSegment, variant: LandingVariant) {
  const sessionId = useRef(generateSessionId()).current;

  return {
    trackLibraryOpen: (source: string) => void,
    trackLandingVariantShown: () => void,
    trackGuideStarted: (entryPoint: string) => void,
    trackGuideCompleted: (payload: GuideCompletedPayload) => void,
    trackGuideAbandoned: (stepIndex: number, totalSteps: number, timeMs: number) => void,
    trackDetailOpen: (templateId: string, path: DetailSourcePath) => void,
    trackDetailSectionViewed: (templateId: string, section: string, path: DetailSourcePath) => void,
    trackLibraryAdd: (payload: LibraryAddPayload) => void,
    trackDwellNoAction: (timeMs: number) => void,
    sessionId,
  };
}
```

#### Session ID Persistence

The `sessionId` is a simple `useRef` initialized on modal/screen mount with a generated UUID. It is cleared on unmount (modal close). No persistence across modal close/reopen is needed — each library session gets a fresh ID. This is intentional: we want to track behavior within a single browsing session, not across sessions.

```ts
const sessionId = useRef(generateSessionId()).current;
// generateSessionId = () => crypto.randomUUID() or a lightweight alternative
// Cleared implicitly when the component unmounts (ref is garbage collected)
```

#### Event Contract

Full event schemas from `instrumentation-events-spec.md`. All events use `library_` prefix.

| Event | Trigger | Key Payload Fields |
|-------|---------|-------------------|
| `library_open` | Screen visible | `source`, `segment`, `user_habit_count`, `session_id` |
| `library_landing_variant_shown` | Variant rendered | `variant`, `segment`, `decision_reason` |
| `library_guide_started` | Guide entry tapped | `entry_point`, `segment` |
| `library_guide_completed` | Results shown | `answers_area`, `answers_time_bucket`, `answers_style`, `recommended_template_ids` |
| `library_guide_abandoned` | Guide closed early | `step_index`, `total_steps`, `time_in_guide_ms` |
| `library_detail_open` | Detail view opens | `template_id`, `path`, `segment` |
| `library_detail_section_viewed` | Section ≥50% visible ≥500ms | `template_id`, `section`, `path` |
| `library_add` | Import confirmed | `template_id`, `path`, `from_customize`, `is_first_import` |
| `library_dwell_no_action` | ≥15s on landing, no nav | `segment`, `variant`, `time_on_landing_ms` |

**Implementation notes:**
- No existing `trackEvent` or `createHabitModalAnalytics` pattern found in the codebase. Create a lightweight analytics utility in `useLibraryAnalytics.ts` using `console.log` as the initial transport. The analytics transport layer can be swapped when an analytics SDK is integrated.
- Gate one-time events (`library_open`, `library_dwell_no_action`) with in-memory flags scoped to `sessionId`.
- `library_detail_section_viewed` uses an `onViewableItemsChanged` / `IntersectionObserver`-style check (use `useRef` tracking for visible sections in the scroll view).

#### `isLost` Implementation (deferred from Phase 1)

Now wire the dwell timer and search-churn counter:

```ts
// Inside useUserSegment, add:
const [landingDwellMs, setLandingDwellMs] = useState(0);
const [searchChangeCount, setSearchChangeCount] = useState(0);
const [hadAction, setHadAction] = useState(false);

// Start interval on mount, clear on any navigation action.
// isLost = (!hadAction && landingDwellMs >= 18000)
//       || (searchChangeCount >= 4 && !hadAction);
```

When `isLost` becomes `true`, elevate the `HelpMeChoosePill` with emphasis animation and update copy per segment.

#### Acceptance Criteria

- All 9 events fire at the correct trigger points.
- `session_id` is consistent across all events in a single library session.
- `session_id` is a fresh value on each modal open (not persisted across close/reopen).
- `library_dwell_no_action` fires at most once per session.
- `isLost` overlay triggers after 18s of no action.

#### Testing

- Unit test `useLibraryAnalytics` — call each track function, verify payload shape.
- Integration test: open library, wait 18s without action, verify `isLost` triggers.
- Unit test: verify `sessionId` is stable within a mount cycle and different across remounts.

---

### Phase 6: Polish, Edge Cases, Accessibility

#### Files to Modify

All files created in Phases 0.5-5 as needed.

#### Checklist

**Accessibility:**
- [ ] All interactive elements have `accessibilityLabel` and `accessibilityRole`.
- [ ] `HelpMeChoosePill` has `accessibilityHint` describing destination.
- [ ] `GuidedPickerView` questions use `accessibilityRole="radiogroup"` for radio options.
- [ ] `StickyAddFooter` button has `accessibilityState={{ disabled }}` when importing.
- [ ] Screen reader announcement on segment switch ("Showing new user recommendations").
- [ ] `HabitDetailView` sections use semantic headings via `accessibilityRole="header"`.

**Reduced Motion:**
- [ ] All `entering`/`exiting` animations wrapped in `useReduceMotion()` check.
- [ ] `HelpMeChoosePill` pulse animation disabled when reduced motion is on.
- [ ] Stagger animations fall back to instant render.

**Offline/Loading:**
- [ ] Template data already loaded from parent — no additional network calls needed in detail/picker.
- [ ] If `allTemplates` is empty/loading during guided picker, show skeleton state.
- [ ] Import failure → show error toast (existing `FeedbackOverlays` handles this).

**Error Boundaries:**
- [ ] Wrap `GuidedPickerView` and `HabitDetailView` in `ScreenErrorBoundary`.
- [ ] Scoring utility never throws — returns empty array on unexpected input.

**Layout Edge Cases:**
- [ ] Very long template names → truncate with ellipsis in detail header.
- [ ] Templates with no icon → show default emoji from `CATEGORY_META`.
- [ ] RTL layout support for pill positioning.
- [ ] Landscape orientation — detail sections should not break.
- [ ] Safe area insets respected in `StickyAddFooter`.

#### Testing

- Manual QA pass through all 3 landing variants.
- Screen reader walkthrough of guided picker flow.
- Offline simulation: airplane mode after templates load, verify add still works (optimistic).

---

## 5. Architecture Decisions

### 5.1 Segmentation Logic Location

**Decision:** Pure client-side hook `useUserSegment` in `src/screens/TemplatesScreen/hooks/`.

**Rationale:** Segmentation inputs (`userHabitCount`, `isPremiumUser`) are already available client-side from `useTemplatesData()`. No server round-trip needed. The `isLost` overlay relies on client-side timers. If server-side segmentation is needed later (A/B testing), introduce a Convex query that returns a segment override.

**Interface:** See `useUserSegment` in Phase 1.

### 5.2 Scoring Utility Design

**Decision:** Local module at `src/screens/TemplatesScreen/utils/recommendation/` (3 files: `scoreFactors.ts`, `rankTemplates.ts`, `matchExplanation.ts`), usable by both library guided picker and (future) onboarding-v2 replacement.

**Location rationale:** The codebase does not have a top-level `src/shared/` convention. Utility code lives near its primary consumer. If a second consumer (onboarding-v2) needs this utility, it can import from the TemplatesScreen path or the module can be promoted to a shared location at that time.

**File decomposition rationale:** The 100-line-per-file limit (per Code Readability Initiative) requires splitting the scoring logic into focused modules:
- `scoreFactors.ts` — weight constants and pure scorer functions (each factor is independent)
- `rankTemplates.ts` — orchestration: applies all factors, sorts, applies tie-breakers
- `matchExplanation.ts` — text generation (separate concern from numeric scoring)

**Integration path:**
1. Phase 3: Library guided picker uses `rankTemplatesForUser` directly.
2. Future: Onboarding-v2 `AppDemoStep` replaces its local scoring with `rankTemplatesForUser`, passing onboarding category selections through `CATEGORY_MAP` normalization.

**Taxonomy bridge:** `GOAL_INTENT_TO_CATEGORIES` maps `GOAL_COLLECTIONS` ids to canonical backend category ids. Onboarding `GOAL_OPTIONS` ids (`movement`, `mind`, etc.) are NOT mapped in this spec — that mapping lives in a future onboarding integration phase.

### 5.3 Navigation Stack

**Decision:** Replace flat `goBack()`-to-main with array-based view stack (`useViewStack`).

**Rationale:**
- Phases 2-4 introduce deeper navigation paths (Main → Category → Detail, Main → GuidedPicker → Detail).
- Flat `goBack()` always returning to main breaks user expectation.
- Array-based stack with push/pop is the simplest correct model.
- Max depth cap (10) prevents memory issues from pathological navigation.

**Interface:** See `useViewStack` in Phase 0.5.

### 5.4 Guided Picker: Progressive Results

**Decision:** Show results immediately after Q1; Q2/Q3 are optional refinements.

**Rationale:**
- Gating results behind 3 mandatory questions creates abandonment risk.
- Users who know their area-of-life often don't need time/style filtering.
- Progressive disclosure: value first, refinement optional.
- Results update live as Q2/Q3 are answered — no "submit" step needed.

**Implementation:** `rankTemplatesForUser` works with partial `RecommendationInput` — only `selectedCategories` is required. `timeBucket` and `stylePreference` default to `'any'`/`'either'` when not provided.

### 5.5 Detail Screen: Full Sub-View, Not Modal-on-Modal

**Decision:** `HabitDetailView` replaces the current `TemplatePreviewModal` as the primary entry to habit details.

**Rationale:**
- Confidence content (7 sections) does not fit in a bottom sheet.
- Modal-on-modal (detail modal over library screen) creates poor UX.
- Sub-view enables full scroll, sticky footer, and back navigation.

**Migration strategy:**
- `TemplatePreviewModal` is **not deleted**. It becomes the "customize" surface only, opened from `HabitDetailView`'s "Customize" accordion.
- All `handleTemplatePreview` call sites throughout `TemplatesScreen` are updated to navigate to `HabitDetailView` (via `viewNav.openDetail(template._id, sourcePath)`) instead of opening the modal.

### 5.6 Analytics Session Tracking

**Decision:** Simple `useRef`-based session ID, initialized on mount, cleared on unmount. No cross-session persistence.

**Rationale:** We track behavior within a single library browsing session. If the user closes and reopens the library, that's a new session. No localStorage, AsyncStorage, or database persistence needed — the ref lifecycle handles it naturally.

### 5.7 Analytics Event Contract

**Decision:** Create a self-contained `useLibraryAnalytics` hook with `console.log` transport initially.

**Rationale:** No existing analytics infrastructure (`trackEvent`, `createHabitModalAnalytics`) was found in the codebase. Rather than block on analytics SDK integration, ship events with `console.log` transport. When an analytics SDK is added, swap the transport inside `useLibraryAnalytics` without changing call sites.

**Event naming:** All events prefixed with `library_`. Payloads are flat objects (no nesting) for simple downstream querying.

### 5.8 Template Pairings vs Habit Pairings

**Decision:** Create new `templatePairings.ts` for this feature; do not modify existing `habitPairings.ts`.

**Rationale:** The existing `habitPairings.ts` uses category-based pairing logic for a different feature surface. This spec's pairings are template-specific (name-based) and serve the post-import success view. Keeping them separate avoids coupling and collision risk.

---

## 6. Content Requirements

### Required Template Fields for Confidence Screen

| Field | Schema Location | Usage | Required? |
|-------|----------------|-------|-----------|
| `suggestedWhy` | `templates.suggestedWhy` | Promise card headline | Fallback to `description` |
| `benefits` | `templates.benefits` | "Why this works" bullets | Fallback to `[scientificReference]` |
| `scientificReference` | `templates.scientificReference` | Science citation link | Always present (required field) |
| `suggestedCue` | `templates.suggestedCue` | "How you'll do it" cue | Fallback: derived implementation intention |
| `startSmallVersion` | `templates.startSmallVersion` | "Start small" line | Fallback: "Just do [name] for 1 minute" |
| `suggestedIdentity` | `templates.suggestedIdentity` | "Who you'll become" | Fallback: derived from category subtitle |
| `estimatedMinutes` | `templates.estimatedMinutes` | Time badge | Fallback: "Quick habit" |
| `growthType` | `templates.growthType` | Style badge | Fallback: display nothing or "Gentle start" |
| `tips` | `templates.tips` | Extra tip in "How" section | Optional — omit section if empty |

### Fallback Strategy

The `deriveConfidenceContent()` function (Phase 0) provides runtime fallbacks:

1. **Promise:** `suggestedWhy` → `description` (always non-empty).
2. **Benefits:** `benefits` array → wrap `scientificReference` in a single-item array.
3. **Cue:** `suggestedCue` → generated implementation intention using category and name.
4. **Start small:** `startSmallVersion` → "Just do [name] for 1 minute."
5. **Identity:** `suggestedIdentity` → "I am a person who [category subtitle]."

Every fallback produces a plausible, non-empty string. The confidence screen never shows blank sections.

---

## 7. Open Questions — Resolved

| Question | Resolution | Rationale |
|----------|-----------|-----------|
| Should "Help me choose" guide be modal or sub-view? | **Sub-view** via `renderSubView` | Consistent with existing drill-downs; avoids modal stacking; full-screen real estate for questions and results. |
| Does the power-user landing exist now or is it Phase 2? | **Phase 1** | It reuses existing components (`PremiumPacksSection`, `GoalCollectionGrid`, `PopularSection`) in a new arrangement. No new components needed — just a layout switch. |
| Should habit detail open as full screen or modal? | **Full sub-view** | Confidence content (7 sections) doesn't fit a bottom sheet. Sub-view with `StickyAddFooter` is a better UX. Existing `TemplatePreviewModal` becomes customize-only. |
| Unify onboarding goals with library `goalCollections`? | **Keep separate for now** but add mapping table | `GOAL_OPTIONS` (`movement`, `mind`) and `GOAL_COLLECTIONS` (`more-energy`, `sleep-better`) serve different UX intents. Add `GOAL_INTENT_TO_CATEGORIES` bridge for scoring but do not merge the arrays. Future onboarding-v2 update can use the shared scoring utility directly. |
| Should guided picker gate results behind all 3 questions? | **No — progressive results** | Show results after Q1; Q2/Q3 refine. Reduces abandonment, gives instant value. |
| Where should scoring utility live? | **`src/screens/TemplatesScreen/utils/recommendation/`** | Consistent with existing code organization. No `src/shared/` folder exists. Promote later if a second consumer appears. |

**Mapping table for reference** (not acted on — for future onboarding integration):

| Onboarding `GOAL_OPTIONS` id | Closest `GOAL_COLLECTIONS` id | Shared categories |
|------------------------------|-------------------------------|-------------------|
| `movement` | `get-healthier` | `health_fitness` |
| `mind` | `less-stress` | `mindfulness`, `mental_health` |
| `health` | `get-healthier` | `health_fitness`, `longevity` |
| `craft` | `be-productive` | `productivity`, `learning` |

---

## 8. Out of Scope

- **A/B testing infrastructure** — Variant selection is deterministic by segment. Experimentation framework is a separate initiative.
- **Premium packs redesign** — `PremiumPacksSection` is reused as-is in the power-user landing. No changes to pack content, pricing, or purchase flow.
- **Onboarding v2 changes** — The shared scoring utility is designed for future onboarding integration, but no onboarding code is modified in this spec.
- **i18n / localization** — All copy is hardcoded English. String extraction for i18n is a separate effort.
- **Server-side template recommendations** — Scoring runs client-side on the full template set. If the template count grows significantly, move scoring to a Convex query.
- **Template pairing data completeness** — Phase 4 ships with a small manual pairing map in `templatePairings.ts`. Expanding it to cover all templates is a content task, not an engineering task.
- **Template creation/editing** — This spec only covers the browse/discovery/import workflow, not template authoring.
- **Analytics dashboard / reporting** — Events are emitted but no dashboard or query layer is built.
- **Cross-session analytics persistence** — Session IDs are ephemeral (per-mount). No localStorage/AsyncStorage persistence is built.

---

## 9. Dependencies and Risks

### Phase 0: Content Backfill

| Dependency | Risk | Mitigation |
|-----------|------|------------|
| Access to seed data file | Low — it's in the repo | N/A |
| Quality of derived fallbacks | Medium — auto-generated content may feel generic | Review generated content manually; prioritize the top 20 most popular templates for hand-written copy |
| `categoryMeta.ts` completeness | Low — just needs 3 new entries | Verify against schema literal union before Phase 1 starts |

### Phase 0.5: Navigation Stack Refactor

| Dependency | Risk | Mitigation |
|-----------|------|------------|
| Existing view navigation consumers | Medium — all sub-views use `goBack()` | Wrap `useViewStack` inside existing `useViewNavigation` API to minimize call-site changes |
| View state serialization | Low — stack is in-memory only | No persistence needed; reset on unmount |
| Testing coverage for back navigation | Medium — behavioral change | Add integration tests covering 3+ depth navigation paths |

### Phase 1: Segment-Aware Landing

| Dependency | Risk | Mitigation |
|-----------|------|------------|
| `userHabitCount` accuracy | Low — already used for `isFirstTimeUser` | N/A |
| `isPremiumUser` availability | Low — already in `useMainBrowseData` | N/A |
| `PremiumPacksSection` component readiness | Low — already exists | N/A |

### Phase 2: Habit Detail

| Dependency | Risk | Mitigation |
|-----------|------|------------|
| Phase 0 content backfill | **Blocking** — detail screen needs content | Ship Phase 0 first; fallback function as safety net |
| Phase 0.5 navigation stack | **Blocking** — detail needs stack-based back nav | Ship Phase 0.5 before Phase 2 |
| `handleTemplatePreview` migration | Medium — 6+ call sites to update | Migrate incrementally; keep modal as fallback during transition |
| Existing import flow stability | Low — import handler doesn't change | N/A |
| `TemplatePreviewModal` as customize-only | Medium — current modal handles both preview and customize | Ensure modal still works standalone when opened from detail "Customize" action |

### Phase 3: Guided Picker

| Dependency | Risk | Mitigation |
|-----------|------|------------|
| Phase 2 `HabitDetailView` | Blocking for "Preview" action from results | Can ship guided picker with direct-add only; preview links added after Phase 2 lands |
| Template count per category | Medium — some categories may have very few templates | Fallback broadening logic; minimum 3 results guaranteed |
| Scoring utility correctness | Medium — weighted scoring needs tuning | Unit tests with known expected outputs; scoring weights are constants, easily adjustable |

### Phase 4: Success View

| Dependency | Risk | Mitigation |
|-----------|------|------------|
| Phase 3 `GuidedPickerView` | Needed for first-import "Take guide" CTA | Can fall back to "Add another habit" CTA if guided picker isn't ready |
| Template pairing data | Medium — manual data, may be incomplete | Category-based fallback for templates without explicit pairings |
| `useImportFeedback` interaction | Low — clear ownership rules defined | Toast path disabled when success view active; re-enables on fallback |

### Phase 5: Instrumentation

| Dependency | Risk | Mitigation |
|-----------|------|------------|
| All Phases 1-4 UI surfaces | Partially blocking — events fire from those surfaces | Instrument each surface as it ships; Phase 5 is a cleanup/completion pass |
| Analytics SDK | Not blocking — `console.log` transport ships first | Transport swap is a one-line change |

### Phase 6: Polish

| Dependency | Risk | Mitigation |
|-----------|------|------------|
| All prior phases | Blocking — polish is applied to shipped surfaces | Run concurrently with final Phase 4/5 work |
| Device testing matrix | Medium — need to test on small/large screens, iOS/Android | Prioritize iPhone SE (small) and iPhone 15 Pro Max (large) |

---

## 10. Review Findings Incorporated

The following 10 items were identified across three review passes and have been incorporated into this spec:

| # | Finding | Resolution |
|---|---------|-----------|
| 1 | Navigation stack blocker — flat `goBack()`-to-main breaks with deeper navigation paths | Added Phase 0.5: Navigation Stack Refactor with `useViewStack` hook (push/pop/reset/current/canGoBack). All sub-views migrated to use the stack. |
| 2 | `habitPairings.ts` collision — spec proposed same filename as existing category-based pairings | Renamed to `templatePairings.ts` (template-specific, name-based). Existing `habitPairings.ts` untouched. All spec references updated. |
| 3 | Progressive guided picker — 3 mandatory questions gate value behind friction | Rewritten: results appear immediately after Q1 (area of life). Q2/Q3 are optional refinements. Added "Edit answers" and "Browse all instead" escape routes. |
| 4 | Landing copy fix — "What do you want to work on?" presumes intent new users lack | New-user header changed to "Start one small habit today" with subtitle "Pick one that feels easy — you can always add more." Returning users keep original copy. |
| 5 | `handleTemplatePreview` migration — no guidance on how to replace existing call sites | Added explicit migration section in Phase 2: lists all 6 call sites, defines new `openDetail(templateId, sourcePath)` signature, specifies migration steps. |
| 6 | `useImportFeedback` conflict — risk of duplicate toast + success view feedback | Clarified ownership: `ImportSuccessView` replaces toast path entirely when active. Toast re-enables automatically if success view is disabled. Added to Phase 4 acceptance criteria. |
| 7 | `src/shared/` folder — proposed location inconsistent with codebase conventions | Changed to `src/screens/TemplatesScreen/utils/recommendation/`. All path references updated. Rationale documented in Architecture Decisions. |
| 8 | Scoring utility file decomposition — single file would exceed 100-line limit | Split into 3 files: `scoreFactors.ts`, `rankTemplates.ts`, `matchExplanation.ts`. Responsibilities clearly delineated. |
| 9 | Missing CATEGORY_META entries — 3 of 19 schema categories lack entries | Added to Phase 0 scope: verify all 19 categories, backfill the 3 missing entries. Added acceptance criterion. |
| 10 | Session ID persistence — unclear whether analytics session persists across modal cycles | Clarified: simple `useRef` initialized on mount, cleared on unmount. No cross-session persistence needed. Documented in Architecture Decisions §5.6. |
