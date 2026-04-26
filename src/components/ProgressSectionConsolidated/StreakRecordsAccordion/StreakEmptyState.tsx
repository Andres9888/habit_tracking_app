/**
 * StreakEmptyState — shown when no streak records exist.
 * Migrated to canonical EmptyState primitive (compact, with backplated flame icon).
 */

import React from 'react';
import { Flame } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { iconSizes } from '@/theme/iconSizes';
import { EmptyState } from '../../EmptyState/EmptyState';

export function StreakEmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <EmptyState
      variant='noResults'
      size='compact'
      icon={
        <Flame
          color={isDark ? '#FDBA74' : '#F97316'}
          size={iconSizes.medium}
          strokeWidth={1.5}
        />
      }
      iconBackplate={{
        alignItems: 'center',
        backgroundColor: isDark ? '#431407' : '#FFF7ED',
        borderRadius: borderRadius.xl,
        height: 40,
        justifyContent: 'center',
        width: 40,
      }}
      headline='No Streaks Yet'
      description='Complete 2+ consecutive days to start tracking streaks'
      hideCTA
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        marginTop: 12,
        padding: spacing.lg,
        shadowColor: colors.text.primary,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      }}
    />
  );
}
