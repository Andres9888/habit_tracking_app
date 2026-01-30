/** HabitDetailScreen - Calendar-focused Habit Detail Page */

import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modal } from '../../components/Modal';
import {
  DetailHeader,
  HabitDetailContent,
  HabitDetailModals,
} from './components';
import { useHabitDetailScreenState } from './useHabitDetailScreenState';
import { useCalendarHandlers } from './useCalendarHandlers';
import { useNotesHandlers } from './useNotesHandlers';
import type { HabitDetailScreenProps } from './HabitDetailScreen.types';

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

  if (!habit) return null;

  return (
    <Modal
      disableGestureClose
      disableBackdropClose={false}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
    >
      <View
        className='flex-1 bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100'
        style={{ paddingTop: insets.top || 44 }}
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
      </View>
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
