import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';
import type { Id } from '../_generated/dataModel';

import { normalizeTemplateName, pickBestTemplate } from './helpers';
import {
  PRUNED_TEMPLATE_NAMES,
  RECATEGORIZE,
  RECATEGORIZE_CATEGORIES,
} from './curatedRemovals';

export const curateTemplates = internalMutation({
  args: { dryRun: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? false;
    const allTemplates = await ctx.db.query('templates').collect();
    type TemplateDoc = (typeof allTemplates)[number];

    const templatesByName = new Map<string, TemplateDoc[]>();
    for (const template of allTemplates) {
      const key = normalizeTemplateName(template.name);
      templatesByName.set(key, [...(templatesByName.get(key) ?? []), template]);
    }

    const idRemap = new Map<Id<'templates'>, Id<'templates'>>();
    let duplicateGroups = 0;
    let duplicateTemplates = 0;

    for (const templates of templatesByName.values()) {
      if (templates.length <= 1) continue;
      duplicateGroups += 1;
      duplicateTemplates += templates.length - 1;
      const best = pickBestTemplate<TemplateDoc>(templates);
      for (const template of templates) {
        if (template._id !== best._id) idRemap.set(template._id, best._id);
      }
    }

    const templateUsage = await ctx.db.query('templateUsage').collect();
    let patchedTemplateUsage = 0;
    for (const usage of templateUsage) {
      const remapped = idRemap.get(usage.templateId);
      if (!remapped) continue;
      patchedTemplateUsage += 1;
      if (!dryRun) await ctx.db.patch(usage._id, { templateId: remapped });
    }

    if (!dryRun) {
      for (const [oldId] of idRemap) await ctx.db.delete(oldId);
    }

    const dedupedTemplates = dryRun
      ? allTemplates.filter((template) => !idRemap.has(template._id))
      : await ctx.db.query('templates').collect();
    const prunedNames: string[] = [];
    const recategorizedNames: string[] = [];

    for (const template of dedupedTemplates) {
      const key = normalizeTemplateName(template.name);
      if (PRUNED_TEMPLATE_NAMES.has(key)) {
        prunedNames.push(template.name);
        if (!dryRun) await ctx.db.delete(template._id);
        continue;
      }

      const targetCategory =
        RECATEGORIZE[template.name] ??
        RECATEGORIZE_CATEGORIES[template.category as string];
      if (targetCategory && template.category !== targetCategory) {
        recategorizedNames.push(template.name);
        if (!dryRun) await ctx.db.patch(template._id, { category: targetCategory });
      }
    }

    const templatesAfterCollection = dryRun
      ? []
      : await ctx.db.query('templates').collect();
    const templatesAfter = dryRun
      ? allTemplates.length - duplicateTemplates - prunedNames.length
      : templatesAfterCollection.length;

    return {
      dryRun,
      duplicateGroups,
      duplicateTemplates,
      patchedTemplateUsage,
      prunedCount: prunedNames.length,
      prunedNames,
      recategorizedCount: recategorizedNames.length,
      recategorizedNames,
      templatesAfter,
      templatesBefore: allTemplates.length,
    };
  },
});
