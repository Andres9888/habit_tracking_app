# Add a "Why & Benefits" Section to Habit Details

## Context

The user wants a section on the habit details screen that surfaces:
1. **Personal motivation** — why _they_ are building this habit
2. **Science-backed benefits** — what the habit actually does (evidence-grounded)

It must work for **all habits**, including custom-created ones with no template backing. The user is unsure of placement — this plan recommends one and lays out the implications.

Today the Goal tab already has a `GoalWhyAnchor` showing `habit.why` / `identity` / `woopWish`. Templates carry richer content (`description`, `scientificReference`, `tips[]`) and render it nicely in `FullsizeTemplatePreview`, but **none of that template content is copied onto the habit at creation** — so once a habit exists, the rich "why" is lost.

## Recommendation

**Add a collapsible `HabitWhyBenefitsCard` inside the Goal tab, between `GoalWhyAnchor` and `StreakGoalCard`** — at `src/screens/HabitDetailScreen/components/GoalTabContent.tsx` line 79–81.

The card unifies personal + educational content under one expandable surface:
- **Personal block** (always shown if any of `why`, `identity`, `woopWish` exist — reuses or replaces today's `GoalWhyAnchor`)
- **Benefits list** — bulleted, theme-aware
- **Science note** — short paragraph + optional reference

Defaults: **expanded when any content exists, hidden when empty** (custom habits with nothing filled in show nothing — no sad empty card).

### Why this placement

- Goal tab is already the conceptual "purpose" home of the screen. Personal why + scientific benefits both answer "why am I doing this?" — same surface.
- Collapsibility prevents bloat for habits with rich content (3–5 benefits + science note can otherwise push `StreakGoalCard` below the fold).
- The pattern already exists — `CollapsibleSectionCard`, `StreakRecordsAccordion` — no new primitive needed.
- A 4th tab ("About") was rejected: tabs are scrollspy anchors over recurring progress surfaces (calendar, strength, goal); benefits are read-once reference content.
- A card above the tabs was rejected: it pushes the sticky tab bar down and hurts the scrollspy UX.

## Schema Changes (Convex)

Add to the habits table in `convex/schema.ts`:

```
benefits: v.optional(v.array(v.string()))
scienceNote: v.optional(v.string())
```

Add to the templates table (if missing):

```
benefits: v.optional(v.array(v.string()))
```

(`description`, `scientificReference`, `tips[]` already exist on template.)

**At habit creation from a template** (in the create mutation), copy:
- `template.benefits` → `habit.benefits`
- `template.scientificReference` (or `template.description`) → `habit.scienceNote`

This matches the existing precedent: `template.suggestedWhy` is already copied to `habit.why` at creation.

**Tradeoff accepted:** copy-at-creation means template updates don't propagate to existing habits. We accept this because it lets users _edit_ benefits to personalize, avoids a render-time DB lookup, and matches the existing pattern. Custom habits start empty and are filled via the edit screen.

## Component Work

### Extract reusable presentational pieces

Move from `src/components/FullsizeTemplatePreview/components/` to a shared location (e.g. `src/components/habit/why/`):

- `DescriptionSection.tsx` (29 lines, already pure) — rename to something neutral like `LongTextBlock` or keep as `DescriptionSection`
- `ScienceEvidenceSection.tsx` + its sub-pieces (`ScienceQuoteBlock`, `ScienceEvidenceTips`) — these are larger; extract conservatively (only what we'll reuse).

Update `FullsizeTemplatePreview` to import from the new shared location (zero behavior change there). This converts a future decomposition cost into present-day work, which is cheaper than duplicating styles now and refactoring twice.

### New component

`src/screens/HabitDetailScreen/components/HabitWhyBenefitsCard/`
- `index.ts` — barrel export
- `HabitWhyBenefitsCard.tsx` — orchestrates layout, collapsible chrome, empty-state logic (≤100 lines)
- `HabitWhyBenefitsCard.hooks.ts` — derives `hasPersonal`, `hasBenefits`, `hasScience` flags
- `HabitWhyBenefitsCard.types.ts` — props

Composes: collapsible header (`CollapsibleSectionCard` pattern) → personal block → benefits list (bulleted) → science note (uses extracted shared components).

### Edit flow

`src/screens/HabitEditScreen/HabitEditScreen.tsx` — add editors for:
- `benefits` (multi-line list — one per row, simple add/remove)
- `scienceNote` (multi-line text)

`why`, `identity`, `woopWish` already have editors there (verify before implementing).

## Critical Files to Modify

- `convex/schema.ts` — add `benefits`, `scienceNote` to habits; `benefits` to templates
- `convex/habits.ts` (or wherever `createHabit` lives) — copy template fields on creation
- `src/features/habits/types.ts` — extend `Habit` type with new optional fields
- `src/screens/HabitDetailScreen/components/GoalTabContent.tsx` — insert `<HabitWhyBenefitsCard />` between `<GoalWhyAnchor />` (line 79) and `<StreakGoalCard />` (line 81)
- `src/screens/HabitDetailScreen/components/HabitWhyBenefitsCard/` — new component directory
- `src/components/FullsizeTemplatePreview/components/DescriptionSection.tsx` — relocate to shared, update import in `PreviewContent.tsx`
- `src/components/FullsizeTemplatePreview/components/ScienceEvidenceSection.tsx` (+ children) — same treatment, scope minimally
- `src/screens/HabitEditScreen/HabitEditScreen.tsx` — add `benefits` + `scienceNote` editors

## Open Questions to Settle Before Implementation

1. **Should `HabitWhyBenefitsCard` replace or sit beside `GoalWhyAnchor`?** Replacing is cleaner (one card for "why"); beside keeps the existing emoji-coded anchor visible at all times. Recommendation: **replace**, fold the anchor's logic into the card's "personal block."
2. **Source of seed benefits for templates** — does someone need to author `template.benefits` arrays for the existing template library, or is that a follow-up content task? Plan assumes follow-up.
3. **Identity + WOOP fields** — keep them inside the personal block, or leave WOOP as its own separate disclosure elsewhere? Recommendation: keep in the same card under one collapsed section; revisit if it gets crowded.

## Verification

End-to-end testing:

1. **Schema migration safe** — run `npx convex dev` locally; verify no schema errors and existing habits load.
2. **Template-derived habit** — create a habit from a template that has `benefits` + `scientificReference` populated. Open habit details → Goal tab. Confirm card renders with the copied content, expanded by default.
3. **Custom habit, empty** — create a habit with no template. Open Goal tab. Confirm the card is hidden (no sad empty state).
4. **Custom habit, edited** — edit the habit, add a personal `why` and 2 benefits + a science note. Confirm card now appears with all three blocks.
5. **Collapse/expand** — confirm tap target toggles, animation matches `StreakRecordsAccordion`.
6. **Theme** — toggle light/dark, confirm card styling matches surrounding `cardStyle` in `GoalTabContent`.
7. **Lint** — `npm run lint:max-lines` — ensure new files ≤100 lines.
8. **Type check** — `npx tsc --noEmit`.
9. **`FullsizeTemplatePreview` regression** — open the template preview screen, confirm description + science sections still render identically after the import path change.

## Out of Scope

- Authoring `benefits[]` content for existing templates (separate content task).
- Backfilling `benefits` / `scienceNote` onto pre-existing habits in production (one-shot migration if desired later — copy from `templateId` lookup).
- Rich-text editing in the habit edit screen (plain text + array of strings is enough for v1).
