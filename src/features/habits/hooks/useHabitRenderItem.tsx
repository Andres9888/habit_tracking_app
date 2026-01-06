import { useCallback } from 'react';
import { View } from 'react-native';
import { addDays, format, parse } from 'date-fns';
import { ScaleDecorator, type RenderItemParams } from 'react-native-draggable-flatlist';
import DraggableHabit from '../../../components/DraggableHabit';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitStatus } from '../types';
import type { HabitCardEntranceVariant } from '../../../components/HabitCard/useHabitCardEntrance';

interface UseHabitRenderItemArgs {
  celebrationsEnabled: boolean;
  completionIcon: 'chain' | 'checkbox';
  dayShape?: 'circle' | 'square';
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  getStreak: (habitId: string) => number;
  handleArchive: (habitId: Id<'habits'>) => Promise<void> | void;
  handleHabitPress: (habit: Habit) => void;
  highlightHabitId?: Id<'habits'> | null;
  isReorderingEnabled: boolean;
  notifyWeekCompletion: (args: { habit: Habit; completedDate: string }) => void;
  reduceMotionPreference: boolean;
  showConnectors?: boolean;
  showHabitStrengthPercentage: boolean;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<unknown> | void;
  weekDateStrings: string[];
  /**
   * Animation variant for habit card entrance.
   * @default 'accentSlideDown'
   */
  entranceVariant?: HabitCardEntranceVariant;
  /**
   * Base stagger delay per card (multiplied by index).
   * @default 100
   */
  entranceStaggerDelay?: number;
  /**
   * Whether entrance animation should trigger.
   * Set to true after success transition completes.
   * @default false
   */
  shouldTriggerEntrance?: boolean;
  /**
   * Set of habit IDs that have already appeared (to prevent re-animation).
   */
  seenHabitIds?: Set<string>;
  /**
   * Callback to mark a habit as "seen" after its entrance animation.
   */
  onHabitEntranceComplete?: (habitId: Id<'habits'>) => void;
}

export function useHabitRenderItem({
  celebrationsEnabled,
  completionIcon,
  dayShape = 'square',
  getHabitStatus,
  getStreak,
  handleArchive,
  handleHabitPress,
  highlightHabitId,
  isReorderingEnabled,
  notifyWeekCompletion,
  reduceMotionPreference,
  showConnectors = true,
  showHabitStrengthPercentage,
  toggleHabit,
  weekDateStrings,
  entranceVariant = 'accentSlideDown',
  entranceStaggerDelay = 100,
  shouldTriggerEntrance = false,
  seenHabitIds,
  onHabitEntranceComplete,
}: UseHabitRenderItemArgs) {
  return useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<Habit>) => {
      // Calculate stagger delay based on item index
      const index = getIndex?.() ?? 0;
      const entranceDelay = index * entranceStaggerDelay;

      // Only trigger entrance if:
      // 1. shouldTriggerEntrance is true (post success transition)
      // 2. This habit hasn't been seen before (prevents re-animation on re-renders)
      const hasBeenSeen = seenHabitIds?.has(item._id) ?? false;
      const triggerEntrance = shouldTriggerEntrance && !hasBeenSeen;
      const weekStatus = weekDateStrings.map((dateString) =>
        getHabitStatus(item._id, dateString)
      );
      const streak = getStreak(item._id);

      // Check if previous day was completed to show connecting chain
      const firstDateString = weekDateStrings[0];
      let isConnectedToPreviousWeek = false;

      if (firstDateString) {
        try {
          const firstDate = parse(firstDateString, 'yyyy-MM-dd', new Date());
          const previousDate = addDays(firstDate, -1);
          const previousDateString = format(previousDate, 'yyyy-MM-dd');
          isConnectedToPreviousWeek = getHabitStatus(item._id, previousDateString) === 'done';
        } catch (e) {
          console.warn('Error calculating previous date status', e);
        }
      }

      return (
        <ScaleDecorator>
          <View
            className='mb-5'
            style={{
              opacity: isActive ? 0.7 : 1,
            }}
          >
            <DraggableHabit
              celebrationsEnabled={celebrationsEnabled}
              completionIcon={completionIcon}
              dayShape={dayShape}
              entranceDelay={entranceDelay}
              entranceVariant={entranceVariant}
              habit={item}
              isConnectedToPreviousWeek={isConnectedToPreviousWeek}
              isJustCreated={highlightHabitId === item._id}
              onArchive={handleArchive}
              onEntranceComplete={() => onHabitEntranceComplete?.(item._id)}
              onLongPress={isReorderingEnabled ? drag : undefined}
              onPress={handleHabitPress}
              onWeekComplete={({ completedDate }) =>
                notifyWeekCompletion({ completedDate, habit: item })
              }
              reduceMotionPreference={reduceMotionPreference}
              showConnectors={showConnectors}
              showHabitStrengthPercentage={showHabitStrengthPercentage}
              streak={streak}
              toggleHabit={toggleHabit}
              triggerEntrance={triggerEntrance}
              weekDateStrings={weekDateStrings}
              weekStatus={weekStatus}
            />
          </View>
        </ScaleDecorator>
      );
    },
    [
      celebrationsEnabled,
      completionIcon,
      dayShape,
      entranceStaggerDelay,
      entranceVariant,
      getHabitStatus,
      getStreak,
      handleArchive,
      handleHabitPress,
      highlightHabitId,
      isReorderingEnabled,
      notifyWeekCompletion,
      onHabitEntranceComplete,
      reduceMotionPreference,
      seenHabitIds,
      shouldTriggerEntrance,
      showConnectors,
      showHabitStrengthPercentage,
      toggleHabit,
      weekDateStrings,
    ]
  );
}
