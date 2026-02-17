/**
 * useUnsavedChangesGuard Hook
 *
 * Confirms before discarding unsaved changes in form editors.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  UseUnsavedChangesGuardOptions,
  UseUnsavedChangesGuardReturn,
} from './types';
import {
  DEFAULT_ALERT_TITLE,
  DEFAULT_ALERT_MESSAGE,
  DEFAULT_DISCARD_BUTTON,
  DEFAULT_KEEP_EDITING_BUTTON,
} from './constants';
import { hasChanges } from './helpers';
import { useConfirmDiscard } from './useConfirmDiscard';
import { useConfirmDiscardAsync } from './useConfirmDiscardAsync';
import { useBackHandler } from './useBackHandler';

/**
 * useUnsavedChangesGuard Hook
 *
 * Provides confirmation dialog before discarding unsaved changes.
 * Works with any form field that has a current and original value.
 */

/**
 * Hook for guarding against accidental data loss in forms.
 * Shows confirmation dialog when user tries to leave with unsaved changes.
 *
 * @description
 * Features:
 * - Detects changes by comparing current vs original value
 * - Shows native Alert dialog with customizable text
 * - Supports both callback and async/await patterns
 * - Optional hardware back button interception (Android)
 * - Handles all primitive types and objects (deep comparison)
 * - Can be disabled when not needed
 *
 * Use cases:
 * - Habit edit forms
 * - Note/letter editors
 * - Settings screens
 * - Any form with destructive navigation
 *
 * @param options - Configuration options
 * @param options.currentValue - Current form value
 * @param options.originalValue - Original value before edits
 * @param options.alertTitle - Dialog title (default: "Unsaved Changes")
 * @param options.alertMessage - Dialog message (default: "You have unsaved changes...")
 * @param options.discardButtonLabel - Discard button text (default: "Discard")
 * @param options.keepEditingButtonLabel - Cancel button text (default: "Keep Editing")
 * @param options.enabled - Whether guard is active (default: true)
 * @param options.onDiscard - Callback when user confirms discard
 * @param options.interceptBackButton - Whether to intercept Android back (default: false)
 * @returns Object with unsaved state and confirmation functions
 *
 * @example
 * ```tsx
 * function HabitEditForm({ habit, onClose }) {
 *   const [name, setName] = useState(habit.name);
 *
 *   const {
 *     hasUnsavedChanges,
 *     confirmDiscard,
 *     confirmDiscardAsync
 *   } = useUnsavedChangesGuard({
 *     currentValue: name,
 *     originalValue: habit.name,
 *     onDiscard: onClose,
 *     interceptBackButton: true
 *   });
 *
 *   const handleClose = () => {
 *     if (hasUnsavedChanges) {
 *       confirmDiscard(); // Shows alert, calls onDiscard if confirmed
 *     } else {
 *       onClose();
 *     }
 *   };
 *
 *   // Or use async version:
 *   const handleNavigation = async () => {
 *     const canProceed = await confirmDiscardAsync();
 *     if (canProceed) navigate('/home');
 *   };
 *
 *   return (
 *     <View>
 *       <TextInput value={name} onChangeText={setName} />
 *       <Button onPress={handleClose}>
 *         Close {hasUnsavedChanges && '*'}
 *       </Button>
 *     </View>
 *   );
 * }
 * ```
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
  const [internalOriginal, setInternalOriginal] = useState(originalValue);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  useEffect(() => {
    setInternalOriginal(originalValue);
  }, [originalValue]);

  const hasUnsavedChanges =
    enabled && hasChanges(currentValue, internalOriginal);

  const confirmDiscard = useConfirmDiscard({
    alertMessage,
    alertTitle,
    discardButtonLabel,
    hasUnsavedChanges,
    keepEditingButtonLabel,
    onDiscard,
    setIsConfirmationVisible,
  });

  const confirmDiscardAsync = useConfirmDiscardAsync({
    alertMessage,
    alertTitle,
    discardButtonLabel,
    hasUnsavedChanges,
    keepEditingButtonLabel,
    onDiscard,
    resolveRef,
    setIsConfirmationVisible,
  });

  const forceDiscard = useCallback(() => {
    onDiscard?.();
  }, [onDiscard]);

  const setOriginalValue = useCallback((value: string) => {
    setInternalOriginal(value);
  }, []);

  useBackHandler({ confirmDiscard, hasUnsavedChanges, interceptBackButton });

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
