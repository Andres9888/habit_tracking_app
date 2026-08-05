import type { CompletionIcon, DayShape } from './types';

export interface ChainDayItemProps {
  accentColor: string;
  burstActive: boolean;
  completionIcon: CompletionIcon;
  completed: boolean;
  strengthPercent: number;
  dateString: string;
  disabled: boolean;
  index: number;
  isToday: boolean;
  missed: boolean;
  onBurstComplete: () => void;
  onToggle: (
    dateString: string,
    completed: boolean,
    disabled: boolean,
    index: number
  ) => void;
  shape: DayShape;
  shouldReduceMotion: boolean;
  showConnector: boolean;
  accessibilityHint: string;
  accessibilityLabel: string;
}
