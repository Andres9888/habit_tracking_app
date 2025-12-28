/**
 * PreviousStreakVoiceNotes Component
 * Displays voice notes from the user's best streak period during rescue mode
 *
 * Scientific Basis:
 * - Voice has 40% higher emotional recall than text (cognitive psychology)
 * - Reconnecting with "peak motivation self" during struggle creates powerful anchor
 * - Hearing your own voice from when you were most committed reinforces identity
 *
 * Part of the Motivation System - Rescue phase
 * Story: Streak Recovery with Voice Note from past self
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Flame,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Mic,
} from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';

import { VoiceNotePlaybackUI } from '../Workshop/VoiceNotePlaybackUI';

// Animation spring configs
const SPRING_BUTTON = { damping: 15, stiffness: 300 };

/**
 * Voice note with streak context data
 */
export interface StreakVoiceNoteData {
  /** Voice note ID */
  id: string;
  /** Audio URI for playback */
  audioUrl: string;
  /** Duration in seconds */
  duration: number;
  /** Optional label */
  label?: string;
  /** When the note was created */
  createdAt: number;
  /** Which day of the streak this was recorded (1-indexed) */
  streakAtRecording: number;
  /** How many days ago this was recorded */
  daysAgo: number;
}

export interface PreviousStreakVoiceNotesProps {
  /** Voice notes from the best streak period */
  voiceNotes: StreakVoiceNoteData[];
  /** The user's best streak (for context display) */
  bestStreak: number;
  /** Called when any voice note playback starts */
  onPlayStart?: () => void;
  /** Called when any voice note playback finishes */
  onPlayFinish?: () => void;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
}

/**
 * Individual voice note card with streak context
 */
function StreakVoiceNoteCard({
  voiceNote,
  bestStreak,
  isExpanded,
  onToggleExpand,
  onPlayStart,
  onPlayFinish,
  reduceMotion = false,
}: {
  voiceNote: StreakVoiceNoteData;
  bestStreak: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onPlayStart?: () => void;
  onPlayFinish?: () => void;
  reduceMotion?: boolean;
}) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, SPRING_BUTTON);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleExpand();
  }, [onToggleExpand]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Format days ago text
  const daysAgoText =
    voiceNote.daysAgo === 0
      ? 'Today'
      : voiceNote.daysAgo === 1
        ? 'Yesterday'
        : `${voiceNote.daysAgo} days ago`;

  return (
    <Animated.View
      className='mb-3 overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50'
      style={animatedStyle}
    >
      {/* Header - always visible, expandable */}
      <Pressable
        accessibilityLabel={`Voice note from day ${voiceNote.streakAtRecording} of ${bestStreak} day streak, recorded ${daysAgoText}. ${isExpanded ? 'Collapse' : 'Expand'} to play.`}
        accessibilityRole='button'
        className='flex-row items-center justify-between p-3'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View className='flex-1 flex-row items-center gap-3'>
          {/* Mic icon with streak badge */}
          <View className='relative'>
            <View className='h-10 w-10 items-center justify-center rounded-full bg-amber-100'>
              <Mic className='text-amber-600' size={18} />
            </View>
            {/* Streak day badge */}
            <View className='absolute -bottom-1 -right-1 flex-row items-center gap-0.5 rounded-full bg-orange-500 px-1.5 py-0.5'>
              <Flame className='text-white' size={10} />
              <Text className='text-[10px] font-bold text-white'>
                {voiceNote.streakAtRecording}
              </Text>
            </View>
          </View>

          {/* Text content */}
          <View className='flex-1'>
            <Text className='text-sm font-semibold text-amber-800'>
              Day {voiceNote.streakAtRecording} of your {bestStreak}-day streak
            </Text>
            <Text className='text-xs text-amber-600'>{daysAgoText}</Text>
          </View>
        </View>

        {/* Expand/collapse chevron */}
        <View className='ml-2 h-8 w-8 items-center justify-center rounded-full bg-amber-100'>
          {isExpanded ? (
            <ChevronUp className='text-amber-600' size={16} />
          ) : (
            <ChevronDown className='text-amber-600' size={16} />
          )}
        </View>
      </Pressable>

      {/* Expanded content - playback UI */}
      {isExpanded && (
        <View className='border-t border-amber-200 p-3'>
          <VoiceNotePlaybackUI
            audioUri={voiceNote.audioUrl}
            initialDuration={voiceNote.duration}
            label={voiceNote.label}
            reduceMotion={reduceMotion}
            showSpeedControl={false}
            onPlayFinish={onPlayFinish}
            onPlayStart={onPlayStart}
          />
          {voiceNote.label && (
            <Text className='mt-2 text-xs italic text-amber-600'>
              "{voiceNote.label}"
            </Text>
          )}
        </View>
      )}
    </Animated.View>
  );
}

/**
 * PreviousStreakVoiceNotes - Shows voice notes from the user's best streak
 *
 * Displayed in Rescue Mode to help users reconnect with their most committed self.
 * Each note shows the day of the streak it was recorded on, creating powerful
 * temporal context ("You recorded this on Day 14 of your 21-day streak").
 */
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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [expandedId]
  );

  if (voiceNotes.length === 0) {
    return null;
  }

  return (
    <View className='rounded-2xl border-l-4 border-l-amber-400 bg-white p-4'>
      {/* Section header */}
      <View className='mb-3 flex-row items-center gap-2'>
        <View className='h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100'>
          <Flame className='text-amber-600' size={20} />
        </View>
        <View className='flex-1'>
          <Text className='text-lg font-bold text-amber-800'>
            Your Best Streak Self
          </Text>
          <Text className='text-xs text-amber-600'>
            Voice notes from your {bestStreak}-day streak
          </Text>
        </View>
        <View className='flex-row items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-2 py-1'>
          <Sparkles className='text-amber-600' size={12} />
          <Text className='text-xs font-medium text-amber-700'>
            Peak Motivation
          </Text>
        </View>
      </View>

      {/* Science callout */}
      <View className='mb-3 rounded-lg bg-amber-50 p-2'>
        <Text className='text-center text-xs italic text-amber-600'>
          💡 Hearing your voice from when you were most committed creates a
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
