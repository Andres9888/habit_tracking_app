/**
 * TipQuickActionsSheet Types
 *
 * Type definitions for the tip quick actions bottom sheet component.
 * This sheet provides contextual quick actions based on the tip type
 * to help users take immediate action on their habits.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

/**
 * Types of tips that can be displayed in the ActionableTipCard
 * Each type corresponds to different quick actions
 */
export type TipType =
  | 'focusDay' // Tip about weak day performance (e.g., "Focus on Saturday")
  | 'lowStreak' // Tip about building/maintaining streaks
  | 'goodStreak' // Encouraging tip when streak is going well
  | 'weekStreak' // Tip about reaching 7-day milestone
  | 'noData'; // Default tip when insufficient data

/**
 * Quick action configuration
 */
export interface QuickAction {
  /** Unique identifier for the action */
  id: string;
  /** Display label for the action */
  label: string;
  /** Icon name from lucide-react-native */
  icon: 'bell' | 'edit-3' | 'calendar' | 'target' | 'heart' | 'zap';
  /** Optional subtitle with additional context */
  subtitle?: string;
  /** Action type for tracking/handling */
  actionType:
    | 'setReminder'
    | 'editHabit'
    | 'viewHistory'
    | 'reviewWhy'
    | 'makeSmaller'
    | 'celebrate';
  /** Optional extra data for the action */
  data?: Record<string, unknown>;
}

/**
 * Props for the TipQuickActionsSheet component
 */
export interface TipQuickActionsSheetProps {
  /** Whether the sheet is visible */
  visible: boolean;
  /** The tip text being displayed */
  tipText: string;
  /** The type of tip for determining available actions */
  tipType: TipType;
  /** Day name for focus day tips (e.g., "Saturday") */
  focusDayName?: string;
  /** Current streak count for context */
  currentStreak?: number;
  /** Callback when an action is selected */
  onActionPress: (action: QuickAction) => void;
  /** Callback when the sheet is closed */
  onClose: () => void;
}

/**
 * Get quick actions based on tip type
 */
export function getQuickActionsForTipType(
  tipType: TipType,
  focusDayName?: string,
  currentStreak?: number
): QuickAction[] {
  switch (tipType) {
    case 'focusDay': {
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

    case 'lowStreak': {
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

    case 'goodStreak': {
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

    case 'weekStreak': {
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

    default: {
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
  }
}

/**
 * Determine tip type from tip text
 * Parses the actionable tip message to determine which quick actions to show
 */
export function determineTipTypeFromText(
  tipText: string,
  currentStreak: number
): { tipType: TipType; focusDayName?: string } {
  // Focus day pattern: "Focus on X & Y to level up!" or "Focus on X to level up!"
  const focusDayMatch = tipText.match(
    /Focus on ([A-Za-z]+(?:\s*&\s*[A-Za-z]+)?)/i
  );
  if (focusDayMatch) {
    // Extract first day name if multiple (e.g., "Sat & Sun" -> "Sat")
    const dayPart = focusDayMatch[1].split('&')[0].trim();
    return { focusDayName: dayPart, tipType: 'focusDay' };
  }

  // Good streak pattern: "Amazing streak!" or similar
  if (
    tipText.toLowerCase().includes('amazing streak') ||
    tipText.toLowerCase().includes('keep the momentum')
  ) {
    return { tipType: 'goodStreak' };
  }

  // Week streak pattern: "more days to hit a week streak"
  if (tipText.toLowerCase().includes('week streak')) {
    return { tipType: 'weekStreak' };
  }

  // Low/no streak pattern: "Complete today to start"
  if (
    tipText.toLowerCase().includes('complete today') ||
    tipText.toLowerCase().includes('start a new streak')
  ) {
    return { tipType: currentStreak > 0 ? 'lowStreak' : 'noData' };
  }

  // Default to low streak if there's any tip but no streak
  if (currentStreak === 0) {
    return { tipType: 'noData' };
  }

  return { tipType: 'lowStreak' };
}
