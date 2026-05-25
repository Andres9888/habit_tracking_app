# Habit Library Redesign — Single-Session Implementation Prompt

## Mission

Implement the full Habit Library Redesign for the `TemplatesScreen` in one session. You are building: a navigation view stack (replacing flat goBack), user segmentation with 3 landing variants, a scoring/recommendation utility, a 3-question guided picker with progressive results, a confidence-first habit detail sub-view (replacing the modal-first preview pattern), a post-import success view with pairing suggestions, and analytics instrumentation. The goal: reduce time-to-first-add, help undecided users find a habit, and increase confidence in chosen habits. Do NOT break existing flows — every current test must still pass when you're done.

---

## Critical Constraints

These are non-negotiable. Violating any of these means the work is rejected.

1. **Max 100 lines per file** (excluding blank lines and comments). Decompose using the patterns in CLAUDE.md:
   - Components: `ComponentName/index.ts` + `ComponentName.tsx` + `ComponentName.hooks.ts` + `ComponentName.types.ts` + `components/`
   - Hooks: `useFeature.ts` + `useFeatureState.ts` + `useFeatureHandlers.ts` + `types.ts`
   - Utils: `core.ts` + `helpers.ts` + `types.ts`

2. **Naming conventions:**
   - Components: `PascalCase.tsx`
   - Hooks: `camelCase.ts`
   - Types: `*.types.ts`
   - Component hooks: `*.hooks.ts`

3. **Import patterns:** Relative imports within `src/screens/TemplatesScreen/`. Convex types imported as `type { Doc } from '../../../../convex/_generated/dataModel'`. Use barrel `index.ts` exports.

4. **No `src/shared/` folder.** All new utility code goes in `src/screens/TemplatesScreen/utils/recommendation/`.

5. **Existing file `habitPairings.ts` is untouched.** Create `templatePairings.ts` for the success view.

6. **React Native + Reanimated** — this is a mobile app. Use `View`, `ScrollView`, `Pressable`, `Animated` from `react-native-reanimated`. No web-only APIs.

7. **TypeScript strict mode.** No `any`. No `@ts-ignore`.

8. **Run `npm run lint:max-lines` after each major step.** Fix violations before proceeding.

---

## Known Pitfalls

Read these before you start. Each has bitten reviewers already.

| # | Pitfall | Resolution |
|---|---------|------------|
| 1 | `habitPairings.ts` already exists with category-based pairings | Create `templatePairings.ts` (name-based). Never touch `habitPairings.ts`. |
| 2 | `handleTemplatePreview` has 5 call sites (see below) | Migrate ALL of them to `openDetail`. Don't leave any behind. |
| 3 | `useImportFeedback` will fire duplicate toast when `ImportSuccessView` is active | Disable toast path when success view is showing. Re-enable on fallback. |
| 4 | `src/shared/` doesn't exist in this codebase | Put scoring utility at `src/screens/TemplatesScreen/utils/recommendation/` |
| 5 | `goBack()` is flat — always returns to main | `useViewStack` replaces it with push/pop array-based navigation. |
| 6 | 3 categories missing from `CATEGORY_META` | Schema has 17 categories. `categoryMeta.ts` has 14 entries. Missing: `relationships`, `environmental_design`, `subtraction`. Add them. |
| 7 | `onPreview` prop is threaded through ~28 files | You are NOT renaming `onPreview` everywhere. Only the handler definition changes. The prop name stays `onPreview` in child components — just wire it to `openDetail` at the orchestration level. |

### `handleTemplatePreview` Call Sites to Migrate

These files reference `handleTemplatePreview` and must change to use `openDetail`:

1. `src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.ts` — handler definition (keep for customize-only use)
2. `src/screens/TemplatesScreen/TemplatesScreen.tsx` — passes `handlers.handleTemplatePreview` as `onPreview`
3. `src/screens/TemplatesScreen/TemplatesScreen.handlers.ts` — references handler
4. `src/screens/TemplatesScreen/views/CategorySearchView.tsx` — uses handler
5. `src/screens/TemplatesScreen/views/CategorySearchView.types.ts` — type reference

The migration: In `TemplatesScreen.tsx`, replace `onPreview: handlers.handleTemplatePreview` with a new function that calls `viewNav.push({ type: 'detail', templateId: template._id, sourcePath })`. The `handleTemplatePreview` function itself stays in `useTemplateImportHandlers` renamed to `handleCustomizeOpen` (only called from `HabitDetailView`'s "Customize" action).

---

## Implementation Order

Execute these steps strictly in sequence. Each step builds on the previous.

---

### Step 1: Add Missing CATEGORY_META Entries

**Files to modify:**
- `src/screens/TemplatesScreen/data/categoryMeta.ts`

**What to do:**

The schema's `templates.category` union has 17 values. `CATEGORY_META` currently has 14. Add entries for the 3 missing categories:

```ts
relationships: { bgColor: T.gold.bg, borderColor: T.gold.border, icon: '❤️', isPremium: false, label: 'Relationships', subtitle: 'Nurture meaningful connections daily', textColor: T.gold.text },
environmental_design: { bgColor: T.blue.bg, borderColor: T.blue.border, icon: '🏠', isPremium: false, label: 'Environment', subtitle: 'Design your space for better habits', textColor: T.blue.text },
subtraction: { bgColor: T.purple.bg, borderColor: T.purple.border, icon: '✂️', isPremium: false, label: 'Subtraction', subtitle: 'Remove what holds you back', textColor: T.purple.text },
```

**Read first:** `src/screens/TemplatesScreen/data/categoryMeta.ts`, `convex/schema.ts` lines 284-303 (the category union).

**Acceptance check:** Count keys in `CATEGORY_META` — must be 17. Cross-reference against schema union. All 17 match.

---

### Step 2: Create `templateContentFallbacks.ts`

**Files to create:**
- `src/screens/TemplatesScreen/data/templateContentFallbacks.ts`

**Interface:**

```ts
import type { Doc } from '../../../../convex/_generated/dataModel';

export interface TemplateConfidenceContent {
  promise: string;
  benefits: string[];
  cue: string;
  startSmall: string;
  identity: string;
}

export function deriveConfidenceContent(
  template: Doc<'templates'>
): TemplateConfidenceContent;
```

**Logic:**
- `promise`: `template.suggestedWhy ?? template.description`
- `benefits`: `template.benefits?.length ? template.benefits : [template.scientificReference]`
- `cue`: `template.suggestedCue ?? "After I [context], I will ${template.name.toLowerCase()} for ${template.estimatedMinutes ?? 2} minutes."`
- `startSmall`: `template.startSmallVersion ?? "Just do ${template.name.toLowerCase()} for 1 minute."`
- `identity`: `template.suggestedIdentity ?? "I am a person who ${getCategoryMeta(template.category).subtitle?.toLowerCase() ?? 'builds lasting habits'}."`

Import `getCategoryMeta` from `./categoryMeta`.

**Acceptance check:** Call `deriveConfidenceContent` with a template that has all fields populated and one with none — both return non-empty strings for every field.

---

### Step 3: Create `useViewStack` Hook

**Files to create:**
- `src/screens/TemplatesScreen/hooks/useViewStack.ts`

**Interface:**

```ts
import { useState } from 'react';
import type { TemplateViewState } from './useViewNavigation';

export interface ViewStackResult {
  current: TemplateViewState;
  stack: TemplateViewState[];
  canGoBack: boolean;
  push: (view: TemplateViewState) => void;
  pop: () => void;
  reset: () => void;
}

export function useViewStack(
  initialView?: TemplateViewState
): ViewStackResult;
```

**Logic:**
- `stack` is `useState<TemplateViewState[]>([initialView ?? { type: 'main' }])`
- `current` = `stack[stack.length - 1]`
- `canGoBack` = `stack.length > 1`
- `push`: append to stack. Cap at 10 — if `stack.length >= 10`, no-op.
- `pop`: remove last item. If only 1 item, no-op.
- `reset`: set stack to `[initialView ?? { type: 'main' }]`

**Acceptance check:** Unit test — push 3 views, verify `current` after each. Pop, verify return to previous. Push 11 times, verify stack stays at 10.

---

### Step 4: Extend `TemplateViewState` Type and Refactor `useViewNavigation`

**Files to modify:**
- `src/screens/TemplatesScreen/hooks/useViewNavigation.ts`

**Changes:**

Add two new view state variants to `TemplateViewState`:

```ts
| { type: 'detail'; templateId: string; sourcePath: DetailSourcePath }
| { type: 'guidedPicker' }
```

Add new type:

```ts
export type DetailSourcePath =
  | 'goal' | 'category' | 'search'
  | 'guide' | 'trending' | 'starter' | 'pairing';
```

Replace the internal `useState<TemplateViewState>` + flat `goBack` with the `useViewStack` hook. Refactor all existing methods:

- `openSeeAll` → `push({ type: 'seeAll' })` + animateIn
- `openStarters` → `push({ type: 'starters' })` + animateIn
- `openCategories` → `push({ type: 'categories' })` + animateIn
- `openCategory(id)` → `push({ type: 'category', categoryId: id })` + animateIn
- `openGoal(id)` → `push({ type: 'goal', goalId: id })` + animateIn
- `goBack` → `pop()` with animateOut
- Add: `openDetail(templateId, sourcePath)` → `push({ type: 'detail', templateId, sourcePath })` + animateIn
- Add: `openGuidedPicker()` → `push({ type: 'guidedPicker' })` + animateIn
- Add: `resetToMain()` → `reset()`

Export `activeView` as `viewStack.current` (same name as before for compatibility).

**Read first:** Current `useViewNavigation.ts` (already read — lines 1-101).

**Acceptance check:** All existing navigation (seeAll, starters, categories, category, goal, search) still works. `goBack` from category returns to main (same behavior as before when stack is [main, category]). New `openDetail` and `openGuidedPicker` push correctly.

---

### Step 5: Update `renderSubView` to Handle New View Types

**Files to modify:**
- `src/screens/TemplatesScreen/views/renderSubView.tsx`

**Changes:**

Add handling for `activeView.type === 'detail'` and `activeView.type === 'guidedPicker'`. For now, render placeholder `View` with `Text` for both (actual components come in later steps). Add `templateId` and `sourcePath` to the `SubViewProps` interface or pass them through.

Add `onOpenDetail` callback to `SubViewProps` (so child views can navigate to detail).

```ts
if (activeView.type === 'detail') {
  // Will be replaced in Step 10
  return <View><Text>Detail: {activeView.templateId}</Text></View>;
}
if (activeView.type === 'guidedPicker') {
  // Will be replaced in Step 11
  return <View><Text>Guided Picker</Text></View>;
}
```

**Acceptance check:** App compiles. Navigating to a non-existent detail/picker type renders placeholder text. All existing sub-views still render.

---

### Step 6: Create `useUserSegment` Hook

**Files to create:**
- `src/screens/TemplatesScreen/hooks/useUserSegment.ts`

**Interface:**

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

**Logic:**
- `power`: `isPremiumUser === true` OR `userHabitCount >= 6`
- `returning`: `userHabitCount >= 2 && userHabitCount <= 5`
- `first_time`: `userHabitCount <= 1` or unknown
- `isLost`: always `false` for now (wired in Step 14)
- `helpMeChooseCopy`: first_time → "Not sure? 30-sec guide", returning → "Help me choose", power → "Need inspiration?"
- Fallback: if inputs undefined/null, default to `first_time`

**Acceptance check:** Unit test with boundary values: 0→first_time, 1→first_time, 2→returning, 5→returning, 6→power, premium+count=0→power.

---

### Step 7: Create `HelpMeChoosePill` Component

**Files to create:**
- `src/screens/TemplatesScreen/components/HelpMeChoosePill/HelpMeChoosePill.tsx`
- `src/screens/TemplatesScreen/components/HelpMeChoosePill/index.ts`

**Interface:**

```ts
interface HelpMeChoosePillProps {
  label: string;
  onPress: () => void;
}
```

**Rendering:** A `Pressable` positioned absolutely at bottom-right (16px from edges), styled as a rounded pill with the app's primary color, text in white, with a subtle pulse animation on first render (use `useSharedValue` + `withRepeat` + `withTiming` for scale 1→1.05→1 over 2s, repeating 3 times then stopping).

Keep under 60 lines. Barrel export from `index.ts`.

**Acceptance check:** Renders visually. Pressing fires `onPress`. Animation plays on mount.

---

### Step 8: Integrate Segmentation into Landing

**Files to modify:**
- `src/screens/TemplatesScreen/views/MainBrowseView.tsx`
- `src/screens/TemplatesScreen/views/MainBrowseView.types.ts`
- `src/screens/TemplatesScreen/views/BrowseSections.tsx`
- `src/screens/TemplatesScreen/TemplatesScreen.tsx`

**Changes to `MainBrowseView.types.ts`:**
Add `landingVariant: LandingVariant` and `onHelpMeChoose: () => void` to `MainBrowseViewProps`.

**Changes to `MainBrowseView.tsx`:**
- Import `HelpMeChoosePill` and `useUserSegment` types.
- Switch header title/subtitle based on `landingVariant`:
  - `landing-new-user`: title="Start one small habit today", subtitle="Pick one that feels easy — you can always add more."
  - `landing-returning-user`: title="What do you want to work on?", subtitle="Pick a path — habits proven to work."
  - `landing-power-user`: title="Find your next upgrade", subtitle="Search, filter, and add in seconds."
- Render `HelpMeChoosePill` with appropriate copy, positioned after the `BrowseSections`/search area.
- Pass `landingVariant` down to `BrowseSections`.

**Changes to `BrowseSections.tsx`:**
- Add `landingVariant` prop.
- Replace `isFirstTimeUser` boolean branch with `switch(landingVariant)`:
  - `landing-new-user`: `StarterHabitList` (or `StartHereCard`) → `BrowseCategoriesLink`
  - `landing-returning-user`: `GoalCollectionGrid` → `PopularSection` → `BrowseCategoriesLink`
  - `landing-power-user`: `GoalCollectionGrid` (compact) → `PopularSection` → `BrowseCategoriesLink`

**Changes to `TemplatesScreen.tsx`:**
- Call `useUserSegment({ userHabitCount: data.userHabitCount, isPremiumUser: data.isPremiumUser })`.
- Pass `landingVariant` and `onHelpMeChoose: () => viewNav.openGuidedPicker()` to `MainBrowseView`.

**Read first:** `MainBrowseView.tsx`, `BrowseSections.tsx`, `TemplatesScreen.tsx`, `MainBrowseView.types.ts` (all already read).

**Acceptance check:** With `userHabitCount=0`, see "Start one small habit today". With `userHabitCount=3`, see "What do you want to work on?". With `userHabitCount=7`, see "Find your next upgrade". `HelpMeChoosePill` visible on all variants.

---

### Step 9: Create Scoring Utility (3 files)

**Files to create:**
- `src/screens/TemplatesScreen/utils/recommendation/types.ts`
- `src/screens/TemplatesScreen/utils/recommendation/scoreFactors.ts`
- `src/screens/TemplatesScreen/utils/recommendation/rankTemplates.ts`
- `src/screens/TemplatesScreen/utils/recommendation/matchExplanation.ts`
- `src/screens/TemplatesScreen/utils/recommendation/goalIntentCategories.ts`
- `src/screens/TemplatesScreen/utils/recommendation/index.ts`

**`types.ts`:**

```ts
import type { Doc } from '../../../../../convex/_generated/dataModel';

export type StylePreference = 'gentle' | 'challenging' | 'either';
export type TimeBucket = 'micro' | 'steady' | 'deep' | 'any';

export interface RecommendationInput {
  selectedCategories: string[];
  selectedGoalIds?: string[];
  timeBucket?: TimeBucket;
  stylePreference?: StylePreference;
  limit?: number;
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

**`scoreFactors.ts`:**

Export constants:
```ts
export const SCORING_WEIGHTS = {
  categoryExact: 45,
  categoryGoalIntent: 18,
  timeExact: 25,
  timeAdjacent: 12,
  timeMissing: 6,
  styleExact: 20,
  styleAdjacent: 12,
  evidence: 6,
  adherenceStartSmall: 3,
  adherenceCue: 2,
  adherenceIdentity: 1,
  popularityMax: 8,
} as const;
```

Export pure scorer functions: `scoreCategoryFit`, `scoreTimeFit`, `scoreStyleFit`, `scoreEvidence`, `scoreAdherence`, `scorePopularity`. Each takes a template + relevant input slice and returns `{ score: number; reason: RecommendationReason | null }`.

Time buckets: `micro`=0-5min, `steady`=6-15min, `deep`=16+min. Adjacent means one bucket away.

**`rankTemplates.ts`:**

```ts
export function rankTemplatesForUser(
  templates: Doc<'templates'>[],
  input: RecommendationInput
): RankedTemplate[];
```

Orchestrates all factor scorers, sums scores, applies tie-breaking (more exact matches → higher popularity → has science → lower minutes → newer createdAt → lexicographic _id). Returns top `input.limit ?? 3` results. If fewer than `limit` results pass threshold, broaden by dropping style, then time, then return whatever matches.

**`matchExplanation.ts`:**

```ts
export function generateWhyThisMatches(reasons: RecommendationReason[]): string;
```

Takes top 2-3 non-zero reasons and builds a human-readable sentence. Example: "Matches your Sleep focus and fits your 0-5 minute window."

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

**`index.ts`:** Barrel re-export of `rankTemplatesForUser`, `generateWhyThisMatches`, types.

**Acceptance check:** Unit test `rankTemplatesForUser` with 10 mock templates, selecting category='sleep', timeBucket='micro'. Top result should be a sleep template with low minutes. Tie-breaker is deterministic across runs.

---

### Step 10: Create `HabitDetailView`

**Files to create:**
- `src/screens/TemplatesScreen/views/HabitDetailView/HabitDetailView.tsx`
- `src/screens/TemplatesScreen/views/HabitDetailView/HabitDetailView.types.ts`
- `src/screens/TemplatesScreen/views/HabitDetailView/HabitDetailView.hooks.ts`
- `src/screens/TemplatesScreen/views/HabitDetailView/index.ts`
- `src/screens/TemplatesScreen/views/HabitDetailView/components/ConfidencePromiseCard.tsx`
- `src/screens/TemplatesScreen/views/HabitDetailView/components/FeasibilityMetaRow.tsx`
- `src/screens/TemplatesScreen/views/HabitDetailView/components/WhyThisWorksSection.tsx`
- `src/screens/TemplatesScreen/views/HabitDetailView/components/HowYoullDoItSection.tsx`
- `src/screens/TemplatesScreen/views/HabitDetailView/components/IdentitySection.tsx`
- `src/screens/TemplatesScreen/views/HabitDetailView/components/StickyAddFooter.tsx`

**`HabitDetailView.types.ts`:**

```ts
import type { Doc } from '../../../../../convex/_generated/dataModel';
import type { DetailSourcePath } from '../../hooks/useViewNavigation';

export interface HabitDetailViewProps {
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
  const [isCustomizeExpanded, setCustomizeExpanded] = useState(false);
  return { content, isCustomizeExpanded, toggleCustomize: () => setCustomizeExpanded(p => !p) };
}
```

**`HabitDetailView.tsx`:** Main orchestration — renders ScrollView with sections in this order:
1. `ConfidencePromiseCard` — icon, name, promise, primary "Add Habit" button
2. `FeasibilityMetaRow` — `estimatedMinutes` + `growthType` badges
3. `WhyThisWorksSection` — benefits bullets + scientificReference
4. `HowYoullDoItSection` — suggestedCue + startSmallVersion
5. `IdentitySection` — suggestedIdentity in first-person
6. `StickyAddFooter` — sticky bottom bar with "Add Habit" button

Each sub-component receives only the data it needs (no prop-drilling the full template).

**Content sections (per component):**
- `ConfidencePromiseCard`: icon from template, name, `content.promise`, primary CTA
- `FeasibilityMetaRow`: `template.estimatedMinutes ?? "Quick"`, `template.growthType ?? "Gentle start"`
- `WhyThisWorksSection`: `content.benefits` as bullet list, `template.scientificReference` as citation
- `HowYoullDoItSection`: `content.cue`, `content.startSmall`, first item of `template.tips`
- `IdentitySection`: `content.identity` rendered as a quote
- `StickyAddFooter`: "Add Habit" Pressable, shows "Added ✓" disabled state if already imported

**Acceptance check:** Navigate to any template card tap → see HabitDetailView with all sections rendered. "Add Habit" triggers import. Back returns to previous view.

---

### Step 11: Migrate `handleTemplatePreview` → `openDetail`

**Files to modify:**
- `src/screens/TemplatesScreen/TemplatesScreen.tsx`
- `src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.ts`
- `src/screens/TemplatesScreen/TemplatesScreen.handlers.ts`
- `src/screens/TemplatesScreen/views/CategorySearchView.tsx`
- `src/screens/TemplatesScreen/views/renderSubView.tsx`

**What to do:**

1. In `TemplatesScreen.tsx`: Replace `onPreview: handlers.handleTemplatePreview` with a new inline function:
   ```ts
   const handlePreview = (template: Doc<'templates'>) => {
     viewNav.openDetail(template._id, 'trending');
   };
   ```
   Use appropriate `sourcePath` based on context: when passed to `renderSubView` for goal views use 'goal', for category use 'category', for search use 'search', for starter use 'starter', for popular/trending use 'trending'.

2. In `renderSubView.tsx`: The `onPreview` prop now navigates to detail. Replace the placeholder from Step 5 with the actual `HabitDetailView` component. Look up template by `activeView.templateId` from `allTemplates`.

3. In `useTemplateImportHandlers.ts`: Keep `handleTemplatePreview` renamed to `handleCustomizeOpen` — this is now only called from `HabitDetailView`'s customize action.

4. In `CategorySearchView.tsx`: Change to use the new `onPreview` prop that navigates to detail.

**Acceptance check:** Tap any template card → lands on `HabitDetailView` (not `TemplatePreviewModal`). "Customize" from detail opens the modal. Back navigation works from detail to parent.

---

### Step 12: Create `GuidedPickerView`

**Files to create:**
- `src/screens/TemplatesScreen/views/GuidedPickerView/GuidedPickerView.tsx`
- `src/screens/TemplatesScreen/views/GuidedPickerView/GuidedPickerView.types.ts`
- `src/screens/TemplatesScreen/views/GuidedPickerView/GuidedPickerView.hooks.ts`
- `src/screens/TemplatesScreen/views/GuidedPickerView/index.ts`
- `src/screens/TemplatesScreen/views/GuidedPickerView/components/QuestionProgress.tsx`
- `src/screens/TemplatesScreen/views/GuidedPickerView/components/AreaOfLifeQuestion.tsx`
- `src/screens/TemplatesScreen/views/GuidedPickerView/components/TimePerDayQuestion.tsx`
- `src/screens/TemplatesScreen/views/GuidedPickerView/components/StyleQuestion.tsx`
- `src/screens/TemplatesScreen/views/GuidedPickerView/components/GuidedResultsCard.tsx`
- `src/screens/TemplatesScreen/views/GuidedPickerView/components/GuidedResultsScreen.tsx`

**`GuidedPickerView.hooks.ts`:**

```ts
export function useGuidedPicker(allTemplates: Doc<'templates'>[]) {
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [timeBucket, setTimeBucket] = useState<TimeBucket | undefined>();
  const [stylePreference, setStylePreference] = useState<StylePreference | undefined>();

  // Computed: results via rankTemplatesForUser
  const results = useMemo(() => {
    if (selectedCategories.length === 0) return [];
    return rankTemplatesForUser(allTemplates, {
      selectedCategories,
      timeBucket: timeBucket ?? 'any',
      stylePreference: stylePreference ?? 'either',
      limit: 3,
    });
  }, [allTemplates, selectedCategories, timeBucket, stylePreference]);

  const hasResults = results.length > 0;
  const isRefined = timeBucket !== undefined || stylePreference !== undefined;

  return {
    currentStep, selectedCategories, timeBucket, stylePreference,
    results, hasResults, isRefined,
    setSelectedCategories, setTimeBucket, setStylePreference, setCurrentStep,
  };
}
```

**Progressive flow:**
- Q1 (`AreaOfLifeQuestion`): Chip grid from `CATEGORY_META` keys. User taps one. Results immediately appear below.
- Results show with "Refine results" toggle that expands Q2 + Q3.
- Q2 (`TimePerDayQuestion`): Radio: micro (0-5 min), steady (6-15 min), deep (16+ min).
- Q3 (`StyleQuestion`): Radio: gentle, challenging.
- Answering Q2/Q3 re-scores results in real time.

**`GuidedResultsScreen`:** Shows 3 `GuidedResultsCard` items with rank badge, template name/icon, `whyThisMatches`, "Preview" and "Add" buttons. Plus "Edit answers" and "Browse all instead" escape routes.

**Wire into `renderSubView.tsx`:** Replace placeholder for `guidedPicker` type with `<GuidedPickerView>`.

**Acceptance check:** Tap HelpMeChoosePill → GuidedPickerView opens. Select a category → 3 results appear. Change time/style → results update. "Preview" → HabitDetailView. "Add" → imports. Back → returns to landing.

---

### Step 13: Create `ImportSuccessView`

**Files to create:**
- `src/screens/TemplatesScreen/views/ImportSuccessView/ImportSuccessView.tsx`
- `src/screens/TemplatesScreen/views/ImportSuccessView/ImportSuccessView.types.ts`
- `src/screens/TemplatesScreen/views/ImportSuccessView/index.ts`
- `src/screens/TemplatesScreen/views/ImportSuccessView/components/WhatsNextSection.tsx`
- `src/screens/TemplatesScreen/views/ImportSuccessView/components/FirstImportBranchCard.tsx`
- `src/screens/TemplatesScreen/data/templatePairings.ts`

**`templatePairings.ts`:**

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
  'Morning Stretch': [
    { templateName: 'Drink Water', reason: 'Start with hydration before movement' },
    { templateName: 'Cold Shower', reason: 'Amplify the energy from stretching' },
  ],
  'Meditate': [
    { templateName: 'Journal', reason: 'Process what surfaced during meditation' },
    { templateName: 'Deep Breathing', reason: 'Pair calm with calm for maximum effect' },
  ],
};

export function getPairingsForTemplate(
  templateName: string,
  allTemplates: Doc<'templates'>[]
): { template: Doc<'templates'>; reason: string }[];
```

`getPairingsForTemplate` logic: exact name match in `TEMPLATE_PAIRINGS` → find matching templates by name in `allTemplates`. If no match, fallback: pick 1-2 popular templates from same category.

**`ImportSuccessView` design:**

Two branches based on `isFirstImport` (was `userHabitCount === 0` before import):

**First import:**
- Header: "Habit added 🎉"
- Subtitle: "[template.name] is now in your daily plan."
- Primary CTA: "Take 30-second guide" → `onOpenGuidedPicker()`
- Secondary: "View today's plan" → `onCloselibrary()`
- Tertiary: "I'm good for now" → `onDismiss()`

**Standard:**
- Header: "Habit added ✓"
- `WhatsNextSection` with 1-2 pairing suggestions
- CTAs: "View today's plan" | "Add another habit"

**`ImportSuccessView.types.ts`:**

```ts
export interface ImportSuccessViewProps {
  template: Doc<'templates'>;
  isFirstImport: boolean;
  allTemplates: Doc<'templates'>[];
  onOpenGuidedPicker: () => void;
  onCloseLibrary: () => void;
  onDismiss: () => void;
  onPreviewPairing: (template: Doc<'templates'>) => void;
  onAddPairing: (template: Doc<'templates'>) => void;
}
```

**Acceptance check:** Import a template with `userHabitCount=0` → see first-import branch. Import with `userHabitCount=3` → see standard branch with pairings.

---

### Step 14: Wire `ImportSuccessView` and Disable Toast Conflict

**Files to modify:**
- `src/screens/TemplatesScreen/TemplatesScreen.tsx`
- `src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.ts`
- `src/screens/TemplatesScreen/views/FeedbackOverlays.tsx`

**What to do:**

1. Add state: `const [successTemplate, setSuccessTemplate] = useState<Doc<'templates'> | null>(null)`.

2. After successful import in `handleDirectImport`, instead of triggering toast via `showSuccess`, set `successTemplate` to the imported template and push `ImportSuccessView` (or render it inline over the current view).

3. When `successTemplate` is set, do NOT call `showSuccess`/`showAlreadyImported` — the success view IS the feedback.

4. Dismissing `ImportSuccessView` clears `successTemplate` and returns to the browse view.

5. In `FeedbackOverlays.tsx`, add a guard: if `successViewActive` prop is true, render nothing (or skip the toast logic).

**Acceptance check:** Import a template → `ImportSuccessView` shows, no toast appears. Dismiss → back to browse. If success view code errors, toast fallback fires.

---

### Step 15: Create `useLibraryAnalytics` Hook

**Files to create:**
- `src/screens/TemplatesScreen/hooks/useLibraryAnalytics.ts`

**Interface:**

```ts
export function useLibraryAnalytics(segment: BaseSegment, variant: LandingVariant) {
  const sessionId = useRef(generateSessionId()).current;
  // ... in-memory flags for one-time events

  return {
    trackLibraryOpen: (source: string) => void,
    trackLandingVariantShown: () => void,
    trackGuideStarted: (entryPoint: string) => void,
    trackGuideCompleted: (payload: { answersArea: string; answersTimeBucket?: string; answersStyle?: string; recommendedIds: string[] }) => void,
    trackGuideAbandoned: (stepIndex: number, totalSteps: number, timeMs: number) => void,
    trackDetailOpen: (templateId: string, path: DetailSourcePath) => void,
    trackDetailSectionViewed: (templateId: string, section: string, path: DetailSourcePath) => void,
    trackLibraryAdd: (payload: { templateId: string; path: DetailSourcePath; fromCustomize: boolean; isFirstImport: boolean }) => void,
    trackDwellNoAction: (timeMs: number) => void,
    sessionId,
  };
}
```

**Implementation:** All track functions call `console.log('[Analytics]', eventName, payload)` as initial transport. Gate one-time events with `useRef` flags. `generateSessionId` = simple random string generator (no crypto dependency needed — `Math.random().toString(36).slice(2)` is fine).

**Acceptance check:** Call each track function, verify console output with correct payload shape. `sessionId` is stable within a render cycle. Remount → new `sessionId`.

---

### Step 16: Wire Analytics into Views

**Files to modify:**
- `src/screens/TemplatesScreen/TemplatesScreen.tsx` — call `trackLibraryOpen` on mount, `trackLandingVariantShown` when variant renders
- `src/screens/TemplatesScreen/views/HabitDetailView/HabitDetailView.tsx` — call `trackDetailOpen` on mount
- `src/screens/TemplatesScreen/views/GuidedPickerView/GuidedPickerView.tsx` — call `trackGuideStarted` on mount, `trackGuideCompleted` when results show, `trackGuideAbandoned` on unmount-before-completion
- Import handlers — call `trackLibraryAdd` on successful import

**Acceptance check:** Open library → console shows `library_open`. Navigate to detail → console shows `library_detail_open`. Complete guide → console shows `library_guide_completed`. Import → console shows `library_add`.

---

### Step 17: Add `isLost` Dwell Detection

**Files to modify:**
- `src/screens/TemplatesScreen/hooks/useUserSegment.ts`

**Add:**
- `landingDwellMs` tracking via `useEffect` + `setInterval` (increment every 1000ms while on landing).
- `hadAction` ref that becomes true on any navigation action.
- `searchChangeCount` state.
- `isLost = (!hadAction && landingDwellMs >= 18000) || (searchChangeCount >= 4 && !hadAction)`
- When `isLost` becomes true, return elevated `helpMeChooseCopy` and trigger `trackDwellNoAction`.

Expose `registerAction()` and `registerSearchChange()` callbacks so the parent can inform the segment hook when actions occur.

**Acceptance check:** Stay on landing for 18s without interacting → `isLost` becomes true → pill gets emphasis. Tap anything → `isLost` never triggers.

---

### Step 18: Run Tests and Fix Breakage

**What to do:**

1. Run `npx jest --passWithNoTests` (or the project's test command).
2. Run `npm run lint:max-lines`.
3. Run TypeScript check: `npx tsc --noEmit`.
4. Fix all failures. Common expected issues:
   - `renderSubView` test snapshots will need updating (new view types).
   - `CategoryDrillView.test.tsx` and `SeeAllView.test.tsx` may fail if `onPreview` behavior changed.
   - Any file over 100 lines needs splitting.

**Acceptance check:** All tests pass. No lint errors. No TypeScript errors. `npm run lint:max-lines` reports 0 violations in new files.

---

## Testing Strategy

### After Each Step

| Step | Verification |
|------|-------------|
| 1-2 | Unit test `deriveConfidenceContent`. Verify CATEGORY_META has 17 keys. |
| 3-4 | Unit test `useViewStack`. Manual: existing navigation still works. |
| 5 | App compiles. Placeholder views render for new types. |
| 6 | Unit test `useUserSegment` boundaries. |
| 7 | Visual: pill renders at bottom-right, press fires callback. |
| 8 | Manual: 3 landing variants render correct headers/sections. |
| 9 | Unit test scoring: known inputs produce expected rankings. |
| 10 | Manual: tap template → detail view renders all sections. |
| 11 | Manual: tap template from ANY surface → detail (not modal). Customize still opens modal. |
| 12 | Manual: full guided picker flow. Results appear after Q1. |
| 13-14 | Manual: import → success view. No duplicate toast. |
| 15-16 | Console: all 9 events fire at correct moments. |
| 17 | Manual: wait 18s → pill emphasis. |
| 18 | `jest`, `tsc --noEmit`, `lint:max-lines` all pass. |

### Tests to Add

1. `useViewStack.test.ts` — push, pop, reset, cap at 10.
2. `useUserSegment.test.ts` — boundary values for all segments.
3. `rankTemplates.test.ts` — known template set with expected ordering.
4. `matchExplanation.test.ts` — reason text generation.
5. `deriveConfidenceContent.test.ts` — full fields and fallback-only.
6. `getPairingsForTemplate.test.ts` — known and unknown names.

### End-to-End Flow Verification

After Step 18, manually verify these flows work without errors:

1. **New user (count=0):** Open library → see "Start one small habit today" → tap HelpMeChoosePill → guided picker → select category → results appear → tap "Preview" → detail view → tap "Add Habit" → ImportSuccessView (first-import branch) → "Take 30-second guide" → guided picker again.

2. **Returning user (count=3):** Open library → see "What do you want to work on?" → tap a goal → goal drill → tap template → detail view → "Add Habit" → success view (standard branch with pairings).

3. **Power user (count=7 or premium):** Open library → see "Find your next upgrade" → search → tap result → detail view → "Customize" → modal opens → import from modal → success view.

4. **Deep navigation:** Main → Category → Detail → Back → Category (not main!). Main → GuidedPicker → Detail → Back → GuidedPicker.

---

## Reference Materials

### Read First (before starting)

| Priority | Path | Why |
|----------|------|-----|
| 1 | `src/screens/TemplatesScreen/hooks/useViewNavigation.ts` | Current nav pattern you're replacing |
| 2 | `src/screens/TemplatesScreen/TemplatesScreen.tsx` | Main orchestration — understand prop flow |
| 3 | `src/screens/TemplatesScreen/views/renderSubView.tsx` | View dispatch logic you're extending |
| 4 | `src/screens/TemplatesScreen/data/categoryMeta.ts` | Category metadata you're extending |
| 5 | `src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.ts` | Import flow you're modifying |
| 6 | `src/screens/TemplatesScreen/views/BrowseSections.tsx` | Landing layout you're variant-switching |
| 7 | `src/screens/TemplatesScreen/views/MainBrowseView.tsx` | Main view you're modifying |
| 8 | `src/screens/TemplatesScreen/hooks/useImportFeedback.ts` | Toast system you're guarding |
| 9 | `convex/schema.ts` (lines 282-358) | Template schema — know what fields exist |
| 10 | `.superdesign/design_iterations/habit-library-redesign/segmentation-rules.md` | Segmentation logic spec |
| 11 | `.superdesign/design_iterations/habit-library-redesign/scoring-utility-design.md` | Scoring weights and factors |

### Reference as Needed

| Path | Context |
|------|---------|
| `src/screens/TemplatesScreen/views/GoalDrillView.tsx` | Example of a sub-view with `onBack`/`onPreview` |
| `src/screens/TemplatesScreen/views/CategoryDrillView.tsx` | Another sub-view pattern |
| `src/screens/TemplatesScreen/data/goalCollections.ts` | Goal collection IDs and categories |
| `src/screens/TemplatesScreen/data/habitPairings.ts` | Existing pairings — DO NOT MODIFY |
| `src/screens/TemplatesScreen/views/FeedbackOverlays.tsx` | Toast/celebration rendering |
| `src/screens/TemplatesScreen/hooks/useTemplatesScreenProps.ts` | How props are assembled |
| `src/screens/TemplatesScreen/hooks/useMainBrowseData.ts` | Data prep for main view |
| `src/screens/TemplatesScreen/views/MainBrowseView.types.ts` | Props interface for main view |
| `src/screens/TemplatesScreen/components/StarterHabitList/StarterHabitList.tsx` | Starter habits rendering |
| `.superdesign/design_iterations/habit-library-redesign/instrumentation-events-spec.md` | Full event schemas |
| `.superdesign/design_iterations/habit-library-redesign/guided-picker-wireframe.md` | Picker layout reference |
| `.superdesign/design_iterations/habit-library-redesign/habit-detail-wireframe.md` | Detail layout reference |
| `.superdesign/design_iterations/habit-library-redesign/success-next-step-wireframe.md` | Success view layout |
| `.superdesign/design_iterations/habit-library-redesign/landing-wireframes.md` | Landing variant layouts |
| `src/screens/TemplatesScreen/TemplatesScreen.handlers.ts` | Handler definitions |
| `src/screens/TemplatesScreen/views/CategorySearchView.tsx` | Uses handleTemplatePreview |

---

## Done Criteria

The implementation is complete when ALL of these are true:

- [ ] All 17 categories have `CATEGORY_META` entries
- [ ] `deriveConfidenceContent` returns non-empty strings for any template
- [ ] `useViewStack` provides push/pop/reset navigation with 10-depth cap
- [ ] `useViewNavigation` wraps `useViewStack` and all existing navigation still works
- [ ] `TemplateViewState` includes `detail` and `guidedPicker` variants
- [ ] `useUserSegment` correctly classifies all boundary cases
- [ ] `HelpMeChoosePill` renders on all 3 landing variants with segment-specific copy
- [ ] 3 distinct landing layouts render based on segment (new/returning/power)
- [ ] `rankTemplatesForUser` returns deterministic scored results
- [ ] `generateWhyThisMatches` produces human-readable explanation strings
- [ ] `HabitDetailView` renders all 6 content sections with fallbacks
- [ ] ALL `handleTemplatePreview` call sites migrated to `openDetail`
- [ ] `TemplatePreviewModal` still works as customize-only surface
- [ ] `GuidedPickerView` shows results after Q1, refines with Q2/Q3
- [ ] `ImportSuccessView` renders correct branch (first vs standard)
- [ ] `templatePairings.ts` provides pairing suggestions
- [ ] No duplicate feedback (toast disabled when success view active)
- [ ] `useLibraryAnalytics` emits all 9 event types with correct payloads
- [ ] `isLost` triggers after 18s dwell with no action
- [ ] Deep navigation works: Category → Detail → Back → Category
- [ ] No file exceeds 100 lines (excluding blanks/comments)
- [ ] All existing tests pass
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run lint:max-lines` reports zero violations in new files
- [ ] No `any` types, no `@ts-ignore`
