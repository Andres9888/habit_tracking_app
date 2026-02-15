/**
 * VisualizationGuideButton Component
 * Button to open the visualization guide modal
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Eye } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../../../../theme/colors';

interface VisualizationGuideButtonProps {
  onPress: () => void;
}

export const VisualizationGuideButton: React.FC<
  VisualizationGuideButtonProps
> = ({ onPress }) => (
  <TouchableOpacity
    accessibilityLabel='Open goal visualization guide'
    accessibilityRole='button'
    className='flex-row items-center justify-center gap-2 rounded-2xl py-3.5 active:opacity-90'
    onPress={onPress}
  >
    <LinearGradient
      className='absolute inset-0 rounded-2xl'
      colors={['#7c3aed', '#4f46e5']}
      end={{ x: 1, y: 0 }}
      start={{ x: 0, y: 0 }}
    />
    <Eye color={colors.text.inverse} size={18} />
    <Text className='text-sm font-semibold text-white'>
      Visualization Guide
    </Text>
    <View className='rounded-full bg-white/20 px-2 py-0.5'>
      <Text className='text-xs font-medium text-white'>Huberman</Text>
    </View>
  </TouchableOpacity>
);
