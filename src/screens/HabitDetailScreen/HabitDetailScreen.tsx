/**
 * HabitDetailScreen Component
 * Calendar-focused Habit Detail Page - Main orchestration file
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modal } from '../../components/Modal';
import { MonthlyCalendarGrid } from '../../components/BinaryHeatmap';
import { HabitStrengthSection } from '../../components/HabitStrengthSection';
import {
  DetailHeader,
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

        <ScrollView
          bounces
          className='flex-1'
          contentContainerClassName='p-4 pb-8'
          showsVerticalScrollIndicator={false}
        >
          {habit.createdAt && (
            <HabitStrengthSection
              completedDates={state.completedDates}
              habitColor={habit.iconColor}
              habitCreatedAt={habit.createdAt}
              habitId={habit._id}
              habitStrength={habit.strength}
            />
          )}
          <MonthlyCalendarGrid
            completedDates={state.completedDates}
            habitColor={habit.iconColor ?? '#10b981'}
            habitCreatedAt={habit.createdAt}
            habitId={habit._id}
            onDayPress={calendarHandlers.handleCalendarDayPress}
          />
        </ScrollView>
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
