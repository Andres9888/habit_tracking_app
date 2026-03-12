/* eslint-disable max-lines */
import React, { useCallback, memo } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import { springs } from '@/theme/animations';
import DraggableHabit from '../../../components/DraggableHabit';
import type { Habit, HabitStatus } from '../types';
import type { UseHabitRenderItemArgs } from './useHabitRenderItem.types';

type HabitRenderContentProps = {
  item: Habit;
  isActive: boolean;
  entranceDelay: number;
  triggerEntrance: boolean;
  weekStatus: HabitStatus[];
  streak: number;
  isConnectedToNextWeek: boolean;
  isConnectedToPreviousWeek: boolean;
  drag?: () => void;
  showHabitStrengthPercentage: boolean;
  handlePause?: (habitId: string) => void;
  handleResume?: (habitId: string) => void;
} & Pick<
  UseHabitRenderItemArgs,
  | 'celebrationsEnabled'
  | 'compactView'
  | 'completionIcon'
  | 'dayShape'
  | 'entranceVariant'
  | 'handleArchive'
  | 'handleHabitPress'
  | 'highlightHabitId'
  | 'isReorderingEnabled'
  | 'notifyWeekCompletion'
  | 'onHabitEntranceComplete'
  | 'reduceMotionPreference'
  | 'isSelectionMode'
  | 'selectedIds'
  | 'onToggleSelection'
  | 'showConnectors'
  | 'toggleHabit'
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
  entranceVariant,
  handleArchive,
  handleHabitPress,
  handlePause,
  handleResume,
  highlightHabitId,
  isReorderingEnabled,
  isSelectionMode,
  selectedIds,
  onToggleSelection,
  notifyWeekCompletion,
  onHabitEntranceComplete,
  reduceMotionPreference,
  showConnectors,
  showHabitStrengthPercentage,
  toggleHabit,
  weekDateStrings,
}: HabitRenderContentProps) {
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

  const handleLongPress = isSelectionMode ? undefined : (isReorderingEnabled ? drag : undefined);
  const handleToggle = useCallback(() => onToggleSelection?.(item._id), [onToggleSelection, item._id]);

  // Animated style for the active drag state
  const activeStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 0.92 : 1, { duration: 150 }),
    transform: [
      {
        scale: withSpring(isActive ? 1.03 : 1, springs.sheet),
      },
    ],
    ...(isActive
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 16,
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
      <Animated.View className={compactView ? 'mb-2' : 'mb-5'} style={activeStyle}>
        <DraggableHabit
          celebrationsEnabled={celebrationsEnabled}
          completionIcon={completionIcon}
          isCompactMode={compactView}
          dayShape={dayShape}
          entranceDelay={entranceDelay}
          entranceVariant={entranceVariant}
          habit={item}
          isConnectedToNextWeek={isConnectedToNextWeek}
          isConnectedToPreviousWeek={isConnectedToPreviousWeek}
          isJustCreated={highlightHabitId === item._id}
          isPaused={item.paused ?? false}
          reduceMotionPreference={reduceMotionPreference}
          showConnectors={showConnectors}
          showHabitStrengthPercentage={showHabitStrengthPercentage ?? false}
          streak={streak}
          toggleHabit={toggleHabit}
          triggerEntrance={triggerEntrance}
          weekDateStrings={weekDateStrings}
          weekStatus={weekStatus}
          isSelected={isSelectionMode ? selectedIds?.has(item._id) : undefined}
          showSelectionOverlay={isSelectionMode}
          onArchive={isSelectionMode ? undefined : handleArchive}
          onEntranceComplete={handleEntranceComplete}
          onLongPress={handleLongPress}
          onPause={handlePause}
          onPress={isSelectionMode ? undefined : handleHabitPress}
          onToggleSelection={isSelectionMode ? handleToggle : undefined}
          onResume={handleResume}
          onWeekComplete={handleWeekComplete}
        />
      </Animated.View>
    </ScaleDecorator>
  );
}

export const HabitRenderContent = memo(HabitRenderContentComponent);
