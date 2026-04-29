/**
 * Citation footnote — quiet attribution for the scientific reference.
 *
 * Reference format: "Author (Year) - Title". Author/Year renders as a
 * semibold source line; the paper title renders below in muted italic.
 * Falls back to displaying the full reference if no clear split.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { evidenceStyles as s } from '../styles';
import type { Template } from '../../../types/template';

interface ScienceQuoteBlockProps {
  template: Template;
}

const CITATION_RE = /^(.+?\(\d{4}\))\s*[-—]\s*(.+)$/;

function parseAttribution(reference: string): { source: string; paper: string } {
  const match = reference.match(CITATION_RE);
  if (match) {
    return { source: match[1].trim(), paper: match[2].trim() };
  }
  return { source: '', paper: reference };
}

export function ScienceQuoteBlock({ template }: ScienceQuoteBlockProps) {
  const reference = template?.scientificReference ?? '';
  if (!reference) return null;

  const { source, paper } = parseAttribution(reference);

  return (
    <View style={s.citation}>
      {source ? <Text style={s.sourceText}>{source}</Text> : null}
      <Text style={s.paperText}>{paper}</Text>
    </View>
  );
}
