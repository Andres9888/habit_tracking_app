/**
 * Visualization technique card component
 */

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, ChevronDown, ChevronUp } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { TechniqueApproach } from './TechniqueApproach';
import type { VisualizationCardProps } from './VisualizationGuide.types';

export function VisualizationCard({ technique }: VisualizationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded(!expanded);
  };

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl border border-stone-100 bg-white/90'
      entering={FadeInDown.delay(100).springify().damping(18)}
    >
      <Pressable
        accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} ${technique.good.title} technique`}
        accessibilityRole='button'
        className='flex-row items-center gap-3 p-4 active:bg-stone-50'
        onPress={handleToggle}
      >
        <View className='h-10 w-10 items-center justify-center rounded-xl'>
          <LinearGradient
            colors={['#ede9fe', '#e0e7ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className='absolute inset-0 rounded-xl'
          />
          <Brain className='text-violet-600' size={20} />
        </View>
        <View className='flex-1'>
          <Text className='text-base font-semibold text-stone-800'>
            {technique.good.title}
          </Text>
          <Text className='text-xs text-stone-500'>
            vs. {technique.bad.title}
          </Text>
        </View>
        {expanded ? (
          <ChevronUp className='text-stone-400' size={20} />
        ) : (
          <ChevronDown className='text-stone-400' size={20} />
        )}
      </Pressable>
      {expanded && (
        <Animated.View
          className='border-t border-stone-100 bg-stone-50/50 px-4 pb-4'
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
        </Animated.View>
      )}
    </Animated.View>
  );
}
