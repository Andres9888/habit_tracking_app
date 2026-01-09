import React from 'react';
import { View, Text } from 'react-native';
import { Mic, Sparkles } from 'lucide-react-native';

import { VoiceNotePlaybackUI } from '../../Workshop/VoiceNotePlaybackUI';
import type { Day1VoiceNoteData } from '../RescueMode.types';

interface FeaturedVoiceNoteProps {
  voiceNote: Day1VoiceNoteData;
  onPlayStart?: () => void;
  onPlayFinish?: () => void;
  reduceMotion?: boolean;
}

/**
 * FeaturedVoiceNote - Prominently displays Day 1 voice note for emotional reconnection
 *
 * Scientific Basis:
 * - Voice has 40% higher emotional recall than text (cognitive psychology)
 * - Hearing your own voice from Day 1 creates powerful emotional anchor
 * - This is particularly effective in Rescue Mode when motivation is low
 */
export function FeaturedVoiceNote({
  voiceNote,
  onPlayStart,
  onPlayFinish,
  reduceMotion = false,
}: FeaturedVoiceNoteProps) {
  // Calculate how long ago the note was recorded
  const daysAgo = Math.floor(
    (Date.now() - voiceNote.createdAt) / (1000 * 60 * 60 * 24)
  );

  return (
    <View className='rounded-2xl border-l-4 border-l-teal-400 bg-gradient-to-br from-teal-50 to-emerald-50 p-5'>
      {/* Header */}
      <View className='mb-3 flex-row items-center gap-2'>
        <View className='h-10 w-10 items-center justify-center rounded-xl bg-teal-100'>
          <Mic className='text-teal-600' size={20} />
        </View>
        <View className='flex-1'>
          <Text className='text-lg font-bold text-teal-800'>
            Hear Your Day 1 Self
          </Text>
          {daysAgo > 0 && (
            <Text className='text-xs text-teal-600'>
              {daysAgo} day{daysAgo === 1 ? '' : 's'} ago
            </Text>
          )}
        </View>
        <View className='flex-row items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5'>
          <Sparkles className='text-amber-600' size={12} />
          <Text className='text-xs font-medium text-amber-700'>Day 1</Text>
        </View>
      </View>

      {/* Voice Note Playback UI */}
      <VoiceNotePlaybackUI
        isDay1
        audioUri={voiceNote.audioUrl}
        initialDuration={voiceNote.duration}
        label={voiceNote.label}
        reduceMotion={reduceMotion}
        showSpeedControl={false}
        onPlayFinish={onPlayFinish}
        onPlayStart={onPlayStart}
      />

      {/* Motivational text */}
      <Text className='mt-3 text-sm italic text-teal-600'>
        Listen to the voice that made the commitment. That's still you.
      </Text>
    </View>
  );
}
