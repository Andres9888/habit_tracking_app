/**
 * Meta-chip row for TemplateReadRow (Version B) — duration/frequency plus a
 * "Research" chip when the habit carries a scientific reference.
 */

import { memo } from 'react';
import { Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import {
  getShortCitation,
  getTemplateMetaLabel,
} from '../HabitTemplateCard/templateMeta';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowMetaProps {
  item: Doc<'templates'>;
}

function TemplateReadRowMetaImpl({ item }: TemplateReadRowMetaProps) {
  const { colors } = useThemeColors();
  const metaLabel = getTemplateMetaLabel(item);
  // Suppress the chip when the teaser above is already showing evidence-backed
  // copy — the Research chip would repeat the same signal in a cold color.
  const hasEvidenceTeaser = Boolean(item.lead ?? item.evidence);
  const hasResearch = !hasEvidenceTeaser && Boolean(getShortCitation(item));
  if (!metaLabel && !hasResearch) return null;

  return (
    <View style={s.chipRow}>
      {metaLabel ? (
        <View style={[s.chip, { backgroundColor: colors.card }]}>
          <Text style={[s.chipText, { color: colors.text.tertiary }]}>
            {metaLabel}
          </Text>
        </View>
      ) : null}
      {hasResearch ? (
        <View style={[s.chip, { backgroundColor: colors.status.infoLight }]}>
          <Text style={[s.chipText, { color: colors.status.info }]}>
            Research
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export const TemplateReadRowMeta = memo(TemplateReadRowMetaImpl);
