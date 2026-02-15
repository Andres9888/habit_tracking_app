/**
 * CardHeader for StreakVoiceNoteCard
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Flame, ChevronDown, ChevronUp, Mic } from 'lucide-react-native';

interface CardHeaderProps {
  streakAtRecording: number;
  bestStreak: number;
  daysAgoText: string;
  isExpanded: boolean;
}

export function CardHeader({
  streakAtRecording,
  bestStreak,
  daysAgoText,
  isExpanded,
}: CardHeaderProps) {
  return (
    <>
      <View className='flex-1 flex-row items-center gap-3'>
        <View className='relative'>
          <View className='h-10 w-10 items-center justify-center rounded-full bg-amber-100'>
            <Mic className='text-amber-600' size={18} />
          </View>
          <View className='absolute -bottom-1 -right-1 flex-row items-center gap-0.5 rounded-full bg-orange-500 px-1.5 py-0.5'>
            <Flame className='text-white' size={10} />
            <Text className='text-[10px] font-bold text-white'>
              {streakAtRecording}
            </Text>
          </View>
        </View>
        <View className='flex-1'>
          <Text className='text-sm font-semibold text-amber-800'>
            Day {streakAtRecording} of your {bestStreak}-day streak
          </Text>
          <Text className='text-xs text-amber-600'>{daysAgoText}</Text>
        </View>
      </View>
      <View className='ml-2 h-8 w-8 items-center justify-center rounded-full bg-amber-100'>
        {isExpanded ? (
          <ChevronUp className='text-amber-600' size={16} />
        ) : (
          <ChevronDown className='text-amber-600' size={16} />
        )}
      </View>
    </>
  );
}
