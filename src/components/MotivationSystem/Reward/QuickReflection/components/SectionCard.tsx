
import React from 'react';
import { View } from 'react-native';

import { clsx } from 'clsx';

import { shadows } from '../../../../../theme/spacing';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * SectionCard Component for consistent styling with shadow
 */
export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <View
      className={clsx(
        'rounded-2xl bg-white p-4 shadow-sm shadow-stone-200/50',
        className
      )}
      style={{
        ...shadows.card,
        shadowColor: '#78716c',
        shadowOpacity: 0.08,
      }}
    >
      {children}
    </View>
  );
}
