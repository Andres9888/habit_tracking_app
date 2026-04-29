/**
 * Hero section for FullsizeTemplatePreview
 * Displays the template icon, name, and metadata pills
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Sparkles, Users } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useAppTheme } from '../../../theme';
import { heroStyles } from '../styles';
import {
  FREQUENCY_LABELS,
  CATEGORY_LABELS,
  CATEGORY_DURATION_DEFAULTS,
} from '../FullsizeTemplatePreview.constants';
import { formatPopularity } from '../../../screens/TemplatesScreen/components/TrendingCard/formatPopularity';
import { MetadataPill } from './MetadataPill';
import { buildHeroGradient } from '../utils/heroGradient';
import type { HeroSectionProps } from './HeroSection.types';

export function HeroSection({
  template,
  iconColor,
  iconAnimatedStyle,
  iconGlowStyle,
}: HeroSectionProps) {
  const theme = useAppTheme();
  const baseGradient = buildHeroGradient(iconColor);
  // First stop is transparent so the ScrollView's header-matching background
  // shows through — prevents alpha-stacking that makes the hero top read
  // darker than the ModalHeader.
  const gradientColors: readonly [string, string, string] = [
    'transparent',
    baseGradient[1],
    baseGradient[2],
  ];
  const formattedFrequency =
    FREQUENCY_LABELS[template?.frequency] || template?.frequency || 'Daily';
  const formattedCategory =
    CATEGORY_LABELS[template?.category] || template?.category || 'General';
  const duration = CATEGORY_DURATION_DEFAULTS[template?.category] || '5-10 min';
  const popularity = template?.popularityScore ?? 0;

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={heroStyles.heroGradient}
    >
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
            icon={<Clock color={iconColor} size={iconSizes.small} strokeWidth={2} />}
            iconColor={iconColor}
          >
            {formattedFrequency}
          </MetadataPill>
          <MetadataPill
            icon={<Sparkles color={iconColor} size={iconSizes.small} strokeWidth={2} />}
            iconColor={iconColor}
          >
            {formattedCategory}
          </MetadataPill>
          <MetadataPill iconColor={iconColor}>{`⏱️ ${duration}`}</MetadataPill>
          {popularity > 0 && (
            <MetadataPill
              icon={<Users color={iconColor} size={iconSizes.small} strokeWidth={2} />}
              iconColor={iconColor}
            >
              {formatPopularity(popularity)}
            </MetadataPill>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}
