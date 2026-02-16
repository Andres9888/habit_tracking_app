/** HabitDetailContent - Dark mode + a11y optimized */
import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Flame, Trophy, CheckCircle2 } from 'lucide-react-native';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import { useThemeColors } from '../../../theme';
import { colors } from '../../../theme/colors';
import type { Habit } from '../../../features/habits/types';

interface HabitDetailContentProps {
  habit: Habit;
  completedDates: Set<string>;
  notesByDate?: Record<string, string>;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

/** Section label component for consistent styling */
function SectionLabel({
  text,
  delay,
  borderColor,
  textColor,
}: {
  text: string;
  delay: number;
  borderColor: string;
  textColor: string;
}) {
  return (
    <Animated.View
      className='mb-3 mt-6 flex-row items-center justify-center gap-2'
      entering={anim(delay)}
    >
      <View className='h-px flex-1' style={{ backgroundColor: borderColor }} />
      <Text
        className='text-[13px] font-semibold tracking-wider'
        style={{ color: textColor }}
      >
        {text}
      </Text>
      <View className='h-px flex-1' style={{ backgroundColor: borderColor }} />
    </Animated.View>
  );
}

export function HabitDetailContent({
  habit,
  completedDates,
  notesByDate,
  onDayPress,
}: HabitDetailContentProps) {
  const { colors, isDark } = useThemeColors();
  const cardBg = isDark ? colors.card : '#FFFFFF';
  const shadowColor = isDark ? '#000000' : '#1c1917';
  const borderColor = isDark ? colors.border : '#DDD8D2';
  const labelColor = isDark ? colors.text.tertiary : '#9C958D';

  const currentStreak = habit.currentStreak ?? 0;
  const bestStreak = habit.bestStreak ?? 0;
  const totalCompletions = completedDates.size;

  return (
    <ScrollView
      bounces
      className='flex-1'
      contentContainerClassName='pb-8 px-4'
      showsVerticalScrollIndicator={false}
    >
      {/* QUICK STATS */}
      <Animated.View
        className='mt-2 flex-row gap-2'
        entering={anim(60)}
      >
        <View
          className='flex-1 items-center rounded-2xl px-3 py-3'
          style={{
            backgroundColor: cardBg,
            elevation: 4,
            shadowColor,
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: isDark ? 0.3 : 0.08,
            shadowRadius: 16,
          }}
        >
          <Flame size={18} color='#f97316' strokeWidth={2.5} />
          <Text
            className='mt-1 text-xl font-bold'
            style={{ color: isDark ? colors.text.primary : '#1c1917' }}
          >
            {currentStreak}
          </Text>
          <Text
            className='text-[11px] font-medium tracking-wide'
            style={{ color: labelColor }}
          >
            CURRENT
          </Text>
        </View>
        <View
          className='flex-1 items-center rounded-2xl px-3 py-3'
          style={{
            backgroundColor: cardBg,
            elevation: 4,
            shadowColor,
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: isDark ? 0.3 : 0.08,
            shadowRadius: 16,
          }}
        >
          <Trophy size={18} color='#eab308' strokeWidth={2.5} />
          <Text
            className='mt-1 text-xl font-bold'
            style={{ color: isDark ? colors.text.primary : '#1c1917' }}
          >
            {bestStreak}
          </Text>
          <Text
            className='text-[11px] font-medium tracking-wide'
            style={{ color: labelColor }}
          >
            BEST
          </Text>
        </View>
        <View
          className='flex-1 items-center rounded-2xl px-3 py-3'
          style={{
            backgroundColor: cardBg,
            elevation: 4,
            shadowColor,
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: isDark ? 0.3 : 0.08,
            shadowRadius: 16,
          }}
        >
          <CheckCircle2 size={18} color='#059669' strokeWidth={2.5} />
          <Text
            className='mt-1 text-xl font-bold'
            style={{ color: isDark ? colors.text.primary : '#1c1917' }}
          >
            {totalCompletions}
          </Text>
          <Text
            className='text-[11px] font-medium tracking-wide'
            style={{ color: labelColor }}
          >
            TOTAL
          </Text>
        </View>
      </Animated.View>

      {/* STRENGTH section */}
      {habit.createdAt && (
        <>
          <SectionLabel borderColor={borderColor} delay={240} text='STRENGTH' textColor={labelColor} />
          <Animated.View
            className='rounded-2xl'
            entering={anim(300)}
            style={{
              backgroundColor: cardBg,
              elevation: 4,
              shadowColor,
              shadowOffset: { height: 4, width: 0 },
              shadowOpacity: isDark ? 0.3 : 0.08,
              shadowRadius: 16,
            }}
          >
            <ErrorBoundary>
              <HabitStrengthSection
                completedDates={completedDates}
                habitColor={habit.color ?? habit.iconColor}
                habitCreatedAt={habit.createdAt}
                habitId={habit._id}
                habitStrength={habit.strength}
              />
            </ErrorBoundary>
          </Animated.View>
        </>
      )}

      {/* HISTORY section */}
      <SectionLabel borderColor={borderColor} delay={360} text='HISTORY' textColor={labelColor} />
      <Animated.View
        className='rounded-2xl p-4'
        entering={anim(420)}
        style={{
          backgroundColor: cardBg,
          elevation: 4,
          shadowColor,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 16,
        }}
      >
        <ErrorBoundary>
          <MonthlyCalendarGrid
            completedDates={completedDates}
            habitColor={habit.color ?? habit.iconColor ?? colors.primary[700]}
            habitCreatedAt={habit.createdAt}
            habitId={habit._id}
            notesByDate={notesByDate}
            onDayPress={onDayPress}
          />
        </ErrorBoundary>
      </Animated.View>
    </ScrollView>
  );
}
