/**
 * Template import mutation
 */
import { v } from 'convex/values';
import { internalMutation, mutation } from '../_generated/server';
import {
  validateHabitName,
  validateColor,
  validateTimeFormat,
  requireValid,
  MAX_HABIT_NAME_LENGTH,
} from '../lib/inputValidation';
import { progressEmojisValidator } from '../lib/progressEmojisValidator';
import { validateDaysOfWeek } from '../habits/validation';

/**
 * Mutation: Import a template to create a new habit
 */
export const importTemplate = mutation({
  args: {
    customizations: v.optional(
      v.object({
        daysOfWeek: v.optional(v.array(v.number())),
        icon: v.optional(v.string()),
        iconColor: v.optional(v.string()),
        name: v.optional(v.string()),
        preferredTime: v.optional(v.string()),
        progressEmojis: v.optional(progressEmojisValidator),
        reminderTime: v.optional(v.string()),
        streakGoal: v.optional(v.number()),
        strengthAlgorithm: v.optional(
          v.union(
            v.literal('forgiving'),
            v.literal('balanced'),
            v.literal('strict')
          )
        ),
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

    validateDaysOfWeek(args.customizations?.daysOfWeek);

    // Duplicate prevention: check if user already imported this template
    const existing = await ctx.db
      .query('templateUsage')
      .withIndex('by_user_template', (q) =>
        q.eq('userId', userId).eq('templateId', args.templateId)
      )
      .first();
    if (existing?.habitId) {
      if (template.growthType) {
        const existingHabit = await ctx.db.get(existing.habitId);
        if (existingHabit && existingHabit.growthType !== template.growthType) {
          await ctx.db.patch(existing.habitId, {
            growthType: template.growthType,
          });
        }
      }
      return { alreadyExists: true, habitId: existing.habitId, success: true };
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
      ...(args.customizations?.daysOfWeek
        ? { daysOfWeek: args.customizations.daysOfWeek }
        : {}),
      frequency: template.frequency,
      ...(args.customizations?.streakGoal !== undefined
        ? { goalDuration: args.customizations.streakGoal }
        : {}),
      ...(template.growthType ? { growthType: template.growthType } : {}),
      icon: args.customizations?.icon ?? template.icon,
      iconColor: validatedIconColor,
      name: validatedName,
      notes:
        template.description + '\n\nSource: ' + template.scientificReference,
      order: maxOrder + 1,
      ...(args.customizations?.preferredTime
        ? { preferredTime: args.customizations.preferredTime }
        : {}),
      ...(args.customizations?.progressEmojis
        ? { progressEmojis: args.customizations.progressEmojis }
        : {}),
      remindersEnabled: !!validatedReminderTime,
      reminderTime: validatedReminderTime,
      strength: 0,
      ...(() => {
        if (args.customizations?.strengthAlgorithm) {
          return { strengthAlgorithm: args.customizations.strengthAlgorithm };
        }
        const minutes = template.estimatedMinutes;
        if (typeof minutes !== 'number') return {};
        const derived =
          minutes <= 2 ? 'forgiving' : minutes <= 20 ? 'balanced' : 'strict';
        return { strengthAlgorithm: derived as 'forgiving' | 'balanced' | 'strict' };
      })(),
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

/**
 * Backfill existing imported habits with their source template growth type.
 * Run after `templatesDataSeed:backfillGrowthType` so templates are populated.
 */
export const backfillImportedHabitGrowthType = internalMutation({
  args: {},
  handler: async (ctx) => {
    const usages = await ctx.db.query('templateUsage').collect();
    let patchedCount = 0;
    const patchedHabitIds: string[] = [];

    for (const usage of usages) {
      if (!usage.habitId) continue;
      const habit = await ctx.db.get(usage.habitId);
      const template = await ctx.db.get(usage.templateId);
      if (!habit || !template?.growthType) continue;
      if (habit.growthType === template.growthType) continue;

      await ctx.db.patch(usage.habitId, { growthType: template.growthType });
      patchedCount++;
      patchedHabitIds.push(usage.habitId);
    }

    return {
      success: true,
      patchedCount,
      patchedHabitIds,
    };
  },
});
