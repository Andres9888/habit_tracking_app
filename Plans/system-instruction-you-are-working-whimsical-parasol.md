# Plan: Add "Red Light Therapy" habit to library

## Context

The user wants **Red Light Therapy** (photobiomodulation) added as a new habit template in the library. Popular biohacking/wellness practice (Huberman, Attia) supporting skin health, muscle recovery, and mitochondrial function. Best fit is the **`recovery`** category (sits naturally next to `Sauna Recovery`, `Contrast Shower`, `Power Nap`).

The schema (`convex/schema.ts:269`) makes `category` a single literal union — a template lives in exactly one category, so we pick one (`recovery`).

All habit templates live in a single seed file (`convex/templatesDataSeed.ts`) and are inserted into the Convex `templates` table. The seed mutation cannot safely be re-run (the RECOVERY section uses direct `ctx.db.insert(...)` without de-dupe — re-seeding would duplicate ~10 existing rows). So we (a) keep the seed file as the source of truth and (b) add a one-shot internal mutation to push just the new row to the live DB.

## Approach

### File 1: `convex/templatesDataSeed.ts` — add the template to the seed

Insert one new `await ctx.db.insert('templates', { ... })` block inside the RECOVERY section, immediately after `Sauna Recovery` (around line 3859). Code:

```ts
await ctx.db.insert('templates', {
  category: 'recovery',
  createdAt: now,
  description:
    'Spend 10-20 minutes in front of a red/near-infrared light panel (660nm + 850nm). Photobiomodulation supports skin health, muscle recovery, and mitochondrial energy production.',
  frequency: FREQUENCY_DAILY,
  icon: '🔴',
  iconColor: '#DC2626',
  name: 'Red Light Therapy',
  startSmallVersion: 'Stand in front of the panel for 60 seconds.',
  popularityScore: 75,
  scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/28748217/',
  scientificReference:
    'Hamblin (2017) - Mechanisms and applications of the anti-inflammatory effects of photobiomodulation',
});
```

Field rationale:
- **category**: `recovery` — best semantic fit; lives next to Sauna Recovery & Contrast Shower.
- **frequency**: `FREQUENCY_DAILY` — typical home-panel use is short daily sessions.
- **icon / iconColor**: `🔴` / `#DC2626` red — visually communicates the modality.
- **startSmallVersion**: included to match the recent "tiny habit" initiative (commit `786e6ae49`). Surrounding recovery rows currently lack this field; adding it for the new entry is forward-compatible.
- **scientificReference / scientificLink**: real Hamblin (2017) review on photobiomodulation mechanisms.
- **popularityScore: 75**: niche but growing — sits below Sauna (85), above floor.

### File 2: `convex/templatesDataSeed.ts` — add a one-shot internal mutation (same file)

Append at the end of the file (after `seedTemplates` closes), so the DB can be updated without re-running the full seed:

```ts
/**
 * Internal Mutation: Insert ONLY the "Red Light Therapy" template.
 * SEC: Internal only — run once from the Convex dashboard after deploy.
 * Safe to re-run: skips if a template with this name already exists.
 */
export const insertRedLightTherapyTemplate = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query('templates')
      .filter((q) => q.eq(q.field('name'), 'Red Light Therapy'))
      .first();

    if (existing) {
      return { inserted: false, reason: 'already exists' };
    }

    await ctx.db.insert('templates', {
      category: 'recovery',
      createdAt: Date.now(),
      description:
        'Spend 10-20 minutes in front of a red/near-infrared light panel (660nm + 850nm). Photobiomodulation supports skin health, muscle recovery, and mitochondrial energy production.',
      frequency: FREQUENCY_DAILY,
      icon: '🔴',
      iconColor: '#DC2626',
      name: 'Red Light Therapy',
      startSmallVersion: 'Stand in front of the panel for 60 seconds.',
      popularityScore: 75,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/28748217/',
      scientificReference:
        'Hamblin (2017) - Mechanisms and applications of the anti-inflammatory effects of photobiomodulation',
    });

    return { inserted: true };
  },
});
```

Reuses existing imports (`internalMutation`, `FREQUENCY_DAILY`) already at the top of the file — no new imports needed. Built-in name-based de-dupe makes it safe to re-run.

## Verification

1. **Type-check**:
   ```
   npx tsc --noEmit
   ```
2. **Push to Convex** (deploys both the updated seed and the new mutation):
   ```
   npx convex dev      # local
   # or: npx convex deploy   # prod
   ```
3. **Run the one-shot mutation** from the Convex dashboard: Functions → `templatesDataSeed:insertRedLightTherapyTemplate` → Run. Expect `{ inserted: true }` (or `{ inserted: false, reason: 'already exists' }` if re-run).
4. **Verify in app**: open the Templates screen → filter to **Recovery** category → confirm "Red Light Therapy" appears with red 🔴 icon, the description, and the "✨ Start small: Stand in front of the panel for 60 seconds." line under the description.
5. **Sanity-check the import flow**: tap the template → tap "Add to my habits" → confirm it lands in the user's habits list with the correct frequency.

## Out of scope

- Fixing the pre-existing de-dupe gap in the RECOVERY section of `seedTemplates` (the direct `ctx.db.insert` calls). Flagging it but not changing it as part of this task.
- Backfilling `startSmallVersion` on the surrounding recovery templates that lack it.
