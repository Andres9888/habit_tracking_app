import { useState, useCallback } from 'react';

/**
 * Hook to manage UnsavedChangesAlert state
 * Provides a simpler API for showing/hiding the alert
 */
export function useUnsavedChangesAlert() {
  const [isVisible, setIsVisible] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(
    null
  );

  const show = useCallback((onConfirmDiscard: () => void) => {
    setPendingCallback(() => onConfirmDiscard);
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
    setPendingCallback(null);
  }, []);

  const handleDiscard = useCallback(() => {
    pendingCallback?.();
    hide();
  }, [pendingCallback, hide]);

  const handleKeepEditing = useCallback(() => {
    hide();
  }, [hide]);

  return {
    handleDiscard,
    handleKeepEditing,
    hide,
    isVisible,
    show,
  };
}
