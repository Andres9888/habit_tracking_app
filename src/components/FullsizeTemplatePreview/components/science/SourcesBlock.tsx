/**
 * "The research" — quiet numbered citations with an educational disclaimer.
 * Uses structured sources when present, else the single scientificReference.
 */

import React from 'react';
import { Linking, Text, View } from 'react-native';
import { Quote } from 'lucide-react-native';

import { colors } from '@/theme';
import { triggerHaptic } from '@/utils/haptics';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { SecLabel } from './SecLabel';
import { scienceResearchStyles as b } from '../../styles/scienceResearch.styles';
import type { Template } from '../../../../types/template';
import type { ScienceSource } from '../../../../../convex/templates/types';

function fallbackSources(template: Template): ScienceSource[] {
  const ref = template?.scientificReference;
  if (!ref) return [];
  return [{ authors: '', title: ref, journal: '', year: '', link: template?.scientificLink }];
}

export function SourcesBlock({ template }: { template: Template }) {
  const sources = template?.sources?.length ? template.sources : fallbackSources(template);
  if (sources.length === 0) return null;
  return (
    <View>
      <SecLabel
        count={sources.length}
        glyph={<Quote color={colors.primary[700]} size={18} strokeWidth={2} />}
      >
        The research
      </SecLabel>
      <View style={b.researchCard}>
        {sources.map((src, i) => {
          const meta = [src.authors, src.journal, src.year].filter(Boolean);
          return (
            <AnimatedPressable
              key={i}
              accessibilityRole={src.link ? 'link' : 'text'}
              disabled={!src.link}
              style={[b.sourceRow, i > 0 ? { borderTopColor: colors.border, borderTopWidth: 1 } : null]}
              onPress={() => {
                if (!src.link) return;
                void triggerHaptic('tap');
                void Linking.openURL(src.link);
              }}
            >
              <Text style={b.sourceNum}>{String(i + 1).padStart(2, '0')}</Text>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={b.sourceTitle}>{src.title}</Text>
                {meta.length > 0 ? (
                  <Text style={b.sourceMeta}>
                    {src.authors ? `${src.authors} · ` : ''}
                    <Text style={b.sourceJournal}>{src.journal}</Text>
                    {src.year ? ` · ${src.year}` : ''}
                  </Text>
                ) : null}
                {src.link ? <Text style={b.sourceLink}>Open full text →</Text> : null}
              </View>
            </AnimatedPressable>
          );
        })}
      </View>
      <Text style={b.disclaimer}>Summaries are educational, not medical advice.</Text>
    </View>
  );
}
