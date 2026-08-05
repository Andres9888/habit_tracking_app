/**
 * Shared types for the Chain Builder onboarding flow (v2).
 */

export type StepId =
  | 'welcome'
  | 'problem'
  | 'solutionIntro'
  | 'strengthHolds'
  | 'watchTransform'
  | 'onePeak'
  | 'pickFirstRoute';

export const STEP_SEQUENCE: readonly StepId[] = [
  'welcome',
  'problem',
  'solutionIntro',
  'strengthHolds',
  'watchTransform',
  'onePeak',
  'pickFirstRoute',
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
