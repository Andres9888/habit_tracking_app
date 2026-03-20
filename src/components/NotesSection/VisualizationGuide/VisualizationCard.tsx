/**
 * Visualization technique card component
 */

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { TechniqueApproach } from './TechniqueApproach';
import type { VisualizationCardProps } from './VisualizationGuide.types';
import { triggerHaptic } from '@/utils/haptics';

export function VisualizationCard({ technique }: VisualizationCardProps) {
  const { colors: themeColors } = useThemeColors();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    triggerHaptic('tap');
    setExpanded(!expanded);
  };

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl border'
      style={{ borderColor: themeColors.border, backgroundColor: themeColors.card }}
      entering={FadeInDown.delay(100).springify().damping(18)}
    >
      <Pressable
        accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} ${technique.good.title} technique`}
        accessibilityRole='button'
        className='flex-row items-center gap-3 p-4 active:opacity-80'
        onPress={handleToggle}
      >
        <View className='h-10 w-10 items-center justify-center rounded-xl'>
          <LinearGradient
            className='absolute inset-0 rounded-xl'
            colors={['#ede9fe', '#e0e7ff']}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          />
          <Brain color={themeColors.status.premiumText} size={20} />
        </View>
        <View className='flex-1'>
          <Text className='text-base font-semibold' style={{ color: themeColors.text.primary }}>
            {technique.good.title}
          </Text>
          <Text className='text-xs' style={{ color: themeColors.text.secondary }}>
            vs. {technique.bad.title}
          </Text>
        </View>
        {expanded ? (
          <ChevronUp color={themeColors.text.tertiary} size={20} />
        ) : (
          <ChevronDown color={themeColors.text.tertiary} size={20} />
        )}
      </Pressable>
      {expanded ? <Animated.View
          className='border-t px-4 pb-4'
          style={{ borderColor: themeColors.border, backgroundColor: themeColors.background }}
          entering={FadeIn.duration(200)}
        >
          <TechniqueApproach
            description={technique.good.description}
            example={technique.good.example}
            icon={technique.good.icon}
            type='effective'
            why={technique.good.why}
          />
          <TechniqueApproach
            description={technique.bad.description}
            example={technique.bad.example}
            icon={technique.bad.icon}
            type='mistake'
            why={technique.bad.why}
          />
        </Animated.View> : null}
    </Animated.View>
  );
}
