/* eslint-disable max-lines */
import React, { useCallback, memo } from 'react';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import type { Id } from '../../../../convex/_generated/dataModel';
import DraggableHabit from '../../../components/DraggableHabit';
import type { Habit, HabitStatus } from '../types';
import type { UseHabitRenderItemArgs } from './useHabitRenderItem.types';
import { isOptimisticHabitId } from './optimisticHabitCreationStore';
import { durations } from '@/theme/animations';

type HabitRenderContentProps = {
  item: Habit;
  isActive: boolean;
  entranceDelay: number;
  triggerEntrance: boolean;
  weekStatus: HabitStatus[];
  streak: number;
  isConnectedToNextWeek: boolean;
  isConnectedToPreviousWeek: boolean;
  isHighlighted: boolean;
  holdHighlight: boolean;
  drag?: () => void;
  showHabitStrengthPercentage: boolean;
  handlePause?: (habitId: Id<'habits'>) => void;
  handleResume?: (habitId: Id<'habits'>) => void;
} & Pick<
  UseHabitRenderItemArgs,
  | 'celebrationsEnabled'
  | 'compactView'
  | 'completionIcon'
  | 'dayShape'
  | 'deferHeavyContent'
  | 'entranceVariant'
  | 'handleArchive'
  | 'handleDelete'
  | 'handleHabitPress'
  | 'isReorderingEnabled'
  | 'notifyWeekCompletion'
  | 'onHabitEntranceComplete'
  | 'reduceMotionPreference'
  | 'isSelectionMode'
  | 'selectedIds'
  | 'onToggleSelection'
  | 'showConnectors'
  | 'showGradientFill'
  | 'toggleHabit'
  | 'userProgressEmojis'
  | 'weekDateStrings'
>;

function HabitRenderContentComponent({
  item,
  isActive,
  entranceDelay,
  triggerEntrance,
  weekStatus,
  streak,
  isConnectedToNextWeek,
  isConnectedToPreviousWeek,
  drag,
  celebrationsEnabled,
  compactView,
  completionIcon,
  dayShape,
  deferHeavyContent,
  entranceVariant,
  handleArchive,
  handleDelete,
  handleHabitPress,
  handlePause,
  handleResume,
  isHighlighted,
  holdHighlight,
  isReorderingEnabled,
  isSelectionMode,
  selectedIds,
  onToggleSelection,
  notifyWeekCompletion,
  onHabitEntranceComplete,
  reduceMotionPreference,
  showConnectors,
  showGradientFill,
  showHabitStrengthPercentage,
  toggleHabit,
  userProgressEmojis,
  weekDateStrings,
}: HabitRenderContentProps) {
  const isOptimisticHabit = isOptimisticHabitId(item._id);

  // Memoize callbacks to prevent recreating on every render
  const handleEntranceComplete = useCallback(() => {
    onHabitEntranceComplete?.(item._id);
  }, [onHabitEntranceComplete, item._id]);

  const handleWeekComplete = useCallback(
    ({ completedDate }: { completedDate: string }) => {
      notifyWeekCompletion({ completedDate, habit: item });
    },
    [notifyWeekCompletion, item]
  );

  const handleLongPress = isSelectionMode
    ? undefined
    : isOptimisticHabit
      ? undefined
      : isReorderingEnabled
        ? drag
        : undefined;
  const handleToggle = useCallback(
    () => onToggleSelection?.(item._id),
    [onToggleSelection, item._id]
  );
  const handleToggleHabit = useCallback(
    (args: Parameters<typeof toggleHabit>[0]) => {
      if (isOptimisticHabit) return;
      void toggleHabit(args);
    },
    [isOptimisticHabit, toggleHabit]
  );

  // Animated style for the active drag state — no scale to avoid GPU blur.
  // At rest the opacity is a plain 1, not `withTiming(1)`: a card mounted
  // during a heavy commit (the focus remount) can have its first animated
  // prop update dropped and stay at the pre-animation value — i.e. invisible.
  // Only the drag-dim transition is animated.
  const activeStyle = useAnimatedStyle(() => ({
    opacity: isActive ? withTiming(0.92, { duration: durations.quick }) : 1,
    ...(isActive
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.22,
          shadowRadius: 24,
          elevation: 12,
          zIndex: 999,
        }
      : {
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
          zIndex: 0,
        }),
  }));

  return (
    <ScaleDecorator activeScale={1}>
      <Animated.View
        className={compactView ? 'mb-2' : 'mb-5'}
        style={activeStyle}
      >
        <DraggableHabit
          celebrationsEnabled={celebrationsEnabled}
          completionIcon={completionIcon}
          isCompactMode={compactView}
          dayShape={dayShape}
          deferHeavyContent={deferHeavyContent}
          entranceDelay={entranceDelay}
          entranceVariant={entranceVariant}
          habit={item}
          isConnectedToNextWeek={isConnectedToNextWeek}
          isConnectedToPreviousWeek={isConnectedToPreviousWeek}
          isJustCreated={isHighlighted}
          holdHighlight={holdHighlight}
          isPaused={item.paused ?? false}
          reduceMotionPreference={reduceMotionPreference}
          showConnectors={showConnectors}
          showGradientFill={showGradientFill}
          showHabitStrengthPercentage={showHabitStrengthPercentage ?? false}
          streak={streak}
          toggleHabit={handleToggleHabit}
          triggerEntrance={triggerEntrance}
          userProgressEmojis={userProgressEmojis}
          weekDateStrings={weekDateStrings}
          weekStatus={weekStatus}
          isSelected={isSelectionMode ? selectedIds?.has(item._id) : undefined}
          showSelectionOverlay={isSelectionMode}
          onArchive={
            isSelectionMode || isOptimisticHabit ? undefined : handleArchive
          }
          onDelete={
            isSelectionMode || isOptimisticHabit ? undefined : handleDelete
          }
          onEntranceComplete={handleEntranceComplete}
          onLongPress={handleLongPress}
          onPause={isOptimisticHabit ? undefined : handlePause}
          onPress={
            isSelectionMode || isOptimisticHabit ? undefined : handleHabitPress
          }
          onToggleSelection={isSelectionMode ? handleToggle : undefined}
          onResume={isOptimisticHabit ? undefined : handleResume}
          onWeekComplete={handleWeekComplete}
        />
      </Animated.View>
    </ScaleDecorator>
  );
}

export const HabitRenderContent = memo(HabitRenderContentComponent);
