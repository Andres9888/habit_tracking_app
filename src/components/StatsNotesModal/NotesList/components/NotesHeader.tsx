/**
 * NotesHeader Component
 * Header with title and add button
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors } from '../../../../theme/colors';
import { AnimatedPressable } from '../../../ui';

interface NotesHeaderProps {
  onAddNote: () => void;
}

export const NotesHeader: React.FC<NotesHeaderProps> = ({ onAddNote }) => (
  <View className='flex-row items-center justify-between'>
    <Text className='text-lg font-semibold text-stone-900'>Notes</Text>
    <AnimatedPressable
      accessibilityLabel='Add new note'
      accessibilityRole='button'
      className='h-9 w-9 items-center justify-center rounded-full bg-stone-900'
      hitSlop={{ bottom: 6, left: 6, right: 6, top: 6 }}
      onPress={onAddNote}
    >
      <Plus color={colors.text.inverse} size={18} strokeWidth={2.25} />
    </AnimatedPressable>
  </View>
);
