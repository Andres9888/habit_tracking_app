/**
 * NoteCard Component
 * Individual note item with edit and delete actions
 */

import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import { Trash2, Edit3 } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
import type { Id } from '../../../../../convex/_generated/dataModel';

interface NoteCardProps {
  note: {
    _id: Id<'notes'>;
    body: string;
    createdAt: number;
    updatedAt: number;
  };
  habitName?: string;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = React.memo(({
  note,
  habitName,
  isDeleting,
  onEdit,
  onDelete,
}) => {
  const { colors } = useThemeColors();
  const dateLabel = useMemo(() => {
    if (note.updatedAt === note.createdAt) {
      return `Created ${format(note.createdAt, 'MMM d, h:mm a')}`;
    }
    return `Updated ${format(note.updatedAt, 'MMM d, h:mm a')}`;
  }, [note.createdAt, note.updatedAt]);
  return (
    <View className='gap-2 rounded-2xl p-4' style={{ backgroundColor: colors.gray[50] }}>
      {habitName && (
        <View className='mb-1'>
          <Text className='text-xs font-semibold' style={{ color: colors.text.secondary }}>
            {habitName}
          </Text>
        </View>
      )}
      <Text className='text-sm leading-5' style={{ color: colors.text.primary }}>{note.body}</Text>
      <View className='flex-row items-center justify-between'>
        <Text className='text-xs' style={{ color: colors.text.tertiary }}>
          {dateLabel}
        </Text>
        <View className='flex-row gap-2'>
          <AnimatedPressable
            accessibilityLabel='Edit note'
            accessibilityRole='button'
            className='rounded-full p-2'
            style={{ backgroundColor: colors.gray[200] }}
            disableAnimation={isDeleting}
            disabled={isDeleting}
            onPress={onEdit}
          >
            <Edit3 color={colors.text.secondary} size={14} strokeWidth={2.25} />
          </AnimatedPressable>
          <AnimatedPressable
            accessibilityLabel='Delete note'
            accessibilityRole='button'
            className='rounded-full bg-red-100 p-2'
            disableAnimation={isDeleting}
            disabled={isDeleting}
            onPress={onDelete}
          >
            {isDeleting ? (
              <ActivityIndicator color='#ef4444' size='small' />
            ) : (
              <Trash2 color='#ef4444' size={14} strokeWidth={2.25} />
            )}
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
});
