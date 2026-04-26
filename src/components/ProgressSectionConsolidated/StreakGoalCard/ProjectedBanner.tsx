/**
 * ProjectedBanner — bottom row showing projected goal-completion date.
 */

import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme/ThemeContext';
import { createDashboardStyles } from './styles/dashboard.styles';

interface ProjectedBannerProps {
  projectedDate: Date;
}

export const ProjectedBanner = React.memo(function ProjectedBanner({
  projectedDate,
}: ProjectedBannerProps) {
  const { colors } = useThemeColors();
  const s = useMemo(() => createDashboardStyles(colors), [colors]);
  const formatted = projectedDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
  return (
    <View style={s.bannerCard}>
      <Text style={s.bannerLabel}>On track to hit goal</Text>
      <Text style={s.bannerDate}>{formatted}</Text>
    </View>
  );
});
