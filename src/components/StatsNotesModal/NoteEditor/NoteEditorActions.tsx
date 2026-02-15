/**
 * NoteEditorActions Component
 *
 * Cancel and save/add buttons for the note editor.
 */

import { ActivityIndicator, Text, View } from 'react-native';

import type { NoteEditorActionsProps } from './types';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

export function NoteEditorActions({
  isValid,
  isSaving,
  isEditing,
  onCancel,
  onSave,
}: NoteEditorActionsProps) {
  return (
    <View className='flex-row items-center justify-end gap-3'>
      <AnimatedPressable
        accessibilityLabel='Cancel'
        accessibilityRole='button'
        className='py-2'
        disableAnimation={isSaving}
        disabled={isSaving}
        onPress={onCancel}
      >
        <Text className='text-xs font-semibold tracking-[2px] text-stone-500'>
          CANCEL
        </Text>
      </AnimatedPressable>
      <AnimatedPressable
        accessibilityLabel={isEditing ? 'Save note' : 'Add note'}
        accessibilityRole='button'
        className={`rounded-3xl border border-stone-900 px-4 py-2.5 ${
          !isValid || isSaving ? 'opacity-40' : ''
        }`}
        disableAnimation={!isValid || isSaving}
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
      </AnimatedPressable>
    </View>
  );
}
