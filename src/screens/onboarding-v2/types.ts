/**
 * Shared types for the Chain Builder onboarding flow (v2).
 */

export type StepId =
  | 'welcome'
  | 'goal'
  | 'painPoints'
  | 'socialProof'
  | 'painAmplification'
  | 'solution'
  | 'categoryPreference'
  | 'processing'
  | 'appDemo'
  | 'planPreview'
  | 'notificationPriming'
  | 'accountCreation'
  | 'paywall';

export const STEP_SEQUENCE: readonly StepId[] = [
  'welcome',
  'goal',
  'painPoints',
  'socialProof',
  'painAmplification',
  'solution',
  'categoryPreference',
  'processing',
  'appDemo',
  'planPreview',
  'notificationPriming',
  'accountCreation',
  'paywall',
] as const;

export interface OnboardingAnswers {
  goal?: string;
  painPoints: string[];
  painAgreements: string[];
  categories: string[];
  pickedTemplateIds: string[];
}

export const INITIAL_ANSWERS: OnboardingAnswers = {
  categories: [],
  painAgreements: [],
  painPoints: [],
  pickedTemplateIds: [],
};

export interface StepComponentProps {
  answers: OnboardingAnswers;
  onAnswerChange: (partial: Partial<OnboardingAnswers>) => void;
  onBack: () => void;
  onNext: () => void;
}
