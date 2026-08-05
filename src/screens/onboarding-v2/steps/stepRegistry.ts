import { ComponentType } from 'react';

import { StepComponentProps, StepId } from '../types';
import { OnePeakStep } from './OnePeakStep';
import { PickFirstRouteStep } from './PickFirstRouteStep';
import { ProblemStep } from './ProblemStep';
import { SolutionIntroStep } from './SolutionIntroStep';
import { StrengthHoldsStep } from './StrengthHoldsStep';
import { WatchItTransformStep } from './WatchItTransformStep';
import { WelcomeStep } from './WelcomeStep';

export const STEP_REGISTRY: Record<StepId, ComponentType<StepComponentProps>> = {
  onePeak: OnePeakStep,
  pickFirstRoute: PickFirstRouteStep,
  problem: ProblemStep,
  solutionIntro: SolutionIntroStep,
  strengthHolds: StrengthHoldsStep,
  watchTransform: WatchItTransformStep,
  welcome: WelcomeStep,
};
