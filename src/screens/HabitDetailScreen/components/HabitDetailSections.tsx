/** Calendar / Goal / Strength sections under sticky tabs. */
import { View, type LayoutChangeEvent } from 'react-native';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import type { Habit } from '../../../features/habits/types';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';
import { CalendarTabContent } from './CalendarTabContent';
import type { DetailView } from './DetailViewTabs';
import { GoalTabContent } from './GoalTabContent';

interface HabitDetailSectionsProps {
  completedDates: Set<string>;
  habit: Habit;
  habitColor: string;
  pendingToggleDate: string | null;
  progressEmojis: ProgressEmojiSet;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onSectionLayout: (view: DetailView, y: number) => void;
}

export function HabitDetailSections({
  completedDates,
  habit,
  habitColor,
  pendingToggleDate,
  progressEmojis,
  onDayPress,
  onSectionLayout,
}: HabitDetailSectionsProps) {
  const layout =
    (view: DetailView) => (event: LayoutChangeEvent) => {
      onSectionLayout(view, event.nativeEvent.layout.y);
    };

  return (
    <>
      <View className='mx-5 mt-4' onLayout={layout('calendar')}>
        <CalendarTabContent
          completedDates={completedDates}
          habit={habit}
          habitColor={habitColor}
          pendingToggleDate={pendingToggleDate}
          onDayPress={onDayPress}
        />
      </View>

      <View className='mx-5 mt-5' onLayout={layout('goal')}>
        <GoalTabContent habit={habit} />
      </View>

      {habit.createdAt ? (
        <View className='mx-5 mt-5' onLayout={layout('strength')}>
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
    </>
  );
}
