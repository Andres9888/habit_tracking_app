/**
 * "How it becomes automatic" — ties the science to Chain Day's streak-strength
 * loop: five stages from Starting to Automatic, automaticity around 66 days.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { Link2 } from 'lucide-react-native';

import { colors } from '@/theme';
import { SecLabel } from './SecLabel';
import { scienceStyles as s } from '../../styles/science.styles';
import { scienceResearchStyles as b } from '../../styles/scienceResearch.styles';

const LEVELS = [
  { label: 'Starting', emoji: '🥉', color: colors.strength.starting },
  { label: 'Building', emoji: '🥈', color: colors.strength.building },
  { label: 'Developing', emoji: '🥇', color: colors.strength.developing },
  { label: 'Strong', emoji: '🏆', color: colors.strength.strong },
  { label: 'Automatic', emoji: '💎', color: colors.strength.automatic },
];

export function StrengthExplainerBlock() {
  return (
    <View>
      <SecLabel glyph={<Link2 color={colors.primary[700]} size={17} strokeWidth={2} />}>
        How it becomes automatic
      </SecLabel>
      <View style={s.card}>
        <Text style={b.strIntro}>
          Every day you keep the chain, this habit gets stronger — climbing five stages from
          Starting to Automatic. Most daily habits cross into automatic around 66 days.
        </Text>
        <View style={b.strTrack}>
          {LEVELS.map((lv, i) => (
            <React.Fragment key={lv.label}>
              {i > 0 ? <View style={[b.strConnector, { backgroundColor: lv.color }]} /> : null}
              <View style={b.strNode}>
                <View style={[b.strCircle, { borderColor: lv.color }]}>
                  <Text style={b.strEmoji}>{lv.emoji}</Text>
                </View>
                <Text style={b.strLabel}>{lv.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
}
