import { useEffect } from 'react';
import type { MutableRefObject } from 'react';

interface UseAutoRestoreQueueOptions {
  isRestoringRef: MutableRefObject<boolean>;
  restoreQueue: () => Promise<void>;
  setIsRestored: (value: boolean) => void;
  skipAutoRestore: boolean;
}

export function useAutoRestoreQueue({
  isRestoringRef,
  restoreQueue,
  setIsRestored,
  skipAutoRestore,
}: UseAutoRestoreQueueOptions): void {
  useEffect(() => {
    if (skipAutoRestore) {
      setIsRestored(true);
      return;
    }

    void restoreQueue();

    return () => {
      isRestoringRef.current = false;
    };
  }, [skipAutoRestore]);
}
