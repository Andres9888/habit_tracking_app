/**
 * ScrollableContent - hero, sticky jump chips, description, and science drill-down.
 * The chips (child index 1) stick under the modal header via stickyHeaderIndices.
 */

import React from 'react';
import { View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import Animated, {
  type useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { HeroSection } from './HeroSection';
import { DescriptionSection } from './DescriptionSection';
import { JumpChips } from './JumpChips';
import { ScienceDrilldown } from './science/ScienceDrilldown';
import { layoutStyles } from '../styles';
import type { SectionKey } from '../utils/sectionAvailability';
import type { Template } from '../../../types/template';

interface SectionAnchors {
  onChipsLayout: (e: LayoutChangeEvent) => void;
  onBodyLayout: (e: LayoutChangeEvent) => void;
  onDrilldownLayout: (e: LayoutChangeEvent) => void;
  onSectionLayout: (key: SectionKey, y: number) => void;
}

interface ScrollableContentProps {
  template: Template;
  iconColor: string;
  iconAnimatedStyle: ViewStyle;
  iconGlowStyle: ViewStyle;
  overscrollTint?: string;
  scrollHandler?: ReturnType<typeof useAnimatedScrollHandler>;
  scrollRef: React.RefObject<Animated.ScrollView | null>;
  sections: SectionKey[];
  activeKey: SectionKey | null;
  anchors: SectionAnchors;
  onChipPress: (key: SectionKey) => void;
  onHeroLayout?: (event: LayoutChangeEvent) => void;
}

export function ScrollableContent({
  template,
  iconColor,
  iconAnimatedStyle,
  iconGlowStyle,
  overscrollTint,
  scrollHandler,
  scrollRef,
  sections,
  activeKey,
  anchors,
  onChipPress,
  onHeroLayout,
}: ScrollableContentProps) {
  return (
    <Animated.ScrollView
      ref={scrollRef}
      bounces
      contentContainerStyle={layoutStyles.contentContainer}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[1]}
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
      <JumpChips
        activeKey={activeKey}
        sections={sections}
        onChipPress={onChipPress}
        onLayout={anchors.onChipsLayout}
      />
      <View style={{ backgroundColor: colors.gray[50] }} onLayout={anchors.onBodyLayout}>
        <DescriptionSection description={template?.description ?? ''} iconColor={iconColor} />
        <View onLayout={anchors.onDrilldownLayout}>
          <ScienceDrilldown template={template} onSectionLayout={anchors.onSectionLayout} />
        </View>
        <View style={layoutStyles.bottomSpacer} />
      </View>
    </Animated.ScrollView>
  );
}
