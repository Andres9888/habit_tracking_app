/**
 * "How it becomes automatic" — ties the science to Chain Day's streak-strength
 * loop: five numbered stages from Starting to Automatic, automaticity around
 * 66 days. Stage 1 is marked as the start; the rest stay neutral (pre-add).
 */

import React from 'react';
import { Text, View } from 'react-native';
import { Link2 } from 'lucide-react-native';

import { colors } from '@/theme';
import { SecLabel } from './SecLabel';
import { scienceStyles as s } from '../../styles/science.styles';
import { scienceResearchStyles as b } from '../../styles/scienceResearch.styles';

const LEVELS = ['Starting', 'Building', 'Developing', 'Strong', 'Automatic'];

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
          {LEVELS.map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 ? <View style={b.strConnector} /> : null}
              <View style={b.strNode}>
                <View style={[b.strCircle, i === 0 && b.strCircleStart]}>
                  <Text style={[b.strNum, i === 0 && b.strNumStart]}>{i + 1}</Text>
                </View>
                <Text style={b.strLabel}>{label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
}
