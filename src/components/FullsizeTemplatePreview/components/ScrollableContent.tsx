/**
 * ScrollableContent - Scrollable area with hero, description, science box, tips
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { HeroSection } from './HeroSection';
import { DescriptionSection } from './DescriptionSection';
import { ScienceBox } from './ScienceBox';
import { TipsBox } from './TipsBox';
import { VideoLink } from './VideoLink';
import { PairsWellWith } from './PairsWellWith';
import { layoutStyles } from '../styles';
import type { Template } from '../../../types/template';
import type { ViewStyle } from 'react-native';

interface ScrollableContentProps {
  template: Template;
  iconColor: string;
  iconAnimatedStyle: ViewStyle;
  iconGlowStyle: ViewStyle;
  onPairPress?: (category: string) => void;
}

export function ScrollableContent({
  template,
  iconColor,
  iconAnimatedStyle,
  iconGlowStyle,
  onPairPress,
}: ScrollableContentProps) {
  const tips = template?.tips;

  return (
    <ScrollView
      bounces
      contentContainerStyle={layoutStyles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <HeroSection
        iconAnimatedStyle={iconAnimatedStyle}
        iconColor={iconColor}
        iconGlowStyle={iconGlowStyle}
        template={template}
      />
      <DescriptionSection description={template?.description ?? ''} />
      {tips && Array.isArray(tips) && tips.length > 0 ? <TipsBox iconColor={iconColor} tips={tips} /> : null}
      <ScienceBox template={template} />
      <VideoLink template={template} />
      <PairsWellWith category={template?.category} onPairPress={onPairPress} />
      <View style={layoutStyles.bottomSpacer} />
    </ScrollView>
  );
}
