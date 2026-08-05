/**
 * "Why it works" — themed credibility card: accent bar, gradient header with a
 * Science-backed badge + Read paper pill, then a Literata lead and cited stat.
 *
 * The badge is claim-gated: it only appears when the template actually carries
 * evidence, so a lightly-authored habit never borrows credibility it lacks.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FileText, ShieldCheck } from 'lucide-react-native';

import { iconSizes } from '@/theme/iconSizes';
import { MAX_FONT_SIZE_MULTIPLIER_STRICT } from '@/utils/accessibility/textScaling';
import { triggerHaptic } from '@/utils/haptics';
import { openExternalLink } from '@/utils/openExternalLink';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { scienceWhyStyles as s } from '../../styles/scienceWhy.styles';
import { ScienceVideoEmbed } from '../ScienceVideoEmbed';
import { useScienceTheme } from './scienceTheme';
import { useDetailPalette } from '../../detailPalette';
import type { Template } from '../../../../types/template';

export function WhyItWorksCard({ template }: { template: Template }) {
  const t = useScienceTheme();
  const palette = useDetailPalette();
  const lead = template?.lead;
  const evidence = template?.evidence ?? template?.scientificReference;
  const paper = template?.scientificLink;

  if (!lead && !evidence) return null;
  const showHeader = Boolean(evidence);

  return (
    <View
      style={[
        s.whyCard,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <View style={[s.whyAccentBar, { backgroundColor: t.accent }]} />
      {showHeader ? (
        <LinearGradient
          colors={[t.gradientStart, t.gradientEnd]}
          end={{ x: 0.5, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={[s.whyHeader, { borderBottomColor: palette.border }]}
        >
          <View style={[s.whyBadge, { backgroundColor: palette.raised }]}>
            <ShieldCheck
              color={t.accent}
              size={iconSizes.small - 1}
              strokeWidth={2.2}
            />
            <Text
              maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
              style={[s.whyBadgeText, { color: t.accent }]}
            >
              Science-backed
            </Text>
          </View>
          {paper ? (
            <AnimatedPressable
              accessibilityLabel='Read the research paper'
              accessibilityRole='link'
              hitSlop={6}
              style={[s.whyReadBtn, { borderColor: `${t.accent}4D` }]}
              onPress={() => {
                void triggerHaptic('tap');
                void openExternalLink(paper);
              }}
            >
              <FileText
                color={t.accent}
                size={iconSizes.small - 1}
                strokeWidth={2}
              />
              <Text
                maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
                numberOfLines={1}
                style={[s.whyReadText, { color: t.accent }]}
              >
                Read paper
              </Text>
            </AnimatedPressable>
          ) : null}
        </LinearGradient>
      ) : null}
      <View style={s.whyBody}>
        <Text style={[s.whyOverline, { color: t.accent }]}>Why it works</Text>
        {lead ? (
          <Text style={[s.whyLead, { color: palette.textPrimary }]}>{lead}</Text>
        ) : null}
        {evidence ? (
          <Text style={[s.whyEvidence, { color: palette.textSecondary }]}>
            {evidence}
          </Text>
        ) : null}
        {template?.youtubeLink ? (
          <View style={{ marginTop: 16 }}>
            <ScienceVideoEmbed template={template} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
