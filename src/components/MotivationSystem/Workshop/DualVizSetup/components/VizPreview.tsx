/**
 * VizPreview Component
 * Compact preview of success or failure visualization
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles, AlertTriangle } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import type { VizPreviewProps } from '../DualVizSetup.types';

export function VizPreview({ type, body, mind, emotion }: VizPreviewProps) {
  const { colors } = useThemeColors();
  const isSuccess = type === 'success';
  const hasAnyField = body || mind || emotion;

  if (!hasAnyField) {
    return (
      <View
        className='flex-1 rounded-xl p-3'
        style={{ backgroundColor: isSuccess ? colors.status.successLight : colors.status.errorLight }}
      >
        <View className='mb-2 flex-row items-center gap-2'>
          {isSuccess ? (
            <Sparkles color={colors.status.success} size={iconSizes.small} />
          ) : (
            <AlertTriangle color={colors.status.error} size={iconSizes.small} />
          )}
          <Text
            className='text-xs font-semibold'
            style={{ color: isSuccess ? colors.status.successText : colors.status.errorText }}
          >
            {isSuccess ? 'Success' : 'Failure'}
          </Text>
        </View>
        <Text className='text-xs italic' style={{ color: colors.text.tertiary }}>
          {isSuccess ? 'How will you feel?' : 'What will you avoid?'}
        </Text>
      </View>
    );
  }

  return (
    <View
      className='flex-1 rounded-xl p-3'
      style={{ backgroundColor: isSuccess ? colors.status.successLight : colors.status.errorLight }}
    >
      <View className='mb-2 flex-row items-center gap-2'>
        {isSuccess ? (
          <Sparkles color={colors.status.success} size={iconSizes.small} />
        ) : (
          <AlertTriangle color={colors.status.error} size={iconSizes.small} />
        )}
        <Text
          className='text-xs font-semibold'
          style={{ color: isSuccess ? colors.status.successText : colors.status.errorText }}
        >
          {isSuccess ? 'Success' : 'Failure'}
        </Text>
      </View>
      <View className='gap-1'>
        {body ? <Text
            className='text-xs'
            style={{ color: isSuccess ? colors.status.successText : colors.status.errorText }}
            numberOfLines={1}
          >
            <Text className='font-medium'>Body:</Text> {body}
          </Text> : null}
        {mind ? <Text
            className='text-xs'
            style={{ color: isSuccess ? colors.status.successText : colors.status.errorText }}
            numberOfLines={1}
          >
            <Text className='font-medium'>Mind:</Text> {mind}
          </Text> : null}
        {emotion ? <Text
            className='text-xs'
            style={{ color: isSuccess ? colors.status.successText : colors.status.errorText }}
            numberOfLines={1}
          >
            <Text className='font-medium'>Feel:</Text> {emotion}
          </Text> : null}
      </View>
    </View>
  );
}
