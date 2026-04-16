/**
 * Hero section for FullsizeTemplatePreview
 * Displays the template icon, name, and metadata pills
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Clock, Sparkles, Users } from 'lucide-react-native';
import { useAppTheme } from '../../../theme';
import { heroStyles } from '../styles';
import {
  FREQUENCY_LABELS,
  CATEGORY_LABELS,
  CATEGORY_DURATION_DEFAULTS,
} from '../FullsizeTemplatePreview.constants';
import { formatPopularity } from '../../../screens/TemplatesScreen/components/TrendingCard/formatPopularity';
import { MetadataPill } from './MetadataPill';
import type { HeroSectionProps } from './HeroSection.types';

export function HeroSection({
  template,
  iconColor,
  iconAnimatedStyle,
  iconGlowStyle,
}: HeroSectionProps) {
  const theme = useAppTheme();
  const formattedFrequency =
    FREQUENCY_LABELS[template?.frequency] || template?.frequency || 'Daily';
  const formattedCategory =
    CATEGORY_LABELS[template?.category] || template?.category || 'General';
  const duration = CATEGORY_DURATION_DEFAULTS[template?.category] || '5-10 min';
  const popularity = template?.popularityScore ?? 0;

  return (
    <View style={heroStyles.heroGradient}>
      <View
        style={[
          heroStyles.decorativeCircle,
          { backgroundColor: `${iconColor}08` },
        ]}
      />
      <View style={heroStyles.heroContent}>
        <Animated.View style={[heroStyles.iconWrapper, iconAnimatedStyle]}>
          <Animated.View
            style={[
              heroStyles.iconGlow,
              { backgroundColor: iconColor, shadowColor: iconColor },
              iconGlowStyle,
            ]}
          />
          <View
            testID='templates-preview-icon'
            style={[
              heroStyles.iconContainer,
              { backgroundColor: `${iconColor}20` },
            ]}
          >
            <Text style={heroStyles.iconText}>{template?.icon ?? '✨'}</Text>
          </View>
        </Animated.View>

        <Text
          testID='templates-preview-name'
          style={[
            heroStyles.templateName,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          {template?.name ?? 'Template'}
        </Text>

        <View testID='templates-preview-pills' style={heroStyles.pillsRow}>
          <MetadataPill
            icon={<Clock color={iconColor} size={14} strokeWidth={2} />}
            iconColor={iconColor}
          >
            {formattedFrequency}
          </MetadataPill>
          <MetadataPill
            icon={<Sparkles color={iconColor} size={14} strokeWidth={2} />}
            iconColor={iconColor}
          >
            {formattedCategory}
          </MetadataPill>
          <MetadataPill iconColor={iconColor}>{`⏱️ ${duration}`}</MetadataPill>
          {popularity > 0 ? (
            <MetadataPill
              icon={<Users color={iconColor} size={14} strokeWidth={2} />}
              iconColor={iconColor}
            >
              {formatPopularity(popularity)}
            </MetadataPill>
          ) : null}
        </View>
      </View>
    </View>
  );
}
