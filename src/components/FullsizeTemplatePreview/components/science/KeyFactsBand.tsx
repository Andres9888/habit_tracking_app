/**
 * KeyFacts decision band (SPEC_01) — at-a-glance facts under the hero so the
 * user can size up a habit in one glance: time · cadence · days-to-automate ·
 * how many added. Each cell is independently optional; renders nothing if
 * fewer than two resolve, so a sparse template still looks balanced.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme/ThemeContext';
import { getGrowthTypeMeta } from '@/utils/growthTypeMeta';
import { formatPopularityCount } from '@/screens/TemplatesScreen/utils/formatPopularityCount';
import { keyFactsStyles as s } from '../../styles/keyFacts.styles';
import type { Template } from '../../../../types/template';

interface KeyFact {
  value: string;
  unit?: string;
  label: string;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildKeyFacts(template: Template): KeyFact[] {
  const facts: KeyFact[] = [];
  if (template?.estimatedMinutes) {
    facts.push({ value: `${template.estimatedMinutes}`, unit: 'min', label: 'per day' });
  }
  if (template?.frequency) {
    facts.push({ value: capitalize(template.frequency), label: 'cadence' });
  }
  const growth = getGrowthTypeMeta(template?.growthType);
  if (growth) facts.push({ value: `${growth.days}`, unit: 'd', label: 'to automate' });
  const added = formatPopularityCount(template?.popularityScore);
  if (added) facts.push({ value: added, label: 'added' });
  return facts;
}

export function KeyFactsBand({ template }: { template: Template }) {
  const { colors, isDark } = useThemeColors();
  const facts = buildKeyFacts(template);
  if (facts.length < 2) return null;
  // White band so the decision aid pops off the gray[50] science section.
  const surface = isDark ? colors.card : '#FFFFFF';

  return (
    <View style={[s.band, { backgroundColor: surface, borderColor: colors.border }]}>
      {facts.map((fact, i) => (
        <View
          key={fact.label}
          style={[s.cell, i > 0 ? { borderLeftColor: colors.border, borderLeftWidth: 1 } : null]}
        >
          <View style={s.valueRow}>
            <Text style={[s.value, { color: colors.text.primary }]}>{fact.value}</Text>
            {fact.unit ? (
              <Text style={[s.unit, { color: colors.text.secondary }]}>{fact.unit}</Text>
            ) : null}
          </View>
          <Text numberOfLines={1} style={[s.label, { color: colors.text.tertiary }]}>
            {fact.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
