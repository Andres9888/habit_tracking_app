/**
 * StreakChainSection Type Definitions
 */

export interface StreakChainSectionProps {
  bestStreak: number;
  currentStreak: number;
  lastSevenDays: boolean[];
  todayCompleted: boolean;
}

export interface DayCircleProps {
  completed: boolean;
  index: number;
  isToday: boolean;
  label: string;
  todayCompleted: boolean;
}

export interface ConnectorLineProps {
  active: boolean;
  index: number;
}

export interface ContextualMessageProps {
  currentStreak: number;
  bestStreak: number;
  todayCompleted: boolean;
  /** The user's previous streak before the current gap (if any). Used for comeback messaging. */
  previousStreak?: number;
  /** Number of days since the user last completed this habit. */
  daysSinceLastCompletion?: number;
}

export interface TierConfig {
  days: number;
  icon: string;
  barColor: string;
  textColor: string;
}

export type MessageType = 'record' | 'motivation' | 'start' | 'celebrate';

export interface ContextualMessageData {
  message: string;
  emoji: string;
  type: MessageType;
}
