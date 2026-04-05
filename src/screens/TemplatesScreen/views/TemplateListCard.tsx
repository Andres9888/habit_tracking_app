/**
 * Compact template result card for filtered list views.
 */

import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Check, Search } from 'lucide-react-native';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../theme/ThemeContext';
import { springs } from '../../../theme/animations';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography, fontWeights } from '../../../theme/typography';
import { triggerHaptic } from '@/utils/haptics';

interface TemplateListCardProps {
  getCategoryLabel: (categoryId: string) => string;
  importedTemplateIds: Set<string>;
  item: Doc<'templates'>;
  importingTemplateId: Id<'templates'> | null;
  searchQuery: string;
  onImport: (templateId: Id<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

function getMatchReason(
  template: Doc<'templates'>,
  searchQuery: string,
  getCategoryLabel: (categoryId: string) => string
) {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return null;

  if ((template.name ?? '').toLowerCase().includes(query)) {
    return 'Match: title';
  }

  if ((template.description ?? '').toLowerCase().includes(query)) {
    return 'Match: description';
  }

  if ((template.scientificReference ?? '').toLowerCase().includes(query)) {
    return 'Match: research summary';
  }

  if (getCategoryLabel(template.category).toLowerCase().includes(query)) {
    return `Match: ${getCategoryLabel(template.category)} category`;
  }

  if ((template.frequency ?? '').toLowerCase().includes(query)) {
    return 'Match: frequency';
  }

  return 'Match: template details';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TemplateListCard({
  getCategoryLabel,
  importedTemplateIds,
  item,
  importingTemplateId,
  searchQuery,
  onImport,
  onPreview,
}: TemplateListCardProps) {
  const { colors } = useThemeColors();
  const isImporting = importingTemplateId === item._id;
  const isImported = importedTemplateIds.has(item._id);
  const categoryLabel = getCategoryLabel(item.category);
  const hasResearch = Boolean(item.scientificReference);
  const matchReason = getMatchReason(item, searchQuery, getCategoryLabel);

  const addScale = useSharedValue(1);

  useEffect(() => {
    if (isImported) {
      addScale.value = withSpring(1.15, springs.responsive);
      const timeout = setTimeout(() => {
        addScale.value = withSpring(1, springs.responsive);
      }, 120);
      return () => clearTimeout(timeout);
    }
  }, [isImported, addScale]);

  const addAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addScale.value }],
  }));

  return (
    <Pressable
      accessibilityLabel={`${item.name} template`}
      accessibilityRole='button'
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: isImporting ? 0.72 : 1,
        },
      ]}
      onPress={() => onPreview(item)}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: `${item.iconColor || colors.primary[600]}30` },
          ]}
        >
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>

        <View style={styles.contentColumn}>
          <Text
            numberOfLines={2}
            style={[styles.title, { color: colors.text.primary }]}
          >
            {item.name}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.description, { color: colors.text.secondary }]}
          >
            {item.description}
          </Text>
        </View>

        <AnimatedPressable
          accessibilityLabel={
            isImported
              ? `${item.name} added`
              : `Import ${item.name} template`
          }
          accessibilityRole='button'
          disabled={isImported || isImporting}
          style={[
            styles.actionButton,
            {
              backgroundColor: isImported
                ? colors.primary[100]
                : colors.primary[600],
            },
            addAnimatedStyle,
          ]}
          onPress={(event) => {
            event.stopPropagation();
            void triggerHaptic('selection');
            onImport(item._id);
          }}
        >
          {isImporting ? (
            <ActivityIndicator color={colors.text.inverse} size='small' />
          ) : isImported ? (
            <Check
              color={colors.primary[700]}
              size={16}
              strokeWidth={3}
            />
          ) : (
            <Text
              style={[styles.actionLabel, { color: colors.text.inverse }]}
            >
              Add
            </Text>
          )}
        </AnimatedPressable>
      </View>

      <View style={styles.metaRow}>
        {item.frequency ? (
          <View
            style={[
              styles.metaPill,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.metaLabel, { color: colors.text.secondary }]}>
              {item.frequency}
            </Text>
          </View>
        ) : null}
        <View
          style={[
            styles.metaPill,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.metaLabel, { color: colors.text.secondary }]}>
            {categoryLabel}
          </Text>
        </View>
        {hasResearch ? (
          <View
            style={[
              styles.metaPill,
              {
                backgroundColor: colors.primary[100],
                borderColor: colors.primary[300],
              },
            ]}
          >
            <Text style={[styles.metaLabel, { color: colors.primary[700] }]}>
              Science
            </Text>
          </View>
        ) : null}
      </View>

      {matchReason ? (
        <View
          style={[
            styles.matchRow,
            { backgroundColor: `${colors.primary[600]}10` },
          ]}
        >
          <Search
            color={colors.primary[700]}
            size={12}
            strokeWidth={2.5}
          />
          <Text style={[styles.matchText, { color: colors.primary[700] }]}>
            {matchReason}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    minWidth: 78,
    paddingHorizontal: spacing.md,
  },
  actionLabel: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
  },
  card: {
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    padding: spacing.base,
  },
  contentColumn: {
    flex: 1,
    gap: 4,
  },
  description: {
    ...typography.bodySmall,
    lineHeight: 18,
  },
  iconText: {
    fontSize: 22,
  },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  matchRow: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    gap: 6,
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  matchText: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
  },
  metaLabel: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
  },
  metaPill: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  title: {
    ...typography.heading3,
    fontSize: 18,
    lineHeight: 22,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
});
