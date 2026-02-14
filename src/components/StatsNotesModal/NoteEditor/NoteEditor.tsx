/**
 * NoteEditor Component
 *
 * Form for creating and editing notes with optional habit linking.
 * Dark mode aware via ThemedTextInput.
 */

import { Text, View } from 'react-native';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import { useThemeColors } from '@/theme/ThemeContext';

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
  const { colors } = useThemeColors();
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
        <Text
          className='text-xs font-semibold uppercase tracking-[2px]'
          style={{ color: colors.text.secondary }}
        >
          {isEditing ? 'EDIT NOTE' : 'NEW NOTE'}
        </Text>

        {!isEditing && (
          <>
            <ThemedTextInput
              accessibilityLabel='Note date'
              placeholder='YYYY-MM-DD'
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

        <ThemedTextInput
          multiline
          accessibilityLabel='Note body'
          placeholder='Write your note here...'
          style={{ minHeight: 120, textAlignVertical: 'top' }}
          value={body}
          onChangeText={setBody}
        />

        <View className='flex-row justify-between'>
          <Text
            className='text-xs'
            style={{
              color: characterCount > 1000 ? '#EF4444' : colors.text.secondary,
            }}
          >
            {characterCount} / 1000 characters
          </Text>
        </View>

        {error ? (
          <Text className='text-sm' style={{ color: '#EF4444' }}>
            {error}
          </Text>
        ) : null}
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
