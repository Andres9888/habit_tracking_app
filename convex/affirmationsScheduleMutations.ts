/**
 * Affirmations Schedule Mutations
 *
 * Premium feature mutations for scheduled delivery management.
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { isValidTimeFormat, isValidDaysOfWeek } from './affirmations/index';

/**
 * Schedule delivery for an affirmation (Premium feature)
 */
export const scheduleDelivery = mutation({
  args: {
    daysOfWeek: v.optional(v.array(v.number())),
    frequency: v.union(v.literal('daily'), v.literal('weekly')),
    id: v.id('affirmations'),
    scheduledTime: v.string(),
  },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) throw new Error('Affirmation not found');

    if (!isValidTimeFormat(args.scheduledTime)) {
      throw new Error('Invalid time format. Use HH:MM 24-hour format');
    }

    if (args.frequency === 'weekly') {
      if (!args.daysOfWeek || args.daysOfWeek.length === 0) {
        throw new Error('Weekly frequency requires at least one day');
      }
      if (!isValidDaysOfWeek(args.daysOfWeek)) {
        throw new Error('Invalid days of week. Use numbers 0-6');
      }
    }

    await ctx.db.patch(args.id, {
      daysOfWeek: args.frequency === 'weekly' ? args.daysOfWeek : undefined,
      frequency: args.frequency,
      isScheduleEnabled: true,
      scheduledTime: args.scheduledTime,
      updatedAt: Date.now(),
    });
    return null;
  },
  returns: v.null(),
});

/**
 * Update the notification ID for an affirmation
 */
export const updateNotificationId = mutation({
  args: { id: v.id('affirmations'), notificationId: v.string() },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) throw new Error('Affirmation not found');
    await ctx.db.patch(args.id, {
      notificationId: args.notificationId,
      updatedAt: Date.now(),
    });
    return null;
  },
  returns: v.null(),
});

/**
 * Toggle scheduled delivery on/off
 */
export const toggleSchedule = mutation({
  args: { enabled: v.boolean(), id: v.id('affirmations') },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) throw new Error('Affirmation not found');

    if (args.enabled && !affirmation.scheduledTime) {
      throw new Error(
        'Cannot enable: no scheduled time. Use scheduleDelivery first.'
      );
    }

    await ctx.db.patch(args.id, {
      isScheduleEnabled: args.enabled,
      notificationId: args.enabled ? affirmation.notificationId : undefined,
      updatedAt: Date.now(),
    });
    return null;
  },
  returns: v.null(),
});

/**
 * Cancel scheduled delivery for an affirmation
 */
export const cancelSchedule = mutation({
  args: { id: v.id('affirmations') },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) throw new Error('Affirmation not found');
    await ctx.db.patch(args.id, {
      daysOfWeek: undefined,
      frequency: undefined,
      isScheduleEnabled: undefined,
      lastDeliveredAt: undefined,
      notificationId: undefined,
      scheduledTime: undefined,
      updatedAt: Date.now(),
    });
    return null;
  },
  returns: v.null(),
});

/**
 * Record a successful delivery
 */
export const recordDelivery = mutation({
  args: { id: v.id('affirmations') },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) throw new Error('Affirmation not found');
    await ctx.db.patch(args.id, {
      lastDeliveredAt: Date.now(),
      updatedAt: Date.now(),
    });
    return null;
  },
  returns: v.null(),
});
