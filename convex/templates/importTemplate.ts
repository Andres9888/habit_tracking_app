/**
 * Template import mutation
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import {
  validateHabitName,
  validateColor,
  validateTimeFormat,
  requireValid,
  MAX_HABIT_NAME_LENGTH,
} from '../lib/inputValidation';
import { hasPremiumAccess } from '../subscriptions/premiumCheck';

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
    const isPremiumUser = await hasPremiumAccess(ctx, userId);

    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // SEC-003: Input validation - name customization
    let validatedName = template.name;
    if (args.customizations?.name !== undefined) {
      const nameResult = validateHabitName(args.customizations.name);
      validatedName = requireValid(nameResult, args.customizations.name);
      if (!validatedName) {
        throw new Error('Custom habit name cannot be empty');
      }
      if (validatedName.length > MAX_HABIT_NAME_LENGTH) {
        throw new Error(
          `Custom habit name cannot exceed ${MAX_HABIT_NAME_LENGTH} characters`
        );
      }
    }

    // SEC-003: Input validation - iconColor customization
    let validatedIconColor = template.iconColor;
    if (args.customizations?.iconColor !== undefined) {
      const iconColorResult = validateColor(
        args.customizations.iconColor,
        'Icon color'
      );
      validatedIconColor =
        requireValid(iconColorResult, args.customizations.iconColor) ??
        template.iconColor;
    }

    // SEC-003: Input validation - reminderTime customization
    let validatedReminderTime = args.customizations?.reminderTime;
    if (validatedReminderTime !== undefined) {
      const reminderTimeResult = validateTimeFormat(
        validatedReminderTime,
        'Reminder time'
      );
      validatedReminderTime = requireValid(
        reminderTimeResult,
        validatedReminderTime
      );
    }

    // Get max order to place new habit at the end (filtered by current user)
    const userHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect();

    if (!isPremiumUser && userHabits.length >= 3) {
      throw new Error(
        'Free tier is limited to 3 habits. Upgrade to premium for unlimited habits.'
      );
    }

    let maxOrder = 0;
    for (const h of userHabits) {
      const order = h.order ?? 0;
      if (order > maxOrder) maxOrder = order;
    }

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
      iconColor: validatedIconColor,
      name: validatedName,
      notes:
        template.description + '\n\nSource: ' + template.scientificReference,
      order: maxOrder + 1,
      remindersEnabled: !!validatedReminderTime,
      reminderTime: validatedReminderTime,
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
      userId,
    });

    return { habitId, success: true };
  },
});
