/**
 * VoiceNoteItemHeader - Header row with note info and expand icon
 */

import React from 'react';
import type { ViewStyle } from 'react-native';
import { View, Text, Pressable } from 'react-native';

import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Mic, ChevronDown } from 'lucide-react-native';

import type { VoiceNoteSummary } from '../VoiceNotesSection.types';
import { formatDuration, formatRelativeTime } from '../VoiceNotesSection.utils';

interface VoiceNoteItemHeaderProps {
  note: VoiceNoteSummary;
  hasPlayback: boolean;
  isExpanded: boolean;
  iconStyle: AnimatedStyle<ViewStyle>;
  onPress: () => void;
}

export function VoiceNoteItemHeader({ note, hasPlayback, isExpanded, iconStyle, onPress }: VoiceNoteItemHeaderProps) {
  const label = hasPlayback
    ? `${note.label || 'Recording'}, ${formatDuration(note.duration)}. ${isExpanded ? 'Collapse' : 'Expand'} to ${isExpanded ? 'hide' : 'play'}`
    : `${note.label || 'Recording'}, ${formatDuration(note.duration)}`;

  return (
    <Pressable accessibilityLabel={label} accessibilityRole={hasPlayback ? 'button' : 'text'} className='flex-row items-center gap-3 p-3' disabled={!hasPlayback} onPress={onPress}>
      <View className='h-8 w-8 items-center justify-center rounded-full bg-teal-100'>
        <Mic className='text-teal-600' size={14} />
      </View>
      <View className='flex-1'>
        <Text className='text-sm font-medium text-stone-700'>{note.label || `Recording ${formatDuration(note.duration)}`}</Text>
        <Text className='text-xs text-stone-500'>{formatRelativeTime(note.createdAt)}{note.isDay1 && ' • Day 1'}</Text>
      </View>
      <Text className='mr-2 text-xs text-stone-400'>{formatDuration(note.duration)}</Text>
      {hasPlayback && <Animated.View style={iconStyle}><ChevronDown className='text-stone-400' size={16} /></Animated.View>}
    </Pressable>
  );
}
