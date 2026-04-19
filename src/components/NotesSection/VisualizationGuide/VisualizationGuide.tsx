/**
 * VisualizationGuide Component
 * Based on Andrew Huberman's research on effective goal visualization
 */

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Eye,
  Mountain,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import type { VisualizationGuideProps } from './VisualizationGuide.types';
import { VISUALIZATION_TECHNIQUES } from './visualizationTechniques';
import { GuideHeader } from './GuideHeader';
import { KeyInsightBox } from './KeyInsightBox';
import { VisualizationCard } from './VisualizationCard';
import { QuickTip } from './QuickTip';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';

export function VisualizationGuide({ habitName }: VisualizationGuideProps) {
  const { colors: themeColors } = useThemeColors();
  const [showAllTechniques, setShowAllTechniques] = useState(false);
  const displayedTechniques = showAllTechniques
    ? VISUALIZATION_TECHNIQUES
    : VISUALIZATION_TECHNIQUES.slice(0, 2);

  const handleShowMore = () => {
    triggerHaptic('tap');
    setShowAllTechniques(!showAllTechniques);
  };

  return (
    <View className='gap-5'>
      <GuideHeader habitName={habitName} />
      <KeyInsightBox />
      <View className='gap-3'>
        <Text className='text-sm font-semibold uppercase tracking-widest' style={{ color: themeColors.text.secondary }}>
          Techniques to Apply
        </Text>
        {displayedTechniques.map((technique) => (
          <VisualizationCard key={technique.id} technique={technique} />
        ))}
        {VISUALIZATION_TECHNIQUES.length > 2 ? <Pressable
            accessibilityLabel={
              showAllTechniques
                ? 'Show less techniques'
                : 'Show more techniques'
            }
            accessibilityRole='button'
            className='flex-row items-center justify-center gap-2 rounded-xl border border-dashed py-3 active:opacity-80'
            style={{ borderColor: themeColors.status.premiumLight, backgroundColor: themeColors.status.premiumLight }}
            onPress={handleShowMore}
          >
            <Text className='text-sm font-medium' style={{ color: themeColors.status.premiumText }}>
              {showAllTechniques
                ? 'Show Less'
                : `Show ${VISUALIZATION_TECHNIQUES.length - 2} More Techniques`}
            </Text>
            {showAllTechniques ? (
              <ChevronUp color={themeColors.status.premiumText} size={iconSizes.small} />
            ) : (
              <ChevronDown color={themeColors.status.premiumText} size={iconSizes.small} />
            )}
          </Pressable> : null}
      </View>
      <Animated.View
        className='gap-3'
        entering={FadeInDown.delay(200).springify().damping(18)}
      >
        <Text className='text-sm font-semibold uppercase tracking-widest' style={{ color: themeColors.text.secondary }}>
          Quick Practice
        </Text>
        <View className='gap-2'>
          <QuickTip
            description='Spend 30 seconds visualizing yourself doing the habit, not having done it'
            icon={<Eye color={themeColors.status.warning} size={iconSizes.small} />}
            title='Morning Visualization'
          />
          <QuickTip
            description='Identify your biggest obstacle and create an "if-then" plan'
            icon={<Mountain color={themeColors.status.warning} size={iconSizes.small} />}
            title='Obstacle Planning'
          />
          <QuickTip
            description='See yourself taking the first small step of your habit'
            icon={<ArrowRight color={themeColors.status.warning} size={iconSizes.small} />}
            title='Next Action Preview'
          />
        </View>
      </Animated.View>
      <View className='items-center rounded-xl px-4 py-3' style={{ backgroundColor: themeColors.background }}>
        <Text className='text-center text-xs' style={{ color: themeColors.text.secondary }}>
          Based on research by Gabriele Oettingen (Mental Contrasting), Peter
          Gollwitzer (Implementation Intentions), and discussed in the Huberman
          Lab Podcast.
        </Text>
      </View>
    </View>
  );
}

export default VisualizationGuide;
