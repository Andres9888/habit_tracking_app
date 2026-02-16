/**
 * HabitsAppOverlays - Bottom-of-tree overlay components
 * Groups modals, toasts, and paywall into a single render unit
 */

import { ArchiveUndoToast } from '../../../components/ArchiveUndoToast';
import { RevenueCatPaywall } from '../../../components/RevenueCatPaywall';
import { usePaywallTracking } from '../../../hooks/usePaywallTracking';
import { HabitsModals } from './HabitsModals';
import WebToaster from './WebToaster';
import { TOAST_DURATION_MS } from '@/constants';
import type { HabitsListState, HabitsModalsState } from '../hooks/types';
import type { PaywallTriggerSource } from '../../../lib/analytics/conversionTracker';

interface HabitsAppOverlaysProps {
  list: HabitsListState;
  modals: HabitsModalsState;
  paywallVisible: boolean;
  paywallSource?: PaywallTriggerSource;
  habitCount?: number;
  onPaywallClose: () => void;
  onPaywallSuccess: () => void;
}

export function HabitsAppOverlays({
  list,
  modals,
  paywallVisible,
  paywallSource = 'home_hero',
  habitCount,
  onPaywallClose,
  onPaywallSuccess,
}: HabitsAppOverlaysProps) {
  const tracking = usePaywallTracking({
    habitCount,
    source: paywallSource,
    visible: paywallVisible,
  });

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

      <RevenueCatPaywall
        visible={paywallVisible}
        onClose={() => {
          tracking.onDismiss();
          onPaywallClose();
        }}
        onPurchaseSuccess={() => {
          tracking.onPurchaseComplete();
          onPaywallSuccess();
        }}
        onRestoreSuccess={onPaywallSuccess}
      />
    </>
  );
}
