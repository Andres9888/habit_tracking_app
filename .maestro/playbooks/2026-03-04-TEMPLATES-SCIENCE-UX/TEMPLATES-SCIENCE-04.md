# Phase 04: Hero Card & Pack Card Enhancements

**Spec**: Templates Science-Based UX Improvements
**Design Reference**: `.superdesign/design_iterations/templates_ux_painpoint_2_1.html`
**Scope**: Small-Medium — modifying existing FeaturedCollection and PremiumPackCard

## Context

Two science principles enhance existing components:

1. **Curiosity Gap (Loewenstein, 1994)**: The hero card currently has a generic description ("Start your day with intention. 5 science-backed morning habits."). A specific outcome teaser creates curiosity tension: "Users report 2.3x more productive mornings." Specific quantified outcomes outperform generic descriptions for engagement.

2. **Recognition over Recall (Nielsen Heuristic #6, 1994)**: Pack cards currently show emoji group + name + description + habit count, but users can't see WHICH habits are inside without tapping. Adding tiny preview chips ("🧘 Meditate", "📖 Deep Read", "+2") lets users evaluate contents at a glance, reducing the need to recall or guess.

## Data Flow

- Hero card: `FeaturedCollection.tsx` — add an outcome stat line
- Hero footer: `HeroFooter.tsx` — could add avatar stack (small enhancement)
- Pack cards: `PremiumPackCard.tsx` — derive preview chip names from the pack's habit list in `premiumPacks.ts`

## Tasks

- [x] **Add curiosity gap outcome text to the hero card.** In the FeaturedCollection component (`src/screens/TemplatesScreen/components/FeaturedCollection/`):
  - ✅ Created `HeroOutcome.tsx` (28 lines) — frosted container with "Users report **2.3x more productive** mornings" text. Rendered between description and HeroChips in FeaturedCollection.tsx (46 lines). No changes needed to styles file.
  - Add a new text element between the description and the habit chips that shows an outcome stat: "Users report 2.3x more productive mornings" (or similar quantified outcome).
  - Style it as a subtle inline container: semi-transparent white background (`rgba(255,255,255,0.12)`), 8px border-radius, 5px 10px padding, font-size 12px, white text at ~90% opacity, with a bold/white `<Text>` for the "2.3x more productive" portion.
  - This may require adjusting `FeaturedCollection.styles.ts` to add an `outcomeContainer` and `outcomeBold` style.
  - Adjust vertical spacing so the card doesn't feel cramped — the description text above can be shortened slightly if needed.
  - All files under 100 lines. Run `npx tsc --noEmit --pretty`.

- [x] **Add preview habit chips to pack cards (Recognition over Recall).** In the PremiumPackCard and PremiumPacksSection components (`src/screens/TemplatesScreen/components/PremiumPacksSection/`):
  - ✅ Created `PackPreviewChips.tsx` (45 lines) — shows first 2 habit chips (emoji + name) + "+N" remaining. Replaced old habit count text in PremiumPackCard.tsx (76 lines). Removed unused `fontFamilies` import and `habitCount` style.
  - In `PremiumPackCard.tsx`, add a row of small preview chips below the description text. Each chip shows an emoji + short habit name (e.g., "🧘 Meditate", "📖 Deep Read"). Show 2 chips + a "+N" chip for remaining.
  - Style the chips: `rgba(255,255,255,0.15)` background, 6px border-radius, 2px 6px padding, font-size 10px, white text at 85% opacity. Wrap in a flex row with 4px gap and `flexWrap: 'wrap'`.
  - The chip data comes from the pack's `habits` array in `premiumPacks.ts`. Each habit already has an `icon` and `name` property — use the first 2 habits for named chips and `+N` for the rest.
  - Remove the old `"X habits"` count text since the chips make it redundant, or keep it as a small monospace subtitle below the chips.
  - All files under 100 lines. Run `npx tsc --noEmit --pretty`.

## Verification

- Hero card shows a quantified outcome stat ("2.3x more productive mornings") in a frosted container
- Each pack card shows 2 named habit preview chips + "+N" count
- Visual balance is maintained — cards don't feel overly tall or cramped
- All files under 100 lines, zero TypeScript errors
