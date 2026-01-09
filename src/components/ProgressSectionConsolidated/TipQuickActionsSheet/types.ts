/**
 * TipQuickActionsSheet Types
 *
 * Type definitions for the tip quick actions bottom sheet component.
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

/**
 * Types of tips that can be displayed in the ActionableTipCard
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
