/**
 * ScheduleStep Component
 * The scheduling step of the letter modal
 */

import { triggerHaptic } from '@/utils/haptics';
import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Mail, Calendar, Lock, ChevronRight } from 'lucide-react-native';
import { UnlockDurationPicker } from '../UnlockDurationPicker';

interface ScheduleStepProps {
  title: string;
  content: string;
  unlockDays: number;
  unlockDateString: string;
  onSelectDays: (days: number) => void;
  onBack: () => void;
}

export function ScheduleStep({
  title,
  content,
  unlockDays,
  unlockDateString,
  onSelectDays,
  onBack,
}: ScheduleStepProps) {
  return (
    <ScrollView className='flex-1' contentContainerClassName='p-4 pb-8'>
      {/* Back button */}
      <Pressable
        accessibilityLabel='Go back to writing'
        className='mb-4 flex-row items-center gap-1'
        onPress={onBack}
      >
        <ChevronRight className='rotate-180 text-violet-600' size={16} />
        <Text className='text-sm font-medium text-violet-600'>
          Back to letter
        </Text>
      </Pressable>

      {/* Preview of letter */}
      <View className='mb-6 rounded-xl border border-violet-200 bg-violet-50 p-4'>
        <View className='mb-2 flex-row items-center gap-2'>
          <Mail className='text-violet-500' size={16} />
          <Text className='font-semibold text-violet-700'>
            {title || 'Letter to Future Self'}
          </Text>
        </View>
        <Text className='text-sm text-stone-600' numberOfLines={3}>
          {content}
        </Text>
      </View>

      {/* Unlock duration picker */}
      <Text className='mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400'>
        When to unlock
      </Text>
      <UnlockDurationPicker
        selectedDays={unlockDays}
        onSelectDays={onSelectDays}
      />

      {/* Unlock date preview */}
      <View className='mt-4 flex-row items-center gap-2 rounded-xl bg-amber-50 p-3'>
        <Calendar className='text-amber-600' size={18} />
        <View className='flex-1'>
          <Text className='text-xs font-medium text-amber-800'>
            Unlocks on:
          </Text>
          <Text className='text-sm font-semibold text-amber-900'>
            {unlockDateString}
          </Text>
        </View>
        <Lock className='text-amber-500' size={16} />
      </View>

      {/* Explanation */}
      <Text className='mt-4 text-center text-xs text-stone-500'>
        Your letter will be locked until this date. You'll receive a
        notification when it's ready to read.
      </Text>
    </ScrollView>
  );
}
