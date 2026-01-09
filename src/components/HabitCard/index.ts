/**
 * HabitCard Barrel Export
 * Re-exports all public APIs from the HabitCard module
 */

export { HabitCard, default } from './HabitCard';
export type { HabitCardProps } from './HabitCard.types';

export { useHabitCardEntrance } from './useHabitCardEntrance';
export type {
  HabitCardEntranceVariant,
  UseHabitCardEntranceOptions,
  UseHabitCardEntranceReturn,
  HabitCardEntranceStyles,
} from './useHabitCardEntrance';

// Internal exports (for advanced usage)
export { useHabitCard } from './useHabitCard';
export { useHabitCardAnimations } from './useHabitCardAnimations';
export { useHabitCardGestures } from './useHabitCardGestures';
export {
  getStrengthColor,
  getStrengthEmoji,
  getBackgroundColor,
} from './HabitCard.utils';
