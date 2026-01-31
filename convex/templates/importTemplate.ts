/**
 * Template import mutation
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';

/**
 * Mutation: Import a template to create a new habit
 */
export const importTemplate = mutation({
  args: {
    customizations: v.optional(
      v.object({
        iconColor: v.optional(v.string()),
        name: v.optional(v.string()),
        reminderTime: v.optional(v.string()),
      })
    ),
    templateId: v.id('templates'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check - require user to be logged in
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to import templates');
    }
    const userId = identity.subject;

    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Get max order to place new habit at the end
    const allHabits = await ctx.db.query('habits').collect();
    const maxOrder = allHabits.reduce((max, h) => Math.max(max, h.order ?? 0), 0);

    // Create habit from template
    const habitId = await ctx.db.insert('habits', {
      accessibility: 1,
      accessibilityUpdatedAt: Date.now(),
      bestStreak: 0,
      consecutiveDays: 0,
      createdAt: Date.now(),
      currentStreak: 0,
      frequency: template.frequency,
      icon: template.icon,
      iconColor: args.customizations?.iconColor || template.iconColor,
      name: args.customizations?.name || template.name,
      notes:
        template.description + '\n\nSource: ' + template.scientificReference,
      order: maxOrder + 1,
      remindersEnabled: !!args.customizations?.reminderTime,
      reminderTime: args.customizations?.reminderTime,
      strength: 0,
      strengthLevel: 'starting',
      strengthUpdatedAt: Date.now(),
      totalCompletions: 0,
      totalMisses: 0,
      userId,
    });

    // Track template usage analytics
    await ctx.db.insert('templateUsage', {
      habitId,
      importedAt: Date.now(),
      templateId: args.templateId,
    });

    return { habitId, success: true };
  },
});
