import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, Sparkles } from 'lucide-react-native';

import { useThemeColors } from '../../../../../theme/ThemeContext';
import { VoiceNotePlaybackUI } from '../../../Workshop/VoiceNotePlaybackUI';
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
  const { colors } = useThemeColors();
  // Calculate how long ago the note was recorded
  const daysAgo = Math.floor(
    (Date.now() - voiceNote.createdAt) / (1000 * 60 * 60 * 24)
  );

  return (
    <View className='rounded-2xl border-l-4 p-5' style={{ borderLeftColor: colors.status.success }}>
      <LinearGradient
        className='absolute inset-0 rounded-2xl'
        colors={['#f0fdfa', '#ecfdf5']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      />
      {/* Header */}
      <View className='mb-3 flex-row items-center gap-2'>
        <View className='h-10 w-10 items-center justify-center rounded-xl' style={{ backgroundColor: colors.status.successLight }}>
          <Mic color={colors.status.success} size={20} />
        </View>
        <View className='flex-1'>
          <Text className='text-lg font-bold' style={{ color: colors.status.successText }}>
            Hear Your Day 1 Self
          </Text>
          {daysAgo > 0 ? <Text className='text-xs' style={{ color: colors.status.success }}>
              {daysAgo} day{daysAgo === 1 ? '' : 's'} ago
            </Text> : null}
        </View>
        <View className='flex-row items-center gap-1 rounded-full px-2 py-0.5' style={{ backgroundColor: colors.status.warningLight }}>
          <Sparkles color={colors.status.warning} size={12} />
          <Text className='text-xs font-medium' style={{ color: colors.status.warningText }}>Day 1</Text>
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
      <Text className='mt-3 text-sm italic' style={{ color: colors.status.success }}>
        Listen to the voice that made the commitment. That's still you.
      </Text>
    </View>
  );
}
