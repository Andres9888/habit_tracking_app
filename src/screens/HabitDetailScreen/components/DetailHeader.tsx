/**
 * DetailHeader Component
 * Header with inline hero, back button, and action buttons
 * OPTIMIZED: 17px name, stronger icon contrast, shadow depth
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { X, Edit3 } from 'lucide-react-native';
import { HeaderCompleteToggle } from '../../../components/HeaderCompleteToggle';
import type { DetailHeaderProps } from '../HabitDetailScreen.types';

// eslint-disable-next-line max-lines-per-function
export function DetailHeader({
  habit,
  isCompletedToday,
  onClose,
  onEdit,
}: DetailHeaderProps) {
  return (
    <View className='flex-row items-center justify-between px-4 pb-3'>
      {/* Back button - OPTIMIZED: stronger shadow */}
      <Pressable
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-white shadow-md active:bg-stone-50'
        onPress={onClose}
      >
        <X color='#1c1917' size={22} strokeWidth={2.25} />
      </Pressable>

      {/* Inline Hero - Icon + Name + Streak */}
      <View className='flex-row items-center gap-3'>
        {habit.icon && (
          <View
            className='h-12 w-12 items-center justify-center rounded-xl shadow-md'
            style={{ backgroundColor: habit.iconColor || '#fef3c7' }}
          >
            <Text className='text-2xl'>{habit.icon}</Text>
          </View>
        )}
        <View>
          {/* OPTIMIZED: 17px semibold for proper hierarchy */}
          <Text className='text-[17px] font-semibold leading-[22px] text-stone-900'>
            {habit.icon
              ? (habit.name ?? '').replace(/^\p{Emoji}\s*/u, '')
              : (habit.name ?? 'Habit')}
          </Text>
          {(habit.currentStreak ?? 0) >= 7 && (
            <Text className='text-[13px] font-semibold text-emerald-600'>
              🔥 {habit.currentStreak} day streak
            </Text>
          )}
        </View>
      </View>

      {/* Action buttons - OPTIMIZED: stronger shadows */}
      <View className='flex-row items-center gap-2'>
        <HeaderCompleteToggle
          completedToday={isCompletedToday}
          habitId={habit._id}
          habitName={habit.name}
        />
        <Pressable
          accessibilityLabel='Edit habit'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center rounded-full bg-white shadow-md active:bg-stone-50'
          onPress={onEdit}
        >
          <Edit3 color='#1c1917' size={18} strokeWidth={2.25} />
        </Pressable>
      </View>
    </View>
  );
}
