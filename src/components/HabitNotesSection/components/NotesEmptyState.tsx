import React from 'react';
import { Text, Pressable } from 'react-native';
import { StickyNote } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface NotesEmptyStateProps {
  onAddNote: () => void;
}

export function NotesEmptyState({ onAddNote }: NotesEmptyStateProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddNote();
  };

  return (
    <Pressable
      accessibilityLabel='Add your first note'
      accessibilityRole='button'
      className='items-center rounded-xl bg-amber-50/50 py-6 active:bg-amber-50'
      onPress={handlePress}
    >
      <StickyNote className='mb-2 text-amber-200' size={28} />
      <Text className='text-center text-sm text-stone-500'>
        Record insights to learn what works best
      </Text>
      <Text className='mt-1 text-xs font-medium text-amber-600'>
        Add your first note
      </Text>
    </Pressable>
  );
}
