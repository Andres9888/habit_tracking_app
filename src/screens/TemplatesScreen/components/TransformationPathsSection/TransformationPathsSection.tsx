/**
 * Collapsible transformation paths — full goal grid when expanded,
 * compact goal chips when collapsed (returning users).
 */

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { iconSizes } from '../../../../theme/iconSizes';
import { spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';
import type { GoalCollection } from '../../data/goalCollections';
import { GoalCollectionGrid } from '../GoalCollectionGrid';
import { GoalQuickPickChips } from '../GoalQuickPickChips';
import { SectionHeader } from '../SectionHeader';

interface TransformationPathsSectionProps {
  collapsible: boolean;
  defaultExpanded: boolean;
  featuredBadgeLabel?: string;
  featuredGoalId: string;
  featuredStarterTemplates: Doc<'templates'>[];
  habitCountsByGoalId: Record<string, number>;
  onPreviewStarter: (template: Doc<'templates'>) => void;
  onSelectGoal: (goal: GoalCollection) => void;
}

export function TransformationPathsSection({
  collapsible,
  defaultExpanded,
  featuredBadgeLabel,
  featuredGoalId,
  featuredStarterTemplates,
  habitCountsByGoalId,
  onPreviewStarter,
  onSelectGoal,
}: TransformationPathsSectionProps) {
  const { colors } = useThemeColors();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const showGrid = !collapsible || expanded;

  return (
    <View style={s.wrap}>
      {collapsible ? (
        <Pressable
          accessibilityLabel={
            expanded
              ? 'Collapse transformation paths'
              : 'Expand transformation paths'
          }
          accessibilityRole='button'
          onPress={() => setExpanded((v) => !v)}
        >
          <SectionHeader
            rightSlot={
              <View
                style={[
                  s.chevron,
                  {
                    backgroundColor: colors.surface,
                    transform: [{ rotate: expanded ? '180deg' : '0deg' }],
                  },
                ]}
              >
                <ChevronDown
                  color={colors.text.secondary}
                  size={iconSizes.small}
                />
              </View>
            }
            subtitle={
              expanded
                ? 'Curated stacks for common goals'
                : 'Tap a goal below or expand for full paths'
            }
            title='Pick your transformation'
          />
        </Pressable>
      ) : (
        <View style={s.staticHeader}>
          <SectionHeader
            subtitle='Curated stacks for common goals'
            title='Pick your transformation'
          />
        </View>
      )}

      {collapsible && !expanded ? (
        <GoalQuickPickChips
          featuredGoalId={featuredGoalId}
          onSelectGoal={onSelectGoal}
        />
      ) : null}

      {showGrid ? (
        <GoalCollectionGrid
          featuredBadgeLabel={featuredBadgeLabel}
          featuredGoalId={featuredGoalId}
          featuredStarterTemplates={featuredStarterTemplates}
          habitCountsByGoalId={habitCountsByGoalId}
          onPreviewStarter={onPreviewStarter}
          onSelectGoal={onSelectGoal}
        />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  chevron: {
    alignItems: 'center',
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    marginRight: spacing.base,
    marginTop: spacing.md,
    width: 28,
  },
  staticHeader: { paddingBottom: spacing.xs },
  wrap: { marginTop: spacing.sm },
});
