/**
 * Hero metadata pills — frequency, category, duration, growth, popularity.
 */

import React from 'react';
import { View } from 'react-native';
import { Clock, ShieldCheck, Sparkles, Sprout, Timer, Users } from 'lucide-react-native';

import { colors } from '@/theme';
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
  const scienceBacked = Boolean(
    template?.scientificReference || template?.lead || template?.evidence
  );

  return (
    <View testID='templates-preview-pills' style={heroStyles.pillsRow}>
      {scienceBacked ? (
        <MetadataPill
          icon={
            <ShieldCheck
              color={colors.primary[700]}
              size={iconSizes.small}
              strokeWidth={2.2}
            />
          }
          iconColor={colors.primary[700]}
        >
          Science-backed
        </MetadataPill>
      ) : null}
      <MetadataPill
        icon={<Clock color={iconColor} size={iconSizes.small} strokeWidth={2} />}
        iconColor={iconColor}
      >
        {frequency}
      </MetadataPill>
      <MetadataPill
        icon={<Sparkles color={iconColor} size={iconSizes.small} strokeWidth={2} />}
        iconColor={iconColor}
      >
        {category}
      </MetadataPill>
      <MetadataPill
        icon={<Timer color={iconColor} size={iconSizes.small} strokeWidth={2} />}
        iconColor={iconColor}
      >
        {duration}
      </MetadataPill>
      {growthMeta ? (
        <MetadataPill
          icon={<Sprout color={iconColor} size={iconSizes.small} strokeWidth={2} />}
          iconColor={iconColor}
        >
          {`${growthMeta.label} · ~${growthMeta.days}d`}
        </MetadataPill>
      ) : null}
      {popularity > 0 ? (
        <MetadataPill
          icon={<Users color={iconColor} size={iconSizes.small} strokeWidth={2} />}
          iconColor={iconColor}
        >
          {formatPopularity(popularity)}
        </MetadataPill>
      ) : null}
    </View>
  );
}
