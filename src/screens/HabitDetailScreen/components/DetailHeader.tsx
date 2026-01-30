/**
 * DetailHeader Component
 * Header with inline hero, back button, and action buttons
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { X, Edit3 } from 'lucide-react-native';
import { HeaderCompleteToggle } from '../../../components/HeaderCompleteToggle';
import type { DetailHeaderProps } from '../HabitDetailScreen.types';

export function DetailHeader({
  habit,
  isCompletedToday,
  onClose,
  onEdit,
}: DetailHeaderProps) {
  return (
    <View className='flex-row items-center justify-between px-4 pb-3'>
      {/* Back button */}
      <Pressable
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm shadow-stone-200/50 active:bg-stone-50'
        onPress={onClose}
      >
        <X className='text-stone-700' size={22} strokeWidth={2.25} />
      </Pressable>

      {/* Inline Hero - Icon + Name + Streak */}
      <View className='flex-row items-center gap-2.5'>
        {habit.icon && (
          <View
            className='h-11 w-11 items-center justify-center rounded-xl shadow'
            style={{ backgroundColor: habit.iconColor || '#fef3c7' }}
          >
            <Text className='text-2xl'>{habit.icon}</Text>
          </View>
        )}
        <View>
          <Text className='text-base font-bold leading-tight text-stone-900'>
            {/* Strip leading emoji from name if icon is shown separately */}
            {habit.icon ? habit.name.replace(/^\p{Emoji}\s*/u, '') : habit.name}
          </Text>
          {(habit.currentStreak ?? 0) >= 7 && (
            <Text className='text-xs font-medium text-orange-600'>
              {habit.currentStreak} day streak
            </Text>
          )}
        </View>
      </View>

      {/* Action buttons */}
      <View className='flex-row items-center gap-2'>
        <HeaderCompleteToggle
          completedToday={isCompletedToday}
          habitId={habit._id}
          habitName={habit.name}
        />
        <Pressable
          accessibilityLabel='Edit habit'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm shadow-stone-200/50 active:bg-stone-50'
          onPress={onEdit}
        >
          <Edit3 className='text-stone-700' size={18} strokeWidth={2.25} />
        </Pressable>
      </View>
    </View>
  );
}
