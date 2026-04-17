/**
 * ProjectedBanner — bottom row showing projected goal-completion date.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { dashboardStyles as s } from './styles/dashboard.styles';

interface ProjectedBannerProps {
  projectedDate: Date;
}

export const ProjectedBanner = React.memo(function ProjectedBanner({
  projectedDate,
}: ProjectedBannerProps) {
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
