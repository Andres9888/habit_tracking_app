/**
 * Celebration Tiers System
 *
 * Defines celebration intensity levels based on milestone importance.
 * Ensures big milestones feel significantly more rewarding than small ones.
 */

export type CelebrationTier = 'small' | 'medium' | 'large';

export interface CelebrationConfig {
  tier: CelebrationTier;
  particleCount: number;
  duration: number;
  hapticType: 'light' | 'medium' | 'heavy';
  showToast: boolean;
  showModal: boolean;
  soundEffect?: 'small' | 'medium' | 'large';
}

/**
 * Milestone tier mapping
 * Tier 1 (Small): 3, 7, 14 days - Starting out
 * Tier 2 (Medium): 21, 30, 60 days - Building momentum
 * Tier 3 (Large): 90, 100, 365 days - Major achievements
 */
const MILESTONE_TIERS: Record<number, CelebrationTier> = {
  3: 'small',
  7: 'small',
  14: 'small',
  21: 'medium',
  30: 'medium',
  60: 'medium',
  90: 'large',
  100: 'large',
  365: 'large',
};

/**
 * Celebration configurations by tier
 */
const TIER_CONFIGS: Record<CelebrationTier, CelebrationConfig> = {
  small: {
    tier: 'small',
    particleCount: 8,
    duration: 800,
    hapticType: 'light',
    showToast: false,
    showModal: false,
    soundEffect: 'small',
  },
  medium: {
    tier: 'medium',
    particleCount: 16,
    duration: 1200,
    hapticType: 'medium',
    showToast: true,
    showModal: false,
    soundEffect: 'medium',
  },
  large: {
    tier: 'large',
    particleCount: 24,
    duration: 2000,
    hapticType: 'heavy',
    showToast: true,
    showModal: true,
    soundEffect: 'large',
  },
};

/**
 * Get celebration config for a given streak milestone
 */
export function getCelebrationConfig(streakDays: number): CelebrationConfig {
  const tier = MILESTONE_TIERS[streakDays] || 'small';
  return TIER_CONFIGS[tier];
}

/**
 * Check if a streak day is a milestone
 */
export function isMilestone(streakDays: number): boolean {
  return streakDays in MILESTONE_TIERS;
}

/**
 * Get the tier for a given streak (for non-milestone days, returns small)
 */
export function getCelebrationTier(streakDays: number): CelebrationTier {
  if (streakDays in MILESTONE_TIERS) {
    return MILESTONE_TIERS[streakDays];
  }
  // Default to small celebration for regular completions
  return 'small';
}

/**
 * Get particle count for a given streak
 */
export function getParticleCount(streakDays: number): number {
  const config = getCelebrationConfig(streakDays);
  return config.particleCount;
}

/**
 * Check if toast should be shown for this celebration
 */
export function shouldShowToast(streakDays: number): boolean {
  const config = getCelebrationConfig(streakDays);
  return config.showToast;
}

/**
 * Check if modal should be shown for this celebration
 */
export function shouldShowModal(streakDays: number): boolean {
  const config = getCelebrationConfig(streakDays);
  return config.showModal;
}
