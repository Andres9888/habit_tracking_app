/**
 * "What to expect" — a vertical progression timeline. Nodes use neutral
 * milestone icons (this screen shows before the habit is added), and the final
 * `peak` node is gold-washed to mark the automaticity milestone.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { Circle, Clock, Sparkles, Star } from 'lucide-react-native';

import { colors } from '@/theme';
import { SecLabel } from './SecLabel';
import { scienceStyles as s } from '../../styles/science.styles';
import { timelinePathStyles as t } from '../../styles/timelinePath.styles';
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
          <View style={t.spine} />
          {timeline.map((node, i) => {
            const last = i === timeline.length - 1;
            const Icon = node.peak ? Star : i === 0 ? Sparkles : Circle;
            const tint = node.peak ? colors.streak[700] : colors.primary[700];
            return (
              <View key={i} style={[t.row, { paddingBottom: last ? 0 : 16 }]}>
                <View style={[t.node, node.peak && t.nodePeak]}>
                  <Icon color={tint} size={node.peak ? 18 : 15} strokeWidth={2.2} />
                </View>
                <View style={[{ flex: 1, minWidth: 0 }, node.peak && t.peakWash]}>
                  <Text style={[t.when, node.peak && t.whenPeak]}>{node.when}</Text>
                  <Text style={t.title}>{node.title}</Text>
                  <Text style={t.desc}>{node.description}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
