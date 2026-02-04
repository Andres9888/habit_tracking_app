/**
 * Onboarding Flow Types
 * TypeScript definitions for the 3-screen onboarding experience
 */

export type OnboardingScreen = 'value-hook' | 'first-habit' | 'success';

export interface OnboardingFlowProps {
  onComplete: (habitName?: string) => void;
  onSkip?: () => void;
}

export interface ValueHookScreenProps {
  onNext: () => void;
}

export interface FirstHabitScreenProps {
  onNext: (habitName: string) => void;
  onSkip: () => void;
}

export interface SuccessScreenProps {
  habitName?: string;
  onComplete: () => void;
}

export interface SuggestionPill {
  id: string;
  label: string;
}

export const DEFAULT_SUGGESTIONS: SuggestionPill[] = [
  { id: 'exercise', label: 'Exercise' },
  { id: 'meditate', label: 'Meditate' },
];
