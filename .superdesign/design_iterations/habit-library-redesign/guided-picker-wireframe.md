# Guided Picker Wireframe (3 Questions)

## Goal
Give undecided users a fast guided path that asks 3 questions and returns the top 3 habit templates with a clear "why this matches you" explanation.

## Inputs reused from codebase
- **Area of life (Q1):** template categories from `CATEGORY_META` (`categoryMeta.ts`) plus fallback categories found in template schema (`relationships`, `environmental_design`, `subtraction`).
- **Time/day (Q2):** `estimatedMinutes` from templates (`schema.ts`), shown as buckets.
- **Style (Q3):** `growthType` (`simple | average | complex`) mapped to UI tone (`gentle | challenging`).
- **Output cards:** existing template fields (`name`, `description`, `category`, `estimatedMinutes`, `growthType`, `scientificReference`, `suggestedWhy`, `startSmallVersion`, `suggestedCue`, `suggestedIdentity`).

## Component tree contract
- `GuidedPickerHeader`
- `QuestionProgress`
- `AreaOfLifeQuestion`
- `TimePerDayQuestion`
- `StyleQuestion`
- `GuidedResultsHeader`
- `GuidedTemplateCard` (x3)
- `MatchReasonList` (inside each card)
- `GuidedPrimaryActions`

## Question copy + options contract
1. **What area of life do you want to improve first?**
   - Suggested first-row options: `health_fitness`, `sleep`, `mindfulness`, `productivity`, `morning_routine`, `mental_health`, `learning`, `financial`
2. **How much time can you realistically spend each day?**
   - `micro` (0-5 min), `steady` (6-15 min), `deep` (16+ min)
3. **What style fits you right now?**
   - `gentle` (maps to `growthType=simple`, allows `average`)
   - `challenging` (maps to `growthType=complex`, allows `average`)

## Layout wireframe (mobile-first)
```text
┌─────────────────────────────────────────────┐
│ ← Back                     Guided picker    │
│ 3 quick questions · ~30s                   │
├─────────────────────────────────────────────┤
│ Progress: [●●○] Question 2 of 3            │
├─────────────────────────────────────────────┤
│ Q1. Area of life                            │
│ [Health] [Sleep] [Mindfulness] [Focus]     │
│ [Morning] [Mental health] [Learning] ...   │
├─────────────────────────────────────────────┤
│ Q2. Time per day                            │
│ ( ) Micro: 0-5 min                          │
│ ( ) Steady: 6-15 min                        │
│ ( ) Deep: 16+ min                           │
├─────────────────────────────────────────────┤
│ Q3. Style                                   │
│ ( ) Gentle start   ( ) Challenging push     │
├─────────────────────────────────────────────┤
│ [Show my best matches]                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Your top 3 matches                          │
│ Based on: Sleep · Micro · Gentle           │
├─────────────────────────────────────────────┤
│ #1 [😴] 2-min Wind-down Check-in            │
│ Why this matches you:                       │
│ • Fits your 0-5 min time window             │
│ • Gentle build style (simple growth)        │
│ • Sleep category aligns with your focus     │
│ [Preview] [Add]                             │
├─────────────────────────────────────────────┤
│ #2 ...                                      │
├─────────────────────────────────────────────┤
│ #3 ...                                      │
└─────────────────────────────────────────────┘
```

## Interaction notes
- Keep all 3 questions in one stacked scroll layout for speed; submit when all required answers exist.
- Results must always show 3 cards (fallback to broad matches if strict filters return fewer than 3).
- Each result card includes a compact reason list with the strongest 2-3 scoring factors.
- "Why this matches you" line should prefer user-language labels, not raw ids.

## Taxonomy mismatch callouts (for mock/spec alignment)
- `GOAL_OPTIONS` onboarding ids (`movement`, `mind`, `health`, `craft`) do not match `GOAL_COLLECTIONS` ids (`more-energy`, `sleep-better`, etc.).
- Convex template categories include `relationships`, `environmental_design`, `subtraction`, but `CATEGORY_META` currently has no explicit metadata entries for them.
- Normalization for this flow: scoring runs on canonical backend category ids; UI labels/icons come from `CATEGORY_META` with default fallback metadata for missing entries.
