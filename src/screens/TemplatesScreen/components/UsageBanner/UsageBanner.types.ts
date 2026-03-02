/**
 * Types for UsageBanner component
 */

export interface UsageBannerProps {
  isPremiumUser: boolean;
  onShowPaywall?: () => void;
  userHabitCount: number;
}

export interface UsageBannerData {
  dots: boolean[];
  limit: number;
  showBanner: boolean;
  showUnlockCta: boolean;
  used: number;
}
