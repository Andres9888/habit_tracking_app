/**
 * Empty state for category/goal drill views with no templates.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

interface DrillListEmptyStateProps {
  onBrowseCategories?: () => void;
  subtitle?: string;
  title?: string;
}

export function DrillListEmptyState({
  onBrowseCategories,
  subtitle = 'New habits are added regularly.',
  title = 'Nothing here yet',
}: DrillListEmptyStateProps) {
  const { colors } = useThemeColors();

  return (
    <View style={s.container}>
      <Text style={s.emoji}>🌱</Text>
      <Text style={[s.title, { color: colors.text.primary }]}>{title}</Text>
      <Text style={[s.subtitle, { color: colors.text.secondary }]}>
        {subtitle}
      </Text>
      {onBrowseCategories ? (
        <Pressable
          accessibilityRole='button'
          style={[
            s.button,
            {
              backgroundColor: colors.status.successLight,
              borderColor: colors.status.successText,
            },
          ]}
          onPress={onBrowseCategories}
        >
          <Text style={[s.buttonText, { color: colors.status.successText }]}>
            Browse all categories
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  button: {
    borderRadius: 999,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  buttonText: { ...typography.bodySmall, fontWeight: '600' },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },
  emoji: { fontSize: 36 },
  subtitle: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  title: { ...typography.heading3, marginTop: spacing.sm, textAlign: 'center' },
});
