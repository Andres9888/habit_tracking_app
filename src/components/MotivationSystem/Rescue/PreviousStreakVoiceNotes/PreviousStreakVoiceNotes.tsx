/**
 * PreviousStreakVoiceNotes Component
 * Displays voice notes from the user's best streak period during rescue mode
 *
 * Scientific Basis:
 * - Voice has 40% higher emotional recall than text (cognitive psychology)
 * - Reconnecting with "peak motivation self" during struggle creates powerful anchor
 * - Hearing your own voice from when you were most committed reinforces identity
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SectionHeader } from './SectionHeader';
import { StreakVoiceNoteCard } from './StreakVoiceNoteCard';
import type { PreviousStreakVoiceNotesProps } from './types';
import { triggerHaptic } from '@/utils/haptics';

export function PreviousStreakVoiceNotes({
  voiceNotes,
  bestStreak,
  onPlayStart,
  onPlayFinish,
  reduceMotion = false,
}: PreviousStreakVoiceNotesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Auto-expand the first note on mount (the one from highest streak day)
  useEffect(() => {
    if (voiceNotes.length > 0 && expandedId === null) {
      setExpandedId(voiceNotes[0].id);
    }
  }, [voiceNotes, expandedId]);

  const handleToggleExpand = useCallback(
    (id: string) => {
      if (expandedId === id) {
        setExpandedId(null);
      } else {
        setExpandedId(id);
        triggerHaptic('tap');
      }
    },
    [expandedId]
  );

  if (voiceNotes.length === 0) {
    return null;
  }

  return (
    <View className='rounded-2xl border-l-4 border-l-amber-400 bg-white p-4'>
      <SectionHeader bestStreak={bestStreak} />

      {/* Science callout */}
      <View className='mb-3 rounded-lg bg-amber-50 p-2'>
        <Text className='text-center text-xs italic text-amber-600'>
          Hearing your voice from when you were most committed creates a
          powerful reconnection
        </Text>
      </View>

      {/* Voice note cards */}
      <View>
        {voiceNotes.map((note) => (
          <StreakVoiceNoteCard
            key={note.id}
            bestStreak={bestStreak}
            isExpanded={expandedId === note.id}
            reduceMotion={reduceMotion}
            voiceNote={note}
            onPlayFinish={onPlayFinish}
            onPlayStart={onPlayStart}
            onToggleExpand={() => handleToggleExpand(note.id)}
          />
        ))}
      </View>

      {/* Encouragement */}
      <Text className='mt-2 text-center text-sm font-medium text-amber-700'>
        This was you at your best. You can get there again.
      </Text>
    </View>
  );
}

export default PreviousStreakVoiceNotes;
