import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { format } from 'date-fns';
import { Edit3 } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';

interface RecentNotePreviewProps {
  note: Doc<'notes'>;
  onEdit: (note: Doc<'notes'>) => void;
}

export function RecentNotePreview({ note, onEdit }: RecentNotePreviewProps) {
  const handlePress = () => {
    triggerHaptic('tap');
    onEdit(note);
  };

  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel={`Most recent note: ${note.body.slice(0, 50)}`}
      accessibilityRole='button'
      className='rounded-xl border p-4'
      style={{
        borderColor: colors.cardBorder,
        backgroundColor: colors.gray[50],
      }}
      onPress={handlePress}
    >
      <View className='mb-2 flex-row items-center justify-between'>
        <Text
          className='text-xs font-medium'
          style={{ color: colors.text.tertiary }}
        >
          {format(new Date(note.date), 'MMM d, yyyy')}
        </Text>
        <Edit3 color={colors.text.tertiary} size={14} />
      </View>
      <Text
        className='text-sm leading-5'
        numberOfLines={3}
        style={{ color: colors.text.primary }}
      >
        {note.body}
      </Text>
    </Pressable>
  );
}
