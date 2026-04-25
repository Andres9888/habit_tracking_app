/**
 * FeaturedGoalStarterRow — 3 inline starter habits previewing the featured goal.
 * Each mini card opens the template preview on tap.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { fontFamilies, fontWeights } from '@/theme/typography';

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
  if (!templates.length) return null;
  return (
    <View style={s.row}>
      {templates.map((template) => (
        <Pressable
          key={template._id}
          accessibilityHint='Opens the habit preview'
          accessibilityLabel={`Preview ${template.name}`}
          accessibilityRole='button'
          style={({ pressed }) => [
            s.card,
            { borderColor: `${accentColor}33` },
            pressed && s.pressed,
          ]}
          onPress={() => onPreview(template)}
        >
          <Text style={s.icon}>{template.icon}</Text>
          <Text numberOfLines={2} style={[s.name, { color: accentColor }]}>
            {template.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.55)',
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
  pressed: { opacity: 0.78 },
  row: { flexDirection: 'row', gap: 8, marginTop: 14 },
});
