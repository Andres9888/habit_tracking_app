/**
 * useUnsavedChangesGuard Hook
 * Confirms before discarding unsaved changes in form editors
 *
 * Part of Edge Case handling: Data Loss Prevention
 * - Tracks whether current value differs from original
 * - Shows Alert.alert confirmation before discarding
 * - Integrates with useDraftStorage for auto-saved drafts
 *
 * @example
 * ```tsx
 * const { hasUnsavedChanges, confirmDiscard, setOriginalValue } = useUnsavedChangesGuard({
 *   currentValue: whyDraft,
 *   originalValue: habit.why ?? '',
 * });
 *
 * // When closing modal:
 * const handleClose = () => {
 *   if (hasUnsavedChanges) {
 *     confirmDiscard(() => {
 *       onClose();
 *     });
 *   } else {
 *     onClose();
 *   }
 * };
 * ```
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, type AlertButton, BackHandler, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Configuration options for the hook
 */
export interface UseUnsavedChangesGuardOptions {
  /** Current value of the form field */
  currentValue: string;
  /** Original value (from database/props) */
  originalValue: string;
  /** Title for the confirmation dialog */
  alertTitle?: string;
  /** Message for the confirmation dialog */
  alertMessage?: string;
  /** Label for the discard button */
  discardButtonLabel?: string;
  /** Label for the keep editing button */
  keepEditingButtonLabel?: string;
  /** Whether to show the guard (can disable for save-in-progress) */
  enabled?: boolean;
  /** Callback when user confirms discard */
  onDiscard?: () => void;
  /** Whether to intercept Android back button (default: false) */
  interceptBackButton?: boolean;
}

/**
 * Return value from the hook
 */
export interface UseUnsavedChangesGuardReturn {
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** Show confirmation dialog and execute callback if user confirms discard */
  confirmDiscard: (onConfirm: () => void) => void;
  /** Show confirmation dialog and return Promise<boolean> */
  confirmDiscardAsync: () => Promise<boolean>;
  /** Update the original value (e.g., after successful save) */
  setOriginalValue: (value: string) => void;
  /** Whether the confirmation dialog is currently showing */
  isConfirmationVisible: boolean;
  /** Directly perform discard action (bypasses confirmation) */
  forceDiscard: () => void;
}

// Default strings
const DEFAULT_ALERT_TITLE = 'Discard Changes?';
const DEFAULT_ALERT_MESSAGE =
  'You have unsaved changes. Are you sure you want to discard them?';
const DEFAULT_DISCARD_BUTTON = 'Discard';
const DEFAULT_KEEP_EDITING_BUTTON = 'Keep Editing';

/**
 * Normalize values for comparison (trim whitespace, handle nullish)
 */
function normalizeValue(value: string | null | undefined): string {
  return (value ?? '').trim();
}

/**
 * Check if two values are meaningfully different
 */
function hasChanges(current: string, original: string): boolean {
  return normalizeValue(current) !== normalizeValue(original);
}

/**
 * useUnsavedChangesGuard Hook
 *
 * Provides confirmation dialog before discarding unsaved changes.
 * Works with any form field that has a current and original value.
 */
export function useUnsavedChangesGuard({
  currentValue,
  originalValue,
  alertTitle = DEFAULT_ALERT_TITLE,
  alertMessage = DEFAULT_ALERT_MESSAGE,
  discardButtonLabel = DEFAULT_DISCARD_BUTTON,
  keepEditingButtonLabel = DEFAULT_KEEP_EDITING_BUTTON,
  enabled = true,
  onDiscard,
  interceptBackButton = false,
}: UseUnsavedChangesGuardOptions): UseUnsavedChangesGuardReturn {
  // Track original value internally (can be updated after save)
  const [internalOriginal, setInternalOriginal] = useState(originalValue);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  // Refs for async confirmation
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  // Update internal original when prop changes (e.g., on mount or save)
  useEffect(() => {
    setInternalOriginal(originalValue);
  }, [originalValue]);

  // Calculate if there are unsaved changes
  const hasUnsavedChanges =
    enabled && hasChanges(currentValue, internalOriginal);

  // Show confirmation dialog with callback
  const confirmDiscard = useCallback(
    (onConfirm: () => void) => {
      if (!hasUnsavedChanges) {
        // No changes, just proceed
        onConfirm();
        return;
      }

      // Haptic feedback for important action
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      setIsConfirmationVisible(true);

      const buttons: AlertButton[] = [
        {
          onPress: () => {
            setIsConfirmationVisible(false);
          },
          style: 'cancel',
          text: keepEditingButtonLabel,
        },
        {
          onPress: () => {
            setIsConfirmationVisible(false);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onDiscard?.();
            onConfirm();
          },
          style: 'destructive',
          text: discardButtonLabel,
        },
      ];

      Alert.alert(alertTitle, alertMessage, buttons, { cancelable: true });
    },
    [
      hasUnsavedChanges,
      alertTitle,
      alertMessage,
      discardButtonLabel,
      keepEditingButtonLabel,
      onDiscard,
    ]
  );

  // Async version for more control flow flexibility
  const confirmDiscardAsync = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!hasUnsavedChanges) {
        resolve(true);
        return;
      }

      // Haptic feedback for important action
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      setIsConfirmationVisible(true);
      resolveRef.current = resolve;

      const buttons: AlertButton[] = [
        {
          onPress: () => {
            setIsConfirmationVisible(false);
            resolveRef.current?.(false);
            resolveRef.current = null;
          },
          style: 'cancel',
          text: keepEditingButtonLabel,
        },
        {
          onPress: () => {
            setIsConfirmationVisible(false);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onDiscard?.();
            resolveRef.current?.(true);
            resolveRef.current = null;
          },
          style: 'destructive',
          text: discardButtonLabel,
        },
      ];

      Alert.alert(alertTitle, alertMessage, buttons, {
        cancelable: true,
        onDismiss: () => {
          // User dismissed by tapping outside on Android
          setIsConfirmationVisible(false);
          resolveRef.current?.(false);
          resolveRef.current = null;
        },
      });
    });
  }, [
    hasUnsavedChanges,
    alertTitle,
    alertMessage,
    discardButtonLabel,
    keepEditingButtonLabel,
    onDiscard,
  ]);

  // Force discard without confirmation
  const forceDiscard = useCallback(() => {
    onDiscard?.();
  }, [onDiscard]);

  // Update original value (call after successful save)
  const setOriginalValue = useCallback((value: string) => {
    setInternalOriginal(value);
  }, []);

  // Intercept Android back button if enabled
  useEffect(() => {
    if (!interceptBackButton || Platform.OS !== 'android') {
      return;
    }

    const handleBackPress = () => {
      if (hasUnsavedChanges) {
        confirmDiscard(() => {
          // Navigation will be handled by the callback
        });
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => {
      subscription.remove();
    };
  }, [hasUnsavedChanges, confirmDiscard, interceptBackButton]);

  return {
    confirmDiscard,
    confirmDiscardAsync,
    forceDiscard,
    hasUnsavedChanges,
    isConfirmationVisible,
    setOriginalValue,
  };
}

export default useUnsavedChangesGuard;
