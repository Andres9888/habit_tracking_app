/**
 * "From the research" — a boxed evidence stat with a mono label, the cited
 * sentence, and a citation line derived from the template's first source.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { scienceEvidenceStyles as s } from '../../styles/scienceEvidence.styles';
import type { ScienceSource } from '../../../../../convex/templates/types';

interface EvidenceCalloutProps {
  evidence: string;
  source?: ScienceSource;
}

export function EvidenceCallout({ evidence, source }: EvidenceCalloutProps) {
  const authors = source?.authors?.trim();
  const journal = source?.journal?.trim();
  const year = source?.year?.trim();
  const hasCite = Boolean(authors || journal || year);
  return (
    <View style={s.callout}>
      <Text style={s.label}>From the research</Text>
      <Text style={s.body}>{evidence}</Text>
      {hasCite ? (
        <Text style={s.cite}>
          {authors ? `${authors} · ` : ''}
          {journal ? <Text style={s.citeJournal}>{journal}</Text> : null}
          {year ? `${journal ? ' · ' : ''}${year}` : ''}
        </Text>
      ) : null}
    </View>
  );
}
