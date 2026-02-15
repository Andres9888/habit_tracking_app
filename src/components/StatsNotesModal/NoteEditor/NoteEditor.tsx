/**
 * NoteEditor Component
 *
 * Form for creating and editing notes with optional habit linking.
 */

import { Text, TextInput, View } from 'react-native';
import { colors } from '@/theme/colors';

import { HabitSelector } from './HabitSelector';
import { NoteEditorActions } from './NoteEditorActions';
import type { NoteEditorProps } from './types';
import { useNoteEditor } from './useNoteEditor';

export default function NoteEditor({
  noteId,
  initialBody = '',
  initialDate,
  initialHabitId,
  onCancel,
  onSave,
}: NoteEditorProps) {
  const {
    body,
    setBody,
    date,
    setDate,
    selectedHabitId,
    setSelectedHabitId,
    habits,
    isSaving,
    error,
    characterCount,
    isValid,
    isEditing,
    handleSave,
  } = useNoteEditor({
    initialBody,
    initialDate,
    initialHabitId,
    noteId,
    onSaveComplete: onSave,
  });

  return (
    <View className='gap-4'>
      <View className='gap-2'>
        <Text className='text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
          {isEditing ? 'EDIT NOTE' : 'NEW NOTE'}
        </Text>

        {!isEditing && (
          <>
            <TextInput
              accessibilityLabel='Note date'
              className='w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-900'
              placeholder='YYYY-MM-DD'
              placeholderTextColor={colors.gray[400]}
              returnKeyType='next'
              value={date}
              onChangeText={setDate}
            />

            <HabitSelector
              habits={habits}
              selectedHabitId={selectedHabitId}
              onSelectHabit={setSelectedHabitId}
            />
          </>
        )}

        <TextInput
          multiline
          accessibilityLabel='Note body'
          className='min-h-[120px] w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-900'
          placeholder='Write your note here...'
          placeholderTextColor={colors.gray[400]}
          textAlignVertical='top'
          value={body}
          onChangeText={setBody}
        />

        <View className='flex-row justify-between'>
          <Text
            className={`text-xs ${
              characterCount > 1000 ? 'text-red-500' : 'text-stone-500'
            }`}
          >
            {characterCount} / 1000 characters
          </Text>
        </View>

        {error ? <Text className='text-sm text-red-500'>{error}</Text> : null}
      </View>

      <NoteEditorActions
        isEditing={isEditing}
        isSaving={isSaving}
        isValid={isValid}
        onCancel={onCancel}
        onSave={handleSave}
      />
    </View>
  );
}
