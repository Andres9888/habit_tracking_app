/** DetailHeader - Optimized: AnimatedPressable, fixed letter spacing, unified shadows, dark mode */
import React from 'react';
import { View, Text } from 'react-native';
import { X, Edit3 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { HeaderCompleteToggle } from '../../../components/HeaderCompleteToggle';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { DetailHeaderProps } from '../HabitDetailScreen.types';
import { iconShadow } from './DetailHeader.constants';
import { HeaderButton } from './HeaderButton';

export function DetailHeader({
  habit,
  isCompletedToday,
  onClose,
  onEdit,
}: DetailHeaderProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const habitName = habit.icon
    ? (habit.name ?? '').replace(/^\p{Emoji}\s*/u, '')
    : (habit.name ?? 'Habit');

  const streakBg = isDark ? themeColors.primary[100] : '#ecfdf5';
  const streakTextColor = isDark ? themeColors.primary[500] : '#047857';
  const streakShadowColor = isDark ? '#000000' : '#059669';

  return (
    <View>
      <Animated.View
        className='flex-row items-center justify-between px-4 pb-2'
        entering={FadeIn.duration(200).delay(50)}
      >
        <HeaderButton
          icon={<X color={themeColors.text.secondary} size={22} strokeWidth={2.5} />}
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
            icon={<Edit3 color={themeColors.text.secondary} size={20} strokeWidth={2.5} />}
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
              backgroundColor: habit.iconColor || '#fef3c7',
              shadowColor: habit.iconColor || '#f59e0b',
            }}
          >
            <Text style={{ fontSize: 40 }}>{habit.icon}</Text>
          </View>
        )}
        <Text
          className='text-center font-bold'
          style={{ fontSize: 34, letterSpacing: -0.5, lineHeight: 41, color: themeColors.text.primary }}
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
            style={{
              backgroundColor: streakBg,
              shadowColor: streakShadowColor,
              shadowOffset: { height: 2, width: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            <Text style={{ fontSize: 17 }}>🔥</Text>
            <Text style={{ fontSize: 17, fontWeight: '600', color: streakTextColor }}>
              {habit.currentStreak} day streak
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}
