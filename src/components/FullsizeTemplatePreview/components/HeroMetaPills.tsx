/**
 * Hero metadata chips — cadence+duration, category, difficulty.
 *
 * The "Habit Detail" mock shows a 3-chip row; popularity moved out of the hero
 * so the chips describe the commitment, not the crowd.
 */

import React from 'react';
import { View } from 'react-native';
import { Clock, Sprout, Tag } from 'lucide-react-native';

import { iconSizes } from '@/theme/iconSizes';
import { getGrowthTypeMeta } from '@/utils/growthTypeMeta';
import { heroStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';
import {
  FREQUENCY_LABELS,
  CATEGORY_LABELS,
  CATEGORY_DURATION_DEFAULTS,
} from '../FullsizeTemplatePreview.constants';
import { MetadataPill } from './MetadataPill';
import type { Template } from '../../../types/template';

interface HeroMetaPillsProps {
  template: Template;
}

export function HeroMetaPills({ template }: HeroMetaPillsProps) {
  const palette = useDetailPalette();
  const iconProps = {
    color: palette.textSecondary,
    size: iconSizes.small,
    strokeWidth: 2,
  };

  const frequency =
    FREQUENCY_LABELS[template?.frequency] || template?.frequency || 'Daily';
  const category =
    CATEGORY_LABELS[template?.category] || template?.category || 'General';
  const duration = template?.estimatedMinutes
    ? `${template.estimatedMinutes} min`
    : CATEGORY_DURATION_DEFAULTS[template?.category] || '5-10 min';
  const growthMeta = getGrowthTypeMeta(template?.growthType);

  return (
    <View testID='templates-preview-pills' style={heroStyles.pillsRow}>
      <MetadataPill icon={<Clock {...iconProps} />}>
        {`${frequency} · ${duration}`}
      </MetadataPill>
      <MetadataPill icon={<Tag {...iconProps} />}>{category}</MetadataPill>
      {growthMeta ? (
        <MetadataPill icon={<Sprout {...iconProps} />}>
          {`${growthMeta.label} · ~${growthMeta.days}d`}
        </MetadataPill>
      ) : null}
    </View>
  );
}
