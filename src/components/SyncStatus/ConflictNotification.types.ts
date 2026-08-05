/**
 * ConflictNotification - Types
 */

export interface ConflictNotificationProps {
  visible: boolean;
  conflictCount: number;
  onDismiss?: () => void;
  testID?: string;
}

export interface UseConflictNotificationResult {
  visible: boolean;
  conflictCount: number;
  showConflict: (count: number) => void;
  dismiss: () => void;
}
