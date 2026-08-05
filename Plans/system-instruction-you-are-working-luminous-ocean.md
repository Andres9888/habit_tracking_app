# Add "13-Minute Focus Meditation" (Wendy Suzuki) to Habit Library

## Context

The habit library has three meditation templates (`5-Minute Meditation`, `Loving-Kindness Meditation`, `Body Scan Meditation`) but none feature neuroscientist Wendy Suzuki, whose lab produced one of the most-cited short-form meditation protocols. The existing `5-Minute Meditation` stays as-is; we add a new, higher-attribution entry in the `mindfulness` category that ties to a published RCT.

Source asset: Wendy Suzuki's NYU lab used a 13-minute guided breath/anchoring meditation in Basso et al. (2019), showing improvements in attention, working memory, mood, and emotional regulation after 8 weeks of daily practice. The guided audio is the "Anchoring and breath awareness" video (`https://www.youtube.com/watch?v=4GtpuD13nZk`).

## Changes

### 1. `convex/templatesDataSeed.ts`

Add a new `insertWithTracking({ ... })` block alongside the other `mindfulness` entries (near the `Loving-Kindness Meditation` entry around line 665, or the `Body Scan Meditation` entry around line 2024 — place adjacent for easy diffing).

```ts
await insertWithTracking({
  category: 'mindfulness',
  createdAt: now,
  description:
    'Do the 13-minute guided breath-anchoring meditation from Dr. Wendy Suzuki’s NYU lab. Eight weeks of daily practice improved attention, working memory, mood, and emotional regulation in non-experienced meditators.',
  frequency: FREQUENCY_DAILY,
  icon: '🧠',
  iconColor: '#6366F1',
  name: '13-Minute Focus Meditation',
  popularityScore: 90,
  scientificLink:
    'https://www.sciencedirect.com/science/article/abs/pii/S016643281830322X',
  scientificReference:
    'Basso et al. (2019) - Brief, daily meditation enhances attention, memory, mood, and emotional regulation in non-experienced meditators (Wendy Suzuki lab, NYU)',
  tips: [
    'Follow the guided audio — don’t try to freestyle it',
    'Commit to 8 weeks daily; the study’s benefits appeared at that cadence',
    'Same time each day (morning works best for focus benefits)',
  ],
  youtubeLink: 'https://www.youtube.com/watch?v=4GtpuD13nZk',
});
```

Notes on field choices:
- `category: 'mindfulness'` — this is an attention-training practice, not a morning starter; keeps it distinct from `5-Minute Meditation` which lives in `morning_routine`.
- `icon: '🧠'` — differentiates from the 🧘/❤️/🫥 already used by the other three meditations; emphasizes the cognitive-science framing.
- `scientificReference` — names Suzuki's lab since the schema has no dedicated "expert" field.

### 2. `convex/templates/youtubeLinks.data.ts`

Add one line to `youtubeLinksData` (alphabetically ordered, so insert near the top — this will land between `10,000 Steps` and `16:8 Intermittent Fasting` since "1" < "1" and ordering is lexical on the whole string):

```ts
'13-Minute Focus Meditation': 'https://www.youtube.com/watch?v=4GtpuD13nZk',
```

Place it between line 6 (`'10,000 Steps'`) and line 7 (`'16:8 Intermittent Fasting'`).

## Critical files

- `convex/templatesDataSeed.ts` — add template entry
- `convex/templates/youtubeLinks.data.ts` — add link mapping
- `convex/templates.ts:57` — `seedTemplates` mutation (unchanged, but how the new entry reaches the DB)

## Verification

1. **Typecheck:** `npx tsc --noEmit` — confirms the new entry matches `TemplateInsert`.
2. **Lint:** `npm run lint` on the two edited files (note `templatesDataSeed.ts` is huge and already exempted in `eslint.config.js`).
3. **Local Convex seed:** run the `seedTemplates` mutation (via `npx convex dashboard` or whichever flow this project uses — `_insertTemplateIfMissing` is idempotent by name, so re-running is safe).
4. **In-app check:** open the habit library UI, filter/browse the `mindfulness` category, confirm "13-Minute Focus Meditation" renders with Wendy Suzuki citation and the correct YouTube link opens `4GtpuD13nZk`.
5. **Grep sanity:** `grep -rn "13-Minute Focus Meditation" convex/` should return exactly two hits (seed + youtubeLinks map).

## Out of scope

- Not renaming or modifying `5-Minute Meditation` (per user choice to keep existing as-is).
- Not adding an `expert` / `author` schema field. If Wendy Suzuki attribution needs to be first-class (shown as a badge in UI), that's a separate schema migration touching `convex/schema.ts`, `TemplateInsert`, and all consumer components — out of scope for this change.
