import { useCallback, useEffect, useRef, useState } from 'react';
import { filterSettingsEntries } from './filterSettingsEntries';
import type { SettingsGroup } from './settingsSearchRegistry';

type ScrollRef = React.RefObject<{
  scrollTo: (options: { y: number; animated: boolean }) => void;
} | null>;

export function useSettingsSearch(scrollRef: ScrollRef) {
  const [query, setQuery] = useState('');
  const [highlightGroup, setHighlightGroup] = useState<SettingsGroup | null>(
    null
  );
  const offsets = useRef(new Map<SettingsGroup, number>());
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear pending highlight timer on unmount to avoid setState-after-unmount.
  useEffect(
    () => () => {
      if (highlightTimerRef.current !== null)
        clearTimeout(highlightTimerRef.current);
    },
    []
  );

  const registerSection = useCallback((group: SettingsGroup, y: number) => {
    offsets.current.set(group, y);
  }, []);

  const jumpToGroup = useCallback(
    (group: SettingsGroup) => {
      const y = offsets.current.get(group) ?? 0;
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
      setQuery('');
      setHighlightGroup(group);
      if (highlightTimerRef.current !== null) {
        clearTimeout(highlightTimerRef.current);
      }
      highlightTimerRef.current = setTimeout(() => {
        setHighlightGroup(null);
        highlightTimerRef.current = null;
      }, 1200);
    },
    [scrollRef]
  );

  return {
    highlightGroup,
    jumpToGroup,
    query,
    registerSection,
    results: filterSettingsEntries(query),
    setQuery,
  };
}
