export interface ChainGridCardProps {
  /** Ordered oldest→newest. true = completed day. */
  days: boolean[];
  currentStreak: number;
  bestStreak: number;
}

export interface ChainCellState {
  completed: boolean;
  isEndOfStreak: boolean;
}
