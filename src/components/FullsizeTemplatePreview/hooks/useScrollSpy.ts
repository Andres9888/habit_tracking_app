/**
 * Scroll-spy for the jump chips: sections register their absolute Y; a worklet
 * runs on every scroll frame (UI thread) and only hops to JS when the active
 * section actually changes, so the chips stay in sync without state thrash.
 */

import { useCallback, useRef, useState } from 'react';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import type { SectionKey } from '../utils/sectionAvailability';

export function useScrollSpy(sections: SectionKey[]) {
  const [activeKey, setActiveKey] = useState<SectionKey | null>(sections[0] ?? null);
  const offsetsRef = useRef<Record<string, number>>({});
  const offsetsSV = useSharedValue<{ key: SectionKey; y: number }[]>([]);
  const lastKeySV = useSharedValue<string>('');
  const activationSV = useSharedValue(72);

  const rebuild = useCallback(() => {
    offsetsSV.value = sections
      .filter((k) => offsetsRef.current[k] != null)
      .map((k) => ({ key: k, y: offsetsRef.current[k] }))
      .sort((a, b) => a.y - b.y);
  }, [sections, offsetsSV]);

  const registerSection = useCallback(
    (key: SectionKey, y: number) => {
      if (offsetsRef.current[key] === y) return;
      offsetsRef.current[key] = y;
      rebuild();
    },
    [rebuild]
  );

  const setActiveFromTap = useCallback(
    (key: SectionKey) => {
      lastKeySV.value = key;
      setActiveKey(key);
    },
    [lastKeySV]
  );

  const setChipsHeight = useCallback(
    (height: number) => {
      activationSV.value = height + 12;
    },
    [activationSV]
  );

  const spyWorklet = useCallback(
    (y: number) => {
      'worklet';
      const list = offsetsSV.value;
      if (list.length === 0) return;
      let active = list[0].key;
      for (const item of list) {
        if (y + activationSV.value >= item.y) active = item.key;
      }
      if (active !== lastKeySV.value) {
        lastKeySV.value = active;
        runOnJS(setActiveKey)(active);
      }
    },
    [offsetsSV, activationSV, lastKeySV]
  );

  return { activeKey, registerSection, setActiveFromTap, setChipsHeight, spyWorklet };
}
