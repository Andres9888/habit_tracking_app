/**
 * DangerZone Component
 *
 * Destructive actions section for habit management.
 * Provides archive (recoverable) and delete (permanent) options
 * with appropriate visual warnings.
 */

import { View, Text, Pressable } from 'react-native';
import { Trash2, Archive } from 'lucide-react-native';

interface DangerZoneProps {
  onArchive: () => void;
  onDelete: () => void;
}

export function DangerZone({ onArchive, onDelete }: DangerZoneProps) {
  return (
    <View className='mt-8 border-t border-stone-200 pt-6'>
      <Text
        className='mb-4 text-center text-xs font-semibold text-stone-400'
        style={{ letterSpacing: 0.5 }}
      >
        MANAGE
      </Text>

      <Pressable
        accessibilityLabel='Archive habit'
        accessibilityRole='button'
        className='mb-3 flex-row items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-4'
        onPress={onArchive}
      >
        <Archive color='#d97706' size={18} strokeWidth={2} />
        <Text className='text-base font-medium text-amber-700'>
          Archive Habit
        </Text>
      </Pressable>

      <Pressable
        accessibilityLabel='Delete habit'
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-4'
        onPress={onDelete}
      >
        <Trash2 color='#dc2626' size={18} strokeWidth={2} />
        <Text className='text-base font-medium text-red-600'>Delete Habit</Text>
      </Pressable>
    </View>
  );
}
