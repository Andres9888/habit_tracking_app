/**
 * ScrollableContent - Scrollable area with hero, description, evidence section
 */

import React, { useMemo, useRef } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { HeroSection } from './HeroSection';
import { DescriptionSection } from './DescriptionSection';
import { ScienceDrilldown } from './science/ScienceDrilldown';
import { JumpNav } from './science/JumpNav';
import { getJumpNavItems } from './science/jumpNavItems';
import { useJumpNav } from '../hooks/useJumpNav';
import { useScrollToScienceAnchor } from '../hooks/useScrollToScienceAnchor';
import { layoutStyles } from '../styles';
import type { ScrollableContentProps } from './ScrollableContent.types';

export function ScrollableContent({
  template,
  iconColor,
  iconAnimatedStyle,
  iconGlowStyle,
  initialAnchor = 'top',
  overscrollTint,
  scrollHandler,
  scrollY,
  visible = true,
  onHeroLayout,
}: ScrollableContentProps) {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const contentRef = useRef<View>(null);
  const scienceRef = useRef<View>(null);

  const jumpItems = useMemo(() => getJumpNavItems(template), [template]);
  const jumpKeys = useMemo(() => jumpItems.map((item) => item.key), [jumpItems]);
  const { activeKey, registerSection, scrollToKey } = useJumpNav(
    scrollY,
    contentRef,
    scrollRef,
    jumpKeys
  );
  const scrollToScience = useScrollToScienceAnchor(
    scrollRef,
    contentRef,
    scienceRef,
    initialAnchor,
    visible,
    template?._id
  );

  return (
    <View style={{ flex: 1 }}>
      <JumpNav
        accentColor={iconColor}
        activeKey={activeKey}
        items={jumpItems}
        onPress={scrollToKey}
      />
      <Animated.ScrollView
        ref={scrollRef}
        bounces
        contentContainerStyle={layoutStyles.contentContainer}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={[{ flex: 1 }, overscrollTint ? { backgroundColor: overscrollTint } : null]}
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
              <ScienceDrilldown registerSection={registerSection} template={template} />
            </View>
            <View style={layoutStyles.bottomSpacer} />
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
