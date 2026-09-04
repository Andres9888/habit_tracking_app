/**
 * HabitsAppOverlays - Bottom-of-tree overlay components
 * Groups modals, toasts, and paywall into a single render unit
 */

import { lazy, Suspense } from 'react';
import { ArchiveUndoToast } from '../../../components/ArchiveUndoToast';
import { BatchDeleteConfirmModal } from './BatchDeleteConfirmModal';
import { CreatedHabitToast } from './CreatedHabitToast';
import { HabitsModals } from './HabitsModals';
import WebToaster from './WebToaster';
import { TOAST_DURATION_MS } from '@/constants';
import type { HabitsModalsState } from '../hooks/types';

const RevenueCatPaywall = lazy(() =>
  import('../../../components/RevenueCatPaywall').then((m) => ({
    default: m.RevenueCatPaywall,
  }))
);

interface HabitsAppOverlaysProps {
  modals: HabitsModalsState;
  paywallVisible: boolean;
  onPaywallClose: () => void;
  onPaywallSuccess: () => void;
  onPremiumUpsell?: () => void;
  /** Batch archive undo */
  batchArchiveUndoVisible: boolean;
  batchArchiveUndoCount: number;
  onBatchArchiveUndo: () => void;
  onBatchArchiveDismiss: () => void;
  /** Batch delete confirmation */
  confirmDeleteVisible: boolean;
  confirmDeleteCount: number;
  onConfirmDeleteCancel: () => void;
  onConfirmDeleteConfirm: () => void;
}

export function HabitsAppOverlays({
  modals,
  paywallVisible,
  onPaywallClose,
  onPaywallSuccess,
  onPremiumUpsell,
  batchArchiveUndoVisible,
  batchArchiveUndoCount,
  onBatchArchiveUndo,
  onBatchArchiveDismiss,
  confirmDeleteVisible,
  confirmDeleteCount,
  onConfirmDeleteCancel,
  onConfirmDeleteConfirm,
}: HabitsAppOverlaysProps) {
  return (
    <>
      <WebToaster />
      <HabitsModals onPremiumUpsell={onPremiumUpsell} state={modals} />
      <CreatedHabitToast modals={modals} />

      <ArchiveUndoToast
        duration={TOAST_DURATION_MS}
        habitName={`${batchArchiveUndoCount} habits`}
        visible={batchArchiveUndoVisible}
        onDismiss={onBatchArchiveDismiss}
        onUndo={(): void => {
          void onBatchArchiveUndo();
        }}
      />

      <BatchDeleteConfirmModal
        count={confirmDeleteCount}
        visible={confirmDeleteVisible}
        onCancel={onConfirmDeleteCancel}
        onConfirm={(): void => {
          void onConfirmDeleteConfirm();
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
