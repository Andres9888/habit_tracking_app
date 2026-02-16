/** HabitDetailContent - Dark mode + a11y optimized */
import React, { useState, useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import { useThemeColors } from '../../../theme';
import { colors } from '../../../theme/colors';
import { WorkshopTabContent } from './WorkshopTabContent';
import type { Habit } from '../../../features/habits/types';

type DetailTab = 'progress' | 'workshop';

interface HabitDetailContentProps {
  habit: Habit;
  completedDates: Set<string>;
  notesByDate?: Record<string, string>;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  initialTab?: DetailTab;
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

/** Tab bar for switching between Progress and Workshop */
function TabBar({
  activeTab,
  onTabChange,
  isDark,
  themeColors,
}: {
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  isDark: boolean;
  themeColors: ReturnType<typeof useThemeColors>['colors'];
}) {
  const tabs: { key: DetailTab; label: string }[] = [
    { key: 'progress', label: 'Progress' },
    { key: 'workshop', label: 'Workshop' },
  ];

  return (
    <View className="mx-4 mb-2 mt-1 flex-row rounded-xl p-1" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            className="flex-1 items-center rounded-lg py-2"
            style={isActive ? {
              backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            } : undefined}
            onPress={() => onTabChange(tab.key)}
          >
            <Text
              className="text-[13px] font-semibold"
              style={{
                color: isActive
                  ? (isDark ? '#FFFFFF' : themeColors.primary[700])
                  : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'),
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function HabitDetailContent({
  habit,
  completedDates,
  notesByDate,
  onDayPress,
  initialTab = 'progress',
}: HabitDetailContentProps) {
  const { colors, isDark } = useThemeColors();
  const [activeTab, setActiveTab] = useState<DetailTab>(initialTab);
  const cardBg = isDark ? colors.card : '#FFFFFF';
  const shadowColor = isDark ? '#000000' : '#1c1917';
  const borderColor = isDark ? colors.border : '#DDD8D2';
  const labelColor = isDark ? colors.text.tertiary : '#9C958D';

  return (
    <View className="flex-1">
      <TabBar
        activeTab={activeTab}
        isDark={isDark}
        themeColors={colors}
        onTabChange={setActiveTab}
      />

      {activeTab === 'progress' ? (
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
        <WorkshopTabContent habit={habit} />
      )}
    </View>
  );
}
