import type { Id } from '../../../../convex/_generated/dataModel';

export interface ConvexMutations {
  toggleHabit: (args: {
    habitId: Id<'habits'>;
    date: string;
  }) => Promise<unknown>;
  createHabit: (args: {
    name: string;
    icon?: string;
    color?: string;
    iconColor?: string;
    daysOfWeek?: number[];
    frequency?: string;
    goalDuration?: number;
    notes?: string;
    preferredTime?: string;
    remindersEnabled?: boolean;
    reminderTime?: string;
    reminderSound?: string;
    strengthAlgorithm?: 'forgiving' | 'balanced' | 'strict';
  }) => Promise<unknown>;
  updateHabit: (args: {
    habitId: Id<'habits'>;
    name?: string;
    icon?: string;
    color?: string;
    iconColor?: string;
    notes?: string;
    preferredTime?: string;
    remindersEnabled?: boolean;
    reminderTime?: string;
    reminderSound?: string;
  }) => Promise<unknown>;
  archiveHabit: (args: { habitId: Id<'habits'> }) => Promise<unknown>;
  pauseHabit: (args: { habitId: Id<'habits'> }) => Promise<unknown>;
  removeHabit: (args: { habitId: Id<'habits'> }) => Promise<unknown>;
}
