/**
 * MetadataPill - Reusable metadata pill component for HeroSection
 */

import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/theme';
import { withAlpha, overlays } from '@/theme/colors';
import { heroStyles } from '../styles';
import { readableAccent } from '../utils/readableAccent';

interface MetadataPillProps {
  iconColor: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  /** 'accent' tints the pill with the template's iconColor (category pill only). */
  variant?: 'neutral' | 'accent';
}

export function MetadataPill({
  iconColor,
  children,
  icon,
  variant = 'neutral',
}: MetadataPillProps) {
  const isAccent = variant === 'accent';
  const textColor = isAccent ? readableAccent(iconColor) : colors.gray[600];

  return (
    <View
      style={[
        heroStyles.metadataPill,
        isAccent
          ? {
              backgroundColor: withAlpha(iconColor, 0.25),
              borderColor: withAlpha(iconColor, 0.4),
            }
          : {
              backgroundColor: overlays.glassStrong,
              borderColor: colors.gray[200],
            },
      ]}
    >
      {icon}
      <Text style={[heroStyles.metadataPillText, { color: textColor }]}>
        {children}
      </Text>
    </View>
  );
}
