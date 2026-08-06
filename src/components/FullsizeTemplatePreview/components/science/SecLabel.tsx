/**
 * Section label for science drill-down blocks — heading + leading glyph.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { scienceStyles as s } from '../../styles/science.styles';
import { useDetailPalette } from '../../detailPalette';

interface SecLabelProps {
  glyph: React.ReactNode;
  children: string;
}

export function SecLabel({ glyph, children }: SecLabelProps) {
  const palette = useDetailPalette();

  return (
    <View style={s.secLabel}>
      {glyph}
      <Text style={[s.secLabelText, { color: palette.textPrimary }]}>
        {children}
      </Text>
    </View>
  );
}
