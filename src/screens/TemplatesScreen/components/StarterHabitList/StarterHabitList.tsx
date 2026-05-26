/**
 * First-time user starter habit rows with one-tap add.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';
import { AddButton } from '../TrendingCard/AddButton';

interface StarterHabitListProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBrowseByGoal: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

export function StarterHabitList({
  importedTemplateIds,
  importingTemplateId,
  onBrowseByGoal,
  onImport,
  onPreview,
  templates,
}: StarterHabitListProps) {
  const { colors } = useThemeColors();

  return (
    <View style={s.wrap}>
      <View
        style={[
          s.banner,
          {
            backgroundColor: colors.primary[50],
            borderColor: colors.primary[200],
          },
        ]}
      >
        <Text style={[s.eyebrow, { color: colors.primary[700] }]}>NEW HERE?</Text>
        <Text style={[s.title, { color: colors.text.primary }]}>
          Start with these 5
        </Text>
        <Text style={[s.subtitle, { color: colors.text.secondary }]}>
          A simple starter pack — proven, easy to stick with.
        </Text>
      </View>

      {templates.map((item) => (
        <Pressable
          key={item._id}
          accessibilityLabel={`Preview ${item.name}`}
          accessibilityRole='button'
          style={[
            s.row,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: importedTemplateIds.has(item._id) ? 0.55 : 1,
            },
            shadows.subtle,
          ]}
          onPress={() => onPreview(item)}
        >
          <View style={[s.iconBox, { backgroundColor: `${item.iconColor}25` }]}>
            <Text style={s.icon}>{item.icon}</Text>
          </View>
          <View style={s.copy}>
            <Text
              numberOfLines={1}
              style={[s.name, { color: colors.text.primary }]}
            >
              {item.name}
            </Text>
            <Text style={[s.meta, { color: colors.text.secondary }]}>
              {item.estimatedMinutes ? `${item.estimatedMinutes} min · ` : ''}
              {item.frequency}
            </Text>
          </View>
          <AddButton
            isImported={importedTemplateIds.has(item._id)}
            isImporting={importingTemplateId === item._id}
            name={item.name}
            onImport={() => onImport(item)}
          />
        </Pressable>
      ))}

      <Pressable
        accessibilityLabel='Browse habits by goal'
        accessibilityRole='button'
        hitSlop={8}
        style={[
          s.escape,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={onBrowseByGoal}
      >
        <Text style={[s.escapeText, { color: colors.text.primary }]}>
          Or browse by goal
        </Text>
        <Text style={[s.escapeArrow, { color: colors.text.primary }]}>→</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  banner: {
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.base,
  },
  copy: { flex: 1, minWidth: 0 },
  escape: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    marginTop: spacing.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  escapeArrow: { ...typography.bodySmall, fontWeight: fontWeights.bold },
  escapeText: { ...typography.bodySmall, fontWeight: fontWeights.semibold },
  eyebrow: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  icon: { fontSize: 24 },
  iconBox: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  meta: { ...typography.caption, marginTop: 2 },
  name: { ...typography.bodySmall, fontWeight: fontWeights.bold },
  row: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  subtitle: { ...typography.caption, lineHeight: 18, marginTop: 4 },
  title: { ...typography.heading3, fontWeight: fontWeights.bold },
  wrap: { paddingHorizontal: spacing.base },
});
