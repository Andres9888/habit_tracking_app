/**
 * Type definitions for the interactive onboarding flow.
 */

import type { Id } from '../../../convex/_generated/dataModel';
import type { TemplateCategory } from '../../../convex/templates/types';

export type OnboardingStep = 'addHabit' | 'tryCompletion' | 'celebration';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  'addHabit',
  'tryCompletion',
  'celebration',
];

export interface OnboardingFlowState {
  currentStep: OnboardingStep;
  stepIndex: number;
  createdHabitId: Id<'habits'> | null;
}

export interface StepProps {
  onNext: () => void;
  onSkip: () => void;
}

export interface AddHabitStepProps extends StepProps {
  onHabitCreated: (habitId: Id<'habits'>) => void;
}

export interface TryCompletionStepProps extends StepProps {
  habitId: Id<'habits'>;
}

export interface CelebrationStepProps {
  habitId: Id<'habits'> | null;
  onComplete: () => void;
}

export interface CategoryPillData {
  label: string;
  category: TemplateCategory | 'popular';
}

export const TEMPLATE_CATEGORIES: CategoryPillData[] = [
  { category: 'popular', label: 'Popular' },
  { category: 'health_fitness', label: 'Health' },
  { category: 'mindfulness', label: 'Mindfulness' },
  { category: 'productivity', label: 'Productivity' },
  { category: 'morning_routine', label: 'Morning' },
  { category: 'learning', label: 'Learning' },
  { category: 'sleep', label: 'Sleep' },
];
