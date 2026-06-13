import { internal } from '../_generated/api';
import { internalMutation, mutation } from '../_generated/server';

const requireAuthenticatedUser = async (
  ctx: { auth: { getUserIdentity: () => Promise<unknown> } },
  action: string
) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error(`Unauthenticated: Must be logged in to ${action}`);
  }
};

export const seedTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuthenticatedUser(ctx, 'seed templates');
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
