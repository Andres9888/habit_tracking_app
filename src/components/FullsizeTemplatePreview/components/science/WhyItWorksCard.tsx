/**
 * "Why it works" — themed credibility card: accent bar, gradient header with a
 * Science-backed badge + Read paper pill, then a Literata lead and cited stat.
 *
 * SecLabel sits above the card like the other five sections. The badge is
 * claim-gated: it only appears when the template actually carries evidence.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

import { scienceWhyStyles as s } from '../../styles/scienceWhy.styles';
import { ScienceVideoEmbed } from '../ScienceVideoEmbed';
import { SecLabel } from './SecLabel';
import { WhyItWorksHeader } from './WhyItWorksHeader';
import { useScienceCard } from './useScienceCard';
import { useScienceTheme } from './scienceTheme';
import { isScienceBacked } from '../../utils/scienceBadge';
import type { Template } from '../../../../types/template';

export function WhyItWorksCard({ template }: { template: Template }) {
  const t = useScienceTheme();
  const { palette, glyph } = useScienceCard();
  const lead = template?.lead;
  const evidence = template?.evidence ?? template?.scientificReference;
  const paper = template?.scientificLink;

  if (!lead && !evidence) return null;

  // Eligibility lives in `isScienceBacked` so this badge and the hero chip can
  // never disagree. It gates on authored backing only — never on the
  // `scientificReference` fallback merged into `evidence` above.
  const showHeader = isScienceBacked(template);

  return (
    <View>
      <SecLabel
        glyph={<ShieldCheck color={glyph} size={16} strokeWidth={2} />}
      >
        Why it works
      </SecLabel>
      <View
        style={[
          s.whyCard,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <View style={[s.whyAccentBar, { backgroundColor: t.accent }]} />
        {showHeader ? (
          <WhyItWorksHeader paper={paper} palette={palette} theme={t} />
        ) : null}
        <View style={s.whyBody}>
          {lead ? (
            <Text style={[s.whyLead, { color: palette.textPrimary }]}>
              {lead}
            </Text>
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
    </View>
  );
}
