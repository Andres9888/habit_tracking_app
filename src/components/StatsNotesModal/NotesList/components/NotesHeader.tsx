/**
 * NotesHeader Component
 * Header with title and add button
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';

interface NotesHeaderProps {
  onAddNote: () => void;
}

export const NotesHeader: React.FC<NotesHeaderProps> = ({ onAddNote }) => (
  <View className='flex-row items-center justify-between'>
    <Text className='text-lg font-semibold text-stone-900'>Notes</Text>
    <TouchableOpacity
      accessibilityLabel='Add new note'
      accessibilityRole='button'
      className='h-9 w-9 items-center justify-center rounded-full bg-stone-900'
      onPress={onAddNote}
    >
      <Plus color='#ffffff' size={18} strokeWidth={2.25} />
    </TouchableOpacity>
  </View>
);
