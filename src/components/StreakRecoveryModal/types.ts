/**
 * Types for StreakRecoveryModal
 */

export interface EligibleHabit {
  habitId: string;
  habitName: string;
  habitEmoji: string;
  currentStreak: number;
}

export interface StreakRecoveryModalProps {
  visible: boolean;
  onClose: () => void;
  eligibleHabits: EligibleHabit[];
  freezesRemaining: number;
  onUseFreeze: (habitId: string) => Promise<void>;
}
