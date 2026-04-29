/**
 * Science & Evidence section — citation-light redesign
 *
 * Top zone (green gradient): science-backed pill, video thumbnail,
 *   watch/read action pills. (Citation footnote removed — pill + Read paper
 *   pill carry credibility; tips carry content.)
 * Bottom zone (cream): "Why it works" tips with checkmark halos.
 */

import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/theme';
import { evidenceStyles as s } from '../styles';
import { ScienceEvidenceHeader } from './ScienceEvidenceHeader';
import { ScienceVideoEmbed } from './ScienceVideoEmbed';
import { ScienceActionPills } from './ScienceActionPills';
import { ScienceEvidenceTips } from './ScienceEvidenceTips';
import type { Template } from '../../../types/template';

interface ScienceEvidenceSectionProps {
  iconColor: string;
  template: Template;
}

const HERO_GRADIENT = [colors.primary[100], '#ECFDF5'] as const;

export function ScienceEvidenceSection({ template }: ScienceEvidenceSectionProps) {
  return (
    <View style={s.section}>
      <LinearGradient
        colors={HERO_GRADIENT}
        end={{ x: 0.5, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={s.topZone}
      >
        <ScienceEvidenceHeader />
        <ScienceVideoEmbed template={template} />
        <ScienceActionPills template={template} />
      </LinearGradient>
      <View style={s.bottomZone}>
        <ScienceEvidenceTips tips={template?.tips} />
      </View>
    </View>
  );
}
