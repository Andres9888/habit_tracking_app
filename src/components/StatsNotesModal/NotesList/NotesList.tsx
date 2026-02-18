/**
 * NotesList Component
 * Main notes list with search, filtering, and CRUD operations
 */

import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import NoteEditor from '../NoteEditor';
import type { NotesListProps } from './NotesList.types';
import { useNotesList } from './useNotesList';
import {
  NotesHeader,
  SearchInput,
  HabitFilter,
  VisualizationGuideButton,
  VisualizationModal,
  NotesGrouped,
} from './components';

export default function NotesList({
  hideHabitFilter = false,
  initialHabitId,
}: NotesListProps) {
  const { colors: themeColors } = useThemeColors();
  const state = useNotesList(initialHabitId);
  const { isAdding, setIsAdding, editingNote, setEditingNoteId, isLoading } =
    state;

  if (isLoading) {
    return (
      <View className='items-center justify-center py-12'>
        <ActivityIndicator color={themeColors.accent} size='large' />
      </View>
    );
  }

  if (isAdding) {
    return (
      <View>
        <NoteEditor
          onCancel={() => setIsAdding(false)}
          onSave={() => setIsAdding(false)}
        />
      </View>
    );
  }

  if (editingNote) {
    return (
      <View>
        <NoteEditor
          initialBody={editingNote.body}
          initialDate={editingNote.date}
          initialHabitId={editingNote.habitId}
          noteId={editingNote._id}
          onCancel={() => setEditingNoteId(null)}
          onSave={() => setEditingNoteId(null)}
        />
      </View>
    );
  }

  const hasFilters = state.searchText || state.selectedHabitFilter !== 'all';

  return (
    <View className='gap-4'>
      <NotesHeader onAddNote={() => setIsAdding(true)} />
      <SearchInput
        value={state.searchText}
        onChangeText={state.setSearchText}
      />

      {!hideHabitFilter && (
        <HabitFilter
          habits={state.habits}
          selectedFilter={state.selectedHabitFilter}
          onFilterChange={state.setSelectedHabitFilter}
        />
      )}

      <VisualizationGuideButton onPress={state.handleOpenVisualizationGuide} />

      {state.groupedNotes.length === 0 ? (
        <View className='items-center py-8'>
          <Text className='text-center text-sm text-stone-500'>
            {hasFilters
              ? 'No notes found'
              : 'No notes yet. Add your first note!'}
          </Text>
        </View>
      ) : (
        <NotesGrouped
          deletingNoteId={state.deletingNoteId}
          groupedNotes={state.groupedNotes}
          habits={state.habits}
          onDelete={state.handleDelete}
          onEdit={setEditingNoteId}
        />
      )}

      <VisualizationModal
        visible={state.showVisualizationGuide}
        onClose={state.handleCloseVisualizationGuide}
      />
    </View>
  );
}
