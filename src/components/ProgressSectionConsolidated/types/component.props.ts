/**
 * Component Props Types
 *
 * Props interfaces for child components within ProgressSectionConsolidated.
 */

import type { QuickAction } from '../TipQuickActionsSheet';

/**
 * Props for InsightChips component
 * Horizontal scroll container with key insight chips
 */
export interface InsightChipsProps {
  /** Current streak in days */
  currentStreak: number;
  /** Best performing day name and rate */
  bestDay: { name: string; rate: number } | null;
  /** Worst performing day (focus day) name and rate */
  focusDay: { name: string; rate: number } | null;
  /** Days completed this month */
  monthlyCompleted: number;
  /** Total days in the month so far */
  monthlyTotal: number;
  /** Callback when focus day chip is pressed */
  onFocusDayPress?: () => void;
}

/**
 * Props for WeeklyPatternChart component
 * Compact 7-day bar chart showing completion patterns
 */
export interface WeeklyPatternChartProps {
  /** Statistics for each day of the week */
  dayStats: Array<{
    day: string;
    dayIndex: number;
    completed: number;
    total: number;
    rate: number;
  }>;
  /** Callback when "Details" button is pressed */
  onSeeAllPress?: () => void;
}

/**
 * Props for ActionableTipCard component
 * CTA section with personalized tip
 */
export interface ActionableTipCardProps {
  /** Tip message text */
  tip: string;
  /** Optional subtitle for additional context */
  subtitle?: string;
  /** Current streak for determining tip type */
  currentStreak?: number;
  /** Callback when tip card is pressed */
  onPress?: () => void;
  /** Callback when a quick action is selected from the sheet */
  onQuickAction?: (action: QuickAction) => void;
}

/**
 * Props for StreakRecordsAccordion component
 * Collapsible section showing streak medal records
 */
export interface StreakRecordsAccordionProps {
  /** Top streak records (medals) */
  streakRecords: Array<{
    days: number;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
  }>;
  /** Current active streak (0 if none) */
  currentStreak: number;
  /** Default expanded state */
  defaultExpanded?: boolean;
}
