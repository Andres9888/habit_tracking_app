/**
 * Variant configurations for PremiumPaywall
 */

import type { VariantConfig } from './PremiumPaywall.types';

export const VARIANT_CONFIGS: Record<string, VariantConfig> = {
  analytics: {
    ctaText: 'Start Free Trial',
    gradientColors: ['#047857', '#059669'] as const,
    heroSubtitle: 'Deep insights to supercharge your habits',
    heroTitle: 'Unlock Premium Analytics',
    presentation: 'blur-overlay',
    showPricingToggle: true,
    showSocialProof: true,
  },
  benefits: {
    ctaText: 'Start 7-Day Free Trial',
    gradientColors: ['#8b5cf6', '#7c3aed'] as const,
    heroSubtitle:
      'Science-backed features proven to increase habit retention by 3x',
    heroTitle: 'Unlock Your Full Motivation Toolkit',
    presentation: 'page-sheet',
    showPricingToggle: false,
    showSocialProof: true,
  },
  motivation: {
    ctaText: 'Start Free Trial',
    gradientColors: ['#047857', '#059669'] as const,
    heroSubtitle: 'Science-backed tools to build unbreakable habits',
    heroTitle: 'Unlock Premium Motivation',
    presentation: 'blur-overlay',
    showPricingToggle: true,
    showSocialProof: true,
  },
};
