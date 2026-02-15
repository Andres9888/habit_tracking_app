/**
 * LetterContent Component
 * Displays the unlocked letter content with quote styling
 */

import type { AnimatedStyle } from 'react-native-reanimated';
import React from 'react';
import type { ViewStyle } from 'react-native';
import { View, Text, ScrollView } from 'react-native';

import Animated from 'react-native-reanimated';
import { Calendar, Quote } from 'lucide-react-native';

import type { LetterData } from '../../LettersSection.types';
import { JustUnlockedBadge } from './JustUnlockedBadge';
import { MotivationalFooter } from './MotivationalFooter';
import { fontFamilies } from '@/theme/typography';

interface LetterContentProps {
  letter: LetterData;
  showContent: boolean;
  animationComplete: boolean;
  wasJustUnlocked: boolean;
  daysSinceWritten: number;
  writtenDateString: string;
  contentAnimatedStyle: AnimatedStyle<ViewStyle>;
  sparkleAnimatedStyle: AnimatedStyle<ViewStyle>;
}

export function LetterContent({
  letter,
  showContent,
  animationComplete,
  wasJustUnlocked,
  daysSinceWritten,
  writtenDateString,
  contentAnimatedStyle,
  sparkleAnimatedStyle,
}: LetterContentProps) {
  return (
    <ScrollView
      className='flex-1'
      contentContainerClassName='px-5 pb-12'
      showsVerticalScrollIndicator={false}
    >
      {wasJustUnlocked && !animationComplete && (
        <JustUnlockedBadge sparkleAnimatedStyle={sparkleAnimatedStyle} />
      )}

      {/* Letter metadata */}
      <Animated.View
        className='mb-6'
        style={showContent ? contentAnimatedStyle : { opacity: 0 }}
      >
        <View className='flex-row items-center justify-center gap-3'>
          <View className='flex-row items-center gap-1.5'>
            <Calendar className='text-violet-400' size={14} />
            <Text className='text-xs text-stone-500'>
              Written {writtenDateString}
            </Text>
          </View>
          <Text className='text-stone-300'>•</Text>
          <Text className='text-xs text-stone-500'>
            {daysSinceWritten} day{daysSinceWritten === 1 ? '' : 's'} ago
          </Text>
        </View>
      </Animated.View>

      {/* Letter content with quote styling */}
      <Animated.View
        style={showContent ? contentAnimatedStyle : { opacity: 0 }}
      >
        <View className='mb-4 items-center'>
          <Quote
            className='rotate-180 text-violet-200'
            fill='#ddd6fe'
            size={32}
          />
        </View>
        <View className='rounded-2xl bg-white p-6 shadow-sm shadow-stone-200/60'>
          <Text
            className='text-base leading-7 text-stone-700'
            style={{ fontFamily: fontFamilies.serif }}
          >
            {letter.content}
          </Text>
        </View>
        <View className='mt-4 items-center'>
          <Quote className='text-violet-200' fill='#ddd6fe' size={32} />
        </View>

        {/* Signature line */}
        <View className='mt-6 items-center'>
          <View className='h-px w-16 bg-violet-200' />
          <Text className='mt-3 text-sm italic text-stone-500'>
            — Your Past Self
          </Text>
          {letter.habitName && (
            <Text className='mt-1 text-xs text-violet-500'>
              For your {letter.habitName} journey
            </Text>
          )}
        </View>
      </Animated.View>

      <MotivationalFooter
        contentAnimatedStyle={contentAnimatedStyle}
        showContent={showContent}
      />
    </ScrollView>
  );
}
