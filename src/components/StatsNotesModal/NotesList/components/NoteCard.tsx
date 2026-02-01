/**
 * NoteCard Component
 * Individual note item with edit and delete actions
 */

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import { Trash2, Edit3 } from 'lucide-react-native';
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

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  habitName,
  isDeleting,
  onEdit,
  onDelete,
}) => (
  <View className='gap-2 rounded-2xl bg-stone-50 p-4'>
    {habitName && (
      <View className='mb-1'>
        <Text className='text-xs font-semibold text-stone-600'>
          {habitName}
        </Text>
      </View>
    )}
    <Text className='text-sm leading-5 text-stone-900'>{note.body}</Text>
    <View className='flex-row items-center justify-between'>
      <Text className='text-xs text-stone-400'>
        {note.updatedAt === note.createdAt
          ? `Created ${format(note.createdAt, 'MMM d, h:mm a')}`
          : `Updated ${format(note.updatedAt, 'MMM d, h:mm a')}`}
      </Text>
      <View className='flex-row gap-2'>
        <TouchableOpacity
          accessibilityLabel='Edit note'
          accessibilityRole='button'
          activeOpacity={0.7}
          className='rounded-full bg-stone-200 p-2'
          disabled={isDeleting}
          onPress={onEdit}
        >
          <Edit3 color='#57534e' size={14} strokeWidth={2.25} />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel='Delete note'
          accessibilityRole='button'
          activeOpacity={0.7}
          className='rounded-full bg-red-100 p-2'
          disabled={isDeleting}
          onPress={onDelete}
        >
          {isDeleting ? (
            <ActivityIndicator color='#ef4444' size='small' />
          ) : (
            <Trash2 color='#ef4444' size={14} strokeWidth={2.25} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
