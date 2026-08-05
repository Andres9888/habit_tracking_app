/**
 * Composes each science section's absolute scroll Y from three onLayout
 * partials (body offset + drilldown offset + section offset) — no measureLayout,
 * so it stays Fabric- and web-safe. Owns the `initialAnchor='science'` jump and
 * chip tap-to-scroll.
 */

import { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { SectionKey } from '../utils/sectionAvailability';

interface Params {
  registerSection: (key: SectionKey, y: number) => void;
  setChipsHeight: (height: number) => void;
  visible: boolean;
  initialAnchor?: string;
  reducedMotion: boolean;
  scrollRef: React.RefObject<Animated.ScrollView | null>;
  templateId?: string;
}

export function useSectionAnchors(p: Params) {
  const bodyY = useRef(0);
  const drilldownY = useRef(0);
  const sectionYs = useRef<Record<string, number>>({});
  const chipsH = useRef(0);
  const scrolled = useRef(false);

  useEffect(() => {
    scrolled.current = false;
  }, [p.templateId, p.initialAnchor, p.visible]);

  const absY = (y: number) => bodyY.current + drilldownY.current + y;

  const recompute = useCallback(
    (key: SectionKey) => {
      const y = sectionYs.current[key];
      if (y != null) p.registerSection(key, absY(y));
    },
    [p]
  );

  const recomputeAll = useCallback(() => {
    for (const key of Object.keys(sectionYs.current) as SectionKey[]) recompute(key);
  }, [recompute]);

  const maybeAnchor = useCallback(() => {
    if (!p.visible || p.initialAnchor !== 'science' || scrolled.current) return;
    const whyY = sectionYs.current.why;
    if (whyY == null) return;
    p.scrollRef.current?.scrollTo({ y: Math.max(0, absY(whyY) - chipsH.current - 8), animated: false });
    scrolled.current = true;
  }, [p]);

  const onChipsLayout = useCallback(
    (e: LayoutChangeEvent) => {
      chipsH.current = e.nativeEvent.layout.height;
      p.setChipsHeight(chipsH.current);
    },
    [p]
  );
  const onBodyLayout = useCallback(
    (e: LayoutChangeEvent) => {
      bodyY.current = e.nativeEvent.layout.y;
      recomputeAll();
      maybeAnchor();
    },
    [recomputeAll, maybeAnchor]
  );
  const onDrilldownLayout = useCallback(
    (e: LayoutChangeEvent) => {
      drilldownY.current = e.nativeEvent.layout.y;
      recomputeAll();
      maybeAnchor();
    },
    [recomputeAll, maybeAnchor]
  );
  const onSectionLayout = useCallback(
    (key: SectionKey, y: number) => {
      sectionYs.current[key] = y;
      recompute(key);
      if (key === 'why') maybeAnchor();
    },
    [recompute, maybeAnchor]
  );

  const scrollToSection = useCallback(
    (key: SectionKey) => {
      const y = sectionYs.current[key];
      if (y == null) return;
      p.scrollRef.current?.scrollTo({
        y: Math.max(0, absY(y) - chipsH.current - 8),
        animated: !p.reducedMotion,
      });
    },
    [p]
  );

  return { onChipsLayout, onBodyLayout, onDrilldownLayout, onSectionLayout, scrollToSection };
}
