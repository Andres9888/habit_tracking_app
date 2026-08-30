/**
 * Hero metadata chips — cadence+duration, category, difficulty, and the
 * Science-backed marker when the template earns it.
 *
 * The "Habit Detail" mock shows a 3-chip row; popularity moved out of the hero
 * so the chips describe the commitment, not the crowd.
 *
 * The page argues desire before proof, which is right — but the differentiator
 * still has to be legible on arrival. The full evidence case stays where it
 * was, at the bottom; only the marker sits up here, gated on the same rule as
 * the WhyItWorksCard badge so the two can never disagree.
 *
 * The difficulty chip reads `getAutomaticityMeta`, not `growthType` directly:
 * the timeline is the page's source of truth for days-to-automatic.
 */

import React from 'react';
import { View } from 'react-native';
import { Clock, ShieldCheck, Sprout, Tag } from 'lucide-react-native';

import { iconSizes } from '@/theme/iconSizes';
import { heroStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';
import { getAutomaticityMeta } from '../utils/automaticityMeta';
import { isScienceBacked } from '../utils/scienceBadge';
import { resolveMetadataValue } from '../utils/templateMetadata';
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

  const frequency = resolveMetadataValue(
    FREQUENCY_LABELS,
    template?.frequency,
    'Daily'
  );
  const category = resolveMetadataValue(
    CATEGORY_LABELS,
    template?.category,
    'General'
  );
  const duration = template?.estimatedMinutes
    ? `${template.estimatedMinutes} min`
    : typeof template?.category === 'string'
      ? (CATEGORY_DURATION_DEFAULTS?.[template.category] ?? '5-10 min')
      : '5-10 min';
  const automaticity = getAutomaticityMeta(template);

  return (
    <View testID='templates-preview-pills' style={heroStyles.pillsRow}>
      <MetadataPill icon={<Clock {...iconProps} />}>
        {`${frequency} · ${duration}`}
      </MetadataPill>
      <MetadataPill icon={<Tag {...iconProps} />}>{category}</MetadataPill>
      {automaticity ? (
        <MetadataPill icon={<Sprout {...iconProps} />}>
          {`${automaticity.label} · ~${automaticity.days}d`}
        </MetadataPill>
      ) : null}
      {isScienceBacked(template) ? (
        <MetadataPill
          testID='templates-preview-science-chip'
          icon={<ShieldCheck {...iconProps} />}
        >
          Science-backed
        </MetadataPill>
      ) : null}
    </View>
  );
}
