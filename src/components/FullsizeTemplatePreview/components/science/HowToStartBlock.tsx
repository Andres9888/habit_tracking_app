/**
 * "How to start" — ordered concrete steps.
 * Uses howToStart when present, otherwise falls back to the generic tips list.
 *
 * The "Suggested cadence" row was removed. Its fallback was
 * `frequency · estimatedMinutes`, which is byte-for-byte what the hero meta
 * pill already printed at the top of the same page — a gold-accented row
 * pulling the eye to information the reader passed four screens ago. Templates
 * that author a richer `cadenceLabel` still surface it: the hero pill and the
 * timeline both carry the timing story.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

import { SecLabel } from './SecLabel';
import { useScienceCard } from './useScienceCard';
import { scienceBlockStyles as b } from '../../styles/scienceBlocks.styles';
import type { Template } from '../../../../types/template';

export function HowToStartBlock({ template }: { template: Template }) {
  const { palette, card, glyph } = useScienceCard();
  const steps = template?.howToStart?.length
    ? template.howToStart
    : template?.tips;
  if (!steps || steps.length === 0) return null;

  return (
    <View>
      <SecLabel
        glyph={<CheckCircle2 color={glyph} size={16} strokeWidth={2} />}
      >
        How to start
      </SecLabel>
      <View style={card}>
        {steps.map((step, i) => (
          <View
            key={i}
            style={[
              b.stepRow,
              { paddingBottom: i === steps.length - 1 ? 0 : 14 },
            ]}
          >
            <View style={[b.stepNum, { backgroundColor: palette.addedBg }]}>
              <Text style={[b.stepNumText, { color: palette.addedFg }]}>
                {i + 1}
              </Text>
            </View>
            <Text
              style={[b.stepText, { color: palette.textPrimary, flex: 1 }]}
            >
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
