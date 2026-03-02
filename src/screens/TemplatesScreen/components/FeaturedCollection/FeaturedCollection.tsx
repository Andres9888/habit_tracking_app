/**
 * FeaturedCollection - Spotlights a curated template pack
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontFamilies, typography } from '../../../../theme/typography';

interface FeaturedCollectionProps {
  onPress: () => void;
}

export function FeaturedCollection({ onPress }: FeaturedCollectionProps) {
  return (
    <Pressable
      testID="templates-featured-collection"
      accessibilityLabel="Featured collection: Morning Mastery"
      accessibilityRole="button"
      style={s.container}
      onPress={onPress}
    >
      <View style={s.badge}>
        <Text style={s.badgeText}>FEATURED</Text>
      </View>
      <Text style={s.title}>Morning Mastery</Text>
      <Text style={s.description}>
        Start your day with science-backed habits for energy and focus
      </Text>
      <View style={s.chips}>
        {['🌅 Wake Early', '💧 Hydrate', '📝 Journal', '🧘 Meditate'].map(
          (chip) => (
            <View key={chip} style={s.chip}>
              <Text style={s.chipText}>{chip}</Text>
            </View>
          )
        )}
      </View>
      <View style={s.footer}>
        <Text style={s.userCount}>2.4k users</Text>
        <View style={s.cta}>
          <Text style={s.ctaText}>Explore</Text>
        </View>
      </View>
    </Pressable>
  );
}

const p = colors.primary;
const s = StyleSheet.create({
  badge: { backgroundColor: p[100], borderRadius: borderRadius.full, paddingHorizontal: spacing.sm, paddingVertical: 2, alignSelf: 'flex-start' },
  badgeText: { ...typography.caption, color: p[700], fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  chip: { backgroundColor: `${p[600]}10`, borderRadius: borderRadius.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  chipText: { ...typography.caption, color: p[700] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  container: { backgroundColor: colors.light.surfaceMuted, borderColor: colors.border, borderRadius: borderRadius.large, borderWidth: 1, gap: spacing.sm, marginHorizontal: spacing.base, marginTop: spacing.md, padding: spacing.base, ...shadows.card },
  cta: { backgroundColor: p[600], borderRadius: borderRadius.small, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  ctaText: { ...typography.caption, color: '#FFFFFF', fontWeight: '700' },
  description: { ...typography.bodySmall, color: colors.text.secondary },
  footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  title: { fontFamily: fontFamilies.primary.display, fontSize: 17, fontWeight: '700', color: colors.text.primary },
  userCount: { ...typography.caption, color: colors.text.tertiary },
});
