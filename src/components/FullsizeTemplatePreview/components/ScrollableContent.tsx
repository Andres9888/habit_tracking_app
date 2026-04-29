/**
 * ScrollableContent - Scrollable area with hero, description, evidence section
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
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
}

export function ScrollableContent({
  template,
  iconColor,
  iconAnimatedStyle,
  iconGlowStyle,
  overscrollTint,
}: ScrollableContentProps) {
  return (
    <ScrollView
      bounces
      contentContainerStyle={layoutStyles.contentContainer}
      showsVerticalScrollIndicator={false}
      style={overscrollTint ? { backgroundColor: overscrollTint } : undefined}
    >
      <HeroSection
        iconAnimatedStyle={iconAnimatedStyle}
        iconColor={iconColor}
        iconGlowStyle={iconGlowStyle}
        template={template}
      />
      <View style={{ backgroundColor: colors.gray[50] }}>
        <DescriptionSection
          description={template?.description ?? ''}
          iconColor={iconColor}
          startSmallVersion={template?.startSmallVersion}
        />
        <ScienceEvidenceSection iconColor={iconColor} template={template} />
        <View style={layoutStyles.bottomSpacer} />
      </View>
    </ScrollView>
  );
}
