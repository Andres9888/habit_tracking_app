/**
 * GoalHero - Full-bleed goal header for GoalDrillView.
 * Mirrors CategoryHero but surfaces goal.promise (which CategoryHero's
 * subtitle slot can't carry for multi-category goals).
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import type { GoalCollection } from '../data/goalCollections';

interface GoalHeroProps {
  goal: GoalCollection;
  habitCount: number;
  onBack: () => void;
}

export function GoalHero({ goal, habitCount, onBack }: GoalHeroProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const countLabel = `📋 ${habitCount} ${habitCount === 1 ? 'habit' : 'habits'}`;

  return (
    <View
      style={[
        s.hero,
        {
          backgroundColor: goal.bgColor,
          borderBottomColor: colors.border,
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
        <ChevronLeft color={goal.textColor} size={iconSizes.medium} strokeWidth={2.5} />
        <Text style={[s.backLabel, { color: goal.textColor }]}>Library</Text>
      </Pressable>

      <View style={s.content}>
        <View style={[s.iconWrap, { backgroundColor: 'rgba(0,0,0,0.06)' }]}>
          <Text style={s.iconText}>{goal.emoji}</Text>
        </View>
        <View style={s.textBlock}>
          <Text style={[s.title, { color: goal.textColor }]}>{goal.label}</Text>
          <Text
            style={[s.subtitle, { color: colors.text.tertiary }]}
            numberOfLines={3}
          >
            {goal.promise}
          </Text>
          <View style={s.badgeRow}>
            <View
              style={[
                s.countBadge,
                {
                  backgroundColor: goal.bgColor,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[s.countText, { color: goal.textColor }]}>
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
