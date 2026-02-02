/**
 * Onboarding Flow Types
 */

export type OnboardingStep = 'welcome' | 'createHabit' | 'chainExplained' | 'reminder' | 'ready';

export interface OnboardingData {
  selectedHabit: HabitSuggestion | null;
  customHabitName: string;
  reminderTime: string | null;
  reminderPreset: ReminderPreset | null;
}

export interface HabitSuggestion {
  id: string;
  emoji: string;
  name: string;
}

export type ReminderPreset = 'morning' | 'afternoon' | 'evening';

export interface OnboardingContextType {
  currentStep: OnboardingStep;
  data: OnboardingData;
  goToStep: (step: OnboardingStep) => void;
  goNext: () => void;
  goBack: () => void;
  updateData: (updates: Partial<OnboardingData>) => void;
  completeOnboarding: () => Promise<void>;
}

export interface OnboardingScreenProps {
  onNext: () => void;
  onBack?: () => void;
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onComplete?: () => Promise<void>;
}
