/**
 * Patches authored science drill-down content onto existing template rows.
 *
 * `templatesDataSeed` skips templates that already exist by name, so seeding
 * alone never reaches installs that are already populated — this mutation is
 * how authored content lands on them. Mirrors the `enrichTemplates` pattern.
 *
 * Run: npx convex run templates/patchScienceEnrichment:patchScienceEnrichment '{"dryRun":true}'
 */

import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';

import { normalizeTemplateName } from './helpers';
import { PRUNED_TEMPLATE_NAMES } from './curatedRemovals';
import { SCIENCE_ENRICHMENT } from './scienceEnrichment.data';
import type { ScienceEnrichment } from './types';

/** Only overwrite a field when we have content for it — never blank one out. */
function buildPatch(entry: ScienceEnrichment): Partial<ScienceEnrichment> {
  const patch: Partial<ScienceEnrichment> = {};
  if (entry.suggestedWhy) patch.suggestedWhy = entry.suggestedWhy;
  if (entry.tagline) patch.tagline = entry.tagline;
  if (entry.lead) patch.lead = entry.lead;
  if (entry.evidence) patch.evidence = entry.evidence;
  if (entry.cadenceLabel) patch.cadenceLabel = entry.cadenceLabel;
  if (entry.benefitDetails?.length) patch.benefitDetails = entry.benefitDetails;
  if (entry.timeline?.length) patch.timeline = entry.timeline;
  if (entry.howToStart?.length) patch.howToStart = entry.howToStart;
  if (entry.sources?.length) patch.sources = entry.sources;
  return patch;
}

export const patchScienceEnrichment = internalMutation({
  args: { dryRun: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? false;
    const templates = await ctx.db.query('templates').collect();

    const byName = new Map(
      Object.entries(SCIENCE_ENRICHMENT).map(([name, entry]) => [
        normalizeTemplateName(name),
        { entry, name },
      ])
    );
    const unmatchedNames = new Set(Object.keys(SCIENCE_ENRICHMENT));
    const updatedNames: string[] = [];

    for (const template of templates) {
      const key = normalizeTemplateName(template.name);
      const found = byName.get(key);
      if (!found || PRUNED_TEMPLATE_NAMES.has(key)) continue;
      unmatchedNames.delete(found.name);

      const patch = buildPatch(found.entry);
      if (Object.keys(patch).length === 0) continue;

      updatedNames.push(template.name);
      if (!dryRun) await ctx.db.patch(template._id, patch);
    }

    return {
      authoredCount: Object.keys(SCIENCE_ENRICHMENT).length,
      dryRun,
      totalTemplates: templates.length,
      // Authored entries whose name matched no row — usually a typo or a rename.
      unmatchedNames: [...unmatchedNames].sort(),
      updatedCount: updatedNames.length,
      updatedNames,
    };
  },
});
