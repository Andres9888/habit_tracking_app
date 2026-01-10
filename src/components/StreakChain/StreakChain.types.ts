export type DayStatus = 'done' | 'missed' | 'planned';

export interface StreakChainProps {
  label: string;
  statuses: DayStatus[];
  size?: number;
}
