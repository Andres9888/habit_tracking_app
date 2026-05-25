# Shared Scoring Utility Design

## Objective
Define one scoring utility used by both:
- onboarding-v2 recommendation path (`useDemoTemplates`)
- habit library guided picker (3-question flow)

This replaces today's onboarding binary scoring (`preferred.has(category) ? 1 : 0`) with weighted, explainable, deterministic ranking.

## Existing inputs and field references
- **Template fields (Convex `templates`):** `category`, `estimatedMinutes`, `growthType`, `popularityScore`, `scientificReference`, `suggestedWhy`, `startSmallVersion`, `suggestedCue`, `suggestedIdentity`, `createdAt`, `_id`.
- **Library taxonomy:** `GOAL_COLLECTIONS` with transformation goals and category sets.
- **Onboarding taxonomy:** `GOAL_OPTIONS`, `CATEGORY_OPTIONS`, and `CATEGORY_MAP` -> backend categories.

## Taxonomy mismatches + normalization strategy
- `GOAL_OPTIONS` ids (`movement`, `mind`, `health`, `craft`, etc.) do not match `GOAL_COLLECTIONS` ids (`more-energy`, `sleep-better`, `less-stress`, etc.).
- Template schema includes categories missing explicit `CATEGORY_META` entries: `relationships`, `environmental_design`, `subtraction`.
- Onboarding currently scores from category preferences only; goal choice does not map into `GOAL_COLLECTIONS` today.

Normalization strategy:
1. **Canonical category key** = backend template `category` id.
2. **Onboarding adapter**: convert onboarding category ids through `CATEGORY_MAP` into canonical category ids.
3. **Goal-intent adapter**: map onboarding `goal` and/or guided flow selections into canonical categories through a static `GOAL_INTENT_TO_CATEGORIES` table.
4. **UI metadata fallback**: if `CATEGORY_META` lacks an entry, render with `DEFAULT_CATEGORY_META` while preserving canonical id for scoring.

## Proposed utility location and signature
Target file (design only): `src/shared/recommendation/scoreTemplates.ts`

```ts
export type StylePreference = 'gentle' | 'challenging' | 'either';
export type TimeBucket = 'micro' | 'steady' | 'deep' | 'any';

export interface RecommendationInput {
  selectedCategories: string[];      // canonical backend ids
  selectedGoalIds?: string[];        // goal collection ids OR onboarding goal ids
  timeBucket?: TimeBucket;           // derived from Q2
  stylePreference?: StylePreference; // derived from Q3
  limit?: number;                    // default 3 for guided, 8 for onboarding
}

export interface RecommendationReason {
  key: 'category' | 'goal' | 'time' | 'style' | 'evidence' | 'adherence' | 'popularity';
  label: string;
  contribution: number;
}

export interface RankedTemplate {
  template: TemplateDoc;
  score: number;
  reasons: RecommendationReason[]; // sorted desc by contribution
  whyThisMatches: string;          // user-facing sentence
}

export function rankTemplatesForUser(
  templates: TemplateDoc[],
  input: RecommendationInput
): RankedTemplate[];
```

## Scoring factors (weighted)
Base score starts at `0`.

1. **Category fit (max +45)**
   - `+45` exact category in `selectedCategories`
   - `+18` category is in a mapped goal-intent category set
2. **Time fit (max +25)**
   - Buckets:
     - `micro`: 0-5
     - `steady`: 6-15
     - `deep`: 16+
   - `+25` in bucket, `+12` adjacent bucket, `0` otherwise
   - If `estimatedMinutes` missing: use fallback heuristics (`isQuickTemplate`) for micro or treat as unknown (`+6`)
3. **Style fit (max +20)**
   - `gentle`: `simple=+20`, `average=+12`, `complex=+0`
   - `challenging`: `complex=+20`, `average=+12`, `simple=+0`
4. **Evidence/trust boost (max +6)**
   - `+6` if `scientificReference` exists
5. **Adherence feasibility boost (max +6)**
   - `+3` if `startSmallVersion` exists
   - `+2` if `suggestedCue` exists
   - `+1` if `suggestedIdentity` exists
6. **Popularity boost (max +8)**
   - Normalize `popularityScore` percentile within candidate set (`0..8`)

Total score range roughly `0..110`.

## "Why this matches you" generation
Build explanation from top 2-3 non-zero reasons:
- Category reason first.
- Then time/style reason.
- Then trust/adherence signal if needed.

Example output:
`"Great fit because it matches your Sleep focus, works in your 0-5 minute window, and uses a gentle build style."`

## Tie-breakers (deterministic)
When scores are equal, apply in order:
1. More exact matches (count of exact: category/time/style)
2. Higher `popularityScore`
3. Has `scientificReference`
4. Lower `estimatedMinutes` (prefer easier entry for undecided users)
5. Newer `createdAt`
6. Lexicographic `_id` (final deterministic fallback)

## Migration strategy
1. **Add utility (no behavior change yet)** in shared recommendation module.
2. **Onboarding integration first**:
   - replace `useDemoTemplates` local `score: preferred.has(category) ? 1 : 0`
   - pass normalized categories from `CATEGORY_MAP`
   - keep output limit at 8 and existing UI contract
3. **Guided library integration**:
   - new `GuidedPickerView` submits Q1/Q2/Q3 as `RecommendationInput`
   - request top 3 ranked templates and render `whyThisMatches`
4. **Compatibility bridge**:
   - keep old onboarding code path behind temporary flag (`legacyBinaryScoring`)
   - run side-by-side analytics logging score deltas before full cutover
5. **Remove legacy scorer** after parity checks and metric validation.

## Analytics impact (for later implementation)
Emit diagnostic payloads for explainability and tuning:
- `scoring_model_version`
- `selected_categories`
- `time_bucket`
- `style_preference`
- per result: `template_id`, `score`, `reason_keys`

## Decision summary
- Use one weighted scoring utility across onboarding and guided library.
- Score on canonical backend categories, with adapters from onboarding and goal-taxonomy sources.
- Always return explainable reasons and deterministic ranking for stable UX and easier experimentation.
