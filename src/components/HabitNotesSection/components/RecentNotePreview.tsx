import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';
import { Edit3 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import type { Doc } from '../../../../convex/_generated/dataModel';

interface RecentNotePreviewProps {
  note: Doc<'notes'>;
  onEdit: (note: Doc<'notes'>) => void;
}

export function RecentNotePreview({ note, onEdit }: RecentNotePreviewProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit(note);
  };

  return (
    <AnimatedPressable
      accessibilityLabel={`Most recent note: ${note.body.slice(0, 50)}`}
      accessibilityRole='button'
      className='rounded-xl border border-stone-100 bg-stone-50/50 p-4 active:bg-stone-100'
      onPress={handlePress}
    >
      <View className='mb-2 flex-row items-center justify-between'>
        <Text className='text-xs font-medium text-stone-500'>
          {format(new Date(note.date), 'MMM d, yyyy')}
        </Text>
        <Edit3 className='text-stone-400' size={14} />
      </View>
      <Text className='text-sm leading-5 text-stone-700' numberOfLines={3}>
        {note.body}
      </Text>
    </AnimatedPressable>
  );
}
