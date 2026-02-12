/**
 * Variant configurations for PremiumPaywall
 */

import type { VariantConfig } from './PremiumPaywall.types';

export const VARIANT_CONFIGS: Record<string, VariantConfig> = {
  motivation: {
    presentation: 'blur-overlay',
    heroTitle: 'Unlock Premium Motivation',
    heroSubtitle: 'Science-backed tools to build unbreakable habits',
    ctaText: 'Start Free Trial',
    showPricingToggle: true,
    showSocialProof: true,
    gradientColors: ['#047857', '#059669'] as const,
  },
  benefits: {
    presentation: 'page-sheet',
    heroTitle: 'Unlock Your Full Motivation Toolkit',
    heroSubtitle:
      'Science-backed features proven to increase habit retention by 3x',
    ctaText: 'Start 7-Day Free Trial',
    showPricingToggle: false,
    showSocialProof: true,
    gradientColors: ['#8b5cf6', '#7c3aed'] as const,
  },
  analytics: {
    presentation: 'blur-overlay',
    heroTitle: 'Unlock Premium Analytics',
    heroSubtitle: 'Deep insights to supercharge your habits',
    ctaText: 'Start Free Trial',
    showPricingToggle: true,
    showSocialProof: false,
    gradientColors: ['#047857', '#059669'] as const,
  },
};
