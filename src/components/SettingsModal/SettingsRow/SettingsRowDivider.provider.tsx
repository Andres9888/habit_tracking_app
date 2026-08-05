import { createContext, useCallback, useContext, useRef } from 'react';
import type { ReactNode } from 'react';

type NextRowDivider = () => boolean;

const SettingsRowDividerContext = createContext<NextRowDivider | null>(null);

export function SettingsRowDividerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const rowIndexRef = useRef(0);
  rowIndexRef.current = 0;

  const getHasDivider = useCallback(() => {
    const hasDivider = rowIndexRef.current > 0;
    rowIndexRef.current += 1;
    return hasDivider;
  }, []);

  return (
    <SettingsRowDividerContext.Provider value={getHasDivider}>
      {children}
    </SettingsRowDividerContext.Provider>
  );
}

export function useSettingsRowDivider(enabled: boolean) {
  const getHasDivider = useContext(SettingsRowDividerContext);
  return enabled && getHasDivider ? getHasDivider() : false;
}
