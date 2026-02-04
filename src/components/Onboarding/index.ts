/**
 * Onboarding Components
 * 3-screen onboarding flow for habit tracking app
 */

export { OnboardingFlow } from './OnboardingFlow';
export { ValueHookScreen } from './screens/ValueHookScreen';
export { FirstHabitScreen } from './screens/FirstHabitScreen';
export { SuccessScreen } from './screens/SuccessScreen';
export { ChainVisual } from './components/ChainVisual';
export { ProgressDots } from './components/ProgressDots';
export { SuggestionPill } from './components/SuggestionPill';

export type {
  OnboardingFlowProps,
  OnboardingScreen,
  ValueHookScreenProps,
  FirstHabitScreenProps,
  SuccessScreenProps,
} from './types';

export { DEFAULT_SUGGESTIONS } from './types';
