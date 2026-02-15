/**
 * SaveButton Component
 * Footer save button for the affirmation editor
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { Check, Plus } from 'lucide-react-native';
import { clsx } from 'clsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SaveButtonProps {
  isEditing: boolean;
  canSave: boolean;
  isSaving: boolean;
  onSave: () => void;
}

export function SaveButton({
  isEditing,
  canSave,
  isSaving,
  onSave,
}: SaveButtonProps) {
  const insets = useSafeAreaInsets();
  return (
    <View className='border-t border-stone-100 px-4 pt-4' style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}>
      <Pressable
        accessibilityLabel={isEditing ? 'Save changes' : 'Add affirmation'}
        accessibilityRole='button'
        accessibilityState={{ disabled: !canSave || isSaving }}
        className={clsx(
          'flex-row items-center justify-center gap-2 rounded-xl py-4',
          canSave && !isSaving ? 'bg-amber-500' : 'bg-stone-200'
        )}
        disabled={!canSave || isSaving}
        style={({ pressed }) => ({ opacity: pressed && canSave && !isSaving ? 0.8 : 1 })}
        onPress={onSave}
      >
        {isEditing ? (
          <Check
            className={canSave && !isSaving ? 'text-white' : 'text-stone-400'}
            size={20}
          />
        ) : (
          <Plus
            className={canSave && !isSaving ? 'text-white' : 'text-stone-400'}
            size={20}
          />
        )}
        <Text
          className={clsx(
            'text-base font-semibold',
            canSave && !isSaving ? 'text-white' : 'text-stone-400'
          )}
        >
          {isSaving
            ? 'Saving...'
            : isEditing
              ? 'Save Changes'
              : 'Add Affirmation'}
        </Text>
      </Pressable>
    </View>
  );
}
