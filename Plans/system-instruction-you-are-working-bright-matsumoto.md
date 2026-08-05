# Add "Running" habit (Wendy Suzuki) to habit library

## Context

The habit library currently has walking/steps (`10,000 Steps`, `7,000 Steps`), `Strength Training`, `Stretching Routine`, and `Zone 2 Cardio Training` — but no dedicated `Running` template, despite running being one of the most common and scientifically-supported exercise habits. Wendy Suzuki (NYU neuroscientist) is also absent from the library entirely, even though her research on aerobic exercise → BDNF → hippocampal neurogenesis is foundational science that complements the existing Huberman/longevity content.

The user wants a new `Running` template anchored to Wendy Suzuki's work. Her TEDx talk "The brain-changing benefits of exercise" (77M+ views) is her flagship content where she describes her own running transformation and the cognitive benefits of aerobic exercise — the closest thing she has to a "running" video.

## Changes

### 1. `convex/templatesDataSeed.ts` — add new template entry

Insert a new `insertWithTracking({...})` block in the **`health_fitness`** category section (near Strength Training at line 343 or Stretching Routine at line 357). Match existing formatting.

```ts
await insertWithTracking({
  category: 'health_fitness',
  createdAt: now,
  description:
    'Run 3-4x per week. Boosts BDNF, grows hippocampal volume, and improves mood, focus, and memory.',
  frequency: 'weekly',
  icon: '🏃',
  iconColor: '#F97316',
  name: 'Running',
  popularityScore: 90,
  scientificLink:
    'https://www.ted.com/talks/wendy_suzuki_the_brain_changing_benefits_of_exercise',
  scientificReference:
    'Basso & Suzuki (2017) - Effects of acute exercise on mood, cognition, neurophysiology',
  youtubeLink: 'https://www.youtube.com/watch?v=BHY0FxzoKZE',
});
```

**Field rationale:**
- `category: 'health_fitness'` — matches Strength Training / Stretching Routine / 10,000 Steps pattern; no `wendy_suzuki` category exists and creating one for a single entry would be premature.
- `frequency: 'weekly'` — matches Strength Training and Zone 2 Cardio; typical running cadence is 3-4x/week, not daily.
- `icon: '🏃'`, `iconColor: '#F97316'` (orange) — distinct from 10,000 Steps purple (#8B5CF6), Strength green (#059669), Stretching pink (#EC4899).
- `popularityScore: 90` — in-line with Strength Training (91) and Zone 2 Cardio (90).
- `scientificReference` — Basso & Suzuki (2017) is her peer-reviewed review on acute exercise effects, more defensible than citing the TED talk itself.
- `youtubeLink` — TEDx talk `BHY0FxzoKZE`, her canonical video.

### 2. `convex/templates/youtubeLinks.data.ts` — add mirror entry

Insert alphabetically (between `'Round-Up Savings'` at line 246 and `'Safe Listening Volume'` at line 247):

```ts
  'Running': 'https://www.youtube.com/watch?v=BHY0FxzoKZE',
```

## Critical files

- `convex/templatesDataSeed.ts` (5,691 lines) — main seed, add around line 355-370 (health_fitness block)
- `convex/templates/youtubeLinks.data.ts` (311 lines) — mirror mapping, alphabetical insert near line 247

## Verification

1. **Type-check + lint:** `npm run lint -- convex/templatesDataSeed.ts convex/templates/youtubeLinks.data.ts` and `npx tsc --noEmit` — confirm no errors.
2. **Seed runs:** `npx convex dev` (or existing seed command) — confirm the new template inserts without tracking errors.
3. **Appears in library:** boot the app, open the habit library / browse-templates view, filter by health_fitness (or search "Running") — confirm the entry renders with 🏃 icon, orange color, Wendy Suzuki citation, and the TEDx link opens when tapped.
4. **YouTube link resolves:** click the video link from the template detail view — confirm it loads `BHY0FxzoKZE`.

## Out of scope

- Creating a dedicated `wendy_suzuki` category (premature for one entry).
- Backfilling Suzuki references onto other existing habits.
- Adding `tips[]`, `suggestedCue`, `suggestedWhy`, `suggestedIdentity` — the schema allows them but most sibling entries (Strength Training, Stretching Routine) omit them. Can be added later if desired.
