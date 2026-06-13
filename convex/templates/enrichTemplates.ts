import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';

import { normalizeTemplateName } from './helpers';
import { PRUNED_TEMPLATE_NAMES } from './curatedRemovals';
import { CURATED_ENRICHMENT } from './curatedEnrichment';

export const enrichTemplates = internalMutation({
  args: { dryRun: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? false;
    const templates = await ctx.db.query('templates').collect();
    const enrichmentByName = new Map(
      Object.entries(CURATED_ENRICHMENT).map(([name, enrichment]) => [
        normalizeTemplateName(name),
        { enrichment, name },
      ])
    );
    const updatedNames: string[] = [];
    const missingNames = new Set(Object.keys(CURATED_ENRICHMENT));

    for (const template of templates) {
      const key = normalizeTemplateName(template.name);
      const entry = enrichmentByName.get(key);
      if (!entry || PRUNED_TEMPLATE_NAMES.has(key)) continue;
      missingNames.delete(entry.name);

      const patch = {
        scientificLink: entry.enrichment.scientificLink,
        tips: entry.enrichment.tips,
      };
      const needsPatch =
        template.scientificLink !== patch.scientificLink ||
        JSON.stringify(template.tips ?? []) !== JSON.stringify(patch.tips);
      if (!needsPatch) continue;

      updatedNames.push(template.name);
      if (!dryRun) await ctx.db.patch(template._id, patch);
    }

    return {
      dryRun,
      missingNames: [...missingNames].sort(),
      updatedCount: updatedNames.length,
      updatedNames,
    };
  },
});
