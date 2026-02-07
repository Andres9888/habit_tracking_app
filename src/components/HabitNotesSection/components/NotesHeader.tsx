import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StickyNote, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../theme/colors';

interface NotesHeaderProps {
  noteCount: number;
  onAddNote: () => void;
}

export function NotesHeader({ noteCount, onAddNote }: NotesHeaderProps) {
  const handleAddNote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddNote();
  };

  return (
    <View className='mb-3 flex-row items-center justify-between'>
      <View className='flex-row items-center gap-2'>
        <View className='size-10 items-center justify-center rounded-xl bg-amber-100'>
          <StickyNote className='text-amber-500' size={20} strokeWidth={2} />
        </View>
        <View>
          <View className='flex-row items-center gap-2'>
            <Text className='font-semibold text-stone-800'>Notes</Text>
            {noteCount > 0 && (
              <View
                accessibilityLabel={`${noteCount} ${noteCount === 1 ? 'note' : 'notes'}`}
                className='rounded-full bg-amber-100 px-2 py-0.5'
              >
                <Text className='text-xs font-medium text-amber-700'>
                  {noteCount}
                </Text>
              </View>
            )}
          </View>
          <Text className='text-xs text-stone-500'>
            Track what works for you
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel='Add note'
        accessibilityRole='button'
        className='rounded-full bg-amber-500 px-4 py-2 active:bg-amber-600'
        onPress={handleAddNote}
      >
        <View className='flex-row items-center gap-1'>
          <Plus color={colors.text.inverse} size={16} strokeWidth={2} />
          <Text className='text-xs font-semibold text-white'>Add</Text>
        </View>
      </Pressable>
    </View>
  );
}
