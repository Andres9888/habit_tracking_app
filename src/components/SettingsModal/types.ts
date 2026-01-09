export interface SettingsModalProps {
  celebrationsEnabled?: boolean;
  dayShape?: 'circle' | 'square';
  habitCompletionIcon?: 'chain' | 'checkbox';
  onChangeDayShape?: (value: 'circle' | 'square') => void | Promise<void>;
  onChangeShowCharacterScreen?: (value: boolean) => void | Promise<void>;
  onChangeHabitCompletionIcon?: (
    value: 'chain' | 'checkbox'
  ) => void | Promise<void>;
  onChangeCelebrationsEnabled?: (value: boolean) => void | Promise<void>;
  onChangeCompact?: (value: boolean) => void | Promise<void>;
  showHabitStrengthPercentage?: boolean;
  onChangeShowHabitStrengthPercentage?: (
    value: boolean
  ) => void | Promise<void>;
  showWeekCompletionBar?: boolean;
  onChangeShowWeekCompletionBar?: (value: boolean) => void | Promise<void>;
  showNotesStats?: boolean;
  onChangeShowNotesStats?: (value: boolean) => void | Promise<void>;
  isHighContrastActive?: boolean;
  isCompact?: boolean;
  onOpenHapticTest?: () => void;
  onClose: () => void;
  showCharacterScreen?: boolean;
  visible: boolean;
}

export interface SettingsColors {
  accent: string;
  background: string;
  card: string;
  cardBorder: string;
  headerText: string;
  icon: string;
  mutedText: string;
  versionText: string;
}
