/**
 * PremiumPaywall Component
 *
 * Unified paywall replacing MotivationPaywall, PremiumBenefitsModal,
 * and PremiumAnalyticsPaywall. Use the `variant` prop:
 *
 * - "motivation": Full-screen blur overlay, motivation features
 * - "benefits": Page-sheet modal, rich feature cards
 * - "analytics": Full-screen blur overlay, analytics features
 */

import React from 'react';

import type { PremiumPaywallProps } from './PremiumPaywall.types';
import { BenefitsVariant } from './BenefitsVariant';
import { BlurOverlayVariant } from './BlurOverlayVariant';
import { VARIANT_CONFIGS } from './variants';
import { usePremiumPaywall } from './usePremiumPaywall';

export function PremiumPaywall({
  variant,
  visible,
  onClose,
  onStartTrial,
  onRestorePurchases,
  triggeredByFeature,
  reduceMotion = false,
  testID,
}: PremiumPaywallProps) {
  const config = VARIANT_CONFIGS[variant];
  const handlers = usePremiumPaywall({
    onClose,
    onRestorePurchases,
    onStartTrial,
    variant,
  });

  if (variant === 'benefits') {
    return (
      <BenefitsVariant
        config={config}
        handlers={handlers}
        reduceMotion={reduceMotion}
        testID={testID}
        triggeredByFeature={triggeredByFeature}
        visible={visible}
      />
    );
  }

  return (
    <BlurOverlayVariant
      config={config}
      handlers={handlers}
      reduceMotion={reduceMotion}
      testID={testID}
      triggeredByFeature={triggeredByFeature}
      variant={variant}
      visible={visible}
    />
  );
}

export default PremiumPaywall;
