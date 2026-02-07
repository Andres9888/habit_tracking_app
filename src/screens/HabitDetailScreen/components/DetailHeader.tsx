/** DetailHeader - Matches Create/Edit modal header style */
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { X, Edit3, Check } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { HeaderCompleteToggle } from '../../../components/HeaderCompleteToggle';
import type { DetailHeaderProps } from '../HabitDetailScreen.types';

export function DetailHeader({
  habit,
  isCompletedToday,
  onClose,
  onEdit,
}: DetailHeaderProps) {
  const habitName = habit.icon
    ? (habit.name ?? '').replace(/^\p{Emoji}\s*/u, '')
    : (habit.name ?? 'Habit');

  return (
    <View>
      {/* Top bar with X and Edit buttons */}
      <View className='flex-row items-center justify-between px-4 pb-2'>
        <Pressable
          accessibilityLabel='Close'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full active:bg-stone-100'
          onPress={onClose}
        >
          <X color='#44403c' size={22} strokeWidth={2} />
        </Pressable>
        <View className='flex-1' />
        <View className='flex-row items-center gap-2'>
          <HeaderCompleteToggle
            completedToday={isCompletedToday}
            habitId={habit._id}
            habitName={habit.name}
          />
          <Pressable
            accessibilityLabel='Edit habit'
            accessibilityRole='button'
            className='h-11 w-11 items-center justify-center rounded-full active:bg-stone-100'
            onPress={onEdit}
          >
            <Edit3 color='#44403c' size={20} strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      {/* Hero section with icon + name */}
      <Animated.View
        className='items-center px-4 pb-6'
        entering={FadeInDown.duration(240).delay(100)}
      >
        {habit.icon && (
          <View
            className='mb-3 h-16 w-16 items-center justify-center rounded-2xl shadow-lg'
            style={{ backgroundColor: habit.iconColor || '#fef3c7' }}
          >
            <Text className='text-3xl'>{habit.icon}</Text>
          </View>
        )}
        <Text
          className='text-center font-bold text-stone-900'
          style={{ fontSize: 28, letterSpacing: -28 * 0.02, lineHeight: 34 }}
        >
          {habitName}
        </Text>
        {(habit.currentStreak ?? 0) > 0 && (
          <View className='mt-2 flex-row items-center gap-1 rounded-full bg-emerald-50 px-3 py-1'>
            <Text className='text-sm'>🔥</Text>
            <Text className='text-[13px] font-semibold text-emerald-700'>
              {habit.currentStreak} day streak
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}
