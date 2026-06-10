/**
 * HabitsAppOverlays - Bottom-of-tree overlay components
 * Groups modals, toasts, and paywall into a single render unit
 */

import { lazy, Suspense } from 'react';
import { ArchiveUndoToast } from '../../../components/ArchiveUndoToast';
import { FormedUndoToast } from '../../../components/FormedUndoToast';
import { BatchDeleteConfirmModal } from './BatchDeleteConfirmModal';
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
  /** Batch archive undo */
  batchArchiveUndoVisible: boolean;
  batchArchiveUndoCount: number;
  onBatchArchiveUndo: () => void;
  onBatchArchiveDismiss: () => void;
  /** Formed habit undo (right-swipe celebration) */
  formedToastVisible: boolean;
  formedToastHabitName: string;
  onFormedUndo: () => void;
  onFormedDismiss: () => void;
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
  batchArchiveUndoVisible,
  batchArchiveUndoCount,
  onBatchArchiveUndo,
  onBatchArchiveDismiss,
  formedToastVisible,
  formedToastHabitName,
  onFormedUndo,
  onFormedDismiss,
  confirmDeleteVisible,
  confirmDeleteCount,
  onConfirmDeleteCancel,
  onConfirmDeleteConfirm,
}: HabitsAppOverlaysProps) {
  return (
    <>
      <WebToaster />
      <HabitsModals state={modals} />

      <ArchiveUndoToast
        duration={TOAST_DURATION_MS}
        habitName={`${batchArchiveUndoCount} habits`}
        visible={batchArchiveUndoVisible}
        onDismiss={onBatchArchiveDismiss}
        onUndo={(): void => {
          void onBatchArchiveUndo();
        }}
      />

      <FormedUndoToast
        duration={TOAST_DURATION_MS}
        habitName={formedToastHabitName}
        visible={formedToastVisible}
        onDismiss={onFormedDismiss}
        onUndo={(): void => {
          void onFormedUndo();
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
