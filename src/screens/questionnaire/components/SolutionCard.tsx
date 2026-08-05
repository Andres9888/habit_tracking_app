/**
 * SolutionCard - Displays a personalized solution based on user pain points.
 */

import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography } from '@/theme/typography';
import { borderRadius, spacing, shadows } from '@/theme/spacing';
import type { Solution } from '../data/solutions';

interface SolutionCardProps {
  solution: Solution;
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: borderRadius.large,
        padding: spacing.lg,
        marginBottom: spacing.base,
        ...shadows.card,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
        <Text style={{ fontSize: 24, marginRight: spacing.md }}>{solution.emoji}</Text>
        <Text
          style={{
            ...typography.heading3,
            color: colors.primary[700],
            flex: 1,
          }}
        >
          {solution.title}
        </Text>
      </View>
      <Text style={{ ...typography.body, color: colors.text.secondary }}>
        {solution.description}
      </Text>
    </View>
  );
}
