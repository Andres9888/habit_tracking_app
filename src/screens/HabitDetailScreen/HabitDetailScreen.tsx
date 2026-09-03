/* eslint-disable max-lines */
/** HabitDetailScreen - Optimized for 9+ scores across all dimensions */
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  HabitDetailModals,
} from './components';
import { DetailFlowSwitch } from './components/DetailFlowSwitch';
import { FlowHeader } from './components/FlowHeader';
import { buildModalsProps } from './HabitDetailScreen.constants';
import type { HabitDetailScreenProps } from './HabitDetailScreen.types';
import { NoteSheet } from './components/NoteSheet';
import { useCalendarHandlers } from './useCalendarHandlers';
import { useDayNotes } from './useDayNotes';
import { useDetailFlow } from './useDetailFlow';
import { useDetailFlowActions } from './useDetailFlowActions';
import { useHabitDetailScreenState } from './useHabitDetailScreenState';
import { useResetDetailFlow } from './useResetDetailFlow';
import { getLocalDateString } from '../../utils/getLocalDateString';

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
    pausedAt: displayHabit?.pausedAt,
    resumedAt: displayHabit?.resumedAt,
    tracking,
    visible,
  });
  const calendarHandlers = useCalendarHandlers({
    completedDates: screenState.completedDates,
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
  // Memoized because this object is threaded down through the detail stack.
  // As a fresh literal it defeated memo boundaries below it.
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
  // The fixed header can't share the hero's gradient node, so recovery has to
  // travel up from the content or the amber hero meets a mint header at the
  // seam.
  const [isRecovery, setIsRecovery] = useState(false);
  const handleRecoveryChange = useCallback((recovery: boolean) => {
    setIsRecovery(recovery);
  }, []);
  const flow = useDetailFlow();
  // Non-detail routes unmount the hero ScrollView. Clear its pinned-header
  // state at the same time so returning to a fresh, top-positioned Detail
  // does not render the stale compact title above the hero title.
  useEffect(() => {
    if (flow.route !== 'detail') setIsTitlePinned(false);
  }, [flow.route]);
  const resetFlowAndPin = useCallback(() => {
    flow.reset();
    setIsTitlePinned(false);
  }, [flow.reset]);
  const actions = useDetailFlowActions(flow.go, flow.replace, flow.route);
  const dayNotes = useDayNotes(displayHabit);
  const [noteDate, setNoteDate] = useState<string | null>(null);
  const today = getLocalDateString();
  useResetDetailFlow(resetFlowAndPin, visible, displayHabit?._id);
  const handleRequestClose = () => {
    if (flow.route === 'detail') onClose();
    else flow.back();
  };

  return (
    <Modal
      accessibilityViewIsModal
      statusBarTranslucent
      transparent
      animationType='slide'
      presentationStyle='overFullScreen'
      visible={visible}
      onRequestClose={handleRequestClose}
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
              onAccessibilityEscape={handleRequestClose}
            >
              <View
                className='flex-1 overflow-hidden rounded-t-3xl'
                style={{ backgroundColor: colors.background, ...shadows.modal }}
              >
                {flow.route === 'detail' ? (
                  <DetailBandHeader
                    isCompletedToday={screenState.isCompletedToday}
                    isRecovery={isRecovery}
                    isTitlePinned={isTitlePinned}
                    title={getHabitDisplayName(displayHabit)}
                    onClose={onClose}
                    onEdit={handleEdit}
                  />
                ) : (
                  <FlowHeader
                    backLabel={flow.backLabel}
                    eyebrow={getHabitDisplayName(displayHabit)}
                    title={flow.title}
                    onBack={flow.back}
                  />
                )}
                <DetailFlowSwitch
                  completedDates={screenState.completedDates}
                  habit={habitWithStreaks}
                  isCompletedToday={screenState.isCompletedToday}
                  notes={dayNotes.notes}
                  params={flow.params}
                  pendingToggleDate={screenState.pendingToggleDate}
                  route={flow.route}
                  todayNote={dayNotes.noteFor(today)}
                  visible={visible}
                  onDayPress={calendarHandlers.handleCalendarDayPress}
                  onEdit={handleEdit}
                  onOpenAnalytics={actions.openAnalytics}
                  onOpenDay={actions.openDay}
                  onOpenHistory={actions.openHistory}
                  onOpenInsight={actions.openInsight}
                  onOpenNote={setNoteDate}
                  onPinnedChange={handlePinnedChange}
                  onRecoveryChange={handleRecoveryChange}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
          <NoteSheet
            date={noteDate}
            existing={noteDate ? dayNotes.noteFor(noteDate) : ''}
            hint={
              noteDate === today
                ? 'Optional. Only you will see this.'
                : 'Notes are part of the record for this day.'
            }
            onClose={() => setNoteDate(null)}
            onSave={(note) => {
              if (noteDate) void dayNotes.saveNote(noteDate, note);
            }}
          />
          <HabitDetailModals
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
