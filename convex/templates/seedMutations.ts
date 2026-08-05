import { internal } from '../_generated/api';
import { internalMutation, mutation } from '../_generated/server';
import { enforceRateLimit } from '../lib/rateLimit';

export const seedTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to seed templates');
    }

    // SR: throttle seed triggers. The catalog is shared and seeding is
    // idempotent (empty-check below), but this stops an authenticated client
    // from spamming seed-job scheduling. Full internalization is deferred —
    // the empty-state "load templates" button in TemplatesScreen calls this.
    await enforceRateLimit(ctx, identity.subject, 'templates.seed');

    const existingTemplate = await ctx.db.query('templates').first();
    if (existingTemplate) return { queued: false };

    const seedJobs = [
      internal.templatesDataSeed.seedTemplates,
      internal.templatesDataSeed.seedAdditionalTemplates,
      internal.templatesDataSeed.seedNewScienceTemplates,
      internal.templatesDataSeed.seedScienceTemplates,
      internal.templatesDataSeed.seedUniqueTemplates,
      internal.templatesDataSeed.seedResearchBackedTemplates,
      internal.templatesDataSeed.relabelExistingTemplates,
    ];
    for (const job of seedJobs) await ctx.scheduler.runAfter(0, job, {});

    return { queued: true };
  },
});

export const seedAdditionalTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(
      0,
      internal.templatesDataSeed.seedAdditionalTemplates,
      {}
    );
    return null;
  },
});

export const seedNewScienceTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(
      0,
      internal.templatesDataSeed.seedNewScienceTemplates,
      {}
    );
    return null;
  },
});

export const seedScienceTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(
      0,
      internal.templatesDataSeed.seedScienceTemplates,
      {}
    );
    return null;
  },
});

export const seedUniqueTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(
      0,
      internal.templatesDataSeed.seedUniqueTemplates,
      {}
    );
    return null;
  },
});
