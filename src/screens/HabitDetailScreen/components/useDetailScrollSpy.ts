/**
 * useDetailScrollSpy - sticky tabs + pinned title + sticky dock visibility.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';
import type { DetailView } from './DetailViewTabButton';

const STICKY_HEADER_OFFSET = 52;
const ACTIVE_SECTION_THRESHOLD = 80;
const PIN_TITLE_THRESHOLD = 48;
const DOCK_SHOW_THRESHOLD = 80;
const PROGRAMMATIC_SCROLL_LOCKOUT_MS = 600;

interface Options {
  onDockVisibilityChange?: (visible: boolean) => void;
  onPinnedChange?: (pinned: boolean) => void;
}

export function useDetailScrollSpy(
  scrollRef: React.RefObject<ScrollView | null>,
  options: Options = {}
) {
  const { onDockVisibilityChange, onPinnedChange } = options;
  const [activeView, setActiveView] = useState<DetailView>('calendar');
  const sectionYsRef = useRef<Record<DetailView, number>>({
    calendar: 0,
    goal: 0,
    strength: 0,
  });
  const heroHeightRef = useRef(0);
  const pinnedRef = useRef(false);
  const dockRef = useRef(false);
  const suppressUntilRef = useRef(0);
  const programmaticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (programmaticTimerRef.current) clearTimeout(programmaticTimerRef.current);
    };
  }, []);

  const handleSectionLayout = useCallback((view: DetailView, y: number) => {
    sectionYsRef.current[view] = y;
  }, []);

  const handleHeroLayout = useCallback((height: number) => {
    heroHeightRef.current = height;
  }, []);

  const scrollToView = useCallback(
    (view: DetailView) => {
      setActiveView(view);
      const y = sectionYsRef.current[view];
      const target = Math.max(0, y - STICKY_HEADER_OFFSET);
      suppressUntilRef.current = Date.now() + PROGRAMMATIC_SCROLL_LOCKOUT_MS;
      scrollRef.current?.scrollTo({ animated: true, y: target });
    },
    [scrollRef]
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const rawY = event.nativeEvent.contentOffset.y;
      const sections = sectionYsRef.current;
      const heroBottom = sections.calendar - STICKY_HEADER_OFFSET;
      const pinThreshold =
        heroBottom > 0 ? heroBottom - PIN_TITLE_THRESHOLD : 140;
      const nextPinned = rawY >= pinThreshold;
      if (nextPinned !== pinnedRef.current) {
        pinnedRef.current = nextPinned;
        onPinnedChange?.(nextPinned);
      }

      const heroH = heroHeightRef.current;
      const heroStillVisible =
        heroH > 0 ? heroH - rawY > DOCK_SHOW_THRESHOLD : true;
      const nextDock = !heroStillVisible;
      if (nextDock !== dockRef.current) {
        dockRef.current = nextDock;
        onDockVisibilityChange?.(nextDock);
      }

      if (Date.now() < suppressUntilRef.current) return;
      const scrollY = rawY + ACTIVE_SECTION_THRESHOLD;
      let next: DetailView = 'calendar';
      let bestY = -Infinity;
      for (const view of ['calendar', 'goal', 'strength'] as DetailView[]) {
        const y = sections[view];
        if (y > 0 && scrollY >= y && y > bestY) {
          next = view;
          bestY = y;
        }
      }
      setActiveView((prev) => (prev === next ? prev : next));
    },
    [onDockVisibilityChange, onPinnedChange]
  );

  return {
    activeView,
    handleHeroLayout,
    handleScroll,
    handleSectionLayout,
    scrollToView,
  };
}
