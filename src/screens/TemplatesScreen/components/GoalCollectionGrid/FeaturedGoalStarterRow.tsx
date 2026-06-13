/**
 * FeaturedGoalStarterRow — 3 inline starter habits previewing the featured goal.
 * Each mini card opens the template preview on tap.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { colors } from '@/theme/colors';
import { withAlpha } from '@/theme/colors/alpha';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';

interface FeaturedGoalStarterRowProps {
  accentColor: string;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

export function FeaturedGoalStarterRow({
  accentColor,
  onPreview,
  templates,
}: FeaturedGoalStarterRowProps) {
  if (templates.length === 0) return null;
  return (
    <View style={s.row}>
      {templates.map((template) => (
        <AnimatedPressable
          key={template._id}
          accessibilityHint='Opens the habit preview'
          accessibilityLabel={`Preview ${template.name}`}
          accessibilityRole='button'
          animationConfig={{ pressScale: 0.97 }}
          hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
          style={[s.card, { borderColor: `${accentColor}33` }]}
          onPress={() => {
            void triggerHaptic('tap');
            onPreview(template);
          }}
        >
          <Text style={s.icon}>{template.icon}</Text>
          <Text numberOfLines={2} style={[s.name, { color: accentColor }]}>
            {template.name}
          </Text>
        </AnimatedPressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: withAlpha(colors.text.inverse, 0.55),
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    minHeight: 76,
    padding: 8,
  },
  icon: { fontSize: 22, lineHeight: 26 },
  name: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 11,
    fontWeight: fontWeights.semibold,
    lineHeight: 14,
    marginTop: 4,
  },
  row: { flexDirection: 'row', gap: 8, marginTop: 14 },
});
