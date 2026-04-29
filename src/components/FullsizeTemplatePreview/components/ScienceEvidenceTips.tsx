/**
 * "Why it works" — causal-claim tips rendered with green checkmark halos.
 *
 * Uses template-provided tips when present; falls back to three universal
 * habit-formation principles so the section always renders the full layout.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { colors } from '@/theme';
import { iconSizes } from '@/theme/iconSizes';
import { evidenceStyles as es } from '../styles';
import { evidenceDetailStyles as s } from '../styles/evidenceDetail.styles';

interface ScienceEvidenceTipsProps {
  tips?: string[];
}

const FALLBACK_TIPS: string[] = [
  'Anchor it to a routine you already do — your brain reuses an existing pathway.',
  "Start with the smallest version — willpower doesn't get a chance to refuse.",
  'Celebrate immediately — dopamine teaches your brain to repeat the loop.',
];

export function ScienceEvidenceTips({ tips }: ScienceEvidenceTipsProps) {
  const list = tips && tips.length > 0 ? tips : FALLBACK_TIPS;

  return (
    <View
      accessible
      accessibilityLabel={`Why it works: ${list.length} reasons`}
      accessibilityRole="text"
    >
      <Text style={es.whyOverline}>Why it works</Text>
      {list.map((tip: string, index: number) => (
        <View key={index} style={s.tipItem}>
          <View style={s.tipCheckHalo}>
            <Check
              color={colors.primary[700]}
              size={iconSizes.small - 2}
              strokeWidth={2.5}
            />
          </View>
          <Text style={s.tipText}>{tip}</Text>
        </View>
      ))}
    </View>
  );
}
