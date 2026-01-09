/** HabitDetailScreen - Calendar-focused Habit Detail Page */

import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modal } from '../../components/Modal';
import {
  DetailHeader,
  HabitDetailContent,
  NotesListModal,
  NotesEditorModal,
  UndoToasts,
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
  const safeTop = insets.top || 44;

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
        style={{ paddingTop: safeTop }}
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
      <NotesListModal
        habitId={habit._id}
        insets={insets}
        isOpen={state.isNotesListOpen}
        onClose={() => state.setIsNotesListOpen(false)}
      />
      <NotesEditorModal
        editingNote={state.editingNote}
        habitId={habit._id}
        insets={insets}
        isOpen={state.isNotesEditorOpen}
        onClose={notesHandlers.handleCloseNotesEditor}
      />
      <UndoToasts
        habitName={habit.name}
        pendingArchive={state.pendingArchive}
        pendingDelete={state.pendingDelete}
        onConfirmArchive={calendarHandlers.handleConfirmArchive}
        onConfirmDelete={calendarHandlers.handleConfirmDelete}
        onDismissDelete={() => state.setPendingDelete(false)}
        onUndoArchive={calendarHandlers.handleUndoArchive}
        onUndoDelete={calendarHandlers.handleUndoDelete}
      />
    </Modal>
  );
}
