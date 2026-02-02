/**
 * Onboarding Module - Main Export
 *
 * Usage:
 *
 * import { OnboardingFlow, useOnboardingStorage } from '@/components/Onboarding';
 *
 * function App() {
 *   const { isLoading, hasCompletedOnboarding } = useOnboardingStorage();
 *
 *   if (isLoading) return <LoadingScreen />;
 *   if (!hasCompletedOnboarding) return <OnboardingFlow onComplete={() => {}} />;
 *   return <MainApp />;
 * }
 */

export { OnboardingFlow } from './OnboardingFlow';
export { useOnboardingStorage } from './hooks';
export { ONBOARDING_COLORS, ASYNC_STORAGE_KEYS } from './constants';
export type { OnboardingData, OnboardingStep, HabitSuggestion } from './types';
