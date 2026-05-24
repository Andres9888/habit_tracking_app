import { findNodeHandle } from 'react-native';
import type { RefObject } from 'react';
import type { ScrollView, View } from 'react-native';

const DEFAULT_LAYOUT_DELAY_MS = 250;
const DEFAULT_OFFSET_PX = 8;

export interface ScrollToSectionOptions {
  /** Wait for layout animations before measuring (default 250). */
  layoutDelayMs?: number;
  /** Extra offset from the top of the scroll viewport (default 8). */
  offsetPx?: number;
}

/**
 * Scrolls a ScrollView so `sectionRef` sits near the top of the viewport.
 * Measures against `contentRef` (the ScrollView's direct content wrapper).
 */
export function scrollToSectionInScrollView(
  scrollViewRef: RefObject<ScrollView | null>,
  contentRef: RefObject<View | null>,
  sectionRef: RefObject<View | null>,
  options?: ScrollToSectionOptions
): void {
  const delay = options?.layoutDelayMs ?? DEFAULT_LAYOUT_DELAY_MS;
  const offset = options?.offsetPx ?? DEFAULT_OFFSET_PX;

  setTimeout(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const contentHandle = findNodeHandle(content);
    if (contentHandle == null) return;

    section.measureLayout(
      contentHandle,
      (_x, y) => {
        scrollViewRef.current?.scrollTo({
          y: Math.max(0, y - offset),
          animated: true,
        });
      },
      () => {}
    );
  }, delay);
}
