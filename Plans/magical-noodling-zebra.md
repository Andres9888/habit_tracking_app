# Category Drill Page — Remove Science Badge + 3-Line Description

## Context

On the category drill page (Library → category, e.g. Sleep) the user wanted two surgical UI tweaks:
1. Remove the `🔬 N science-backed` badge from the hero header — felt redundant/noisy.
2. Allow the **habit card** description (in the list beneath the hero) to show up to 3 lines instead of 2, so descriptions don't truncate prematurely.

The hero subtitle was also bumped from `numberOfLines={2}` → `3` as a defensive cap (current short copy still renders on 1 line; only kicks in if copy gets longer).

## Files Modified

- `src/screens/TemplatesScreen/views/CategoryHero.tsx` — removed science badge JSX, removed `scienceCount` prop + styles, bumped subtitle `numberOfLines` to 3.
- `src/screens/TemplatesScreen/views/CategoryDrillView.tsx` — removed `scienceCount` calculation and the prop passed into `CategoryHero`.
- `src/screens/TemplatesScreen/views/TemplateListCard/TemplateListCard.tsx` — bumped habit-card description `numberOfLines` from 2 → 3.

## What Is NOT Changing

- Category subtitle copy (stayed the original short strings).
- Any other page/component (`CategoryGroupHeader`, section labels, etc.).
- Data model, filtering, or sort logic.
- The separate "overall page improvements" discussion (sticky filters, empty state, View details footer, etc.) — parked for a future PR.

## PR Creation Steps

1. Commit the uncommitted changes with a descriptive message.
2. Push branch `remove-fact-tag-three-lines` to origin with `-u`.
3. Open PR against `main` via `gh pr create` with a concise title (<80 chars) and a short body.
