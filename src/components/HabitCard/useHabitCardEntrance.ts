/**
 * useHabitCardEntrance Re-export
 * Maintains backward compatibility while delegating to the entrance module
 */

export { useHabitCardEntrance, default } from './entrance/useHabitCardEntrance';

export type {
  HabitCardEntranceVariant,
  UseHabitCardEntranceOptions,
  UseHabitCardEntranceReturn,
  HabitCardEntranceStyles,
} from './entrance/types';
