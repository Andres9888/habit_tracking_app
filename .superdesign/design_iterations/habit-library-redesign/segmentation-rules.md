# Landing Segmentation Rules (decide_segmentation)

Scope: rule set for selecting `TemplatesScreen` landing variant (`new`, `returning`, `power`) and applying `lost` assist affordances.

## 1) Base segment thresholds

Evaluate in this order using existing signals (`userHabitCount`, premium state):

| Segment | Rule | Landing variant |
|---|---|---|
| `power` | `isPremiumUser === true` OR `userHabitCount >= 6` | `landing-power-user` |
| `returning` | `userHabitCount >= 2 AND userHabitCount <= 5` | `landing-returning-user` |
| `first_time` | `userHabitCount <= 1` OR unknown count on very first library open | `landing-new-user` |

Notes:
- Unknown/undefined `userHabitCount` defaults to `first_time` for safety.
- `isPremiumUser` immediately promotes to `power` regardless of habit count.

## 2) Lost/undecided overlay signals

`lost` is an overlay state, not a standalone base landing.

Mark `isLost = true` when any rule is met:

1. **Dwell-without-action**
   - `landingDwellMs >= 18000`
   - AND no `goal_select`, `template_preview`, `template_import`, `search_submit`, `category_open`
2. **Repeated open-close without progress**
   - `libraryOpenCount24h >= 3`
   - AND `templateImportCount24h === 0`
3. **Search churn without commitment**
   - `searchQueryChangeCount >= 4`
   - AND no preview/import action in same session

When `isLost = true`, keep base segment landing but force:
- `HelpMeChoosePill` visible and elevated
- contextual copy variant:
  - first_time: `Not sure? 30-sec guide`
  - returning: `Help me choose`
  - power: `Need inspiration?`

## 3) Fallback and precedence logic

Deterministic decision order:

1. Resolve `baseSegment` (`power` > `returning` > `first_time`)
2. Evaluate `isLost` overlay
3. Select variant:
   - `baseSegment === first_time` -> `landing-new-user`
   - `baseSegment === returning` -> `landing-returning-user`
   - `baseSegment === power` -> `landing-power-user`
4. Apply `lost` UI overrides if `isLost`

Fail-safe behavior:
- If telemetry missing, default to base segment by `userHabitCount`.
- If both count and premium are missing, use `landing-new-user`.
- If any computation errors, log and render `landing-returning-user` as neutral fallback.

## 4) Event payload fields

Fields below are required for segmentation observability and future tuning.

### `library_open`
- `type`: `"library_open"`
- `source`: `"templates_screen"`
- `sessionId`: string
- `userHabitCount`: number | null
- `isPremiumUser`: boolean | null
- `baseSegment`: `"first_time" | "returning" | "power"`
- `isLost`: boolean
- `variantShown`: `"landing-new-user" | "landing-returning-user" | "landing-power-user"`
- `openCount24h`: number

### `library_landing_variant_shown`
- `type`: `"library_landing_variant_shown"`
- `sessionId`: string
- `variantShown`: same enum as above
- `baseSegment`: same enum as above
- `lostTrigger`: `"none" | "dwell_no_action" | "repeat_open_no_import" | "search_churn"`
- `userHabitCount`: number | null
- `isPremiumUser`: boolean | null

### `library_dwell_no_action`
- `type`: `"library_dwell_no_action"`
- `sessionId`: string
- `dwellMs`: number
- `searchQueryChangeCount`: number
- `hadQuickFilterTap`: boolean
- `hadGoalTap`: boolean
- `hadPreviewTap`: boolean
- `hadImportTap`: boolean
- `baseSegment`: segment enum
- `variantShown`: variant enum

### Optional assist telemetry
- `library_guide_started` / `library_guide_completed` / `library_guide_abandoned`
  - include: `sessionId`, `baseSegment`, `isLost`, `entryPoint` (`help_pill` | `hero_cta`), `variantShown`

## 5) Pseudocode contract

```ts
function resolveLandingSegment(input: {
  userHabitCount?: number | null;
  isPremiumUser?: boolean | null;
  landingDwellMs: number;
  libraryOpenCount24h: number;
  templateImportCount24h: number;
  searchQueryChangeCount: number;
  hadAction: boolean;
}) {
  const count = input.userHabitCount ?? 0;
  const baseSegment =
    input.isPremiumUser || count >= 6 ? 'power' :
    count >= 2 ? 'returning' :
    'first_time';

  const isLost =
    (!input.hadAction && input.landingDwellMs >= 18000) ||
    (input.libraryOpenCount24h >= 3 && input.templateImportCount24h === 0) ||
    (input.searchQueryChangeCount >= 4 && !input.hadAction);

  const variantShown =
    baseSegment === 'power' ? 'landing-power-user' :
    baseSegment === 'returning' ? 'landing-returning-user' :
    'landing-new-user';

  return { baseSegment, isLost, variantShown };
}
```
