/**
 * ScrollableContent — hero, description, decision group, then science group.
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import Animated, {
  type AnimatedStyle,
  type useAnimatedScrollHandler,
} from 'react-native-reanimated';
import type { TemplatePreviewAnchor } from '../FullsizeTemplatePreview.types';
import { HeroSection } from './HeroSection';
import { DescriptionSection } from './DescriptionSection';
import { DecisionDrilldown } from './DecisionDrilldown';
import { ScienceDrilldown } from './science/ScienceDrilldown';
import { layoutStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';
import { hasScienceContent } from '../utils/hasScienceContent';
import type { Template } from '../../../types/template';

interface ScrollableContentProps {
  template: Template;
  iconAnimatedStyle: AnimatedStyle<ViewStyle>;
  initialAnchor?: TemplatePreviewAnchor;
  overscrollTint?: string;
  reducedMotion?: boolean;
  scrollHandler?: ReturnType<typeof useAnimatedScrollHandler>;
  visible?: boolean;
  onHeroLayout?: (event: LayoutChangeEvent) => void;
}

export function ScrollableContent({
  template,
  iconAnimatedStyle,
  initialAnchor = 'top',
  overscrollTint,
  reducedMotion = false,
  scrollHandler,
  visible = true,
  onHeroLayout,
}: ScrollableContentProps) {
  const palette = useDetailPalette();
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

    scienceRef.current.measureLayout(
      contentRef.current,
      (_x, y) => {
        // Jump, don't animate: the modal entrance already provides the
        // transition, and an animated catch-up scroll reads as lag.
        scrollRef.current?.scrollTo({ animated: false, y });
        hasScrolledRef.current = true;
      },
      () => {
        // Measurement can fail before first layout settles; landing at the
        // end (science is the last group) beats silently ignoring the link.
        scrollRef.current?.scrollToEnd({ animated: false });
        hasScrolledRef.current = true;
      }
    );
  }, [canAnchorScience, initialAnchor, visible]);

  return (
    <Animated.ScrollView
      ref={scrollRef}
      bounces
      contentContainerStyle={layoutStyles.contentContainer}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      style={overscrollTint ? { backgroundColor: overscrollTint } : undefined}
      onScroll={scrollHandler}
    >
      <View ref={contentRef}>
        <View onLayout={onHeroLayout}>
          <HeroSection
            iconAnimatedStyle={iconAnimatedStyle}
            template={template}
          />
        </View>
        <View style={{ backgroundColor: palette.body }}>
          <DescriptionSection description={template?.description ?? ''} />
          <DecisionDrilldown template={template} />
          <View
            ref={scienceRef}
            onLayout={canAnchorScience ? scrollToScience : undefined}
          >
            <ScienceDrilldown template={template} />
          </View>
          <View style={layoutStyles.bottomSpacer} />
        </View>
      </View>
    </Animated.ScrollView>
  );
}
