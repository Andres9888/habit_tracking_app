/** SettingsScrollContext — lets a row that expands a picker in place pull the
 *  newly revealed content into view. Sort order sits low enough in the list that
 *  its options used to open entirely below the fold with no feedback. */
import { createContext, useContext, type ReactNode } from 'react';

interface SettingsScrollValue {
  /** Scrolls the measured node fully into view if it extends past the fold. */
  ensureVisible: (node: MeasurableView | null) => void;
}

/** The slice of View we need — keeps callers off the full RN View type. */
export interface MeasurableView {
  measureLayout: (
    relativeTo: number,
    onSuccess: (x: number, y: number, width: number, height: number) => void,
    onFail: () => void
  ) => void;
}

const SettingsScrollContext = createContext<SettingsScrollValue>({
  ensureVisible: () => {},
});

export function useSettingsScroll() {
  return useContext(SettingsScrollContext);
}

export function SettingsScrollProvider({
  ensureVisible,
  children,
}: {
  ensureVisible: SettingsScrollValue['ensureVisible'];
  children: ReactNode;
}) {
  return (
    <SettingsScrollContext.Provider value={{ ensureVisible }}>
      {children}
    </SettingsScrollContext.Provider>
  );
}
