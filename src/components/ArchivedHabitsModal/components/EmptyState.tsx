/**
 * ArchivedHabitsModal EmptyState — migrated to canonical primitive with iconBackplate + actionSlot tip card.
 */
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { typography, fontWeights } from '@/theme/typography';
import { EmptyState as CanonicalEmptyState } from '../../EmptyState/EmptyState';

const tipStyles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.card,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    width: '100%',
  },
  desc: { ...typography.caption, lineHeight: 19 },
  emoji: { fontSize: typography.heading3.fontSize, marginTop: 1 },
  title: { ...typography.caption, fontWeight: fontWeights.semibold, marginBottom: 3 },
});

export function EmptyState() {
  const { colors } = useThemeColors();

  const tipCard = (
    <View style={[tipStyles.card, { backgroundColor: colors.gray[50] }]}>
      <Text style={tipStyles.emoji}>💡</Text>
      <View style={{ flex: 1 }}>
        <Text style={[tipStyles.title, { color: colors.text.tertiary }]}>Tip</Text>
        <Text style={[tipStyles.desc, { color: colors.text.tertiary }]}>
          Archiving is reversible. Restore any habit and pick up right where you left off.
        </Text>
      </View>
    </View>
  );

  return (
    <CanonicalEmptyState
      variant='noResults'
      icon='🌱'
      iconBackplate={{
        alignItems: 'center',
        backgroundColor: colors.gray[200],
        borderRadius: borderRadius.xl,
        height: 80,
        justifyContent: 'center',
        width: 80,
      }}
      headline='All habits are active'
      description='Swipe left on any habit to archive it. Your progress and streaks are always preserved.'
      actionSlot={tipCard}
      hideCTA
    />
  );
}
