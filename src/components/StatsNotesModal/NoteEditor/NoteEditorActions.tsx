/**
 * NoteEditorActions Component
 *
 * Cancel and save/add buttons for the note editor.
 */

import { ActivityIndicator, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';

import type { NoteEditorActionsProps } from './types';

export function NoteEditorActions({
  isValid,
  isSaving,
  isEditing,
  onCancel,
  onSave,
}: NoteEditorActionsProps) {
  const { colors: themeColors } = useThemeColors();

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
        <Text
          className='text-xs font-semibold tracking-[2px]'
          style={{ color: themeColors.text.secondary }}
        >
          CANCEL
        </Text>
      </AnimatedPressable>
      <AnimatedPressable
        accessibilityLabel={isEditing ? 'Save note' : 'Add note'}
        accessibilityRole='button'
        className='rounded-3xl px-4 py-2.5'
        disableAnimation={!isValid || isSaving}
        disabled={!isValid || isSaving}
        style={{
          borderColor: themeColors.text.primary,
          borderWidth: 1,
          opacity: !isValid || isSaving ? 0.4 : 1,
        }}
        onPress={onSave}
      >
        {isSaving ? (
          <ActivityIndicator color={themeColors.text.primary} size='small' />
        ) : (
          <Text
            className='text-xs font-semibold tracking-[2px]'
            style={{ color: themeColors.text.primary }}
          >
            {isEditing ? 'SAVE' : 'ADD'}
          </Text>
        )}
      </AnimatedPressable>
    </View>
  );
}
