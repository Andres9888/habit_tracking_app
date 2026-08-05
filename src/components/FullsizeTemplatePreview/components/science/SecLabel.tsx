/**
 * Section label for science drill-down blocks — Literata heading + leading glyph.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { scienceStyles as s } from '../../styles/science.styles';

interface SecLabelProps {
  glyph: React.ReactNode;
  children: string;
  /** Optional item count, rendered as a faint mono "04" on the right. */
  count?: number;
}

export function SecLabel({ glyph, children, count }: SecLabelProps) {
  return (
    <View style={s.secLabel}>
      {glyph}
      <Text style={s.secLabelText}>{children}</Text>
      {count ? <Text style={s.secLabelCount}>{String(count).padStart(2, '0')}</Text> : null}
    </View>
  );
}
