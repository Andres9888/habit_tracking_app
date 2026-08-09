/**
 * "What to expect" — a vertical progression timeline. The final `peak` node is
 * gold-haloed to mark the automaticity milestone. Renders only with timeline data.
 *
 * The closing note is the only place on the page that addresses missing a day.
 * Streak-break shame is the dominant churn mechanic in this category, and
 * every other block here describes the habit going well — so a reader forms
 * the expectation of an unbroken run before they have started. Naming the
 * miss up front is what makes the timeline honest rather than aspirational.
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
                          borderColor: palette.green,
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
      {/* Claim is checked against the real formula, not written to reassure:
          a missed day decays strength proportionally (`calculateNewStrength`
          in convex/habitStrength/momentum.ts), it never zeroes it. Deliberately
          says "strength", not "progress" — the streak counter DOES reset on a
          miss, and promising otherwise would break the moment it happened. */}
      <Text style={[b.timelineNote, { color: palette.textTertiary }]}>
        Miss a day and your strength doesn&apos;t reset — it dips slightly and
        starts building again the next time you show up.
      </Text>
    </View>
  );
}
