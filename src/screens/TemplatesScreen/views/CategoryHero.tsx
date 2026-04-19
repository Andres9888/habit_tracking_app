/**
 * CategoryHero - Full-bleed category header for CategoryDrillView.
 * Replaces the plain ScreenHeader with a colored banner that uses
 * the category's own bgColor, icon, label, and subtitle.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import type { CategoryMeta } from '../data/categoryMeta.types';

interface CategoryHeroProps {
  habitCount: number;
  meta: CategoryMeta;
  onBack: () => void;
}

export function CategoryHero({
  habitCount,
  meta,
  onBack,
}: CategoryHeroProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const countLabel = `📋 ${habitCount} ${habitCount === 1 ? 'habit' : 'habits'}`;

  return (
    <View
      style={[
        s.hero,
        {
          backgroundColor: meta.bgColor,
          borderBottomColor: meta.borderColor,
          paddingTop: insets.top + spacing.sm,
        },
      ]}
    >
      <Pressable
        accessibilityLabel='Go back'
        accessibilityRole='button'
        hitSlop={8}
        style={s.backBtn}
        onPress={onBack}
      >
        <ChevronLeft color={meta.textColor} size={20} strokeWidth={2.5} />
        <Text style={[s.backLabel, { color: meta.textColor }]}>Library</Text>
      </Pressable>

      <View style={s.content}>
        <View style={[s.iconWrap, { backgroundColor: meta.borderColor }]}>
          <Text style={s.iconText}>{meta.icon}</Text>
        </View>
        <View style={s.textBlock}>
          <Text style={[s.title, { color: meta.textColor }]}>{meta.label}</Text>
          {meta.subtitle ? (
            <Text
              style={[s.subtitle, { color: colors.text.tertiary }]}
              numberOfLines={3}
            >
              {meta.subtitle}
            </Text>
          ) : null}
          <View style={s.badgeRow}>
            <View
              style={[
                s.countBadge,
                {
                  backgroundColor: meta.bgColor,
                  borderColor: meta.borderColor,
                },
              ]}
            >
              <Text style={[s.countText, { color: meta.textColor }]}>
                {countLabel}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  backBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  backLabel: { ...typography.body, fontWeight: fontWeights.semibold },
  badgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  content: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  countBadge: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  countText: { ...typography.caption, fontWeight: fontWeights.semibold },
  hero: {
    borderBottomWidth: 1,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },
  iconText: { fontSize: 26 },
  iconWrap: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  subtitle: { ...typography.bodySmall, marginTop: 2 },
  textBlock: { flex: 1 },
  title: { ...typography.heading2, letterSpacing: -0.4 },
});
