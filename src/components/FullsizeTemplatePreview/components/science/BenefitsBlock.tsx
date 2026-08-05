/**
 * "What you'll feel" — concrete benefit rows with green icon tiles.
 * Renders only when the template supplies structured benefitDetails.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { Leaf, Moon, Sparkles, Target, Waves } from 'lucide-react-native';

import { colors } from '@/theme';
import { iconSizes } from '@/theme/iconSizes';
import { SecLabel } from './SecLabel';
import { scienceStyles as s } from '../../styles/science.styles';
import { scienceBlockStyles as b } from '../../styles/scienceBlocks.styles';
import type { Template } from '../../../../types/template';

const GLYPHS = { wave: Waves, moon: Moon, target: Target, leaf: Leaf, sparkle: Sparkles };

export function BenefitsBlock({ template }: { template: Template }) {
  const benefits = template?.benefitDetails;
  if (!benefits || benefits.length === 0) return null;
  return (
    <View>
      <SecLabel glyph={<Sparkles color={colors.primary[700]} size={17} strokeWidth={2} />}>
        What you&apos;ll feel
      </SecLabel>
      <View style={[s.card, { padding: 0, overflow: 'hidden' }]}>
        {benefits.map((item, i) => {
          const Glyph = GLYPHS[item.icon as keyof typeof GLYPHS] ?? Sparkles;
          return (
            <View
              key={i}
              style={[
                b.benefitRow,
                i > 0 ? { borderTopColor: colors.border, borderTopWidth: 1 } : null,
              ]}
            >
              <View style={b.benefitIcon}>
                <Glyph color={colors.primary[700]} size={iconSizes.medium - 1} strokeWidth={2} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={b.benefitTitle}>{item.title}</Text>
                <Text style={b.benefitDesc}>{item.description}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
