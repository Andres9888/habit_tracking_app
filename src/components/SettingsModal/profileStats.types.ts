export interface ProfileStats {
  activeHabits: number;
  flawlessDays: number;
  lifetimeCompletions: number;
}

export interface ProfileHabitEntry {
  _id: string | number;
  createdAt?: number;
}

export interface ProfileTrackingEntry {
  completed?: boolean;
  date: string;
  habitId: string | number;
}
