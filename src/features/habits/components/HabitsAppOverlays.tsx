/**
 * HabitsAppOverlays - Bottom-of-tree overlay components
 * Groups modals, toasts, and paywall into a single render unit
 */

import type { HabitsListState, HabitsModalsState } from '../hooks/types';
import WebToaster from './WebToaster';
import { ArchiveUndoToast } from '../../../components/ArchiveUndoToast';
import { HabitsModals } from './HabitsModals';
import { RevenueCatPaywall } from '../../../components/RevenueCatPaywall';

interface HabitsAppOverlaysProps {
  list: HabitsListState;
  modals: HabitsModalsState;
  paywallVisible: boolean;
  onPaywallClose: () => void;
  onPaywallSuccess: () => void;
}

export function HabitsAppOverlays({
  list,
  modals,
  paywallVisible,
  onPaywallClose,
  onPaywallSuccess,
}: HabitsAppOverlaysProps) {
  return (
    <>
      <WebToaster />
      <HabitsModals state={modals} />

      <ArchiveUndoToast
        duration={5000}
        habitName={list.archiveUndoHabitName}
        visible={list.archiveUndoVisible}
        onDismiss={list.dismissArchiveUndo}
        onUndo={(): void => {
          void list.handleArchiveUndo();
        }}
      />

      <RevenueCatPaywall
        visible={paywallVisible}
        onClose={onPaywallClose}
        onPurchaseSuccess={onPaywallSuccess}
        onRestoreSuccess={onPaywallSuccess}
      />
    </>
  );
}
