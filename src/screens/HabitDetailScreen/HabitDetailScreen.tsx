/* eslint-disable max-lines */
/** HabitDetailScreen - Optimized for 9+ scores across all dimensions */
import { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, View } from 'react-native';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors } from '../../theme';
import { overlays } from '../../theme/colors';
import { shadows } from '../../theme/spacing';
import { api } from '../../../convex/_generated/api';
import { useCachedQuery } from '../../lib/queryCache';
import {
  DetailBandHeader,
  DetailLoadingState,
  getHabitDisplayName,
  HabitDetailContent,
  HabitDetailModals,
} from './components';
import { buildModalsProps } from './HabitDetailScreen.constants';
import type { HabitDetailScreenProps } from './HabitDetailScreen.types';
import { useCalendarHandlers } from './useCalendarHandlers';
import { useHabitDetailScreenState } from './useHabitDetailScreenState';

// Module-scoped so the default prop is referentially stable. As an inline `[]`
// literal it was a new array on every render, which meant the tracking-keyed
// useMemo in useHabitDetailScreenState could never hold whenever the prop was
// omitted.
const NO_TRACKING: NonNullable<HabitDetailScreenProps['tracking']> = [];

// eslint-disable-next-line max-lines-per-function
function HabitDetailScreenContent({
  editOverlay,
  habit,
  onArchive,
  onClose,
  onDelete,
  onEdit,
  tracking = NO_TRACKING,
  visible,
}: HabitDetailScreenProps) {
  const { colors } = useThemeColors();
  const fetchedHabit = useCachedQuery(
    api.habits.get,
    visible && habit ? { habitId: habit._id } : 'skip',
    { entryName: 'habits.get' }
  );
  // The detail modal stays mounted across habit switches; never let a payload
  // for a different habit win over the list-seeded habit prop.
  const fullHabit =
    fetchedHabit && fetchedHabit._id === habit?._id ? fetchedHabit : undefined;
  const displayHabit = fullHabit ?? habit;
  const screenState = useHabitDetailScreenState({
    bestStreak: displayHabit?.bestStreak ?? 0,
    currentStreak: displayHabit?.currentStreak ?? 0,
    habitId: displayHabit?._id,
    tracking,
    visible,
  });
  const calendarHandlers = useCalendarHandlers({
    habit: displayHabit,
    onArchive,
    onClose,
    onDelete,
    setPendingArchive: screenState.setPendingArchive,
    setPendingDelete: screenState.setPendingDelete,
    setPendingToggleDate: screenState.setPendingToggleDate,
  });
  const handleEdit = () => {
    if (displayHabit) onEdit?.(displayHabit);
  };
  // Memoized because this object is threaded down through HabitDetailContent →
  // HabitDetailSections → ThisWeekCard / MonthHeatmapCard etc. As a
  // fresh literal it defeated every memo boundary below it, so each scroll tick
  // (which flips isTitlePinned) rebuilt the whole detail stack including the
  // 42-cell month grid.
  const habitWithStreaks = useMemo(
    () =>
      displayHabit
        ? {
            ...displayHabit,
            bestStreak: screenState.bestStreak,
            currentStreak: screenState.currentStreak,
          }
        : undefined,
    [displayHabit, screenState.bestStreak, screenState.currentStreak]
  );
  const [isTitlePinned, setIsTitlePinned] = useState(false);
  const handlePinnedChange = useCallback((pinned: boolean) => {
    setIsTitlePinned(pinned);
  }, []);

  return (
    <Modal
      accessibilityViewIsModal
      statusBarTranslucent
      transparent
      animationType='slide'
      presentationStyle='overFullScreen'
      visible={visible}
      onRequestClose={onClose}
    >
      {displayHabit && habitWithStreaks ? (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='flex-1'
          >
            <View
              className='flex-1'
              style={{ backgroundColor: overlays.scrim }}
            >
              <View
                className='flex-1 overflow-hidden rounded-t-3xl'
                style={{ backgroundColor: colors.background, ...shadows.modal }}
              >
                <DetailBandHeader
                  isCompletedToday={screenState.isCompletedToday}
                  isTitlePinned={isTitlePinned}
                  title={getHabitDisplayName(displayHabit)}
                  onClose={onClose}
                  onEdit={handleEdit}
                />
                <HabitDetailContent
                  completedDates={screenState.completedDates}
                  habit={habitWithStreaks}
                  isCompletedToday={screenState.isCompletedToday}
                  pendingToggleDate={screenState.pendingToggleDate}
                  visible={visible}
                  onDayPress={calendarHandlers.handleCalendarDayPress}
                  onEdit={handleEdit}
                  onPinnedChange={handlePinnedChange}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
          <HabitDetailModals
            habitId={displayHabit._id}
            habitName={displayHabit.name}
            {...buildModalsProps(screenState, calendarHandlers)}
          />
        </>
      ) : (
        <DetailLoadingState />
      )}
      {editOverlay}
    </Modal>
  );
}

export default function HabitDetailScreen(props: HabitDetailScreenProps) {
  return (
    <ScreenErrorBoundary screenName='Habit Details' onGoBack={props.onClose}>
      <HabitDetailScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
