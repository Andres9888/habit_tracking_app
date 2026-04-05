/**
 * InfoCard - Reusable card for info modal sections
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

interface InfoCardProps {
  Icon: LucideIcon;
  iconColor: string;
  title: string;
  titleColor: string;
  description: string;
  descriptionColor: string;
  bgColor: string;
}

export function InfoCard({
  Icon,
  iconColor,
  title,
  titleColor,
  description,
  descriptionColor,
  bgColor,
}: InfoCardProps) {
  return (
    <View className='mb-6 rounded-2xl p-4' style={{ backgroundColor: bgColor }}>
      <View className='mb-2 flex-row items-center gap-2'>
        <Icon color={iconColor} size={iconSizes.medium} />
        <Text className='text-base font-semibold' style={{ color: titleColor }}>
          {title}
        </Text>
      </View>
      <Text className='text-sm leading-5' style={{ color: descriptionColor }}>
        {description}
      </Text>
    </View>
  );
}
