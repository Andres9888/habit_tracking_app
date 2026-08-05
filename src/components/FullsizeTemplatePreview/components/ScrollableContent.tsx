/**
 * ScrollableContent - Scrollable area with hero, description, evidence section
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, { type AnimatedStyle,
  type useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import type { TemplatePreviewAnchor } from '@/screens/TemplatesScreen/TemplatesScreen.types';
import { HeroSection } from './HeroSection';
import { DescriptionSection } from './DescriptionSection';
import { ScienceDrilldown } from './science/ScienceDrilldown';
import { layoutStyles } from '../styles';
import type { Template } from '../../../types/template';
import type { ViewStyle } from 'react-native';

interface ScrollableContentProps {
  template: Template;
  iconColor: string;
  iconAnimatedStyle: AnimatedStyle<ViewStyle>;
  iconGlowStyle: AnimatedStyle<ViewStyle>;
  initialAnchor?: TemplatePreviewAnchor;
  overscrollTint?: string;
  reducedMotion?: boolean;
  scrollHandler?: ReturnType<typeof useAnimatedScrollHandler>;
  visible?: boolean;
  onHeroLayout?: (event: LayoutChangeEvent) => void;
}

export function ScrollableContent({
  template,
  iconColor,
  iconAnimatedStyle,
  iconGlowStyle,
  initialAnchor = 'top',
  overscrollTint,
  reducedMotion = false,
  scrollHandler,
  visible = true,
  onHeroLayout,
}: ScrollableContentProps) {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const contentRef = useRef<View>(null);
  const scienceRef = useRef<View>(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    hasScrolledRef.current = false;
  }, [template?._id, initialAnchor, visible]);

  const scrollToScience = useCallback(() => {
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
        // Jump, don't animate: the modal entrance already provides the
        // transition, and an animated catch-up scroll reads as lag.
        scrollRef.current?.scrollTo({ animated: false, y });
        hasScrolledRef.current = true;
      },
      () => {}
    );
  }, [initialAnchor, reducedMotion, visible]);

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
            iconColor={iconColor}
            iconGlowStyle={iconGlowStyle}
            template={template}
          />
        </View>
        <View style={{ backgroundColor: colors.gray[50] }}>
          <DescriptionSection
            description={template?.description ?? ''}
            iconColor={iconColor}
          />
          <View ref={scienceRef} onLayout={scrollToScience}>
            <ScienceDrilldown template={template} />
          </View>
          <View style={layoutStyles.bottomSpacer} />
        </View>
      </View>
    </Animated.ScrollView>
  );
}
