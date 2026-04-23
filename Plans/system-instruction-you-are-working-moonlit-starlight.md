# Add "40 Hz Binaural Beats" Habit Template

## Context

Andres wants a new habit template themed around Andrew Huberman's discussion of 40 Hz binaural beats — a gamma-frequency auditory stimulation protocol associated with focus and cognitive performance. The app already has a first-class `andrew_huberman` (premium) category with 17 existing templates following a consistent schema, so this slots cleanly into the existing system.

The outcome: one new entry in the template seed data so that new/resetting users see "40 Hz Binaural Beats" in the Huberman section of the template library, importable like any other template.

## Approach

Add a single new `insertWithTracking({...})` call to the Huberman block in `convex/templatesDataSeed.ts`. No schema, UI, or query changes are needed — the `andrew_huberman` category, display metadata, and import flow are already wired up.

The seed helper (`_insertTemplateIfMissing`, `convex/templatesDataSeed.ts:45-57`) de-duplicates by `name`, so re-running the seed is safe for existing DBs. To make the new template visible to databases that have already been seeded, Andres will need to re-run `seedTemplates` via the Convex dashboard (same as every prior template addition).

## Template definition

Insert after the last Huberman entry (around `convex/templatesDataSeed.ts:956`, just before the `// Social Habits Templates` comment at line 958):

```ts
await insertWithTracking({
  category: 'andrew_huberman',
  createdAt: now,
  description:
    'Listen to pure 40 Hz binaural beats for ~5 minutes before a focused work bout. Huberman cites peer-reviewed evidence that gamma-frequency auditory stimulation improves reaction time, working memory, and verbal recall.',
  frequency: FREQUENCY_DAILY,
  icon: '🎧',
  iconColor: '#7C3AED',
  name: '40 Hz Binaural Beats',
  popularityScore: 82,
  scientificLink: 'https://x.com/hubermanlab/status/1675600356892631040',
  scientificReference:
    'Huberman Lab — 40 Hz binaural beats as a data-supported focus tool',
  tips: [
    'Use stereo headphones — binaural beats require left/right channel separation',
    'About 5 minutes before starting deep work is the sweet spot',
    'Stick to pure tones — versions mixed with rain/ocean sounds are less effective',
    'Don\'t use for every work bout — the effect attenuates with overuse',
  ],
  youtubeLink: 'https://www.youtube.com/watch?v=pQI64hD2sJw',
});
```

### Design choices

- **Category:** `andrew_huberman` — exact match; premium category already displays with 🔬 / green theme (`src/screens/TemplatesScreen/data/categoryMeta.ts:28`).
- **Icon:** 🎧 (headphones) — clearest visual signal for a binaural-beats audio protocol.
- **Icon color:** `#7C3AED` (purple) — matches the "advanced neural protocol" tone used for `16:8 Intermittent Fasting` (line 887).
- **Frequency:** `FREQUENCY_DAILY` — consistent with focus/NSDR-style Huberman templates.
- **Popularity:** 82 — in-line with mid-tier Huberman entries (Sauna 83, Morning Protein 84); not a top-5 Huberman flagship.
- **`scientificLink`:** Andrew Huberman's own X/Twitter post endorsing 40 Hz binaural beats as a data-supported focus tool (`https://x.com/hubermanlab/status/1675600356892631040`). Verified via web search — this is his official account.
- **`youtubeLink`:** `https://www.youtube.com/watch?v=pQI64hD2sJw` — "40 HZ Binaural beats 'FOCUS & CONCENTRATION' with Dr. Andrew Huberman". Verified via web search.
- **Description / tips:** Pulled from Huberman's public guidance — ~5-min pre-work dose, pure tones only, headphones required, don't use every bout to avoid attenuation.
- **Attribution:** "by Andrew Huberman" lives in `scientificReference` (matching the existing Huberman-template convention, e.g. `'Huberman Lab (2023) - ...'`) rather than in `name`, to keep the name short for card display.

## Files to modify

- `convex/templatesDataSeed.ts` — single insertion, ~17 new lines around line 957.

## Files referenced (read-only)

- `convex/templates/types.ts:31-44` — `TemplateInsert` type.
- `convex/templates.ts:57` — `seedTemplates` mutation entry point.
- `src/screens/TemplatesScreen/data/categoryMeta.ts:28-43` — Huberman category display metadata.
- `convex/templates/importTemplate.ts:115` — premium gating (inherited for free).

## Verification

1. `npx tsc --noEmit` — ensure the new literal typechecks against `TemplateInsert`.
2. In the Convex dashboard (or `npx convex dev`), run `templates:seedTemplates` once. Confirm the new row appears in the `templates` table with `name = "40 Hz Binaural Beats"` and `category = "andrew_huberman"`.
3. Run the app, navigate to Templates → Huberman section (premium), and confirm the card renders with the 🎧 icon, purple color, description, and 3 tips.
4. Tap the template and complete the import flow; verify it creates a habit whose notes include the scientific reference.

## Resolved choices

- Name: `"40 Hz Binaural Beats"` (Andres confirmed).
- Sources: Huberman's official X post + the YouTube clip featuring him (both verified via search).
