/**
 * HabitsAppOverlays - Bottom-of-tree overlay components
 * Groups modals, toasts, and paywall into a single render unit
 */

import { ArchiveUndoToast } from '../../../components/ArchiveUndoToast';
import { RevenueCatPaywall } from '../../../components/RevenueCatPaywall';
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
        onClose={onPaywallClose}
        onPurchaseSuccess={onPaywallSuccess}
        onRestoreSuccess={onPaywallSuccess}
      />
    </>
  );
}
