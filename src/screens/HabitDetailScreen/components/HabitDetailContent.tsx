/**
 * HabitDetailContent - Scrollspy layout: Hero → sticky tabs → Calendar + Strength + Goal stacked.
 * Tabs act as anchors, not gatekeepers. Every progress surface is visible in one scroll.
 */
import { useRef } from 'react';
import { ScrollView, View, type LayoutChangeEvent } from 'react-native';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import type { Habit } from '../../../features/habits/types';
import { useProgressEmojis } from '../../../hooks/useProgressEmojis';
import { useThemeColors } from '../../../theme';
import { CalendarTabContent } from './CalendarTabContent';
import { DetailHeroSection } from './DetailHeroSection';
import { DetailViewTabs, type DetailView } from './DetailViewTabs';
import { GoalTabContent } from './GoalTabContent';
import { useDetailScrollSpy } from './useDetailScrollSpy';

interface HabitDetailContentProps {
  completedDates: Set<string>;
  daysTracking?: number;
  habit: Habit;
  isCompletedToday: boolean;
  pendingToggleDate?: string | null;
  totalCompletions: number;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onPinnedChange?: (pinned: boolean) => void;
}

export function HabitDetailContent({
  completedDates,
  daysTracking,
  habit,
  isCompletedToday,
  pendingToggleDate = null,
  totalCompletions,
  onDayPress,
  onPinnedChange,
}: HabitDetailContentProps) {
  const { colors } = useThemeColors();
  const scrollRef = useRef<ScrollView>(null);
  const { activeView, handleScroll, handleSectionLayout, scrollToView } =
    useDetailScrollSpy(scrollRef, { onPinnedChange });
  const habitColor = habit.color ?? habit.iconColor ?? colors.primary[700];
  const progressEmojis = useProgressEmojis(habit);

  const makeSectionLayoutHandler =
    (view: DetailView) => (event: LayoutChangeEvent) => {
      handleSectionLayout(view, event.nativeEvent.layout.y);
    };

  return (
    <ScrollView
      ref={scrollRef}
      bounces
      className='flex-1'
      contentContainerClassName='pb-16'
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[1]}
      onScroll={handleScroll}
    >
      <DetailHeroSection
        daysTracking={daysTracking}
        habit={habit}
        isCompletedToday={isCompletedToday}
        isToggling={pendingToggleDate !== null}
        totalCompletions={totalCompletions}
        onDayPress={onDayPress}
      />
      <DetailViewTabs activeView={activeView} onViewChange={scrollToView} />

      <View
        className='mx-4 mt-3'
        onLayout={makeSectionLayoutHandler('calendar')}
      >
        <CalendarTabContent
          completedDates={completedDates}
          habit={habit}
          habitColor={habitColor}
          pendingToggleDate={pendingToggleDate}
          onDayPress={onDayPress}
        />
      </View>

      {habit.createdAt ? (
        <View
          className='mx-4 mt-4'
          onLayout={makeSectionLayoutHandler('strength')}
        >
          <ErrorBoundary>
            <HabitStrengthSection
              completedDates={completedDates}
              habitColor={habit.color ?? habit.iconColor}
              habitCreatedAt={habit.createdAt}
              habitId={habit._id}
              habitStrength={habit.strength}
              progressEmojis={progressEmojis}
            />
          </ErrorBoundary>
        </View>
      ) : null}

      <View className='mx-4 mt-4' onLayout={makeSectionLayoutHandler('goal')}>
        <GoalTabContent habit={habit} />
      </View>
    </ScrollView>
  );
}
