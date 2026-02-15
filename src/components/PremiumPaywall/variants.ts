/**
 * Variant configurations for PremiumPaywall
 */

import type { VariantConfig } from './PremiumPaywall.types';

export const VARIANT_CONFIGS: Record<string, VariantConfig> = {
  analytics: {
    ctaText: 'Try Premium Free for 7 Days',
    gradientColors: ['#047857', '#059669'] as const,
    heroSubtitle: "See exactly what's working — and what needs attention.",
    heroTitle: 'Unlock Premium Analytics',
    presentation: 'blur-overlay',
    showPricingToggle: true,
    showSocialProof: false,
  },
  benefits: {
    ctaText: 'Start My Free 7-Day Trial',
    gradientColors: ['#8b5cf6', '#7c3aed'] as const,
    heroSubtitle:
      'Science-backed tools proven to 3× your habit retention. Try free for 7 days.',
    heroTitle: 'Make Your Habits Unbreakable',
    presentation: 'page-sheet',
    showPricingToggle: false,
    showSocialProof: true,
  },
  motivation: {
    ctaText: 'Try Premium Free for 7 Days',
    gradientColors: ['#047857', '#059669'] as const,
    heroSubtitle: 'Science-backed tools to make your habits unbreakable.',
    heroTitle: 'Unlock Premium Motivation',
    presentation: 'blur-overlay',
    showPricingToggle: true,
    showSocialProof: true,
  },
};
