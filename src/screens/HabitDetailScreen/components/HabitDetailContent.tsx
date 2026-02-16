/** HabitDetailContent - Dark mode + a11y optimized */
import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import { useThemeColors } from '../../../theme';
import { colors } from '../../../theme/colors';
import { WorkshopTab } from './WorkshopTab';
import type { Habit } from '../../../features/habits/types';

type TabType = 'overview' | 'workshop';

interface HabitDetailContentProps {
  habit: Habit;
  completedDates: Set<string>;
  notesByDate?: Record<string, string>;
  isPremium?: boolean;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onPremiumRequired?: () => void;
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
  isPremium = false,
  onDayPress,
  onPremiumRequired = () => {},
}: HabitDetailContentProps) {
  const { colors, isDark } = useThemeColors();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const cardBg = isDark ? colors.card : '#FFFFFF';
  const shadowColor = isDark ? '#000000' : '#1c1917';
  const borderColor = isDark ? colors.border : '#DDD8D2';
  const labelColor = isDark ? colors.text.tertiary : '#9C958D';

  const tabBarBg = isDark ? colors.gray[900] : '#F9F9F7';

  return (
    <View className='flex-1'>
      {/* Tab Bar */}
      <View
        className='flex-row gap-0 border-b'
        style={{
          backgroundColor: tabBarBg,
          borderBottomColor: borderColor,
        }}
      >
        {(['overview', 'workshop'] as const).map((tab) => (
          <Pressable
            key={tab}
            className='flex-1 py-3'
            onPress={() => setActiveTab(tab)}
            accessibilityRole='tab'
            accessibilityState={{ selected: activeTab === tab }}
          >
            <Text
              className={`text-center text-sm font-semibold capitalize ${
                activeTab === tab ? 'text-primary-700' : 'text-stone-500'
              }`}
              style={{
                color:
                  activeTab === tab ? colors.primary[700] : colors.text.tertiary,
              }}
            >
              {tab === 'overview' ? '📊 Overview' : '🧠 Workshop'}
            </Text>
            {activeTab === tab && (
              <View
                className='mt-1 h-0.5'
                style={{ backgroundColor: colors.primary[700] }}
              />
            )}
          </Pressable>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <ScrollView
          bounces
          className='flex-1'
          contentContainerClassName='pb-8 px-4'
          showsVerticalScrollIndicator={false}
        >
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
      ) : (
        <ErrorBoundary>
          <WorkshopTab
            habit={habit}
            isPremium={isPremium}
            onPremiumRequired={onPremiumRequired}
          />
        </ErrorBoundary>
      )}
    </View>
  );
}
