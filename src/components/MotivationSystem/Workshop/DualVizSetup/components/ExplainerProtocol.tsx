/**
 * ExplainerProtocol Component
 * Protocol explanation: when to use success vs failure visualization
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles, AlertTriangle } from 'lucide-react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

export function ExplainerProtocol() {
  const { colors } = useThemeColors();

  return (
    <>
      <Text className='mb-3 text-sm leading-relaxed' style={{ color: colors.text.secondary }}>
        This protocol uses{' '}
        <Text className='font-semibold' style={{ color: colors.text.primary }}>context-aware</Text>{' '}
        visualization to optimize motivation:
      </Text>

      <View className='mb-4 gap-3'>
        <View className='flex-row gap-3'>
          <View className='h-8 w-8 items-center justify-center rounded-lg' style={{ backgroundColor: colors.status.successLight }}>
            <Sparkles color={colors.status.success} size={16} />
          </View>
          <View className='flex-1'>
            <Text className='font-semibold' style={{ color: colors.status.successText }}>
              Feeling Motivated?
            </Text>
            <Text className='text-xs' style={{ color: colors.text.secondary }}>
              Visualize SUCCESS → Amplify your drive
            </Text>
          </View>
        </View>
        <View className='flex-row gap-3'>
          <View className='h-8 w-8 items-center justify-center rounded-lg' style={{ backgroundColor: colors.status.errorLight }}>
            <AlertTriangle color={colors.status.error} size={16} />
          </View>
          <View className='flex-1'>
            <Text className='font-semibold' style={{ color: colors.status.errorText }}>Not Motivated?</Text>
            <Text className='text-xs' style={{ color: colors.text.secondary }}>
              Visualize FAILURE → Fear drives action
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}
