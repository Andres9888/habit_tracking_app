/** HabitDetailContent - Sticky anchors + one calm progress scroll. */
import { useRef } from 'react';
import { ScrollView, View, type LayoutChangeEvent } from 'react-native';
import ErrorBoundary from '../../../components/ErrorBoundary';
import type { Habit } from '../../../features/habits/types';
import { useThemeColors } from '../../../theme';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { CalendarTabContent } from './CalendarTabContent';
import { DetailHeroSection } from './DetailHeroSection';
import { DetailInsightsCard } from './DetailInsightsCard';
import { DetailStrengthCard } from './DetailStrengthCard';
import { DetailViewTabs, type DetailView } from './DetailViewTabs';
import { GoalTabContent } from './GoalTabContent';
import { useDetailScrollSpy } from './useDetailScrollSpy';

interface HabitDetailContentProps {
  completedDates: Set<string>;
  habit: Habit;
  isCompletedToday: boolean;
  pendingToggleDate?: string | null;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onPinnedChange?: (pinned: boolean) => void;
}

export function HabitDetailContent({
  completedDates,
  habit,
  isCompletedToday,
  pendingToggleDate = null,
  onDayPress,
  onPinnedChange,
}: HabitDetailContentProps) {
  const { colors } = useThemeColors();
  const scrollRef = useRef<ScrollView>(null);
  const { activeView, handleScroll, handleSectionLayout, scrollToView } =
    useDetailScrollSpy(scrollRef, { onPinnedChange });
  const habitColor = habit.color ?? habit.iconColor ?? colors.primary[700];
  const isTodayToggling = pendingToggleDate === getLocalDateString();

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
      stickyHeaderIndices={[0]}
      onScroll={handleScroll}
    >
      <DetailViewTabs activeView={activeView} onViewChange={scrollToView} />
      <DetailHeroSection
        completedDates={completedDates}
        habit={habit}
        habitColor={habitColor}
        isCompletedToday={isCompletedToday}
        isToggling={isTodayToggling}
        onDayPress={onDayPress}
      />

      {habit.createdAt ? (
        <View
          className='mx-5 mt-4'
          onLayout={makeSectionLayoutHandler('strength')}
        >
          <ErrorBoundary>
            <DetailStrengthCard
              completedDates={completedDates}
              habitCreatedAt={habit.createdAt}
              habitStrength={habit.strength}
              isCompletedToday={isCompletedToday}
            />
          </ErrorBoundary>
        </View>
      ) : null}

      <View className='mx-5 mt-5'>
        <ErrorBoundary>
          <DetailInsightsCard
            completedDates={completedDates}
            habitColor={habitColor}
          />
        </ErrorBoundary>
      </View>

      <View
        className='mx-5 mt-5'
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

      <View className='mx-5 mt-5' onLayout={makeSectionLayoutHandler('goal')}>
        <GoalTabContent completedDates={completedDates} habit={habit} />
      </View>
    </ScrollView>
  );
}
