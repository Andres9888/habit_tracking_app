/**
 * ScrollableContent — hero, description, decision group, then science group.
 */

import React from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  type useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import type { TemplatePreviewAnchor } from '@/screens/TemplatesScreen/TemplatesScreen.types';
import { HeroSection } from './HeroSection';
import { DescriptionSection } from './DescriptionSection';
import { DecisionDrilldown } from './DecisionDrilldown';
import { ScienceDrilldown } from './science/ScienceDrilldown';
import { layoutStyles } from '../styles';
import { useScienceAnchor } from '../hooks/useScienceAnchor';
import type { Template } from '../../../types/template';
import type { ViewStyle } from 'react-native';

interface ScrollableContentProps {
  template: Template;
  iconColor: string;
  iconAnimatedStyle: ViewStyle;
  iconGlowStyle: ViewStyle;
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
  scrollHandler,
  visible = true,
  onHeroLayout,
}: ScrollableContentProps) {
  const { scrollRef, contentRef, scienceRef, onScienceLayout } =
    useScienceAnchor({ template, initialAnchor, visible });

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
          <DecisionDrilldown template={template} />
          <View ref={scienceRef} onLayout={onScienceLayout}>
            <ScienceDrilldown template={template} />
          </View>
          <View style={layoutStyles.bottomSpacer} />
        </View>
      </View>
    </Animated.ScrollView>
  );
}
