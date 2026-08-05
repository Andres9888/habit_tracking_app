/**
 * HabitRankingsList EmptyState — uses canonical EmptyState primitive (compact).
 */

import React from 'react';
import { ListOrdered } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { iconSizes } from '@/theme/iconSizes';
import { EmptyState as CanonicalEmptyState } from '../EmptyState/EmptyState';

export function EmptyState() {
  return (
    <CanonicalEmptyState
      variant='noResults'
      size='compact'
      icon={<ListOrdered color={colors.primary[600]} size={iconSizes.xl} strokeWidth={1.5} />}
      headline='No Habits to Rank Yet'
      description='Complete some habits to see your rankings here'
      hideCTA
    />
  );
}
