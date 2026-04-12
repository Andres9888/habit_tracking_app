/**
 * Unified Science & Evidence section
 * Combines citation, video embed, and tips in a gradient-backed container
 */

import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme';
import { evidenceStyles as s } from '../styles';
import { ScienceEvidenceHeader } from './ScienceEvidenceHeader';
import { ScienceQuoteBlock } from './ScienceQuoteBlock';
import { ScienceVideoEmbed } from './ScienceVideoEmbed';
import { ScienceEvidenceTips } from './ScienceEvidenceTips';
import type { Template } from '../../../types/template';

interface ScienceEvidenceSectionProps {
  iconColor: string;
  template: Template;
}

const GRADIENT_COLORS = [colors.primary[100], '#FAFAF9'] as const;

export function ScienceEvidenceSection({
  iconColor,
  template,
}: ScienceEvidenceSectionProps) {
  const tips = template?.tips;

  return (
    <View style={s.section}>
      <LinearGradient
        colors={GRADIENT_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={s.gradient}
      >
        <ScienceEvidenceHeader />
        <ScienceQuoteBlock template={template} />
        <ScienceVideoEmbed iconColor={iconColor} template={template} />
        {tips && Array.isArray(tips) && tips.length > 0 ? (
          <ScienceEvidenceTips tips={tips} />
        ) : null}
      </LinearGradient>
    </View>
  );
}
