/**
 * Quick actions data by tip type
 */

import type { QuickAction } from './types';

export function getFocusDayActions(focusDayName?: string): QuickAction[] {
  return [
    {
      actionType: 'setReminder',
      data: { dayName: focusDayName },
      icon: 'bell',
      id: 'set-reminder',
      label: `Set ${focusDayName || 'day'} reminder`,
      subtitle: 'Get a notification to stay on track',
    },
    {
      actionType: 'makeSmaller',
      data: { dayName: focusDayName },
      icon: 'edit-3',
      id: 'make-smaller',
      label: `Make habit easier on ${focusDayName || 'this day'}`,
      subtitle: 'Adjust to a smaller version for tough days',
    },
    {
      actionType: 'viewHistory',
      data: { dayName: focusDayName },
      icon: 'calendar',
      id: 'view-history',
      label: `View ${focusDayName || 'day'} history`,
      subtitle: 'See your pattern on this day',
    },
  ];
}

export function getLowStreakActions(): QuickAction[] {
  return [
    {
      actionType: 'setReminder',
      icon: 'bell',
      id: 'set-daily-reminder',
      label: 'Set daily reminder',
      subtitle: 'Never forget with a daily nudge',
    },
    {
      actionType: 'makeSmaller',
      icon: 'zap',
      id: 'try-smaller',
      label: 'Try a smaller version',
      subtitle: 'Start with 2 minutes to build momentum',
    },
    {
      actionType: 'reviewWhy',
      icon: 'heart',
      id: 'review-why',
      label: 'Review your why',
      subtitle: 'Reconnect with your motivation',
    },
  ];
}

export function getGoodStreakActions(currentStreak?: number): QuickAction[] {
  return [
    {
      actionType: 'celebrate',
      icon: 'zap',
      id: 'keep-going',
      label: 'Keep the momentum!',
      subtitle: `${currentStreak || 0} days strong!`,
    },
    {
      actionType: 'setReminder',
      icon: 'bell',
      id: 'set-reminder',
      label: "Ensure you don't miss tomorrow",
      subtitle: 'Set a reminder to stay consistent',
    },
  ];
}

export function getWeekStreakActions(): QuickAction[] {
  return [
    {
      actionType: 'celebrate',
      icon: 'zap',
      id: 'celebrate',
      label: 'Celebrate your progress!',
      subtitle: 'A week streak is a major milestone',
    },
    {
      actionType: 'editHabit',
      icon: 'target',
      id: 'set-target',
      label: 'Set a new goal',
      subtitle: 'Aim for 14 days next!',
    },
  ];
}

export function getDefaultActions(): QuickAction[] {
  return [
    {
      actionType: 'celebrate',
      icon: 'zap',
      id: 'complete-today',
      label: 'Complete today to start',
      subtitle: 'Your first step toward building a habit',
    },
    {
      actionType: 'setReminder',
      icon: 'bell',
      id: 'set-reminder',
      label: 'Set a reminder',
      subtitle: 'Get notified at the right time',
    },
  ];
}
