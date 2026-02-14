/** HabitDetailContent - Dark mode aware with theme colors */
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { Habit } from '../../../features/habits/types';

interface HabitDetailContentProps {
  habit: Habit;
  completedDates: Set<string>;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

/** Section label component for consistent styling */
function SectionLabel({
  text,
  delay,
  dividerColor,
  textColor,
}: {
  text: string;
  delay: number;
  dividerColor: string;
  textColor: string;
}) {
  return (
    <Animated.View
      className='mb-3 mt-6 flex-row items-center justify-center gap-2'
      entering={anim(delay)}
    >
      <View className='h-px flex-1' style={{ backgroundColor: dividerColor }} />
      <Text
        className='text-[13px] font-semibold tracking-wider'
        style={{ color: textColor }}
      >
        {text}
      </Text>
      <View className='h-px flex-1' style={{ backgroundColor: dividerColor }} />
    </Animated.View>
  );
}

export function HabitDetailContent({
  habit,
  completedDates,
  onDayPress,
}: HabitDetailContentProps) {
  const { colors, isDark } = useThemeColors();

  const cardStyle = {
    backgroundColor: colors.card,
    elevation: 4,
    shadowColor: isDark ? '#000' : '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: isDark ? 0.3 : 0.08,
    shadowRadius: 16,
  };

  return (
    <ScrollView
      bounces
      className='flex-1'
      contentContainerClassName='pb-8 px-4'
      showsVerticalScrollIndicator={false}
    >
      {habit.createdAt && (
        <>
          <SectionLabel
            delay={240}
            dividerColor={colors.border}
            text='STRENGTH'
            textColor={colors.text.tertiary}
          />
          <Animated.View
            className='rounded-2xl'
            entering={anim(300)}
            style={cardStyle}
          >
            <ErrorBoundary>
              <HabitStrengthSection
                completedDates={completedDates}
                habitColor={habit.iconColor}
                habitCreatedAt={habit.createdAt}
                habitId={habit._id}
                habitStrength={habit.strength}
              />
            </ErrorBoundary>
          </Animated.View>
        </>
      )}

      <SectionLabel
        delay={360}
        dividerColor={colors.border}
        text='HISTORY'
        textColor={colors.text.tertiary}
      />
      <Animated.View
        className='rounded-2xl p-4'
        entering={anim(420)}
        style={cardStyle}
      >
        <ErrorBoundary>
          <MonthlyCalendarGrid
            completedDates={completedDates}
            habitColor={habit.iconColor ?? '#047857'}
            habitCreatedAt={habit.createdAt}
            habitId={habit._id}
            onDayPress={onDayPress}
          />
        </ErrorBoundary>
      </Animated.View>
    </ScrollView>
  );
}
