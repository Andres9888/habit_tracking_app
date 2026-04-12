/**
 * Header for the unified Science & Evidence section
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../theme';
import { evidenceStyles as s } from '../styles';

export function ScienceEvidenceHeader() {
  const theme = useAppTheme();

  return (
    <>
      <View style={s.header}>
        <Text style={s.headerIcon}>🔬</Text>
        <Text
          style={[
            s.headerLabel,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          SCIENCE & EVIDENCE
        </Text>
      </View>
      <View style={s.divider} />
    </>
  );
}
