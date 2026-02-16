/**
 * ScrollableContent - Scrollable area with hero, description, science box, tips
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { HeroSection } from './HeroSection';
import { DescriptionSection } from './DescriptionSection';
import { ScienceBox } from './ScienceBox';
import { TipsBox } from './TipsBox';
import { createLayoutStyles } from '../styles';
import type { Template } from '../../../types/template';
import type { ViewStyle } from 'react-native';

interface ScrollableContentProps {
  template: Template;
  iconColor: string;
  iconAnimatedStyle: ViewStyle;
  iconGlowStyle: ViewStyle;
  onResearchPress: () => void;
}

export function ScrollableContent({
  template,
  iconColor,
  iconAnimatedStyle,
  iconGlowStyle,
  onResearchPress,
}: ScrollableContentProps) {
  const { colors } = useThemeColors();
  const layoutStyles = React.useMemo(
    () => createLayoutStyles(colors),
    [colors],
  );
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
      <ScienceBox template={template} onResearchPress={onResearchPress} />
      {tips && Array.isArray(tips) && tips.length > 0 && (
        <TipsBox iconColor={iconColor} tips={tips} />
      )}
      <View style={layoutStyles.bottomSpacer} />
    </ScrollView>
  );
}
