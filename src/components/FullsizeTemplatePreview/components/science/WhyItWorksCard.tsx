/**
 * "Why it works" — themed credibility card: accent bar, gradient header with a
 * Science-backed badge + Read paper pill, then a Literata lead and cited stat.
 */

import React from 'react';
import { Linking, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FileText, ShieldCheck } from 'lucide-react-native';

import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { scienceWhyStyles as s } from '../../styles/scienceWhy.styles';
import { ScienceVideoEmbed } from '../ScienceVideoEmbed';
import { scienceTheme } from './scienceTheme';
import type { Template } from '../../../../types/template';

export function WhyItWorksCard({ template }: { template: Template }) {
  const t = scienceTheme(template);
  const lead = template?.lead;
  const evidence = template?.evidence ?? template?.scientificReference;
  const paper = template?.scientificLink;
  return (
    <View style={s.whyCard}>
      <View style={[s.whyAccentBar, { backgroundColor: t.accent }]} />
      <LinearGradient
        colors={[t.gradientStart, t.gradientEnd]}
        end={{ x: 0.5, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={s.whyHeader}
      >
        <View style={s.whyBadge}>
          <ShieldCheck color={t.accent} size={iconSizes.small - 1} strokeWidth={2.2} />
          <Text style={[s.whyBadgeText, { color: t.accent }]}>Science-backed</Text>
        </View>
        {paper ? (
          <AnimatedPressable
            accessibilityLabel="Read the research paper"
            accessibilityRole="link"
            hitSlop={6}
            style={[s.whyReadBtn, { borderColor: `${t.accent}40` }]}
            onPress={() => {
              void triggerHaptic('tap');
              void Linking.openURL(paper);
            }}
          >
            <FileText color={t.accent} size={iconSizes.small - 1} strokeWidth={2} />
            <Text style={[s.whyReadText, { color: t.accent }]}>Read paper</Text>
          </AnimatedPressable>
        ) : null}
      </LinearGradient>
      <View style={s.whyBody}>
        <Text style={[s.whyOverline, { color: t.accent }]}>Why it works</Text>
        {lead ? <Text style={s.whyLead}>{lead}</Text> : null}
        {evidence ? <Text style={s.whyEvidence}>{evidence}</Text> : null}
        {template?.youtubeLink ? (
          <View style={{ marginTop: 16 }}>
            <ScienceVideoEmbed template={template} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
