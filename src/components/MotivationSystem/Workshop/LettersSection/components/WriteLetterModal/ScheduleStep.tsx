/**
 * ScheduleStep Component
 * The scheduling step of the letter modal
 */

import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Mail, Calendar, Lock, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '../../../../../../theme/ThemeContext';
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
  const { colors, isDark } = useThemeColors();
  
  // Theme-aware colors
  const violetBg = isDark ? '#4c1d95' : '#ede9fe';
  const violetText = isDark ? '#c4b5fd' : '#7c3aed';
  const violetBorder = isDark ? '#6d28d9' : '#c4b5fd';
  const amberBg = isDark ? '#78350f' : '#fffbeb';
  const amberText = isDark ? '#fcd34d' : '#d97706';

  return (
    <ScrollView className='flex-1' contentContainerClassName='p-4 pb-8'>
      {/* Back button */}
      <Pressable
        accessibilityLabel='Go back to writing'
        className='mb-4 flex-row items-center gap-1'
        onPress={onBack}
      >
        <ChevronRight color={violetText} size={16} style={{ transform: [{ rotate: '180deg' }] }} />
        <Text className='text-sm font-medium' style={{ color: violetText }}>
          Back to letter
        </Text>
      </Pressable>

      {/* Preview of letter */}
      <View 
        className='mb-6 rounded-xl p-4' 
        style={{ 
          backgroundColor: violetBg,
          borderColor: violetBorder,
          borderWidth: 1,
        }}
      >
        <View className='mb-2 flex-row items-center gap-2'>
          <Mail color={violetText} size={16} />
          <Text className='font-semibold' style={{ color: violetText }}>
            {title || 'Letter to Future Self'}
          </Text>
        </View>
        <Text className='text-sm' numberOfLines={3} style={{ color: colors.text.secondary }}>
          {content}
        </Text>
      </View>

      {/* Unlock duration picker */}
      <Text 
        className='mb-3 text-xs font-semibold uppercase tracking-wide' 
        style={{ color: colors.text.tertiary }}
      >
        When to unlock
      </Text>
      <UnlockDurationPicker
        selectedDays={unlockDays}
        onSelectDays={onSelectDays}
      />

      {/* Unlock date preview */}
      <View 
        className='mt-4 flex-row items-center gap-2 rounded-xl p-3' 
        style={{ backgroundColor: amberBg }}
      >
        <Calendar color={amberText} size={18} />
        <View className='flex-1'>
          <Text className='text-xs font-medium' style={{ color: amberText }}>
            Unlocks on:
          </Text>
          <Text className='text-sm font-semibold' style={{ color: amberText }}>
            {unlockDateString}
          </Text>
        </View>
        <Lock color={amberText} size={16} />
      </View>

      {/* Explanation with more context */}
      <View className='mt-4 rounded-xl p-3' style={{ backgroundColor: isDark ? colors.gray[800] : colors.gray[100] }}>
        <Text className='text-center text-xs leading-relaxed' style={{ color: colors.text.secondary }}>
          Your letter will be locked for <Text className='font-semibold'>{unlockDays} days</Text> to give your habits time to grow. 
          You'll get a notification when it's ready to read — a message from your past self to your future self.
        </Text>
      </View>
    </ScrollView>
  );
}
