/**
 * useDraftRecovery - Internal hook for draft recovery on mount
 */
import { useEffect, useState } from 'react';

import { getDraft } from './storage';
import type { DraftContentType } from './types';

interface UseDraftRecoveryOptions {
  habitId: string;
  contentType: DraftContentType;
  maxAgeMs: number;
  enabled: boolean;
  onDraftRecovered?: (content: string) => void;
}

interface UseDraftRecoveryReturn {
  recoveredDraft: string;
  wasRecovered: boolean;
  isInitialized: boolean;
  setRecoveredDraft: (value: string) => void;
  setWasRecovered: (value: boolean) => void;
}

export function useDraftRecovery({
  habitId,
  contentType,
  maxAgeMs,
  enabled,
  onDraftRecovered,
}: UseDraftRecoveryOptions): UseDraftRecoveryReturn {
  const [recoveredDraft, setRecoveredDraft] = useState<string>('');
  const [wasRecovered, setWasRecovered] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!enabled || !habitId) {
      setIsInitialized(true);
      return;
    }
    let isMounted = true;
    const recoverDraft = async () => {
      try {
        const recovered = await getDraft(habitId, contentType, maxAgeMs);
        if (isMounted && recovered && recovered.trim().length > 0) {
          setRecoveredDraft(recovered);
          setWasRecovered(true);
          onDraftRecovered?.(recovered);
        }
      } catch (error) {
        if (__DEV__) console.warn('Draft recovery failed:', error);
      } finally {
        if (isMounted) setIsInitialized(true);
      }
    };
    void recoverDraft();
    return () => {
      isMounted = false;
    };
  }, [habitId, contentType, enabled, maxAgeMs, onDraftRecovered]);

  return {
    isInitialized,
    recoveredDraft,
    setRecoveredDraft,
    setWasRecovered,
    wasRecovered,
  };
}
