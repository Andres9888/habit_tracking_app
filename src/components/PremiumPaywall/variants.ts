/**
 * Variant configurations for PremiumPaywall
 */

import type { VariantConfig } from './PremiumPaywall.types';

export const VARIANT_CONFIGS: Record<string, VariantConfig> = {
  analytics: {
    ctaText: 'Start Free Trial',
    gradientColors: ['#047857', '#059669'] as const,
    heroSubtitle: "See exactly what's working — and what needs attention.",
    heroTitle: 'Unlock Premium Analytics',
    presentation: 'blur-overlay',
    showPricingToggle: true,
    showSocialProof: false,
  },
  benefits: {
    ctaText: 'Start Free Trial',
    gradientColors: ['#8b5cf6', '#7c3aed'] as const,
    heroSubtitle: 'Science-backed tools proven to 3x your habit retention.',
    heroTitle: 'Unlock Your Full Motivation Toolkit',
    presentation: 'page-sheet',
    showPricingToggle: false,
    showSocialProof: true,
  },
  motivation: {
    ctaText: 'Start Free Trial',
    gradientColors: ['#047857', '#059669'] as const,
    heroSubtitle: 'Science-backed tools to make your habits unbreakable.',
    heroTitle: 'Unlock Premium Motivation',
    presentation: 'blur-overlay',
    showPricingToggle: true,
    showSocialProof: true,
  },
};
