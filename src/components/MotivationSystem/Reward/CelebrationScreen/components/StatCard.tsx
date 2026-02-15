/**
 * StatCard - Individual stat display card with icon and value
 */

import React from 'react';
import { View, Text } from 'react-native';

import { clsx } from 'clsx';

import type { StatCardProps } from '../types';

const COLOR_CLASSES = {
  amber: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    label: 'text-amber-600',
    value: 'text-amber-700',
  },
  emerald: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    label: 'text-emerald-600',
    value: 'text-emerald-700',
  },
  violet: {
    bg: 'bg-violet-50',
    iconBg: 'bg-violet-100',
    label: 'text-violet-600',
    value: 'text-violet-700',
  },
};

export function StatCard({ icon, value, label, color }: StatCardProps) {
  const classes = COLOR_CLASSES[color];

  return (
    <View className={clsx('flex-1 items-center rounded-xl p-3', classes.bg)}>
      <View
        className={clsx(
          'mb-2 h-10 w-10 items-center justify-center rounded-lg',
          classes.iconBg
        )}
      >
        {icon}
      </View>
      <Text className={clsx('text-xl font-bold', classes.value)}>{value}</Text>
      <Text className={clsx('text-xs font-medium', classes.label)}>
        {label}
      </Text>
    </View>
  );
}
