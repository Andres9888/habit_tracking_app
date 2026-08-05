/**
 * HabitRankingsList Types
 */

export interface HabitRanking {
  id: string;
  name: string;
  emoji: string;
  strength: number;
  currentStreak: number;
  longestStreak: number;
  isAtRisk: boolean;
}

export interface HabitRankingsListProps {
  habits: HabitRanking[];
  onHabitPress?: (habitId: string) => void;
}

export interface RankBadge {
  color: string;
  icon: string;
}
