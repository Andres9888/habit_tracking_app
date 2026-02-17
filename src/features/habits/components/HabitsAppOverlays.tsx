/**
 * HabitsAppOverlays - Bottom-of-tree overlay components
 * Groups modals, toasts, and paywall into a single render unit
 */

import { lazy, Suspense } from 'react';
import { ArchiveUndoToast } from '../../../components/ArchiveUndoToast';
import { RevenueCatPaywall } from '../../../components/RevenueCatPaywall';
import { HabitsModals } from './HabitsModals';
import WebToaster from './WebToaster';
import { TOAST_DURATION_MS } from '@/constants';
import type { HabitsListState, HabitsModalsState } from '../hooks/types';

// Lazy-load Year in Review — heavy screen, rarely opened
const YearInReview = lazy(() =>
  import('../../../screens/YearInReview').then((m) => ({
    default: m.YearInReview,
  }))
);

interface HabitsAppOverlaysProps {
  list: HabitsListState;
  modals: HabitsModalsState;
  paywallVisible: boolean;
  showYearInReview?: boolean;
  onCloseYearInReview?: () => void;
  onPaywallClose: () => void;
  onPaywallSuccess: () => void;
}

export function HabitsAppOverlays({
  list,
  modals,
  paywallVisible,
  showYearInReview = false,
  onCloseYearInReview,
  onPaywallClose,
  onPaywallSuccess,
}: HabitsAppOverlaysProps) {
  return (
    <>
      <WebToaster />
      <HabitsModals state={modals} />

      {showYearInReview && (
        <Suspense fallback={null}>
          <YearInReview
            visible={showYearInReview}
            onClose={onCloseYearInReview ?? (() => {})}
          />
        </Suspense>
      )}

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
