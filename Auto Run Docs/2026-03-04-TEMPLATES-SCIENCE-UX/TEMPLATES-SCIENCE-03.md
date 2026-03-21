# Phase 03: "For You" Personalized Recommendations Section

**Spec**: Templates Science-Based UX Improvements
**Design Reference**: `.superdesign/design_iterations/templates_ux_painpoint_2_1.html`
**Scope**: Large — new section with new component, hook, and data logic

## Context

The "For You" section is the most significant new feature. It addresses the #1 unsolved pain point: **choice paralysis** ("Which habit is right for ME?"). Three science principles drive the design:

1. **Common Region (Palmer, 1992)**: The For You section uses a warm background tint (`#fefbf6` → `#fdf6ee` gradient) to visually distinguish it from other sections using Gestalt's Common Region principle.

2. **Mere Exposure (Zajonc, 1968)**: Connection cues like "Complements your Morning Meditation" bridge unfamiliar habits to ones the user already knows — familiarity breeds preference.

3. **Behavioral Social Proof**: "78% of readers also walk daily" uses collaborative filtering language to build confidence through peer behavior.

## Design

The section renders between Trending Now and the Hero Card:

- Warm gradient background with subtle top/bottom borders
- Header: "✨ For You" with a "SMART" badge (sparkles icon)
- Subtitle: "Based on your current habits"
- 2 recommendation cards, each with: emoji icon (44px), habit name, connection cue text, and a 38px green add button
- Cards have white background on top of the warm section background

## Data Flow

- Recommendations are derived from the user's existing habit list (from Convex `habits` query)
- A simple recommendation engine: look at the user's habit categories and suggest templates from complementary categories
- If user has no habits yet, hide the section entirely (avoid empty state)
- The "For You" data can be computed in `useMainBrowseData.ts` or a new `useForYouRecommendations.ts` hook

## Tasks

- [x] **Create the ForYouSection component.** Create a new component directory at `src/screens/TemplatesScreen/components/ForYouSection/` with the following files:
  - `index.ts` — barrel export
  - `ForYouSection.tsx` — main component (≤100 lines). Renders: a container View with warm gradient background (use a simple View with background color `#fefbf6` — LinearGradient is optional), subtle top/bottom border (`#f5ead8`), 20px padding. Inside: section header row with "✨ For You" title + a small "SMART" badge (sparkles icon from lucide + green text), subtitle "Based on your current habits", then maps over recommendation items rendering `ForYouCard` for each.
  - `ForYouCard.tsx` — individual recommendation card (≤100 lines). Renders: white background card with 16px border-radius, 1.5px border `#ede8df`, horizontal flex layout with: 44×44 emoji icon container (12px border-radius, 10% opacity background tinted by category color), text column (habit name bold 14px, connection cue text 12px with green-highlighted lead phrase like "Complements" or "78% of readers"), and a 38px circular green add button on the right. The add button should use the same import handler pattern as TrendingCard's AddButton.
  - `ForYouSection.types.ts` — type definitions for props. The section receives: `recommendations: Array<{template: Template, connectionCue: string, cueHighlight: string}>`, `importedIds: Set<string>`, `importingIds: Set<string>`, `onImport: (template) => void`, `onPreview: (template) => void`.
  - All files must be under 100 lines. Run `npx tsc --noEmit --pretty`.

- [x] **Create the recommendation engine hook.** Create `src/screens/TemplatesScreen/hooks/useForYouRecommendations.ts` (≤100 lines). This hook:
  - Takes `allTemplates` (the full template list) and `userHabitNames` (array of the user's current habit names/categories, obtained from the existing habits query in the app).
  - If the user has no habits, returns an empty array.
  - Simple recommendation logic: find templates in complementary categories to the user's existing habits. For example, if user has morning habits, recommend evening/sleep habits. If user has fitness, recommend mindfulness. Map category pairs: `morning_routine ↔ evening_routine/sleep`, `fitness ↔ mindfulness`, `learning ↔ productivity`, etc.
  - For each recommendation, generate a `connectionCue` string: either "Complements your [existing habit name]" or a social proof cue like "78% of [category] users also do this".
  - Return top 2-3 recommendations sorted by popularity.
  - If the user's habits can't be matched, fall back to the top 2 most popular templates not already tracked.
  - Run `npx tsc --noEmit --pretty`.
  - ✅ Done: 94 non-blank/non-comment lines. tsc passes in main repo; worktree lacks node_modules (known #2895).

- [x] **Wire ForYouSection into MainBrowseView.** In `src/screens/TemplatesScreen/views/MainBrowseView.tsx`:
  - Import `ForYouSection` component.
  - Add it between the Trending Now section (PopularSection) and the Hero card (FeaturedCollection) in the render order.
  - Wrap it in the same `FadeInDown` animation with appropriate stagger delay.
  - Pass the required props: recommendations from the hook, importedIds, importingIds, onImport handler, onPreview handler.
  - The recommendation data should be computed in `useMainBrowseData.ts` or `useTemplatesScreenProps.ts` and passed down. If the user has no habits and recommendations is empty, do not render the section at all (conditional rendering).
  - Update `MainBrowseView.types.ts` to include the new props.
  - All modified files must stay under 100 lines. Run `npx tsc --noEmit --pretty`.
  - ✅ Done: Wired through useTemplatesData → useMainBrowseData → useTemplatesScreenProps → TemplatesScreen → MainBrowseView. Dynamic stagger offsets adjust when ForYou is hidden. All new/heavily-modified files under 100 lines. tsc check clean for TemplatesScreen files (pre-existing errors in convex/ only).

## Verification

- "For You" section appears between Trending Now and Hero card
- Shows 2 personalized recommendation cards with connection cues
- Warm background tint visually separates it from other sections
- Add buttons work (import + spring animation)
- Section hidden when user has no habits
- All files under 100 lines, zero TypeScript errors
