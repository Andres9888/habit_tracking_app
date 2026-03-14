/**
 * HabitsAppOverlays - Bottom-of-tree overlay components
 * Groups modals, toasts, and web paywall fallback into a single render unit
 */

import { ArchiveUndoToast } from '../../../components/ArchiveUndoToast';
import { WebPaywallFallback } from '../../../components/WebPaywallFallback';
import { BatchDeleteConfirmModal } from './BatchDeleteConfirmModal';
import { HabitsModals } from './HabitsModals';
import WebToaster from './WebToaster';
import { TOAST_DURATION_MS } from '@/constants';
import type { HabitsModalsState } from '../hooks/types';

interface HabitsAppOverlaysProps {
  modals: HabitsModalsState;
  webFallbackVisible: boolean;
  onDismissWebFallback: () => void;
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
  webFallbackVisible,
  onDismissWebFallback,
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

      <BatchDeleteConfirmModal
        count={confirmDeleteCount}
        visible={confirmDeleteVisible}
        onCancel={onConfirmDeleteCancel}
        onConfirm={(): void => {
          void onConfirmDeleteConfirm();
        }}
      />

      <WebPaywallFallback
        visible={webFallbackVisible}
        onClose={onDismissWebFallback}
      />
    </>
  );
}
