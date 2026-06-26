/**
 * Hero metadata pills — frequency, category, duration, growth, popularity.
 * The pill surface is neutral; `iconColor` tints only the lucide glyphs.
 */

import React from 'react';
import { View } from 'react-native';
import { Clock, Sparkles, Sprout, Users } from 'lucide-react-native';

import { iconSizes } from '@/theme/iconSizes';
import { getGrowthTypeMeta } from '@/utils/growthTypeMeta';
import { heroStyles } from '../styles';
import {
  FREQUENCY_LABELS,
  CATEGORY_LABELS,
  CATEGORY_DURATION_DEFAULTS,
} from '../FullsizeTemplatePreview.constants';
import { formatPopularity } from '../../../screens/TemplatesScreen/components/TrendingCard/formatPopularity';
import { MetadataPill } from './MetadataPill';
import type { Template } from '../../../types/template';

interface HeroMetaPillsProps {
  template: Template;
  iconColor: string;
}

export function HeroMetaPills({ template, iconColor }: HeroMetaPillsProps) {
  const frequency =
    FREQUENCY_LABELS[template?.frequency] || template?.frequency || 'Daily';
  const category =
    CATEGORY_LABELS[template?.category] || template?.category || 'General';
  const duration = CATEGORY_DURATION_DEFAULTS[template?.category] || '5-10 min';
  const popularity = template?.popularityScore ?? 0;
  const growthMeta = getGrowthTypeMeta(template?.growthType);
  const sz = iconSizes.small;

  return (
    <View testID='templates-preview-pills' style={heroStyles.pillsRow}>
      <MetadataPill icon={<Clock color={iconColor} size={sz} strokeWidth={2} />}>
        {frequency}
      </MetadataPill>
      <MetadataPill icon={<Sparkles color={iconColor} size={sz} strokeWidth={2} />}>
        {category}
      </MetadataPill>
      <MetadataPill>{`⏱️ ${duration}`}</MetadataPill>
      {growthMeta ? (
        <MetadataPill icon={<Sprout color={iconColor} size={sz} strokeWidth={2} />}>
          {`${growthMeta.label} · ~${growthMeta.days}d`}
        </MetadataPill>
      ) : null}
      {popularity > 0 ? (
        <MetadataPill icon={<Users color={iconColor} size={sz} strokeWidth={2} />}>
          {formatPopularity(popularity)}
        </MetadataPill>
      ) : null}
    </View>
  );
}
