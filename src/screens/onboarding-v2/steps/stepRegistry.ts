import { ComponentType } from 'react';

import { StepComponentProps, StepId } from '../types';
import { AccountCreationStep } from './AccountCreationStep';
import { AppDemoStep } from './AppDemoStep';
import { CategoryPreferenceStep } from './CategoryPreferenceStep';
import { GoalStep } from './GoalStep';
import { NameStep } from './NameStep';
import { NotificationPrimingStep } from './NotificationPrimingStep';
import { PainAmplificationStep } from './PainAmplificationStep';
import { PainPointsStep } from './PainPointsStep';
import { PaywallStep } from './PaywallStep';
import { PlanPreviewStep } from './PlanPreviewStep';
import { ProblemStep } from './ProblemStep';
import { ProcessingStep } from './ProcessingStep';
import { SocialProofStep } from './SocialProofStep';
import { SolutionIntroStep } from './SolutionIntroStep';
import { SolutionStep } from './SolutionStep';
import { WelcomeStep } from './WelcomeStep';

export const STEP_REGISTRY: Record<StepId, ComponentType<StepComponentProps>> = {
  accountCreation: AccountCreationStep,
  appDemo: AppDemoStep,
  categoryPreference: CategoryPreferenceStep,
  goal: GoalStep,
  name: NameStep,
  notificationPriming: NotificationPrimingStep,
  painAmplification: PainAmplificationStep,
  painPoints: PainPointsStep,
  paywall: PaywallStep,
  planPreview: PlanPreviewStep,
  problem: ProblemStep,
  processing: ProcessingStep,
  socialProof: SocialProofStep,
  solution: SolutionStep,
  solutionIntro: SolutionIntroStep,
  welcome: WelcomeStep,
};
