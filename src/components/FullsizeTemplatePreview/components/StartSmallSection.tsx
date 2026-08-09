/**
 * StartSmallSection — the laughably-easy floor version of the habit
 * (BJ Fogg / Atomic Habits).
 *
 * This used to live on every browse card, where it repeated dozens of times
 * per category and cost more scroll than it earned. It belongs here instead:
 * the reader has already tapped in, so they are at the decision point this
 * copy is written for.
 *
 * Tinted panel (greenTint + left rail) so this block visually outranks the
 * neutral siblings around it — it is the answer to "can I actually do this".
 * Hidden entirely when the template has no start-small version.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from 'lucide-react-native';

import { fontFamilies, fontWeights } from '../../../theme/typography';
import { SecLabel } from './science/SecLabel';
import { useScienceCard } from './science/useScienceCard';

interface StartSmallSectionProps {
  startSmallVersion?: string;
}

export function StartSmallSection({
  startSmallVersion,
}: StartSmallSectionProps) {
  const { palette, glyph } = useScienceCard();
  const text = startSmallVersion?.trim();
  if (!text) return null;

  return (
    <View>
      <SecLabel glyph={<Feather color={glyph} size={16} strokeWidth={2} />}>
        Start small
      </SecLabel>
      <View
        style={[
          s.panel,
          {
            backgroundColor: palette.greenTint,
            borderLeftColor: palette.green,
          },
        ]}
      >
        <Text style={[s.text, { color: palette.textPrimary }]}>{text}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  panel: {
    borderLeftWidth: 4,
    borderRadius: 22,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  text: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.semibold,
    lineHeight: 24,
  },
});
