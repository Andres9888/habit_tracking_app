import { useCallback, useRef, useState } from 'react';
import { filterSettingsEntries } from './filterSettingsEntries';
import type { SettingsGroup } from './settingsSearchRegistry';

type ScrollRef = React.RefObject<{
  scrollTo: (options: { y: number; animated: boolean }) => void;
} | null>;

export function useSettingsSearch(scrollRef: ScrollRef) {
  const [query, setQuery] = useState('');
  const offsets = useRef(new Map<SettingsGroup, number>());

  const registerSection = useCallback((group: SettingsGroup, y: number) => {
    offsets.current.set(group, y);
  }, []);

  const jumpToGroup = useCallback(
    (group: SettingsGroup) => {
      const y = offsets.current.get(group) ?? 0;
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
      setQuery('');
    },
    [scrollRef]
  );

  return {
    jumpToGroup,
    query,
    registerSection,
    results: filterSettingsEntries(query),
    setQuery,
  };
}
