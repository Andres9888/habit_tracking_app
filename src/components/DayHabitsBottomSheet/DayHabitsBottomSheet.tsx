import { Modal, Pressable, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColors } from '../../theme/ThemeContext';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { DragHandle, EmptyState, HabitList, SheetHeader } from './components';
import { getSheetContainerStyle } from './styles';
import type { DayHabitsBottomSheetProps } from './types';
import { useDayHabitsSheet } from './useDayHabitsSheet';
import { useSheetAnimations } from './useSheetAnimations';

/**
 * DayHabitsBottomSheet - iOS-style bottom sheet for viewing and toggling habits on a specific day.
 *
 * Features:
 * - Drag handle for visual affordance
 * - Header with formatted date and "Today" badge
 * - Scrollable list of habits with toggle checkboxes
 * - Done button to close
 * - Spring animations for slide up/down
 * - Backdrop fade to 40% black
 * - Dismiss via tap outside, drag down, or Done button
 * - Haptic feedback on toggle
 * - Empty state when no habits exist
 * - Full accessibility support
 */
export function DayHabitsBottomSheet({
  date,
  visible,
  onClose,
  habits,
  getHabitStatus,
  toggleHabit,
  reduceMotion = false,
}: DayHabitsBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { triggerLightImpact } = useHapticFeedback({});

  const {
    dateInfo,
    handleBackdropPress,
    handleDonePress,
    handleToggleHabit,
    togglingHabitId,
  } = useDayHabitsSheet({ date, onClose, toggleHabit });

  const { backdropStyle, panGesture, sheetStyle } = useSheetAnimations({
    onClose,
    reduceMotion,
    triggerLightImpact,
    visible,
  });

  const hasValidDate = dateInfo.dateString.trim().length > 0;

  // Compute completion count for header
  const completedCount = hasValidDate
    ? habits.filter(
        (habit) => getHabitStatus(habit._id, dateInfo.dateString) === 'done'
      ).length
    : 0;

  return (
    <Modal
      accessibilityViewIsModal
      statusBarTranslucent
      transparent
      animationType='none'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-end'>
        <Pressable
          accessible={false}
          className='absolute inset-0'
          onPress={handleBackdropPress}
        >
          <Animated.View className='flex-1 bg-black' style={backdropStyle} />
        </Pressable>

        <GestureDetector gesture={panGesture}>
          <View collapsable={false}>
            <Animated.View
              className='rounded-t-3xl'
              style={[
                getSheetContainerStyle(insets.bottom),
                { backgroundColor: colors.surface },
                sheetStyle,
              ]}
            >
              <DragHandle />

              <SheetHeader
                completedCount={completedCount}
                displayDate={dateInfo.displayDate}
                isToday={dateInfo.isToday}
                totalCount={habits.length}
                onDonePress={handleDonePress}
              />

              {habits.length === 0 || !hasValidDate ? (
                <EmptyState />
              ) : (
                <HabitList
                  dateString={dateInfo.dateString}
                  getHabitStatus={getHabitStatus}
                  habits={habits}
                  reduceMotion={reduceMotion}
                  togglingHabitId={togglingHabitId}
                  onToggleHabit={handleToggleHabit}
                />
              )}
            </Animated.View>
          </View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

export default DayHabitsBottomSheet;
