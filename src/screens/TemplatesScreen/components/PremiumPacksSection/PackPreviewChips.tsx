/**
 * PackPreviewChips - Habit preview chips for Recognition over Recall (Nielsen #6)
 */

import { StyleSheet, Text, View } from 'react-native';
import type { PremiumPackHabit } from '../../data/premiumPacks';

const MAX_VISIBLE = 2;

interface PackPreviewChipsProps {
  habits: PremiumPackHabit[];
}

export function PackPreviewChips({ habits }: PackPreviewChipsProps) {
  const visible = habits.slice(0, MAX_VISIBLE);
  const remaining = habits.length - MAX_VISIBLE;

  return (
    <View style={s.container}>
      {visible.map((h) => (
        <View key={h.name} style={s.chip}>
          <Text style={s.chipText}>
            {h.emoji} {h.name}
          </Text>
        </View>
      ))}
      {remaining > 0 && (
        <View style={s.chip}>
          <Text style={s.chipText}>+{remaining}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  chip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  chipText: { color: 'rgba(255,255,255,0.85)', fontSize: 10 },
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
});
