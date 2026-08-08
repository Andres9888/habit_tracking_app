/**
 * Aug 2026 evidence review — apply pass.
 *
 * Three one-shot internal mutations, all idempotent and safe to re-run:
 *  - `applyEvidenceCorrections` rewrites claims the cited sources do not support
 *  - `backfillStartSmallRound2` fills the 42 templates the first backfill missed
 *  - `seedEvidenceReviewTemplates` inserts the 10 new habits
 *
 * Run order does not matter. Follows the same convention as
 * `templatesDataSeed:relabelExistingTemplates` — the seed literals stay as the
 * historical record and the live catalog is patched by name.
 */

import { internalMutation } from '../../_generated/server';

import { normalizeTemplateName } from '../helpers';
import { PRUNED_TEMPLATE_NAMES } from '../curatedRemovals';
import { EVIDENCE_CORRECTIONS } from './corrections.data';
import { EVIDENCE_REVIEW_TEMPLATES } from './newTemplates.data';
import { START_SMALL_ROUND_2 } from './startSmall.data';

export const applyEvidenceCorrections = internalMutation({
  args: {},
  handler: async (ctx) => {
    const patchedNames: string[] = [];
    const missingNames: string[] = [];

    for (const correction of EVIDENCE_CORRECTIONS) {
      const template = await ctx.db
        .query('templates')
        .filter((q) => q.eq(q.field('name'), correction.name))
        .first();

      if (!template) {
        missingNames.push(correction.name);
        continue;
      }

      // An empty `scientificLink` means "clear the stored link" — it pointed at
      // the wrong record and no verified replacement exists. Convex has no
      // field-delete on patch, so it is stored as an empty string and the UI's
      // existing truthiness checks hide the pill.
      await ctx.db.patch(template._id, correction.patch);
      patchedNames.push(correction.name);
    }

    return {
      missingCount: missingNames.length,
      missingNames,
      patchedCount: patchedNames.length,
      patchedNames,
    };
  },
});

export const backfillStartSmallRound2 = internalMutation({
  args: {},
  handler: async (ctx) => {
    const patchedNames: string[] = [];
    const missingNames: string[] = [];
    let alreadySetCount = 0;

    for (const [name, startSmallVersion] of Object.entries(
      START_SMALL_ROUND_2
    )) {
      const template = await ctx.db
        .query('templates')
        .filter((q) => q.eq(q.field('name'), name))
        .first();

      if (!template) {
        missingNames.push(name);
        continue;
      }
      if (template.startSmallVersion) {
        alreadySetCount++;
        continue;
      }

      await ctx.db.patch(template._id, { startSmallVersion });
      patchedNames.push(name);
    }

    return {
      alreadySetCount,
      missingCount: missingNames.length,
      missingNames,
      patchedCount: patchedNames.length,
      patchedNames,
    };
  },
});

export const seedEvidenceReviewTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const existingTemplates = await ctx.db.query('templates').collect();
    const existingNames = new Set(
      existingTemplates.map((template) => normalizeTemplateName(template.name))
    );
    const insertedNames: string[] = [];
    const skippedNames: string[] = [];

    for (const template of EVIDENCE_REVIEW_TEMPLATES) {
      const key = normalizeTemplateName(template.name);
      if (existingNames.has(key) || PRUNED_TEMPLATE_NAMES.has(key)) {
        skippedNames.push(template.name);
        continue;
      }

      await ctx.db.insert('templates', { ...template, createdAt: now });
      insertedNames.push(template.name);
      existingNames.add(key);
    }

    return {
      insertedCount: insertedNames.length,
      insertedNames,
      skippedCount: skippedNames.length,
      skippedNames,
    };
  },
});
