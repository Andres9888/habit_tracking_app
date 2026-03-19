/**
 * VoiceNotesSectionHeader Component
 * Header row with icon, title, and premium badge
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

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
  const { colors } = useThemeColors();

  return (
    <View className='mb-2 flex-row items-center gap-2'>
      <Text className='text-base'>🎙️</Text>
      <Text className='text-xs font-semibold' style={{ color: colors.status.success }}>Voice Notes</Text>
      {isPremium ? (
        <View className='rounded-full px-1.5 py-0.5' style={{ backgroundColor: colors.status.successLight }}>
          <Text className='text-[9px] font-bold' style={{ color: colors.status.successText }}>PREMIUM</Text>
        </View>
      ) : (
        <View className='ml-auto flex-row items-center gap-1'>
          {!hasVoiceNotes && !isRecording ? <>
              <Plus color={colors.status.success} size={12} />
              <Text className='text-xs font-medium' style={{ color: colors.status.success }}>Record</Text>
            </> : null}
        </View>
      )}
    </View>
  );
}
