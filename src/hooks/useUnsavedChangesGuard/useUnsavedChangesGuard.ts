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
