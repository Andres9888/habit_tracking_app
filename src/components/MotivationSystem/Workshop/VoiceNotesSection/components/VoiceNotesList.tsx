/**
 * VoiceNotesList Component
 * Displays list of existing voice notes with expandable playback
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import { VoiceNoteItem } from './VoiceNoteItem';
import type { VoiceNoteSummary } from '../VoiceNotesSection.types';

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
  const { colors } = useThemeColors();

  if (voiceNotes.length === 0) {
    return null;
  }

  const displayNotes = voiceNotes.slice(0, 3);
  const hasMore = voiceNotes.length > 3;

  return (
    <View className='mt-4 border-t pt-4' style={{ borderColor: colors.border }}>
      <View className='mb-2 flex-row items-center justify-between'>
        <Text className='text-sm font-medium' style={{ color: colors.text.secondary }}>
          Your Recordings ({voiceNotes.length})
        </Text>
        {hasMore ? <Pressable
            accessibilityLabel={`View all ${voiceNotes.length} recordings`}
            accessibilityRole='button'
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            onPress={onViewAllNotes}
          >
            <Text className='text-xs font-medium' style={{ color: colors.status.success }}>View All</Text>
          </Pressable> : null}
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
