/**
 * MetadataPill - translucent cream chip used in the drill-down hero.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { heroStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';

interface MetadataPillProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function MetadataPill({ children, icon }: MetadataPillProps) {
  const palette = useDetailPalette();

  return (
    <View
      style={[
        heroStyles.metadataPill,
        {
          backgroundColor: palette.chipBg,
          borderColor: palette.chipBorder,
        },
      ]}
    >
      {icon}
      <Text
        style={[heroStyles.metadataPillText, { color: palette.textSecondary }]}
      >
        {children}
      </Text>
    </View>
  );
}
