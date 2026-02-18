/**
 * Types for the smart notification permission flow
 */

export type NotificationPermissionStatus =
  | 'not_asked' // User hasn't been shown the pre-permission screen yet
  | 'pre_screen_shown' // Pre-permission screen was shown, waiting for action
  | 'granted' // User granted permission
  | 'denied' // User denied system permission
  | 'skipped'; // User dismissed the pre-permission screen without going to system prompt

export interface UseNotificationPermissionFlowResult {
  /** Whether the pre-permission explanation modal should be visible */
  prePermissionVisible: boolean;
  /** Current permission status */
  permissionStatus: NotificationPermissionStatus;
  /** Call when the user taps "Enable Notifications" on the pre-permission screen */
  onEnableNotifications: () => Promise<void>;
  /** Call when the user taps "Maybe Later" on the pre-permission screen */
  onSkipNotifications: () => void;
  /** Call after a habit is completed — triggers flow if conditions are met */
  onHabitCompleted: (habitId: string) => Promise<void>;
  /** Whether we're currently requesting permission */
  isRequestingPermission: boolean;
}
