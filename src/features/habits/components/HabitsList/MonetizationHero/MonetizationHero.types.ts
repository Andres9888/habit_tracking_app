/**
 * MonetizationHero Types
 */

export interface MonetizationHeroProps {
  freeHabitLimit: number;
  habitSlotsUsed: number;
  hasReachedHabitLimit: boolean;
  onUpgradePress: () => void;
  reduceMotion?: boolean;
}
