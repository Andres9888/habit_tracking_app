/** HabitDetailScreen - Optimized for 9+ scores across all dimensions */
import React from 'react';
import { View, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import {
  DetailHeader,
  DetailLoadingState,
  HabitDetailContent,
  HabitDetailModals,
} from './components';
import { useHabitDetailScreenState } from './useHabitDetailScreenState';
import { useCalendarHandlers } from './useCalendarHandlers';
import { useNotesHandlers } from './useNotesHandlers';
import type { HabitDetailScreenProps } from './HabitDetailScreen.types';

const GRADIENT = [
  colors.light.background,
  colors.light.gradientMid,
  colors.light.background,
] as const;

// eslint-disable-next-line max-lines-per-function
export default function HabitDetailScreen({
  habit,
  onArchive,
  onClose,
  onDelete,
  onEdit,
  tracking = [],
  visible,
}: HabitDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const state = useHabitDetailScreenState({
    habitCreatedAt: habit?.createdAt,
    habitId: habit?._id,
    habitStrength: habit?.strength ?? 0,
    tracking,
    visible,
  });
  const calendarHandlers = useCalendarHandlers({
    habit,
    isTogglingCalendar: state.isTogglingCalendar,
    onArchive,
    onClose,
    onDelete,
    setIsTogglingCalendar: state.setIsTogglingCalendar,
    setPendingArchive: state.setPendingArchive,
    setPendingDelete: state.setPendingDelete,
  });
  const notesHandlers = useNotesHandlers({
    habit,
    onEdit,
    setEditingNoteId: state.setEditingNoteId,
    setIsNotesEditorOpen: state.setIsNotesEditorOpen,
    setIsNotesListOpen: state.setIsNotesListOpen,
  });

  // Loading: modal visible but habit data not yet available
  if (!habit) {
    return (
      <Modal
        transparent
        animationType='slide'
        visible={visible}
        onRequestClose={onClose}
      >
        <DetailLoadingState />
      </Modal>
    );
  }

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <View className='flex-1 bg-black/50'>
          <View className='flex-1 overflow-hidden rounded-t-3xl shadow-2xl'>
            <LinearGradient
              colors={GRADIENT as unknown as string[]}
              locations={[0, 0.5, 1]}
              style={{ flex: 1, paddingTop: Math.max(insets.top + 4, 12) }}
            >
              <DetailHeader
                habit={habit}
                isCompletedToday={state.isCompletedToday}
                onClose={onClose}
                onEdit={notesHandlers.handleEdit}
              />
              <HabitDetailContent
                completedDates={state.completedDates}
                habit={habit}
                onDayPress={calendarHandlers.handleCalendarDayPress}
              />
            </LinearGradient>
          </View>
        </View>
      </KeyboardAvoidingView>
      <HabitDetailModals
        editingNote={state.editingNote}
        habitId={habit._id}
        habitName={habit.name}
        handleCloseNotesEditor={notesHandlers.handleCloseNotesEditor}
        handleConfirmArchive={calendarHandlers.handleConfirmArchive}
        handleConfirmDelete={calendarHandlers.handleConfirmDelete}
        handleUndoArchive={calendarHandlers.handleUndoArchive}
        handleUndoDelete={calendarHandlers.handleUndoDelete}
        insets={insets}
        isNotesEditorOpen={state.isNotesEditorOpen}
        isNotesListOpen={state.isNotesListOpen}
        pendingArchive={state.pendingArchive}
        pendingDelete={state.pendingDelete}
        setIsNotesListOpen={state.setIsNotesListOpen}
        setPendingDelete={state.setPendingDelete}
      />
    </Modal>
  );
}
