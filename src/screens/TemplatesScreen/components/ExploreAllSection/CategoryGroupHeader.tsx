/**
 * Category header inside Explore All — tappable to expand/collapse habits.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

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
  expanded = true,
  icon,
  label,
  onToggle,
  subtitle,
}: CategoryGroupHeaderProps) {
  const { colors } = useThemeColors();
  const Chevron = expanded ? ChevronDown : ChevronRight;

  const content = (
    <>
      <View style={s.topLine}>
        <Text style={s.icon}>{icon}</Text>
        <Text style={[s.label, { color: colors.text.primary }]}>{label}</Text>
        <Text style={[s.count, { color: colors.text.tertiary }]}>· {count}</Text>
        {onToggle ? (
          <View style={s.chevron}>
            <Chevron color={colors.text.tertiary} size={18} strokeWidth={2.5} />
          </View>
        ) : null}
      </View>
      {subtitle ? (
        <Text style={[s.subtitle, { color: colors.text.secondary }]}>
          {subtitle}
        </Text>
      ) : null}
    </>
  );

  if (!onToggle) {
    return (
      <View style={[s.container, { backgroundColor: colors.background }]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityLabel={`${label}, ${expanded ? 'collapse' : 'expand'}`}
      accessibilityRole='button'
      accessibilityState={{ expanded }}
      style={[s.container, { backgroundColor: colors.background }]}
      onPress={onToggle}
    >
      {content}
    </Pressable>
  );
}

const s = StyleSheet.create({
  chevron: { marginLeft: 'auto' },
  container: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  count: { ...typography.caption },
  icon: { fontSize: 17 },
  label: { ...typography.body, fontWeight: fontWeights.bold },
  subtitle: { ...typography.caption, marginTop: 2, paddingLeft: 26 },
  topLine: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
});
