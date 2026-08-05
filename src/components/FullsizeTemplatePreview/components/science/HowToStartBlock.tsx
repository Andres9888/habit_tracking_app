/**
 * "How to start" — ordered concrete steps plus a suggested-cadence line.
 * Uses howToStart when present, otherwise falls back to the generic tips list.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { CheckCircle2, Repeat } from 'lucide-react-native';

import { SecLabel } from './SecLabel';
import { useScienceCard } from './useScienceCard';
import { scienceBlockStyles as b } from '../../styles/scienceBlocks.styles';
import type { Template } from '../../../../types/template';

function cadenceFor(template: Template): string | undefined {
  if (template?.cadenceLabel) return template.cadenceLabel;
  const freq = template?.frequency
    ? `${template.frequency[0].toUpperCase()}${template.frequency.slice(1)}`
    : null;
  const mins = template?.estimatedMinutes
    ? `${template.estimatedMinutes} min`
    : null;
  return [freq, mins].filter(Boolean).join(' · ') || undefined;
}

export function HowToStartBlock({ template }: { template: Template }) {
  const { palette, card, glyph } = useScienceCard();
  const steps = template?.howToStart?.length
    ? template.howToStart
    : template?.tips;
  if (!steps || steps.length === 0) return null;
  const cadence = cadenceFor(template);

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
        {cadence ? (
          <View style={[b.cadenceRow, { borderTopColor: palette.border }]}>
            <Repeat color={palette.gold} size={15} strokeWidth={2} />
            <Text style={[b.cadenceLabel, { color: palette.gold }]}>
              Suggested cadence
            </Text>
            <Text style={[b.cadenceValue, { color: palette.textSecondary }]}>
              {cadence}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
