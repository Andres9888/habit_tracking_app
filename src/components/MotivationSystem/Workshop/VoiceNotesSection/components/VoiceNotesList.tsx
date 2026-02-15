/**
 * VoiceNotesList Component
 * Displays list of existing voice notes with expandable playback
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import type { VoiceNoteSummary } from '../VoiceNotesSection.types';
import { VoiceNoteItem } from './VoiceNoteItem';

interface VoiceNotesListProps {
  voiceNotes: VoiceNoteSummary[];
  onViewAllNotes: () => void;
  onPlayStart?: (noteId: string) => void;
  onPlayFinish?: (noteId: string) => void;
  reduceMotion?: boolean;
}

export function VoiceNotesList({
  voiceNotes,
  onViewAllNotes,
  onPlayStart,
  onPlayFinish,
  reduceMotion = false,
}: VoiceNotesListProps) {
  if (voiceNotes.length === 0) {
    return null;
  }

  const displayNotes = voiceNotes.slice(0, 3);
  const hasMore = voiceNotes.length > 3;

  return (
    <View className='mt-4 border-t border-stone-100 pt-4'>
      <View className='mb-2 flex-row items-center justify-between'>
        <Text className='text-sm font-medium text-stone-600'>
          Your Recordings ({voiceNotes.length})
        </Text>
        {hasMore && (
          <Pressable
            accessibilityLabel={`View all ${voiceNotes.length} recordings`}
            accessibilityRole='button'
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            onPress={onViewAllNotes}
          >
            <Text className='text-xs font-medium text-teal-600'>View All</Text>
          </Pressable>
        )}
      </View>
      <View className='gap-2'>
        {displayNotes.map((note) => (
          <VoiceNoteItem
            key={note.id}
            note={note}
            reduceMotion={reduceMotion}
            onPlayFinish={() => onPlayFinish?.(note.id)}
            onPlayStart={() => onPlayStart?.(note.id)}
          />
        ))}
      </View>
    </View>
  );
}
