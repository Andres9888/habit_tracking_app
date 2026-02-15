/**
 * VizFields - Renders body/mind/emotion visualization fields
 */

import React from 'react';
import { View } from 'react-native';

import { User, Brain, Heart } from 'lucide-react-native';

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
  const isSuccess = type === 'success';
  const colorClass: ColorClass = isSuccess ? 'success' : 'failure';
  const iconColor = isSuccess ? 'text-emerald-500' : 'text-rose-500';

  return (
    <View className={compact ? 'gap-1' : 'gap-2'}>
      {body && (
        <VizField
          colorClass={colorClass}
          icon={<User className={iconColor} size={16} />}
          label='Body'
          value={body}
        />
      )}
      {mind && (
        <VizField
          colorClass={colorClass}
          icon={<Brain className={iconColor} size={16} />}
          label='Mind'
          value={mind}
        />
      )}
      {emotion && (
        <VizField
          colorClass={colorClass}
          icon={<Heart className={iconColor} size={16} />}
          label='Emotion'
          value={emotion}
        />
      )}
    </View>
  );
}
