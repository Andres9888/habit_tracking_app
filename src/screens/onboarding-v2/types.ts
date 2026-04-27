/**
 * Shared types for the Chain Builder onboarding flow (v2).
 */

export type StepId =
  | 'welcome'
  | 'problem'
  | 'solutionIntro'
  | 'name'
  | 'goal'
  | 'painPoints'
  | 'socialProof'
  | 'painAmplification'
  | 'solution'
  | 'categoryPreference'
  | 'processing'
  | 'appDemo'
  | 'planPreview'
  | 'firstCheckIn'
  | 'celebration'
  | 'notificationPriming'
  | 'accountCreation'
  | 'paywall';

export const STEP_SEQUENCE: readonly StepId[] = [
  'welcome',
  'problem',
  'solutionIntro',
  'name',
  'goal',
  'painPoints',
  'socialProof',
  'painAmplification',
  'solution',
  'categoryPreference',
  'processing',
  'appDemo',
  'planPreview',
  'firstCheckIn',
  'celebration',
  'notificationPriming',
  'accountCreation',
  'paywall',
] as const;

export interface OnboardingAnswers {
  name?: string;
  goal?: string;
  painPoints: string[];
  painAgreements: string[];
  categories: string[];
  pickedTemplateIds: string[];
  firstCheckInIds: string[];
}

export const INITIAL_ANSWERS: OnboardingAnswers = {
  categories: [],
  firstCheckInIds: [],
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
