/**
 * "What to expect" — a vertical progression timeline. The final `peak` node is
 * gold-haloed to mark the automaticity milestone. Renders only with timeline data.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { Clock } from 'lucide-react-native';

import { SecLabel } from './SecLabel';
import { useScienceCard } from './useScienceCard';
import { scienceBlockStyles as b } from '../../styles/scienceBlocks.styles';
import type { Template } from '../../../../types/template';

export function TimelineBlock({ template }: { template: Template }) {
  const { palette, card, glyph } = useScienceCard();
  const timeline = template?.timeline;
  if (!timeline || timeline.length === 0) return null;

  return (
    <View>
      <SecLabel glyph={<Clock color={glyph} size={16} strokeWidth={2} />}>
        What to expect
      </SecLabel>
      <View style={card}>
        <View style={{ position: 'relative' }}>
          <View style={[b.spine, { backgroundColor: palette.border }]} />
          {timeline.map((node, i) => {
            const last = i === timeline.length - 1;
            return (
              <View key={i} style={[b.tlRow, { paddingBottom: last ? 0 : 16 }]}>
                <View
                  style={[
                    b.tlDot,
                    node.peak
                      ? {
                          backgroundColor: palette.goldFill,
                          borderColor: palette.gold,
                        }
                      : {
                          backgroundColor: palette.card,
                          borderColor: palette.addBg,
                        },
                  ]}
                >
                  {node.peak ? <Text style={{ fontSize: 9 }}>💎</Text> : null}
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={[
                      b.tlWhen,
                      { color: node.peak ? palette.gold : palette.green },
                    ]}
                  >
                    {node.when}
                  </Text>
                  <Text style={[b.tlTitle, { color: palette.textPrimary }]}>
                    {node.title}
                  </Text>
                  <Text style={[b.tlDesc, { color: palette.textSecondary }]}>
                    {node.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
