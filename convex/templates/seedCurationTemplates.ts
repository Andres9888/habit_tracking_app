import { internalMutation } from '../_generated/server';

import { normalizeTemplateName } from './helpers';
import { PRUNED_TEMPLATE_NAMES } from './curatedRemovals';
import { CURATION_SEED_TEMPLATES } from './curatedSeedTemplates';
import { withPremiumFlag } from './premiumFlags';

export const seedCurationTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const existingTemplates = await ctx.db.query('templates').collect();
    const existingNames = new Set(
      existingTemplates.map((template) => normalizeTemplateName(template.name))
    );
    const insertedNames: string[] = [];
    const skippedNames: string[] = [];

    for (const template of CURATION_SEED_TEMPLATES) {
      const key = normalizeTemplateName(template.name);
      if (existingNames.has(key) || PRUNED_TEMPLATE_NAMES.has(key)) {
        skippedNames.push(template.name);
        continue;
      }

      await ctx.db.insert(
        'templates',
        withPremiumFlag({ ...template, createdAt: now })
      );
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
