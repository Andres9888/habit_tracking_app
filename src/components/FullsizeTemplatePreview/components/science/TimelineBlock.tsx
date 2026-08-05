/**
 * "What to expect" — a vertical progression timeline. The final `peak` node is
 * gold-haloed to mark the automaticity milestone. Renders only with timeline data.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { Clock } from 'lucide-react-native';

import { colors } from '@/theme';
import { SecLabel } from './SecLabel';
import { scienceStyles as s } from '../../styles/science.styles';
import { scienceBlockStyles as b } from '../../styles/scienceBlocks.styles';
import type { Template } from '../../../../types/template';

export function TimelineBlock({ template }: { template: Template }) {
  const timeline = template?.timeline;
  if (!timeline || timeline.length === 0) return null;
  return (
    <View>
      <SecLabel glyph={<Clock color={colors.primary[700]} size={17} strokeWidth={2} />}>
        What to expect
      </SecLabel>
      <View style={s.card}>
        <View style={{ position: 'relative' }}>
          <View style={b.spine} />
          {timeline.map((node, i) => {
            const last = i === timeline.length - 1;
            return (
              <View key={i} style={[b.tlRow, { paddingBottom: last ? 0 : 16 }]}>
                <View
                  style={[
                    b.tlDot,
                    node.peak
                      ? { backgroundColor: colors.streak[300], borderColor: colors.streak[300] }
                      : { backgroundColor: '#FFFFFF', borderColor: colors.primary[600] },
                  ]}
                >
                  {node.peak ? <Text style={{ fontSize: 9 }}>💎</Text> : null}
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={[
                      b.tlWhen,
                      { color: node.peak ? colors.streak[700] : colors.primary[700] },
                    ]}
                  >
                    {node.when}
                  </Text>
                  <Text style={b.tlTitle}>{node.title}</Text>
                  <Text style={b.tlDesc}>{node.description}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
