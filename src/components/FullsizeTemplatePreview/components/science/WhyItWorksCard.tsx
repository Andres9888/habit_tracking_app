/**
 * "Why it works" — a credibility card with a flat surface header (Science-backed
 * badge + Read paper pill), a Literata lead, and a boxed evidence callout.
 */

import React from 'react';
import { Linking, Text, View } from 'react-native';
import { FileText, ShieldCheck } from 'lucide-react-native';

import { colors } from '@/theme';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { scienceWhyStyles as s } from '../../styles/scienceWhy.styles';
import { ScienceVideoEmbed } from '../ScienceVideoEmbed';
import { EvidenceCallout } from './EvidenceCallout';
import type { Template } from '../../../../types/template';

export function WhyItWorksCard({ template }: { template: Template }) {
  const lead = template?.lead;
  const evidence = template?.evidence ?? template?.scientificReference;
  const paper = template?.scientificLink;
  return (
    <View style={s.whyCard}>
      <View style={s.whyHeader}>
        <View style={s.whyBadge}>
          <ShieldCheck color={colors.primary[700]} size={iconSizes.small - 1} strokeWidth={2.2} />
          <Text style={[s.whyBadgeText, { color: colors.primary[700] }]}>Science-backed</Text>
        </View>
        {paper ? (
          <AnimatedPressable
            accessibilityLabel="Read the research paper"
            accessibilityRole="link"
            hitSlop={6}
            style={s.whyReadBtn}
            onPress={() => {
              void triggerHaptic('tap');
              void Linking.openURL(paper);
            }}
          >
            <FileText color={colors.primary[700]} size={iconSizes.small - 1} strokeWidth={2} />
            <Text style={[s.whyReadText, { color: colors.primary[700] }]}>Read paper</Text>
          </AnimatedPressable>
        ) : null}
      </View>
      <View style={s.whyBody}>
        <Text style={s.whyOverline}>Why it works</Text>
        {lead ? <Text style={s.whyLead}>{lead}</Text> : null}
        {evidence ? <EvidenceCallout evidence={evidence} source={template?.sources?.[0]} /> : null}
        {template?.youtubeLink ? (
          <View style={{ marginTop: 16 }}>
            <ScienceVideoEmbed template={template} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
