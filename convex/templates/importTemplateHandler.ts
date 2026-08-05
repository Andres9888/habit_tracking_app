import type { MutationCtx } from '../_generated/server';
import { validateDaysOfWeek } from '../habits/validation';
import {
  resolveImportedStrengthAlgorithm,
  validateImportCustomizations,
} from './importTemplateCustomizations';
import type { ImportTemplateArgs } from './importTemplate.types';

export async function importTemplateHandler(
  ctx: MutationCtx,
  args: ImportTemplateArgs
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Unauthenticated: Must be logged in to import templates');
  }
  const userId = identity.subject;
  const template = await ctx.db.get(args.templateId);
  if (!template) throw new Error('Template not found');
  validateDaysOfWeek(args.customizations?.daysOfWeek);

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

  const { iconColor, name, reminderTime } = validateImportCustomizations(
    template,
    args.customizations
  );
  const userHabits = await ctx.db
    .query('habits')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .collect();
  let maxOrder = 0;
  for (const habit of userHabits) {
    const order = habit.order ?? 0;
    if (order > maxOrder) maxOrder = order;
  }

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
    ...(args.customizations?.streakGoal === undefined
      ? {}
      : { goalDuration: args.customizations.streakGoal }),
    ...(template.growthType ? { growthType: template.growthType } : {}),
    icon: args.customizations?.icon ?? template.icon,
    iconColor,
    name,
    notes: template.description + '\n\nSource: ' + template.scientificReference,
    order: maxOrder + 1,
    ...(args.customizations?.preferredTime
      ? { preferredTime: args.customizations.preferredTime }
      : {}),
    ...(args.customizations?.progressEmojis
      ? { progressEmojis: args.customizations.progressEmojis }
      : {}),
    remindersEnabled: !!reminderTime,
    reminderTime,
    strength: 0,
    ...resolveImportedStrengthAlgorithm(template, args.customizations),
    strengthLevel: 'starting',
    strengthUpdatedAt: Date.now(),
    totalCompletions: 0,
    totalMisses: 0,
    userId,
  });
  await ctx.db.insert('templateUsage', {
    habitId,
    importedAt: Date.now(),
    templateId: args.templateId,
    userId,
  });
  return { habitId, success: true };
}
