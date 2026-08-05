/**
 * "What you'll feel" — concrete benefit rows with green icon tiles.
 * Renders only when the template supplies structured benefitDetails.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { Leaf, Moon, Sparkles, Target, Waves } from 'lucide-react-native';

import { iconSizes } from '@/theme/iconSizes';
import { SecLabel } from './SecLabel';
import { useScienceCard } from './useScienceCard';
import { scienceBlockStyles as b } from '../../styles/scienceBlocks.styles';
import type { Template } from '../../../../types/template';

const GLYPHS = {
  wave: Waves,
  moon: Moon,
  target: Target,
  leaf: Leaf,
  sparkle: Sparkles,
};

export function BenefitsBlock({ template }: { template: Template }) {
  const { palette, flushCard, divider, glyph } = useScienceCard();
  const benefits = template?.benefitDetails;
  if (!benefits || benefits.length === 0) return null;

  return (
    <View>
      <SecLabel
        glyph={<Sparkles color={glyph} size={16} strokeWidth={2} />}
      >
        What you&apos;ll feel
      </SecLabel>
      <View style={flushCard}>
        {benefits.map((item, i) => {
          const Glyph = GLYPHS[item.icon as keyof typeof GLYPHS] ?? Sparkles;
          return (
            <View key={i} style={[b.benefitRow, i > 0 ? divider : null]}>
              <View
                style={[
                  b.benefitIcon,
                  { backgroundColor: palette.addedBg },
                ]}
              >
                <Glyph
                  color={palette.addedFg}
                  size={iconSizes.medium - 1}
                  strokeWidth={2}
                />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  style={[b.benefitTitle, { color: palette.textPrimary }]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[b.benefitDesc, { color: palette.textSecondary }]}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
