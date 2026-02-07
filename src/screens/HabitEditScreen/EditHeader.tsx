/**
 * EditHeader Component
 *
 * Header bar for the habit edit screen with cancel and save actions.
 * Handles safe area padding for notched devices.
 */

import { View, Pressable, Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

interface EditHeaderProps {
  paddingTop: number;
  onCancel: () => void;
  onSave: () => void;
}

export function EditHeader({ paddingTop, onCancel, onSave }: EditHeaderProps) {
  return (
    <View
      className='flex-row items-center justify-between border-b border-stone-200 bg-stone-50 px-4 pb-3'
      style={{ paddingTop }}
    >
      <Pressable
        accessibilityLabel='Cancel'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full'
        onPress={onCancel}
      >
        <ChevronLeft color='#1c1917' size={24} strokeWidth={2} />
      </Pressable>

      <Pressable
        accessibilityLabel='Save changes'
        accessibilityRole='button'
        className='rounded-full bg-emerald-600 px-5 py-2.5 shadow-md'
        onPress={onSave}
      >
        <Text className='text-[15px] font-semibold text-white'>Save</Text>
      </Pressable>
    </View>
  );
}
