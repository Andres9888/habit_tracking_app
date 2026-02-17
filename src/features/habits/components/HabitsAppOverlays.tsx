/**
 * HabitsAppOverlays - Bottom-of-tree overlay components
 * Groups modals, toasts, and paywall into a single render unit.
 *
 * Includes the smart notification pre-permission modal that fires after
 * the user completes their first habit (see feat/smart-notification-permission).
 */

import { ArchiveUndoToast } from '../../../components/ArchiveUndoToast';
import { NotificationPrePermissionModal } from '../../../components/NotificationPrePermissionModal';
import { RevenueCatPaywall } from '../../../components/RevenueCatPaywall';
import { HabitsModals } from './HabitsModals';
import WebToaster from './WebToaster';
import { TOAST_DURATION_MS } from '@/constants';
import type { HabitsListState, HabitsModalsState } from '../hooks/types';

interface HabitsAppOverlaysProps {
  list: HabitsListState;
  modals: HabitsModalsState;
  paywallVisible: boolean;
  /** Notification pre-permission modal state (smart permission flow) */
  notifPrePermissionVisible: boolean;
  notifIsRequestingPermission: boolean;
  onNotifEnable: () => Promise<void>;
  onNotifSkip: () => void;
  onPaywallClose: () => void;
  onPaywallSuccess: () => void;
}

export function HabitsAppOverlays({
  list,
  modals,
  paywallVisible,
  notifPrePermissionVisible,
  notifIsRequestingPermission,
  onNotifEnable,
  onNotifSkip,
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

      {/* Smart notification permission flow: shown after first habit completion */}
      <NotificationPrePermissionModal
        visible={notifPrePermissionVisible}
        isRequestingPermission={notifIsRequestingPermission}
        onEnable={onNotifEnable}
        onSkip={onNotifSkip}
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
