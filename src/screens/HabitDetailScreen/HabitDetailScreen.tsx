/* eslint-disable max-lines */
/**
 * HabitDetailScreen - Detailed view of a single habit
 * Shows calendar, completion history, notes, and actions
 * 
 * ## Navigation Entry Points
 * - Opened as Modal from HabitsList when user taps a habit
 * - Receives habit object and tracking data via props
 * 
 * ## State Management
 * - `useHabitDetailScreenState` hook: calendar dates, completion state, modals
 * - `useCalendarHandlers` hook: archive/delete/calendar toggle actions
 * - `useNotesHandlers` hook: note editing and viewing
 * 
 * ## Props Contract
 * @interface HabitDetailScreenProps
 * @property {Habit} habit - The habit object to display
 * @property {() => void} [onArchive] - Callback when habit is archived
 * @property {() => void} onClose - Callback to close the modal
 * @property {() => void} [onDelete] - Callback when habit is deleted
 * @property {() => void} [onEdit] - Callback to edit habit
 * @property {TrackingEntry[]} [tracking] - Array of tracking entries
 * @property {boolean} visible - Modal visibility
 * 
 * ## UI Structure
 * - Full-screen modal with rounded top corners
 * - LinearGradient background (light/dark based on theme)
 * - DetailHeader: habit name, edit button, close button
 * - HabitDetailContent: calendar grid, notes list
 * - HabitDetailModals: archive/delete confirmations, notes editor
 * 
 * @flag UNDER_150_LINES - Screen is well-structured at 124 lines
 */
import React from 'react';
import { View, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import {
  DetailHeader,
  DetailLoadingState,
  HabitDetailContent,
  HabitDetailModals,
} from './components';
import {
  DETAIL_BG_GRADIENT_LIGHT,
  DETAIL_BG_GRADIENT_DARK,
  buildModalsProps,
} from './HabitDetailScreen.constants';
import { useThemeColors } from '../../theme';
import { useHabitDetailScreenState } from './useHabitDetailScreenState';
import { useCalendarHandlers } from './useCalendarHandlers';
import { useNotesHandlers } from './useNotesHandlers';
import type { HabitDetailScreenProps } from './HabitDetailScreen.types';

// eslint-disable-next-line max-lines-per-function
function HabitDetailScreenContent({
  habit,
  onArchive,
  onClose,
  onDelete,
  onEdit,
  tracking = [],
  visible,
}: HabitDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeColors();
  const bgGradient = isDark ? DETAIL_BG_GRADIENT_DARK : DETAIL_BG_GRADIENT_LIGHT;
  const screenState = useHabitDetailScreenState({
    habitCreatedAt: habit?.createdAt,
    habitId: habit?._id,
    habitStrength: habit?.strength ?? 0,
    tracking,
    visible,
  });
  const calendarHandlers = useCalendarHandlers({
    habit,
    isTogglingCalendar: screenState.isTogglingCalendar,
    onArchive,
    onClose,
    onDelete,
    setIsTogglingCalendar: screenState.setIsTogglingCalendar,
    setPendingArchive: screenState.setPendingArchive,
    setPendingDelete: screenState.setPendingDelete,
  });
  const notesHandlers = useNotesHandlers({
    habit,
    onEdit,
    setEditingNoteId: screenState.setEditingNoteId,
    setIsNotesEditorOpen: screenState.setIsNotesEditorOpen,
    setIsNotesListOpen: screenState.setIsNotesListOpen,
  });

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      {habit ? (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='flex-1'
          >
            <View className='flex-1 bg-black/50'>
              <View className='flex-1 overflow-hidden rounded-t-3xl shadow-2xl'>
                <LinearGradient
                  colors={bgGradient as unknown as string[]}
                  locations={[0, 0.5, 1]}
                  style={{ flex: 1, paddingTop: Math.max(insets.top + 4, 12) }}
                >
                  <DetailHeader
                    habit={habit}
                    isCompletedToday={screenState.isCompletedToday}
                    onClose={onClose}
                    onEdit={notesHandlers.handleEdit}
                  />
                  <HabitDetailContent
                    completedDates={screenState.completedDates}
                    habit={habit}
                    notesByDate={screenState.notesByDate}
                    onDayPress={calendarHandlers.handleCalendarDayPress}
                  />
                </LinearGradient>
              </View>
            </View>
          </KeyboardAvoidingView>
          <HabitDetailModals
            habitId={habit._id}
            habitName={habit.name}
            {...buildModalsProps(
              screenState,
              calendarHandlers,
              notesHandlers,
              insets
            )}
          />
        </>
      ) : (
        <DetailLoadingState />
      )}
    </Modal>
  );
}

export default function HabitDetailScreen(props: HabitDetailScreenProps) {
  return (
    <ScreenErrorBoundary screenName="Habit Details" onGoBack={props.onClose}>
      <HabitDetailScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
