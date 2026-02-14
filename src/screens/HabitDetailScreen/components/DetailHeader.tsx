/** DetailHeader - Optimized: AnimatedPressable, fixed letter spacing, unified shadows */
import React from 'react';
import { View, Text } from 'react-native';
import { X, Edit3 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { HeaderCompleteToggle } from '../../../components/HeaderCompleteToggle';
import type { DetailHeaderProps } from '../HabitDetailScreen.types';
import { iconShadow, streakShadow } from './DetailHeader.constants';
import { HeaderButton } from './HeaderButton';

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
      <Animated.View
        className='flex-row items-center justify-between px-4 pb-2'
        entering={FadeIn.duration(200).delay(50)}
      >
        <HeaderButton
          icon={<X color='#57534e' size={22} strokeWidth={2.5} />}
          label='Close'
          onPress={onClose}
        />
        <View className='flex-1' />
        <View className='flex-row items-center gap-3'>
          <HeaderCompleteToggle
            completedToday={isCompletedToday}
            habitId={habit._id}
            habitName={habit.name}
          />
          <HeaderButton
            icon={<Edit3 color='#57534e' size={20} strokeWidth={2.5} />}
            label='Edit habit'
            onPress={onEdit}
          />
        </View>
      </Animated.View>
      <Animated.View
        className='items-center px-4 pb-6'
        entering={FadeInDown.duration(280).delay(100).springify().damping(18)}
      >
        {habit.icon && (
          <View
            className='mb-4 h-20 w-20 items-center justify-center rounded-2xl'
            style={{
              ...iconShadow,
              backgroundColor: habit.color ?? habit.iconColor || '#fef3c7',
              shadowColor: habit.color ?? habit.iconColor || '#f59e0b',
            }}
          >
            <Text style={{ fontSize: 40 }}>{habit.icon}</Text>
          </View>
        )}
        <Text
          className='text-center font-bold text-stone-900'
          style={{ fontSize: 34, letterSpacing: -0.5, lineHeight: 41 }}
        >
          {habitName}
        </Text>
        {(habit.currentStreak ?? 0) > 0 && (
          <Animated.View
            className='mt-3 flex-row items-center gap-1.5 rounded-full px-4 py-2'
            entering={FadeInDown.duration(240)
              .delay(200)
              .springify()
              .damping(18)}
            style={streakShadow}
          >
            <Text style={{ fontSize: 17 }}>🔥</Text>
            <Text className='text-[17px] font-semibold text-emerald-700'>
              {habit.currentStreak} day streak
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}
