# Growth Type Pills — Wire Up the Real Habit Library Screen

## Context

The previous plan (`make-template-growth-badges-visible.md`) implemented the growth-type pill (`Simple` / `Average` / `Complex` + `~21d/~66d/~120d`) on `TemplateListItem` and ran a Convex backfill so `growthType` is populated on ~315/347 dev templates.

The user still doesn't see the pills because the change was applied to the **wrong component**:

- `src/components/CreateHabitModal/components/TemplateListItem/TemplateListItem.tsx` is the **legacy** CreateHabitModal row — not the screen the user is browsing.
- The actual **Habit Library** screen the user opens lives in `src/screens/TemplatesScreen/` and renders rows via `views/TemplateListCard/TemplateListCard.tsx` → `CardFooterMeta.tsx`. Neither reads `growthType`.

Convex data is healthy (verified by readonly query against `valuable-guineapig-979`):
- `total: 347`, `withGrowthType: 315` (simple 148, average 126, complex 41, undefined 32).

So no Convex/schema/backfill work remains — only the front-end needs to read the field in the right place.

## Scope

Surgical addition only:
1. Make `getGrowthTypeMeta` reachable by the TemplatesScreen without a cross-feature import.
2. Render the growth-type pill inside the existing `CardFooterMeta` meta-pill row next to frequency / category / popularity.
3. Leave `TemplateListItem` alone — it already has the pill and the legacy modal still uses it.

No layout redesign, no new components, no backend changes.

## Implementation

### 1. Promote the helper to a shared util (minimal move)

Move:
- `src/components/CreateHabitModal/components/TemplateListItem/growthTypeMeta.ts`
→ `src/utils/growthTypeMeta.ts`

Keep the API identical (`GrowthType`, `GrowthTypeMeta`, `getGrowthTypeMeta`). Update the one existing import in:
- `src/components/CreateHabitModal/components/TemplateListItem/TemplateListItem.tsx`
  - Change `import { getGrowthTypeMeta } from './growthTypeMeta';` → `from '@/utils/growthTypeMeta';` (or relative path consistent with neighboring imports — check the file’s existing alias usage; `@/theme/...` is already in use).

### 2. Add growth-type pill to the Habit Library row

File: `src/screens/TemplatesScreen/views/TemplateListCard/CardFooterMeta.tsx`

- Accept a new optional prop `growthType?: 'simple' | 'average' | 'complex'` (re-export the type from the util, or import `GrowthType`).
- Inside the existing `<View style={styles.metaRow}>`, render a new pill **before** the frequency pill so the growth signal reads first:
  ```
  {growthMeta ? (
    <View style={[styles.metaPill, { backgroundColor: growthMeta.pillBg, borderColor: growthMeta.pillBg }]}>
      <Text style={[styles.metaLabel, { color: growthMeta.pillFg }]}>
        {growthMeta.label} · ~{growthMeta.days}d
      </Text>
    </View>
  ) : null}
  ```
- Compute `growthMeta` via the shared `getGrowthTypeMeta(growthType)` import.
- Reuse the existing `styles.metaPill` / `styles.metaLabel` so it sits naturally with the frequency / category / popularity pills. Override only `backgroundColor`, `borderColor`, and text color from `growthTypeMeta` so the pill colors stay consistent with the legacy implementation.

### 3. Pass the field through `TemplateListCard`

File: `src/screens/TemplatesScreen/views/TemplateListCard/TemplateListCard.tsx`

- The component already gets `item: Doc<'templates'>`. Pass `growthType={item.growthType}` into `<CardFooterMeta ... />`.
- No other changes — title row, add button, description, and match row stay identical.

### 4. (No backend changes)

Leave `convex/schema.ts`, `convex/templates/types.ts`, `convex/templatesDataSeed.ts`, and `convex/habits/validators.ts` as-is in the working tree. They’re already deployed (the data shows `growthType` values), so no `convex run` / `convex deploy` is required for this fix.

## Critical Files

- Move: `src/components/CreateHabitModal/components/TemplateListItem/growthTypeMeta.ts` → `src/utils/growthTypeMeta.ts`
- Edit: `src/components/CreateHabitModal/components/TemplateListItem/TemplateListItem.tsx` (single import path update)
- Edit: `src/screens/TemplatesScreen/views/TemplateListCard/TemplateListCard.tsx` (pass prop)
- Edit: `src/screens/TemplatesScreen/views/TemplateListCard/CardFooterMeta.tsx` (render pill)

## Verification

1. Type check the touched files (or run `npx tsc --noEmit` if available in this workspace).
2. Open the app and navigate to the Habit Library (the new screen, not the “+ create habit” modal). Confirm each row in:
   - `TemplatesList` (default browse)
   - `SeeAllView` (See all → category)
   - `DrillListBody` (category drill)
   shows the growth pill (`Simple · ~21d` / `Average · ~66d` / `Complex · ~120d`) alongside the existing frequency / category pills.
3. Confirm templates without a `growthType` (~32 in dev) render normally with no pill instead of an empty pill — guaranteed by `getGrowthTypeMeta` returning `null`.
4. Re-run the readonly count query against `valuable-guineapig-979` if rows look wrong; expected: `withGrowthType: 315 / total: 347`.
5. Open the legacy CreateHabitModal template list once to confirm the existing pill there still renders (regression check after import-path update).

## Out of Scope

- Restyling the Habit Library card layout.
- Adding growth pills to `MiniTemplateCard`, `FeaturedGoalStarterRow`, or the TemplatePreview modal — only the list row was requested.
- Production deployment / prod backfill (`wandering-wolf-192` has 0 templates; not used by the simulator).
