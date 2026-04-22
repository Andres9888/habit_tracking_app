/**
 * CategoryGroupHeader — tappable accordion row header.
 * Renders emoji · label/subtitle · count · animated chevron.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import {
  fontFamilies,
  fontWeights,
  typography,
} from '../../../../theme/typography';
import { CategoryChevron } from './CategoryChevron';

interface CategoryGroupHeaderProps {
  count: number;
  expanded?: boolean;
  icon: string;
  label: string;
  onToggle?: () => void;
  subtitle?: string;
}

export function CategoryGroupHeader({
  count,
  expanded = false,
  icon,
  label,
  onToggle,
  subtitle,
}: CategoryGroupHeaderProps) {
  const { colors } = useThemeColors();

  const content = (
    <View style={s.row}>
      <Text style={s.icon}>{icon}</Text>
      <View style={s.textStack}>
        <Text style={[s.label, { color: colors.text.primary }]}>{label}</Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={[s.subtitle, { color: colors.text.secondary }]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Text style={[s.count, { color: colors.text.tertiary }]}>{count}</Text>
      {onToggle ? <CategoryChevron expanded={expanded} /> : null}
    </View>
  );

  if (!onToggle) return <View style={s.container}>{content}</View>;

  return (
    <Pressable
      accessibilityLabel={`${label}, ${expanded ? 'collapse' : 'expand'}`}
      accessibilityRole='button'
      accessibilityState={{ expanded }}
      style={s.container}
      onPress={onToggle}
    >
      {content}
    </Pressable>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  count: {
    ...typography.caption,
    fontFamily: fontFamilies.monospace,
    paddingHorizontal: spacing.sm,
  },
  icon: { fontSize: 20, lineHeight: 24 },
  label: { ...typography.body, fontWeight: fontWeights.bold },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  subtitle: { ...typography.caption, marginTop: 1 },
  textStack: { flex: 1, minWidth: 0 },
});
