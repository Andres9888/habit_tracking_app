/**
 * Daily Challenge System - Type Definitions
 *
 * Opt-in daily challenges that boost engagement with XP bonuses.
 */

export type ChallengeId =
  | 'complete_before_noon'
  | 'perfect_5_day_week'
  | 'try_new_template'
  | 'morning_routine_3'
  | 'weekend_warrior'
  | 'consistency_king';

export type ChallengeTier = 'free' | 'premium';

export interface Challenge {
  id: ChallengeId;
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
  tier: ChallengeTier;
  /** Number of days this challenge spans (1 = daily, 5 = weekly) */
  durationDays: number;
}

export interface ChallengeProgress {
  challengeId: ChallengeId;
  /** ISO date string when the challenge was started/assigned */
  assignedDate: string;
  /** Current progress (e.g., days completed out of durationDays) */
  currentProgress: number;
  /** Target progress for completion */
  targetProgress: number;
  /** Whether the challenge has been completed */
  completed: boolean;
  /** ISO date string when completed */
  completedDate?: string;
  /** Whether the user dismissed this challenge card */
  dismissed: boolean;
}

export interface ChallengeCompletion {
  challengeId: ChallengeId;
  completedDate: string;
  xpEarned: number;
}

export interface DailyChallengeState {
  /** Currently active challenge for today */
  activeChallenge: ChallengeProgress | null;
  /** History of completed challenges */
  completions: ChallengeCompletion[];
  /** Total XP earned from challenges */
  totalXpEarned: number;
  /** Whether challenges are opted in */
  optedIn: boolean;
}
