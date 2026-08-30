import { createContext, useCallback, useContext, useRef } from 'react';
import type { ReactNode } from 'react';

type GetRowIndex = (key: string) => number;

const SettingsRowDividerContext = createContext<GetRowIndex | null>(null);

/**
 * Assigns each row inside a card a stable position, so only the first row
 * skips the hairline.
 *
 * This used to be a counter reset in the provider's render body. Children
 * re-render independently of the provider — a row toggling its own state does
 * not re-render the enclosing SettingsSection — so the counter was never reset
 * and every row, including the first, eventually reported a divider above it.
 * Keying by row label makes the answer idempotent: asking twice returns the
 * same index, no matter which component re-rendered.
 */
export function SettingsRowDividerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const orderRef = useRef(new Map<string, number>());
  const nextIndexRef = useRef(0);

  const getRowIndex = useCallback<GetRowIndex>((key) => {
    const existing = orderRef.current.get(key);
    if (existing !== undefined) return existing;
    const index = nextIndexRef.current;
    nextIndexRef.current += 1;
    orderRef.current.set(key, index);
    return index;
  }, []);

  return (
    <SettingsRowDividerContext.Provider value={getRowIndex}>
      {children}
    </SettingsRowDividerContext.Provider>
  );
}

/** True when this row is not the first in its card. `key` must be stable and
 *  unique within the card — the row's label is the natural choice. */
export function useSettingsRowDivider(enabled: boolean, key: string) {
  const getRowIndex = useContext(SettingsRowDividerContext);
  if (!enabled || !getRowIndex) return false;
  return getRowIndex(key) > 0;
}
