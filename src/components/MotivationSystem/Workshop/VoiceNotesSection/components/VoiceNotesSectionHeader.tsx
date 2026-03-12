/**
 * VoiceNotesSectionHeader Component
 * Header row with icon, title, and premium badge
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Plus } from 'lucide-react-native';

interface VoiceNotesSectionHeaderProps {
  isPremium: boolean;
  hasVoiceNotes: boolean;
  isRecording: boolean;
}

export function VoiceNotesSectionHeader({
  isPremium,
  hasVoiceNotes,
  isRecording,
}: VoiceNotesSectionHeaderProps) {
  return (
    <View className='mb-2 flex-row items-center gap-2'>
      <Text className='text-base'>🎙️</Text>
      <Text className='text-xs font-semibold text-teal-600'>Voice Notes</Text>
      {isPremium ? (
        <View className='rounded-full bg-emerald-100 px-1.5 py-0.5'>
          <Text className='text-[9px] font-bold text-emerald-700'>PREMIUM</Text>
        </View>
      ) : (
        <View className='ml-auto flex-row items-center gap-1'>
          {!hasVoiceNotes && !isRecording ? <>
              <Plus className='text-teal-600' size={12} />
              <Text className='text-xs font-medium text-teal-600'>Record</Text>
            </> : null}
        </View>
      )}
    </View>
  );
}
