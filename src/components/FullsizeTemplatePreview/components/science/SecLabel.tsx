/**
 * Section label for science drill-down blocks — Literata heading + leading glyph.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { scienceStyles as s } from '../../styles/science.styles';

interface SecLabelProps {
  glyph: React.ReactNode;
  children: string;
}

export function SecLabel({ glyph, children }: SecLabelProps) {
  return (
    <View style={s.secLabel}>
      {glyph}
      <Text style={s.secLabelText}>{children}</Text>
    </View>
  );
}
