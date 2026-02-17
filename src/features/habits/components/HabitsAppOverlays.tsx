/**
 * HabitsAppOverlays - Bottom-of-tree overlay components
 * Groups modals, toasts, and paywall into a single render unit
 *
 * Paywall is now driven by the A/B test framework (paywall_screen experiment):
 *   Variant A — RevenueCat native paywall (control)
 *   Variant B — Social proof ("10,000+ chains built" + testimonials)
 *   Variant C — Fear-of-loss ("Your X-day streak is at risk without Premium")
 */

import { ArchiveUndoToast } from '../../../components/ArchiveUndoToast';
import { PaywallABTest } from '../../../components/PremiumPaywall/PaywallABTest';
import { HabitsModals } from './HabitsModals';
import WebToaster from './WebToaster';
import { TOAST_DURATION_MS } from '@/constants';
import type { HabitsListState, HabitsModalsState } from '../hooks/types';

interface HabitsAppOverlaysProps {
  list: HabitsListState;
  modals: HabitsModalsState;
  paywallVisible: boolean;
  onPaywallClose: () => void;
  onPaywallSuccess: () => void;
  /**
   * The user's current streak in days — passed to Variant C for personalisation.
   * Falls back to 7 inside PaywallABTest if omitted.
   */
  streakDays?: number;
}

export function HabitsAppOverlays({
  list,
  modals,
  paywallVisible,
  onPaywallClose,
  onPaywallSuccess,
  streakDays,
}: HabitsAppOverlaysProps) {
  return (
    <>
      <WebToaster />
      <HabitsModals state={modals} />

      <ArchiveUndoToast
        duration={TOAST_DURATION_MS}
        habitName={list.archiveUndoHabitName}
        visible={list.archiveUndoVisible}
        onDismiss={list.dismissArchiveUndo}
        onUndo={(): void => {
          void list.handleArchiveUndo();
        }}
      />

      <PaywallABTest
        visible={paywallVisible}
        streakDays={streakDays}
        onClose={onPaywallClose}
        onPurchaseSuccess={onPaywallSuccess}
        onRestoreSuccess={onPaywallSuccess}
      />
    </>
  );
}
