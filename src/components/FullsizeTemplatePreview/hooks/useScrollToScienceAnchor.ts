/**
 * useScrollToScienceAnchor - jumps the preview scroll position straight to
 * the science section when opened via the "science" anchor. Jump, don't
 * animate: the modal entrance already provides the transition, and an
 * animated catch-up scroll reads as lag.
 */

import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { View } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { TemplatePreviewAnchor } from '@/screens/TemplatesScreen/TemplatesScreen.types';

export function useScrollToScienceAnchor(
  scrollRef: RefObject<Animated.ScrollView | null>,
  contentRef: RefObject<View | null>,
  scienceRef: RefObject<View | null>,
  initialAnchor: TemplatePreviewAnchor,
  visible: boolean,
  templateId: string | undefined
) {
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    hasScrolledRef.current = false;
  }, [templateId, initialAnchor, visible]);

  return useCallback(() => {
    if (
      !visible ||
      initialAnchor !== 'science' ||
      hasScrolledRef.current ||
      !scienceRef.current ||
      !contentRef.current
    ) {
      return;
    }

    scienceRef.current.measureLayout(
      contentRef.current,
      (_x, y) => {
        scrollRef.current?.scrollTo({ animated: false, y });
        hasScrolledRef.current = true;
      },
      () => {}
    );
  }, [contentRef, initialAnchor, scienceRef, scrollRef, visible]);
}
