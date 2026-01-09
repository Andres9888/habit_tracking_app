import type { ViewStyle } from 'react-native';

export interface HabitsEmptyStateProps {
  isLoading: boolean;
  openCreateHabitScreen: () => void;
  openTemplatesScreen?: () => void;
  onQuickCreateHabit?: (habitName: string) => Promise<void>;
  onNeedHelpQuiz?: () => void;
  onScheduleReminder?: () => void;
}

export interface HabitSuggestion {
  duration: string;
  emoji: string;
  fullName: string;
  name: string;
  timeHint: string;
}

export interface TimeContext {
  greeting: string;
  habits: HabitSuggestion[];
  period: 'morning' | 'afternoon' | 'evening';
}

export interface QuickStartButtonProps {
  habit: HabitSuggestion;
  isCreating: boolean;
  isSuccess: boolean;
  onPress: () => Promise<void>;
  containerStyle?: ViewStyle;
  index: number;
}

export interface QuickWinCardProps {
  creatingHabit: string | null;
  successHabit: string | null;
  onQuickCreateHabit: (habitName: string) => Promise<void>;
  timeContext: TimeContext;
}

export interface CustomHabitCardProps {
  onPress: () => void;
  onNeedHelpQuiz?: () => void;
}

export interface TemplatesPeekCardProps {
  onPress: () => void;
}

export interface CompactHelperRowProps {
  onNeedHelpQuiz?: () => void;
  onScheduleReminder?: () => void;
}

export interface WelcomeHeroProps {
  greeting: string;
  period: string;
}

export interface FloatingParticleProps {
  delay: number;
  emoji: string;
  duration?: number;
}

export interface TemplatePreview {
  tagline: string;
  title: string;
}
