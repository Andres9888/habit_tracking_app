/** DetailHeader - Dark mode + a11y optimized */
import React from 'react';
import { View, Text } from 'react-native';
import { X, Edit3 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import type { DetailHeaderProps } from '../HabitDetailScreen.types';
import { iconShadow, streakShadow } from './DetailHeader.constants';
import { HeaderButton } from './HeaderButton';

export function DetailHeader({ habit, onClose, onEdit }: DetailHeaderProps) {
  const { colors, isDark } = useThemeColors();
  const iconColor = isDark ? colors.text.secondary : '#57534e';
  const textPrimary = isDark ? colors.text.primary : '#1c1917';
  const habitName = habit.icon
    ? (habit.name ?? '').replace(/^\p{Emoji}\s*/u, '')
    : (habit.name ?? 'Habit');

  return (
    <View>
      <Animated.View
        className='flex-row items-center justify-between px-4 pb-2'
        entering={FadeInDown.duration(280).springify().damping(18)}
      >
        <HeaderButton
          icon={<X color={iconColor} size={22} strokeWidth={2.5} />}
          label='Close'
          onPress={onClose}
        />
        <View className='flex-1' />
        <HeaderButton
          icon={<Edit3 size={15} strokeWidth={2.5} />}
          label='Edit habit'
          text='Edit Habit'
          onPress={onEdit}
        />
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
              backgroundColor: (habit.color ?? habit.iconColor) || '#fef3c7',
              shadowColor: (habit.color ?? habit.iconColor) || '#f59e0b',
            }}
          >
            <Text style={{ fontSize: 40 }}>{habit.icon}</Text>
          </View>
        )}
        <Text
          className='text-center font-bold'
          style={{
            fontSize: 34,
            letterSpacing: -0.5,
            lineHeight: 41,
            color: textPrimary,
          }}
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
