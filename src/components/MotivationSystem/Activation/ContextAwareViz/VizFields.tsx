/**
 * VizFields - Renders body/mind/emotion visualization fields
 */

import React from 'react';
import { View } from 'react-native';
import { User, Brain, Heart } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import { useThemeColors } from '../../../../theme/ThemeContext';
import type { VizType, ColorClass } from './types';
import { VizField } from './VizField';

interface VizFieldsProps {
  type: VizType;
  body?: string;
  mind?: string;
  emotion?: string;
  compact: boolean;
}

export function VizFields({
  type,
  body,
  mind,
  emotion,
  compact,
}: VizFieldsProps) {
  const { colors } = useThemeColors();
  const isSuccess = type === 'success';
  const colorClass: ColorClass = isSuccess ? 'success' : 'failure';
  const iconColor = isSuccess ? colors.status.success : colors.status.error;

  return (
    <View className={compact ? 'gap-1' : 'gap-2'}>
      {body ? <VizField
          colorClass={colorClass}
          icon={<User color={iconColor} size={iconSizes.small} />}
          label='Body'
          value={body}
        /> : null}
      {mind ? <VizField
          colorClass={colorClass}
          icon={<Brain color={iconColor} size={iconSizes.small} />}
          label='Mind'
          value={mind}
        /> : null}
      {emotion ? <VizField
          colorClass={colorClass}
          icon={<Heart color={iconColor} size={iconSizes.small} />}
          label='Emotion'
          value={emotion}
        /> : null}
    </View>
  );
}
