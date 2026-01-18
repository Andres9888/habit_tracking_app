/**
 * VisualizationGuideButton Component
 * Button to open the visualization guide modal
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Eye } from 'lucide-react-native';

interface VisualizationGuideButtonProps {
  onPress: () => void;
}

export const VisualizationGuideButton: React.FC<
  VisualizationGuideButtonProps
> = ({ onPress }) => (
  <TouchableOpacity
    accessibilityLabel='Open goal visualization guide'
    accessibilityRole='button'
    className='flex-row items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 py-3.5 active:opacity-90'
    onPress={onPress}
  >
    <Eye color='#ffffff' size={18} />
    <Text className='text-sm font-semibold text-white'>
      Visualization Guide
    </Text>
    <View className='rounded-full bg-white/20 px-2 py-0.5'>
      <Text className='text-xs font-medium text-white'>Huberman</Text>
    </View>
  </TouchableOpacity>
);
