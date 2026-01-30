/**
 * NoteEditorActions Component
 *
 * Cancel and save/add buttons for the note editor.
 */

import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import type { NoteEditorActionsProps } from './types';

export function NoteEditorActions({
  isValid,
  isSaving,
  isEditing,
  onCancel,
  onSave,
}: NoteEditorActionsProps) {
  return (
    <View className='flex-row items-center justify-end gap-3'>
      <TouchableOpacity
        accessibilityRole='button'
        className='py-2'
        disabled={isSaving}
        onPress={onCancel}
      >
        <Text className='text-xs font-semibold tracking-[2px] text-stone-500'>
          CANCEL
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole='button'
        className={`rounded-3xl border border-stone-900 px-5 py-2 ${
          !isValid || isSaving ? 'opacity-40' : ''
        }`}
        disabled={!isValid || isSaving}
        onPress={onSave}
      >
        {isSaving ? (
          <ActivityIndicator color='#1c1917' size='small' />
        ) : (
          <Text className='text-xs font-semibold tracking-[2px] text-stone-900'>
            {isEditing ? 'SAVE' : 'ADD'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
