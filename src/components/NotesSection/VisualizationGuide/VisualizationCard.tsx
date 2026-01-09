/**
 * Visualization technique card component
 */

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
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
      entering={FadeInDown.delay(100).springify()}
    >
      <Pressable
        accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} ${technique.good.title} technique`}
        accessibilityRole='button'
        className='flex-row items-center gap-3 p-4 active:bg-stone-50'
        onPress={handleToggle}
      >
        <View className='h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100'>
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
          <View className='mt-4'>
            <View className='mb-2 flex-row items-center gap-2'>
              {technique.good.icon}
              <Text className='text-sm font-semibold text-emerald-700'>
                ✓ Effective Approach
              </Text>
            </View>
            <View className='rounded-xl bg-emerald-50 p-3'>
              <Text className='text-sm leading-relaxed text-stone-700'>
                {technique.good.description}
              </Text>
              <View className='mt-3 rounded-lg bg-white/80 p-2.5'>
                <Text className='text-xs italic text-stone-600'>
                  {technique.good.example}
                </Text>
              </View>
              <View className='mt-2 flex-row items-start gap-2'>
                <Lightbulb className='mt-0.5 text-amber-500' size={14} />
                <Text className='flex-1 text-xs text-stone-600'>
                  <Text className='font-medium'>Why it works: </Text>
                  {technique.good.why}
                </Text>
              </View>
            </View>
          </View>
          <View className='mt-4'>
            <View className='mb-2 flex-row items-center gap-2'>
              {technique.bad.icon}
              <Text className='text-sm font-semibold text-rose-700'>
                ✗ Common Mistake
              </Text>
            </View>
            <View className='rounded-xl bg-rose-50 p-3'>
              <Text className='text-sm leading-relaxed text-stone-700'>
                {technique.bad.description}
              </Text>
              <View className='mt-3 rounded-lg bg-white/80 p-2.5'>
                <Text className='text-xs italic text-stone-600'>
                  {technique.bad.example}
                </Text>
              </View>
              <View className='mt-2 flex-row items-start gap-2'>
                <AlertTriangle className='mt-0.5 text-rose-500' size={14} />
                <Text className='flex-1 text-xs text-stone-600'>
                  <Text className='font-medium'>Why to avoid: </Text>
                  {technique.bad.why}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}
