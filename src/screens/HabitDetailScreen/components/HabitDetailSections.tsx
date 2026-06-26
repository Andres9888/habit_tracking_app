/**
 * HabitDetailSections - the stacked scroll body (Calendar → Strength → Goal).
 * Each section reports its y via onSectionLayout so the sticky tabs can scrollspy.
 */
import { View, type LayoutChangeEvent } from 'react-native';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import type { Habit } from '../../../features/habits/types';
import { useProgressEmojis } from '../../../hooks/useProgressEmojis';
import { useThemeColors } from '../../../theme';
import { CalendarTabContent } from './CalendarTabContent';
import type { DetailView } from './DetailViewTabs';
import { GoalTabContent } from './GoalTabContent';

interface HabitDetailSectionsProps {
  completedDates: Set<string>;
  habit: Habit;
  pendingToggleDate?: string | null;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onSectionLayout: (view: DetailView) => (event: LayoutChangeEvent) => void;
}

export function HabitDetailSections({
  completedDates,
  habit,
  pendingToggleDate = null,
  onDayPress,
  onSectionLayout,
}: HabitDetailSectionsProps) {
  const { colors } = useThemeColors();
  const habitColor = habit.color ?? habit.iconColor ?? colors.primary[700];
  const progressEmojis = useProgressEmojis(habit);

  return (
    <>
      <View className='mx-5 mt-4' onLayout={onSectionLayout('calendar')}>
        <CalendarTabContent
          completedDates={completedDates}
          habit={habit}
          habitColor={habitColor}
          pendingToggleDate={pendingToggleDate}
          onDayPress={onDayPress}
        />
      </View>

      {habit.createdAt ? (
        <View className='mx-5 mt-5' onLayout={onSectionLayout('strength')}>
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

      <View className='mx-5 mt-5' onLayout={onSectionLayout('goal')}>
        <GoalTabContent habit={habit} />
      </View>
    </>
  );
}
