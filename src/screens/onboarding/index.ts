/**
 * Onboarding Module
 * 
 * Exports:
 * - OnboardingScreen: Main 3-screen carousel
 * - useOnboardingStatus: Hook for managing onboarding state
 * - trackOnboardingEvent: Analytics tracking
 * - ONBOARDING_KEY: AsyncStorage key for persistence
 */

export { OnboardingScreen, ONBOARDING_KEY } from './OnboardingScreen';
export { useOnboardingStatus } from './useOnboardingStatus';
export { trackOnboardingEvent } from './analytics';
export type { OnboardingAnalyticsTracker, OnboardingEventName } from './analytics';
