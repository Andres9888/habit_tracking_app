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
import { useThemeColors } from '../../../../theme/ThemeContext';
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
  const { colors } = useThemeColors();
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
    <View className='rounded-2xl border-l-4 p-4' style={{ borderLeftColor: colors.status.warning, backgroundColor: colors.card }}>
      <SectionHeader bestStreak={bestStreak} />

      {/* Science callout */}
      <View className='mb-3 rounded-lg p-2' style={{ backgroundColor: colors.status.warningLight }}>
        <Text className='text-center text-xs italic' style={{ color: colors.status.warning }}>
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
      <Text className='mt-2 text-center text-sm font-medium' style={{ color: colors.status.warningText }}>
        This was you at your best. You can get there again.
      </Text>
    </View>
  );
}

export default PreviousStreakVoiceNotes;
