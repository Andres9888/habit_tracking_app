/**
 * ScrollableContent - Scrollable area with hero, description, evidence section
 */

import React from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, { type useAnimatedScrollHandler } from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { HeroSection } from './HeroSection';
import { DescriptionSection } from './DescriptionSection';
import { ScienceEvidenceSection } from './ScienceEvidenceSection';
import { layoutStyles } from '../styles';
import type { Template } from '../../../types/template';
import type { ViewStyle } from 'react-native';

interface ScrollableContentProps {
  template: Template;
  iconColor: string;
  iconAnimatedStyle: ViewStyle;
  iconGlowStyle: ViewStyle;
  /** Background color for the scroll-view's top overscroll bounce zone (matches header tint). */
  overscrollTint?: string;
  /** Reanimated scroll handler — emits scrollY to drive header tint fade. */
  scrollHandler?: ReturnType<typeof useAnimatedScrollHandler>;
  /** Fires when the hero block lays out — used to compute the tint fade threshold. */
  onHeroLayout?: (event: LayoutChangeEvent) => void;
}

export function ScrollableContent({
  template,
  iconColor,
  iconAnimatedStyle,
  iconGlowStyle,
  overscrollTint,
  scrollHandler,
  onHeroLayout,
}: ScrollableContentProps) {
  return (
    <Animated.ScrollView
      bounces
      contentContainerStyle={layoutStyles.contentContainer}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      style={overscrollTint ? { backgroundColor: overscrollTint } : undefined}
      onScroll={scrollHandler}
    >
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
          startSmallVersion={template?.startSmallVersion}
        />
        <ScienceEvidenceSection iconColor={iconColor} template={template} />
        <View style={layoutStyles.bottomSpacer} />
      </View>
    </Animated.ScrollView>
  );
}
