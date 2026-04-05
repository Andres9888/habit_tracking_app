/**
 * DualVizHeader Component
 * Header section for DualVizSetup with title and action button
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { HelpCircle, Plus, Pencil } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface DualVizHeaderProps {
  hasViz: boolean;
  onHelpPress: () => void;
}

export function DualVizHeader({ hasViz, onHelpPress }: DualVizHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mb-2 flex-row items-center justify-between'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-base'>👁️</Text>
        <View>
          <Text className='text-xs font-semibold' style={{ color: colors.status.premiumText }}>
            Visualization Setup
          </Text>
          <Text className='text-[10px]' style={{ color: colors.text.tertiary }}>Huberman Protocol</Text>
        </View>
      </View>
      <View className='flex-row items-center gap-2'>
        <Pressable
          accessibilityLabel='Learn about dual visualization'
          className='h-6 w-6 items-center justify-center rounded-full'
          hitSlop={{ bottom: 12, left: 12, right: 12, top: 12 }}
          onPress={onHelpPress}
        >
          <HelpCircle color={colors.text.tertiary} size={iconSizes.small} />
        </Pressable>
        {hasViz ? (
          <Pencil color={colors.text.tertiary} size={iconSizes.small} />
        ) : (
          <View className='flex-row items-center gap-1'>
            <Plus color={colors.status.premiumText} size={iconSizes.small} />
            <Text className='text-xs font-medium' style={{ color: colors.status.premiumText }}>Set up</Text>
          </View>
        )}
      </View>
    </View>
  );
}
