/**
 * "Why it works" — themed credibility card: accent bar, optional Read paper
 * header, then a Literata lead and cited stat.
 *
 * SecLabel sits above the card like the other five sections. The gradient
 * header (paper pill only) is claim-gated via isScienceBacked and omitted
 * when there is no paper link — the Science-backed claim already lives on
 * the hero chip + THE EVIDENCE overline.
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

  // Eligibility lives in `isScienceBacked` so this header and the hero chip can
  // never disagree. It gates on authored backing only — never on the
  // `scientificReference` fallback merged into `evidence` above. Paper is
  // required too: without it the header would be an empty gradient strip.
  const showHeader = isScienceBacked(template) && Boolean(paper);

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
