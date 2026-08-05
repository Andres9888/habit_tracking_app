/**
 * useScienceAnchor — jump-scrolls to the science group when the preview opens
 * with initialAnchor="science".
 *
 * The measurement is gated on hasScienceContent: without it the wrapper View
 * still lays out (zero-height) and an ungated anchor would scroll to an empty
 * region and mark itself handled, stranding the user mid-page.
 */

import { useCallback, useEffect, useRef } from 'react';
import type { View } from 'react-native';
import type Animated from 'react-native-reanimated';

import type { TemplatePreviewAnchor } from '@/screens/TemplatesScreen/TemplatesScreen.types';
import { hasScienceContent } from '../utils/hasScienceContent';
import type { Template } from '../../../types/template';

interface UseScienceAnchorArgs {
  template: Template;
  initialAnchor: TemplatePreviewAnchor;
  visible: boolean;
}

export function useScienceAnchor({
  template,
  initialAnchor,
  visible,
}: UseScienceAnchorArgs) {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const contentRef = useRef<View>(null);
  const scienceRef = useRef<View>(null);
  const hasScrolledRef = useRef(false);
  const canAnchorScience = hasScienceContent(template);

  useEffect(() => {
    hasScrolledRef.current = false;
  }, [template?._id, initialAnchor, visible]);

  const scrollToScience = useCallback(() => {
    if (
      !visible ||
      initialAnchor !== 'science' ||
      !canAnchorScience ||
      hasScrolledRef.current ||
      !scienceRef.current ||
      !contentRef.current
    ) {
      return;
    }

    // Jump, don't animate: the modal entrance already provides the
    // transition, and an animated catch-up scroll reads as lag.
    scienceRef.current.measureLayout(
      contentRef.current,
      (_x, y) => {
        scrollRef.current?.scrollTo({ animated: false, y });
        hasScrolledRef.current = true;
      },
      () => {}
    );
  }, [canAnchorScience, initialAnchor, visible]);

  return {
    scrollRef,
    contentRef,
    scienceRef,
    canAnchorScience,
    // undefined when nothing can be anchored, so the layout pass costs nothing
    onScienceLayout: canAnchorScience ? scrollToScience : undefined,
  };
}
