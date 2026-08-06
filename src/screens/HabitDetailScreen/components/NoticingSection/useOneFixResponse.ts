/**
 * Remembers how the user answered a "One fix to try" suggestion.
 *
 * The suggestion is derived, not stored server-side, so the response lives in
 * local storage keyed by habit + weekday: re-deriving the same weakest weekday
 * next week must not re-ask a question the user already declined.
 */

import { useCallback, useEffect, useState } from 'react';
import { safeGetString, safeSetString } from '../../../../utils/storage';

export type OneFixResponse = 'accepted' | 'declined' | 'unanswered';

const KEY_PREFIX = 'habitDetail.oneFix';

function storageKey(habitId: string, weekday: number): string {
  return `${KEY_PREFIX}:${habitId}:${weekday}`;
}

function parse(value: string): OneFixResponse {
  return value === 'accepted' || value === 'declined' ? value : 'unanswered';
}

export function useOneFixResponse(habitId: string, weekday: number) {
  const [response, setResponse] = useState<OneFixResponse>('unanswered');
  /** Undefined until the stored value has been read, so nothing flashes. */
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoaded(false);
    void safeGetString(storageKey(habitId, weekday), 'unanswered').then(
      (value) => {
        if (cancelled) return;
        setResponse(parse(value));
        setIsLoaded(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [habitId, weekday]);

  const respond = useCallback(
    (next: Exclude<OneFixResponse, 'unanswered'>) => {
      setResponse(next);
      void safeSetString(storageKey(habitId, weekday), next);
    },
    [habitId, weekday]
  );

  return { isLoaded, respond, response };
}
