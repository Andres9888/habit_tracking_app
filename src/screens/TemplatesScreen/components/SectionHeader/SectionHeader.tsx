/**
 * SectionHeader — shared header for curated sections on the habit library.
 * One visual rhythm: title + optional subtitle on the left, optional slot
 * on the right. Used by PopularSection, PremiumPacksSection, ExploreAllSection.
 */

import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

interface SectionHeaderProps {
  icon?: string;
  iconBg?: string;
  rightSlot?: ReactNode;
  subtitle?: string;
  title: string;
}

export function SectionHeader({
  icon,
  iconBg,
  rightSlot,
  subtitle,
  title,
}: SectionHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View style={s.row}>
      <View style={s.titleRow}>
        {icon ? (
          <View style={[s.iconBox, { backgroundColor: iconBg }]}>
            <Text style={s.icon}>{icon}</Text>
          </View>
        ) : null}
        <View style={s.textBlock}>
          <Text style={[s.title, { color: colors.text.primary }]}>{title}</Text>
          {subtitle ? (
            <Text style={[s.subtitle, { color: colors.text.secondary }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {rightSlot ? <View style={s.right}>{rightSlot}</View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  icon: { fontSize: 15 },
  iconBox: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flexShrink: 0,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  right: { flexShrink: 0 },
  row: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  subtitle: { ...typography.caption, marginTop: 2 },
  textBlock: { flex: 1, minWidth: 0 },
  title: { ...typography.heading3 },
  titleRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
});
