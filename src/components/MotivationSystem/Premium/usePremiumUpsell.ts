/**
 * usePremiumUpsell Hook
 *
 * Manages the state for premium upsell flows in the Motivation System.
 * Tracks which feature triggered the paywall for highlighting and analytics.
 *
 * @example
 * ```tsx
 * function MotivationTab() {
 *   const {
 *     showPaywall,
 *     setShowPaywall,
 *     triggeredFeature,
 *     triggerPaywall,
 *     dismissPaywall,
 *     showBenefits,
 *     setShowBenefits,
 *   } = usePremiumUpsell();
 *
 *   return (
 *     <>
 *       <VoiceNotesSection
 *         isPremium={isPremium}
 *         onPremiumRequired={() => triggerPaywall('voiceNotes')}
 *       />
 *       <MotivationPaywall
 *         visible={showPaywall}
 *         onClose={dismissPaywall}
 *         triggeredByFeature={triggeredFeature}
 *       />
 *     </>
 *   );
 * }
 * ```
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { MotivationPremiumFeature } from './PremiumFeatureLock';

interface PremiumUpsellState {
  /**
   * Whether the paywall modal is visible
   */
  showPaywall: boolean;

  /**
   * Set paywall visibility directly
   */
  setShowPaywall: (show: boolean) => void;

  /**
   * Whether the benefits modal is visible (educational screen)
   */
  showBenefits: boolean;

  /**
   * Set benefits modal visibility directly
   */
  setShowBenefits: (show: boolean) => void;

  /**
   * Which feature triggered the paywall (for highlighting)
   */
  triggeredFeature: MotivationPremiumFeature | undefined;

  /**
   * Trigger the paywall with a specific feature context
   */
  triggerPaywall: (feature: MotivationPremiumFeature) => void;

  /**
   * Trigger the benefits modal with a specific feature context
   */
  triggerBenefits: (feature: MotivationPremiumFeature) => void;

  /**
   * Dismiss the paywall and clear the triggered feature
   */
  dismissPaywall: () => void;

  /**
   * Dismiss the benefits modal
   */
  dismissBenefits: () => void;

  /**
   * Navigate from benefits to paywall
   */
  benefitsToPaywall: () => void;
}

export function usePremiumUpsell(): PremiumUpsellState {
  const [showPaywall, setShowPaywall] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [triggeredFeature, setTriggeredFeature] = useState<
    MotivationPremiumFeature | undefined
  >();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      for (const timer of timersRef.current) {
        clearTimeout(timer);
      }
    };
  }, []);

  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timersRef.current = timersRef.current.filter((t) => t !== id);
      fn();
    }, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const triggerPaywall = useCallback((feature: MotivationPremiumFeature) => {
    setTriggeredFeature(feature);
    setShowPaywall(true);
  }, []);

  const triggerBenefits = useCallback((feature: MotivationPremiumFeature) => {
    setTriggeredFeature(feature);
    setShowBenefits(true);
  }, []);

  const dismissPaywall = useCallback(() => {
    setShowPaywall(false);
    // Clear triggered feature after animation completes
    safeTimeout(() => setTriggeredFeature(undefined), 300);
  }, [safeTimeout]);

  const dismissBenefits = useCallback(() => {
    setShowBenefits(false);
  }, []);

  const benefitsToPaywall = useCallback(() => {
    setShowBenefits(false);
    // Small delay to let benefits modal close
    safeTimeout(() => setShowPaywall(true), 100);
  }, [safeTimeout]);

  return {
    benefitsToPaywall,
    dismissBenefits,
    dismissPaywall,
    setShowBenefits,
    setShowPaywall,
    showBenefits,
    showPaywall,
    triggerBenefits,
    triggeredFeature,
    triggerPaywall,
  };
}

export default usePremiumUpsell;
