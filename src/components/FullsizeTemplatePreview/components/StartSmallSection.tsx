/**
 * StartSmallSection — the laughably-easy floor version of the habit
 * (BJ Fogg / Atomic Habits).
 *
 * This used to live on every browse card, where it repeated dozens of times
 * per category and cost more scroll than it earned. It belongs here instead:
 * the reader has already tapped in, so they are at the decision point this
 * copy is written for.
 *
 * Hidden entirely when the template has no start-small version.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { useDetailPalette } from '../detailPalette';

interface StartSmallSectionProps {
  startSmallVersion?: string;
}

export function StartSmallSection({
  startSmallVersion,
}: StartSmallSectionProps) {
  const palette = useDetailPalette();
  const text = startSmallVersion?.trim();
  if (!text) return null;

  return (
    <View style={s.wrap}>
      <View
        style={[
          s.box,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <Text style={[s.label, { color: palette.textTertiary }]}>
          Start small
        </Text>
        <Text style={[s.text, { color: palette.textPrimary }]}>{text}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { paddingBottom: spacing.lg, paddingHorizontal: 20 },
  box: { borderRadius: 16, borderWidth: 1, padding: 16 },
  label: {
    fontSize: 11,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  text: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
});
