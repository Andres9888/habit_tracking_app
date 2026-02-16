/**
 * NotesHeader Component
 * Header with title and add button
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface NotesHeaderProps {
  onAddNote: () => void;
}

export const NotesHeader: React.FC<NotesHeaderProps> = ({ onAddNote }) => {
  const { colors } = useThemeColors();
  return (
    <View className='flex-row items-center justify-between'>
      <Text className='text-lg font-semibold' style={{ color: colors.text.primary }}>Notes</Text>
      <TouchableOpacity
        accessibilityLabel='Add new note'
        accessibilityRole='button'
        activeOpacity={0.7}
        className='h-9 w-9 items-center justify-center rounded-full'
        style={{ backgroundColor: colors.gray[900] }}
        hitSlop={{ bottom: 6, left: 6, right: 6, top: 6 }}
        onPress={onAddNote}
      >
        <Plus color={colors.text.inverse} size={18} strokeWidth={2.25} />
      </TouchableOpacity>
    </View>
  );
};
