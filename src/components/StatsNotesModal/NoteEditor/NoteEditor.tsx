/**
 * NoteEditor Component
 *
 * Form for creating and editing notes with optional habit linking.
 */

import { Text, TextInput, View } from 'react-native';
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

  const { colors } = useThemeColors();

  return (
    <View className='gap-4'>
      <View className='gap-2'>
        <Text className='text-xs font-semibold uppercase tracking-[2px]' style={{ color: colors.text.tertiary }}>
          {isEditing ? 'EDIT NOTE' : 'NEW NOTE'}
        </Text>

        {!isEditing && (
          <>
            <TextInput
              accessibilityLabel='Note date'
              className='w-full rounded-2xl border px-4 py-3 text-sm font-medium'
              placeholder='YYYY-MM-DD'
              placeholderTextColor={colors.text.tertiary}
              returnKeyType='next'
              style={{ borderColor: colors.border, backgroundColor: colors.card, color: colors.text.primary }}
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
          className='min-h-[120px] w-full rounded-2xl border px-4 py-3 text-sm font-medium'
          placeholder='Write your note here...'
          placeholderTextColor={colors.text.tertiary}
          style={{ borderColor: colors.border, backgroundColor: colors.card, color: colors.text.primary }}
          textAlignVertical='top'
          value={body}
          onChangeText={setBody}
        />

        <View className='flex-row justify-between'>
          <Text
            className={`text-xs ${
              characterCount > 1000 ? 'text-red-500' : ''
            }`}
            style={characterCount <= 1000 ? { color: colors.text.tertiary } : undefined}
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
