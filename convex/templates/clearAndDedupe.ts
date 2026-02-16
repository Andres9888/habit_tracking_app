/**
 * Template clear and deduplication mutations
 */
import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';
import type { Id } from '../_generated/dataModel';
import { normalizeTemplateName, pickBestTemplate } from './helpers';

/**
 * Mutation: Clear all templates (for cleanup/reset)
 */
export const clearTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query('templates').collect();
    for (const template of templates) {
      await ctx.db.delete(template._id);
    }
    return { message: `Deleted ${templates.length} templates`, success: true };
  },
});

/**
 * Mutation: Dedupe templates by name (one-time cleanup)
 * - Keeps the "best" template per name (based on link/popularity/completeness)
 * - Re-points templateUsage.templateId to the kept template
 * - Deletes extra templates
 */
export const dedupeTemplates = internalMutation({
  args: { dryRun: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? false;

    const allTemplates = await ctx.db.query('templates').collect();
    type TemplateDoc = (typeof allTemplates)[number];
    const templatesByName = new Map<string, TemplateDoc[]>();

    for (const template of allTemplates) {
      const key = normalizeTemplateName(template.name);
      const existing = templatesByName.get(key);
      if (!existing) {
        templatesByName.set(key, [template]);
        continue;
      }
      existing.push(template);
    }

    const idRemap = new Map<Id<'templates'>, Id<'templates'>>();
    let duplicateGroups = 0;
    let duplicateTemplates = 0;

    for (const [, templates] of templatesByName) {
      if (templates.length <= 1) continue;

      duplicateGroups += 1;
      duplicateTemplates += templates.length - 1;

      const best = pickBestTemplate<TemplateDoc>(templates);
      for (const template of templates) {
        if (template._id === best._id) continue;
        idRemap.set(template._id, best._id);
      }
    }

    const templateUsage = await ctx.db.query('templateUsage').collect();
    let patchedTemplateUsage = 0;

    if (!dryRun) {
      for (const usage of templateUsage) {
        const remapped = idRemap.get(usage.templateId);
        if (!remapped) continue;
        await ctx.db.patch(usage._id, { templateId: remapped });
        patchedTemplateUsage += 1;
      }

      for (const [oldId] of idRemap) {
        await ctx.db.delete(oldId);
      }
    }

    let templatesAfter = allTemplates.length;
    if (!dryRun) {
      const remaining = await ctx.db.query('templates').collect();
      templatesAfter = remaining.length;
    }

    return {
      dryRun,
      duplicateGroups,
      duplicateTemplates,
      patchedTemplateUsage: dryRun ? 0 : patchedTemplateUsage,
      templatesAfter,
      templatesBefore: allTemplates.length,
    };
  },
});
