/** HabitDetailContent - Tabbed layout: Calendar / Strength / Goal */
import { useCallback, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import { useThemeColors } from '../../../theme';
import { shadows } from '../../../theme/spacing';
import type { Habit } from '../../../features/habits/types';
import { CalendarTabContent } from './CalendarTabContent';
import { DetailViewTabs, type DetailView } from './DetailViewTabs';
import { GoalTabContent } from './GoalTabContent';
import { computeCompletionRate } from './HabitDetailContent.utils';

interface HabitDetailContentProps {
  completedDates: Set<string>;
  habit: Habit;
  totalCompletions: number;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function HabitDetailContent({
  completedDates,
  habit,
  totalCompletions,
  onDayPress,
}: HabitDetailContentProps) {
  const { colors } = useThemeColors();
  const [activeView, setActiveView] = useState<DetailView>('calendar');
  const scrollRef = useRef<ScrollView>(null);
  const habitColor = habit.color ?? habit.iconColor ?? colors.primary[700];
  const cardBg = colors.card;

  const handleViewChange = useCallback((view: DetailView) => {
    setActiveView(view);
    scrollRef.current?.scrollTo({ animated: true, y: 0 });
  }, []);

  const completionRate = computeCompletionRate(habit, totalCompletions);

  return (
    <ScrollView
      ref={scrollRef}
      bounces
      className='flex-1'
      contentContainerClassName='pb-8 px-4'
      showsVerticalScrollIndicator={false}
    >
      <DetailViewTabs activeView={activeView} onViewChange={handleViewChange} />

      {activeView === 'calendar' ? (
        <CalendarTabContent
          completedDates={completedDates}
          habit={habit}
          habitColor={habitColor}
          onDayPress={onDayPress}
        />
      ) : null}

      {activeView === 'strength' && habit.createdAt ? (
        <Animated.View
          className='mt-2 rounded-2xl'
          entering={FadeInDown.duration(300).springify().damping(20)}
          style={{ backgroundColor: cardBg, ...shadows.card }}
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
      ) : null}

      {activeView === 'goal' ? (
        <GoalTabContent completionRate={completionRate} habit={habit} />
      ) : null}
    </ScrollView>
  );
}
