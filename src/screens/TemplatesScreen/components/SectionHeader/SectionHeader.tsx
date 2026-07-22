/**
 * SectionHeader — category header for the grouped habit-library catalog.
 * Renders an optional inline emoji with title/subtitle and a right-side slot.
 */

import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import { useBrowserPalette } from '../../browserPalette';

interface SectionHeaderProps {
  icon?: string;
  rightSlot?: ReactNode;
  subtitle?: string;
  title: string;
}

export function SectionHeader({
  icon,
  rightSlot,
  subtitle,
  title,
}: SectionHeaderProps) {
  const palette = useBrowserPalette();
  return (
    <View style={s.row}>
      <View style={s.titleRow}>
        {icon ? (
          <View style={[s.iconTile, { backgroundColor: palette.iconTile }]}>
            <Text style={s.icon}>{icon}</Text>
          </View>
        ) : null}
        <View style={s.textBlock}>
          <Text style={[s.title, { color: palette.textPrimary }]}>{title}</Text>
          {subtitle ? (
            <Text style={[s.subtitle, { color: palette.textSecondary }]}>
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
  icon: { fontSize: 22 },
  iconTile: {
    alignItems: 'center',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  right: { flexShrink: 0 },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  subtitle: { ...typography.body, fontSize: 15, marginTop: 2 },
  textBlock: { flex: 1, minWidth: 0 },
  title: { ...typography.heading1, fontSize: 22 },
  titleRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
});
