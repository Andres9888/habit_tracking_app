/**
 * "How to start" — ordered concrete steps plus a suggested-cadence line.
 * Uses howToStart when present, otherwise falls back to the generic tips list.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { CheckCircle2, Repeat } from 'lucide-react-native';

import { colors } from '@/theme';
import { SecLabel } from './SecLabel';
import { scienceStyles as s } from '../../styles/science.styles';
import { scienceBlockStyles as b } from '../../styles/scienceBlocks.styles';
import type { Template } from '../../../../types/template';

function cadenceFor(template: Template): string | undefined {
  if (template?.cadenceLabel) return template.cadenceLabel;
  const freq = template?.frequency ? `${template.frequency[0].toUpperCase()}${template.frequency.slice(1)}` : null;
  const mins = template?.estimatedMinutes ? `${template.estimatedMinutes} min` : null;
  return [freq, mins].filter(Boolean).join(' · ') || undefined;
}

export function HowToStartBlock({ template }: { template: Template }) {
  const steps = template?.howToStart?.length ? template.howToStart : template?.tips;
  if (!steps || steps.length === 0) return null;
  const cadence = cadenceFor(template);
  return (
    <View>
      <SecLabel glyph={<CheckCircle2 color={colors.primary[700]} size={17} strokeWidth={2} />}>
        How to start
      </SecLabel>
      <View style={s.card}>
        {steps.map((step, i) => (
          <View key={i} style={[b.stepRow, { paddingBottom: i === steps.length - 1 ? 0 : 12 }]}>
            <View style={b.stepNum}>
              <Text style={b.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={[b.stepText, { flex: 1 }]}>{step}</Text>
          </View>
        ))}
        {cadence ? (
          <View style={b.cadenceRow}>
            <Repeat color={colors.streak[700]} size={15} strokeWidth={2} />
            <Text style={b.cadenceLabel}>Suggested cadence</Text>
            <Text style={b.cadenceValue}>{cadence}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
