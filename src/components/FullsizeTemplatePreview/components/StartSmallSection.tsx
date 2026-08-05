/**
 * StartSmallSection — the laughably-easy floor version of the habit
 * (BJ Fogg / Atomic Habits).
 *
 * This used to live on every browse card, where it repeated dozens of times
 * per category and cost more scroll than it earned. It belongs here instead:
 * the reader has already tapped in, so they are at the decision point this
 * copy is written for.
 *
 * Rendered in the shared SecLabel + card grammar rather than a local one. It
 * previously used its own uppercase micro-label and no glyph, so the single
 * most persuasive block on the page read as an aside wedged between two
 * properly-labelled blocks — it looked like a footnote to "What you'll feel"
 * instead of the answer to "can I actually do this".
 *
 * Hidden entirely when the template has no start-small version.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from 'lucide-react-native';

import { fontFamilies, typography } from '../../../theme/typography';
import { SecLabel } from './science/SecLabel';
import { useScienceCard } from './science/useScienceCard';

interface StartSmallSectionProps {
  startSmallVersion?: string;
}

export function StartSmallSection({
  startSmallVersion,
}: StartSmallSectionProps) {
  const { palette, card, glyph } = useScienceCard();
  const text = startSmallVersion?.trim();
  if (!text) return null;

  return (
    <View>
      <SecLabel glyph={<Feather color={glyph} size={16} strokeWidth={2} />}>
        Start small
      </SecLabel>
      <View style={card}>
        <Text style={[s.text, { color: palette.textPrimary }]}>{text}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  text: {
    ...typography.body,
    fontFamily: fontFamilies.primary.text,
    fontSize: 15,
    lineHeight: 22,
  },
});
