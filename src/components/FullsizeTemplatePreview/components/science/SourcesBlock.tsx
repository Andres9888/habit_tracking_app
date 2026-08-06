/**
 * Citations with an educational disclaimer. Uses structured sources when
 * present, else the single scientificReference.
 *
 * The heading is claim-gated the same way the Science-backed badge is. This
 * section used to be titled "The research" unconditionally, and because
 * `scientificReference` is populated on every template the fallback rendered a
 * research heading on all 318 — including the ~50 that correctly do NOT earn
 * the badge, over a row reading "Cirillo (2006) - The Pomodoro Technique" with
 * no authors, journal or year. The badge disappeared and the research framing
 * survived one section later, which undid the gate. When nothing here is
 * primary literature the section says "Further reading" instead.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { Quote } from 'lucide-react-native';

import { triggerHaptic } from '@/utils/haptics';
import { openExternalLink } from '@/utils/openExternalLink';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { SecLabel } from './SecLabel';
import { useScienceCard } from './useScienceCard';
import { citedSources } from '../../utils/scienceBadge';
import { scienceResearchStyles as b } from '../../styles/scienceResearch.styles';
import type { Template } from '../../../../types/template';
import type { ScienceSource } from '../../../../../convex/templates/types';

function fallbackSources(template: Template): ScienceSource[] {
  const ref = template?.scientificReference;
  if (!ref) return [];
  return [
    {
      authors: '',
      title: ref,
      journal: '',
      year: '',
      link: template?.scientificLink,
    },
  ];
}

export function SourcesBlock({ template }: { template: Template }) {
  const { palette, flushCard, divider, glyph } = useScienceCard();
  const sources = template?.sources?.length
    ? template.sources
    : fallbackSources(template);
  if (sources.length === 0) return null;

  // Books and methodology references stay listed — they are real references.
  // They just cannot be what makes the section "The research".
  const heading =
    citedSources(template).length > 0 ? 'The research' : 'Further reading';

  return (
    <View>
      <SecLabel glyph={<Quote color={glyph} size={17} strokeWidth={2} />}>
        {heading}
      </SecLabel>
      <View style={flushCard}>
        {sources.map((src, i) => {
          const meta = [src.authors, src.journal, src.year].filter(Boolean);
          return (
            <AnimatedPressable
              key={i}
              accessibilityRole={src.link ? 'link' : 'text'}
              disabled={!src.link}
              style={[b.sourceRow, i > 0 ? divider : null]}
              onPress={() => {
                if (!src.link) return;
                void triggerHaptic('tap');
                void openExternalLink(src.link);
              }}
            >
              <Text style={[b.sourceNum, { color: palette.textQuiet }]}>
                {String(i + 1).padStart(2, '0')}
              </Text>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[b.sourceTitle, { color: palette.textPrimary }]}>
                  {src.title}
                </Text>
                {meta.length > 0 ? (
                  <Text style={[b.sourceMeta, { color: palette.textTertiary }]}>
                    {src.authors ? `${src.authors} · ` : ''}
                    <Text style={b.sourceJournal}>{src.journal}</Text>
                    {src.year ? ` · ${src.year}` : ''}
                  </Text>
                ) : null}
              </View>
            </AnimatedPressable>
          );
        })}
      </View>
      <Text style={[b.disclaimer, { color: palette.textQuiet }]}>
        Summaries are educational, not medical advice.
      </Text>
    </View>
  );
}
