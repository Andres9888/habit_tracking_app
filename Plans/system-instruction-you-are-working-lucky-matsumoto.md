# Redesign HabitDetail Tabs — 8 Mock Variations

## Context

Inside the HabitDetail screen there's a 3-tab segmented control (**Calendar / Strength / Goal**) that switches the main content view. Today it's a standard filled-pill segmented control on a gray track — functional but visually generic. It doesn't carry the app's "Warm Minimal" personality (warm parchment backgrounds, forest green accent, burnished gold, subtle card lift, organic restraint).

Goal: produce **8 HTML mocks** showing different tab treatments, each making a distinct design bet. Open them all in the browser so the user can compare side-by-side and pick a direction. Monetization is explicitly out of scope for this round — focus purely on UX and aesthetic alignment with the app.

## Current Implementation (Reference)

- **Component**: `src/screens/HabitDetailScreen/components/DetailViewTabs.tsx:31` (3 tabs, animated pill indicator, 180ms cubic easing)
- **Button**: `src/screens/HabitDetailScreen/components/DetailViewTabButton.tsx:23` (icon + label, 13px text, Lucide icons)
- **Tokens**: `src/theme/colors/core.ts` — forest green `#059669`, warm background `#F5F1ED`, card `#EDEAE5`, streak gold `#8B6208`, text primary `#2D2A26`
- **Current style**: track `gray[200]` (light) / `surface` (dark), indicator `gray[50]` (light) / `card` (dark) with shadow tinted by accent, corner radius 8/6px, 4px padding

## Design Language Targets (what "aligned with the app" means here)

- Warm parchment canvas — not neutral gray
- Forest green as the single saturated accent
- Gold reserved as momentum accent (don't lean on it here)
- Soft tonal shadows (not hard drop shadows)
- 8–16px corner radii, generous padding
- Spring-feeling motion; active state should feel *lifted* not just recolored

## The 8 Mocks (each at 390×844 iPhone frame, showing tab bar in context with a hero above)

Each mock renders the tab in its actual HabitDetail context (DetailHero above, placeholder content below) so relative scale is honest. Each includes a short "Why this is better" caption beneath.

1. **`habit_tabs_01_parchment_pill.html` — Warm Parchment Pill**
   Track becomes the canvas color (`#F5F1ED`) with a thin `#DDD8D2` border. Active pill is `#EDEAE5` card color with a 1px forest-tinted border and layered tonal shadow. *Why better:* Track stops feeling like a foreign gray object; it reads as a natural recess in the parchment. Keeps current layout — lowest risk, highest coherence win.

2. **`habit_tabs_02_underline_minimal.html` — Sparse Underline**
   No track at all. Just three labels on the canvas with an animated 2px forest-green underline + subtle dot under the active tab. *Why better:* Removes chrome entirely. Lets the content breathe; reads as editorial, premium, confident. Best for users who spend time on the detail screen.

3. **`habit_tabs_03_floating_card.html` — Floating Card Tabs**
   Tabs sit in an elevated card (same `#EDEAE5` as DetailHero) with forest-green active indicator that has a soft green glow shadow. Matches the FAB/BottomActionBar "floating capsule" language. *Why better:* Reinforces the app's existing floating-surface motif, creates visual rhyme with the bottom bar.

4. **`habit_tabs_04_text_only_weighted.html` — Text-Only, Weight-Driven**
   Drops icons. Active tab uses heavier weight + forest green; inactive is `gray[400]` regular weight. Tiny 4px colored dot under active label. *Why better:* Icons are redundant with labels at this scale. More legible, more mature, more space for longer labels if you add a 4th tab later.

5. **`habit_tabs_05_icon_only_stacked.html` — Icon-Stacked Compact**
   Icon above label in small stacked buttons; active state lifts the whole button with a shadow and fills background. Feels like iOS Health. *Why better:* Each tab becomes a clearer affordance. Good if a 4th tab ("Notes" / "History") is on the roadmap — scales to 4–5 tabs without cramping.

6. **`habit_tabs_06_segmented_ios_native.html` — iOS Segmented Refined**
   Apple-style segmented control but re-skinned with warm tokens (parchment track, card-color pill, subtle inner shadow on track, hairline dividers between inactive tabs). *Why better:* Platform-native muscle memory; users already know the interaction. Least cognitive load, most conservative.

7. **`habit_tabs_07_ghost_chip.html` — Ghost Chips**
   Each tab is an independent pill-shaped chip. Inactive = transparent with hairline border; active = filled forest green with white label. Small gaps between chips. *Why better:* Feels more like content filters than a rigid segmented control. Invites exploration. Good if tabs ever become filterable or re-orderable.

8. **`habit_tabs_08_scrollspy_anchor.html` — Anchor Tabs + Sticky Header**
   Tabs act as scroll-to-section anchors in a single long view (no view switching). Sticky tab bar hides the DetailHero on scroll; underline tracks the active section as you scroll. *Why better:* Eliminates the "I have to click around to see everything" friction. All information is reachable in one scroll. Big UX bet — best for power users.

## Deliverables

1. **`habit_tabs_theme.css`** — shared theme file extracting the Warm Minimal tokens from `src/theme/colors/core.ts` as CSS custom properties so all 8 mocks share one source of truth for colors/fonts.

2. **`habit_tabs_01_parchment_pill.html` … `habit_tabs_08_scrollspy_anchor.html`** — 8 self-contained HTML files, each:
   - Phone-frame shell (390×844) to simulate the detail screen
   - Tailwind CDN + Inter/Outfit via Google Fonts + Lucide icons
   - A realistic DetailHero mock above (habit name, emoji, streak badge) so the tab is shown in true context
   - The tab bar variant
   - Placeholder content preview (e.g., a simple Calendar grid / strength meter stub) so the tab bar doesn't float alone
   - A caption card below with "Why this is better" + "Trade-offs"
   - CSS-only hover/active animations where relevant so the user can feel the motion

3. **`habit_tabs_index.html`** — a single index page with all 8 mocks embedded in `<iframe>` tiles side-by-side in a responsive grid, each labeled, so the user can scan all variants at once. Clicking a tile opens the full-fidelity version in a new tab.

4. **Open in browser** — after generating, run `open` on `habit_tabs_index.html` so the user sees the comparison view immediately.

## Files Created

All in `.superdesign/design_iterations/`:
- `habit_tabs_theme.css`
- `habit_tabs_01_parchment_pill.html`
- `habit_tabs_02_underline_minimal.html`
- `habit_tabs_03_floating_card.html`
- `habit_tabs_04_text_only_weighted.html`
- `habit_tabs_05_icon_only_stacked.html`
- `habit_tabs_06_segmented_ios_native.html`
- `habit_tabs_07_ghost_chip.html`
- `habit_tabs_08_scrollspy_anchor.html`
- `habit_tabs_index.html`

No production code is modified in this plan. This is mock-only. Once the user picks 1–2 favorites, a follow-up plan will port the chosen treatment to `DetailViewTabs.tsx` + `DetailViewTabButton.tsx`.

## Verification

1. `open .superdesign/design_iterations/habit_tabs_index.html` — all 8 tiles render without broken iframes, fonts load, Lucide icons appear.
2. Open each mock standalone — tab hover/active states animate, layout is pixel-honest at 390×844.
3. Visual check: each mock uses the warm parchment token (`#F5F1ED`), forest green accent (`#059669`), card color (`#EDEAE5`) — no stray cool grays or out-of-palette blues.
4. User reviews the grid, picks favorite(s), we then apply to the real component.

## Critical Files Referenced (not modified)

- `src/screens/HabitDetailScreen/components/DetailViewTabs.tsx` — current tab container
- `src/screens/HabitDetailScreen/components/DetailViewTabButton.tsx` — current tab button
- `src/theme/colors/core.ts` — color tokens
- `src/theme/spacing.ts` — spacing + shadow tokens
