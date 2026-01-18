/**
 * MilestoneProgress Types
 *
 * Type definitions for the MilestoneProgress component that displays
 * gamification progress toward meaningful milestones.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

/**
 * Milestone configuration
 */
export interface Milestone {
  /** Number of days required for this milestone */
  days: number;
  /** Badge emoji for this milestone */
  badge: string;
  /** Display name for this milestone */
  name: string;
}

/**
 * Milestone thresholds with their badges and names
 *
 * From spec:
 * | Days | Badge | Name |
 * | 3    | ⚡    | Habit Starter |
 * | 7    | ⭐    | Week Warrior |
 * | 14   | 🔥    | Two Week Titan |
 * | 21   | 🏅    | Habit Builder |
 * | 30   | 🏆    | Monthly Master |
 * | 60   | 💎    | Two Month Diamond |
 * | 90   | 🌟    | Quarterly Legend |
 * | 100  | 💯    | Century Club |
 * | 365  | 👑    | Year Hero |
 */
export const MILESTONES: Milestone[] = [
  { badge: '⚡', days: 3, name: 'Habit Starter' },
  { badge: '⭐', days: 7, name: 'Week Warrior' },
  { badge: '🔥', days: 14, name: 'Two Week Titan' },
  { badge: '🏅', days: 21, name: 'Habit Builder' },
  { badge: '🏆', days: 30, name: 'Monthly Master' },
  { badge: '💎', days: 60, name: 'Two Month Diamond' },
  { badge: '🌟', days: 90, name: 'Quarterly Legend' },
  { badge: '💯', days: 100, name: 'Century Club' },
  { badge: '👑', days: 365, name: 'Year Hero' },
];

/**
 * Display state for the MilestoneProgress component
 */
export type MilestoneDisplayState =
  | 'in-progress' // Working toward next milestone
  | 'just-hit' // Just achieved a milestone (celebration)
  | 'no-streak'; // No active streak

/**
 * Props for MilestoneProgress component
 *
 * @example
 * ```tsx
 * <MilestoneProgress
 *   currentStreak={14}
 *   onMilestoneHit={(milestone) => console.log(`Hit ${milestone} days!`)}
 * />
 * ```
 */
export interface MilestoneProgressProps {
  /** Current streak in days */
  currentStreak: number;

  /** Optional callback when a milestone is achieved */
  onMilestoneHit?: (milestone: number) => void;

  /** Optional: Track which milestones have been celebrated to avoid re-celebrating */
  celebratedMilestones?: number[];
}

/**
 * Result of milestone calculations
 */
export interface MilestoneCalculation {
  /** Current milestone (if any) */
  currentMilestone: Milestone | null;
  /** Next milestone to achieve */
  nextMilestone: Milestone | null;
  /** Days remaining until next milestone */
  daysRemaining: number;
  /** Progress percentage toward next milestone (0-100) */
  progressPercentage: number;
  /** Display state for the component */
  displayState: MilestoneDisplayState;
  /** Previous milestone (used for progress bar start point) */
  previousMilestone: Milestone | null;
}

/**
 * Gets the next milestone after the current streak
 */
export function getNextMilestone(currentStreak: number): Milestone | null {
  return MILESTONES.find((m) => m.days > currentStreak) ?? null;
}

/**
 * Gets the current milestone (last achieved)
 */
export function getCurrentMilestone(currentStreak: number): Milestone | null {
  // Find the highest milestone that has been achieved
  const achieved = MILESTONES.filter((m) => m.days <= currentStreak);
  return achieved.length > 0 ? achieved.at(-1) : null;
}

/**
 * Gets the previous milestone before the next one
 */
export function getPreviousMilestone(currentStreak: number): Milestone | null {
  const nextIdx = MILESTONES.findIndex((m) => m.days > currentStreak);
  if (nextIdx <= 0) return null;
  return MILESTONES[nextIdx - 1];
}

/**
 * Checks if the current streak exactly matches a milestone
 */
export function isOnMilestone(currentStreak: number): boolean {
  return MILESTONES.some((m) => m.days === currentStreak);
}

/**
 * Calculates all milestone-related values
 */
export function calculateMilestoneProgress(
  currentStreak: number,
  celebratedMilestones: number[] = []
): MilestoneCalculation {
  // Handle no-streak state (including negative values)
  if (currentStreak <= 0) {
    return {
      currentMilestone: null,
      daysRemaining: 3, // Days to first milestone
      displayState: 'no-streak',
      nextMilestone: MILESTONES[0],
      previousMilestone: null,
      progressPercentage: 0,
    };
  }

  const nextMilestone = getNextMilestone(currentStreak);
  const currentMilestone = getCurrentMilestone(currentStreak);
  const previousMilestone = getPreviousMilestone(currentStreak);

  // Check if just hit a milestone that hasn't been celebrated
  const justHitMilestone =
    isOnMilestone(currentStreak) &&
    !celebratedMilestones.includes(currentStreak);

  // Calculate days remaining
  const daysRemaining = nextMilestone ? nextMilestone.days - currentStreak : 0;

  // Calculate progress percentage
  // Progress is relative to the range between previous milestone (or 0) and next milestone
  let progressPercentage = 0;
  if (nextMilestone) {
    const startPoint = previousMilestone?.days ?? 0;
    const range = nextMilestone.days - startPoint;
    const current = currentStreak - startPoint;
    progressPercentage = range > 0 ? Math.round((current / range) * 100) : 0;
  } else {
    // Beyond all milestones
    progressPercentage = 100;
  }

  return {
    currentMilestone,
    daysRemaining,
    displayState: justHitMilestone
      ? 'just-hit'
      : currentStreak > 0
        ? 'in-progress'
        : 'no-streak',
    nextMilestone,
    previousMilestone,
    progressPercentage,
  };
}
