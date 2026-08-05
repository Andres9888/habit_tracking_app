/**
 * "What to expect" — a vertical progression timeline. The final `peak` node is
 * gold-haloed to mark the automaticity milestone. Renders only with timeline data.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { Check, Clock } from 'lucide-react-native';

import { colors } from '@/theme';
import { SecLabel } from './SecLabel';
import { scienceStyles as s } from '../../styles/science.styles';
import { scienceTimelineStyles as b } from '../../styles/scienceTimeline.styles';
import type { Template } from '../../../../types/template';
import type { TimelineEntry } from '../../../../../convex/templates/types';

function lastNonPeakIndex(timeline: TimelineEntry[]): number {
  for (let i = timeline.length - 1; i >= 0; i -= 1) {
    if (!timeline[i].peak) return i;
  }
  return -1;
}

// Earlier non-peak nodes read as "already settled" (a checkmark); the
// non-peak node right before the peak reads as the current milestone.
function dotVariant(timeline: TimelineEntry[], index: number): 'done' | 'current' | 'peak' {
  if (timeline[index].peak) return 'peak';
  return index === lastNonPeakIndex(timeline) ? 'current' : 'done';
}

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
            const variant = dotVariant(timeline, i);
            return (
              <View key={i} style={[b.tlRow, { paddingBottom: last ? 0 : 20 }]}>
                <View
                  style={[
                    b.tlDot,
                    variant === 'peak' && b.tlDotPeak,
                    variant === 'done' && b.tlDotDone,
                    variant === 'current' && b.tlDotCurrent,
                  ]}
                >
                  {variant === 'peak' ? <Text style={{ fontSize: 15 }}>💎</Text> : null}
                  {variant === 'done' ? (
                    <Check color='#FFFFFF' size={14} strokeWidth={3} />
                  ) : null}
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
