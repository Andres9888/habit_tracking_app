/**
 * ExplainerHeader Component
 * Header section for the DualVizExplainer modal
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, X } from 'lucide-react-native';

interface ExplainerHeaderProps {
  onClose: () => void;
}

export function ExplainerHeader({ onClose }: ExplainerHeaderProps) {
  return (
    <View className='mb-4 flex-row items-start justify-between'>
      <View className='flex-row items-center gap-2'>
        <View className='h-10 w-10 items-center justify-center rounded-xl'>
          <LinearGradient
            className='absolute inset-0 rounded-xl'
            colors={['#d1fae5', '#ffe4e6']}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          />
          <Eye className='text-stone-700' size={20} />
        </View>
        <View>
          <Text className='text-lg font-bold text-stone-800'>
            Dual Visualization
          </Text>
          <Text className='text-xs text-stone-500'>
            Andrew Huberman, Stanford
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel='Close'
        className='h-8 w-8 items-center justify-center rounded-full bg-stone-100'
        onPress={onClose}
      >
        <X className='text-stone-500' size={24} />
      </Pressable>
    </View>
  );
}
