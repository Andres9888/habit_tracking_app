/**
 * HabitsAppOverlays - Bottom-of-tree overlay components
 * Groups modals, toasts, and paywall into a single render unit
 */

import { lazy, Suspense } from 'react';
import { ArchiveUndoToast } from '../../../components/ArchiveUndoToast';
import { HabitsModals } from './HabitsModals';
import WebToaster from './WebToaster';
import { TOAST_DURATION_MS } from '@/constants';
import type { HabitsListState, HabitsModalsState } from '../hooks/types';

const RevenueCatPaywall = lazy(() =>
  import('../../../components/RevenueCatPaywall').then((m) => ({
    default: m.RevenueCatPaywall,
  }))
);

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

      <Suspense fallback={null}>
        <RevenueCatPaywall
          visible={paywallVisible}
          onClose={onPaywallClose}
          onPurchaseSuccess={onPaywallSuccess}
          onRestoreSuccess={onPaywallSuccess}
        />
      </Suspense>
    </>
  );
}
