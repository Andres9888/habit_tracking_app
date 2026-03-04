/**
 * ForYouSection — personalized recommendation section with warm gradient background.
 *
 * Uses Common Region (Palmer, 1992) via warm tint to visually separate from other sections.
 * Renders "✨ For You" header + SMART badge + recommendation cards.
 */

import { StyleSheet, Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { colors } from '../../../../theme/colors';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { ForYouCard } from './ForYouCard';
import type { ForYouSectionProps } from './ForYouSection.types';

export function ForYouSection({
  importedIds,
  importingIds,
  onImport,
  onPreview,
  recommendations,
}: ForYouSectionProps) {
  if (recommendations.length === 0) return null;

  return (
    <View style={s.container}>
      <View style={s.headerRow}>
        <Text style={s.title}>✨ For You</Text>
        <View style={s.badge}>
          <Sparkles color={colors.primary[700]} size={12} />
          <Text style={s.badgeText}>SMART</Text>
        </View>
      </View>
      <Text style={s.subtitle}>Based on your current habits</Text>
      <View style={s.cards}>
        {recommendations.map((rec) => (
          <ForYouCard
            key={rec.template._id}
            connectionCue={rec.connectionCue}
            cueHighlight={rec.cueHighlight}
            icon={rec.template.icon}
            iconColor={rec.template.iconColor}
            isImported={importedIds.has(rec.template._id)}
            isImporting={importingIds.has(rec.template._id)}
            name={rec.template.name}
            onImport={() => onImport(rec.template)}
            onPress={() => onPreview(rec.template)}
          />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: '#fefbf6',
    borderBottomColor: '#f5ead8',
    borderBottomWidth: 1.5,
    borderTopColor: '#f5ead8',
    borderTopWidth: 1.5,
    marginTop: spacing.base,
    padding: spacing.base + 4,
  },
  headerRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  title: { color: colors.text.primary, fontSize: 20, fontWeight: '700' },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.chip,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: colors.primary[700],
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 2,
  },
  cards: { gap: 10, marginTop: 14 },
});
