/**
 * Always-on confidence teaser (Version B). Prefers a curated "Why it works"
 * line; when a habit has none, falls back to its "Start small" tip so the
 * box stays populated. Full science lives in the detail view.
 */

import { memo } from 'react';
import { Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowTeaserProps {
  item: Doc<'templates'>;
}

function TemplateReadRowTeaserImpl({ item }: TemplateReadRowTeaserProps) {
  const { colors } = useThemeColors();
  const why = item.lead ?? item.evidence ?? null;
  const text = why ?? item.startSmallVersion ?? null;
  if (!text) return null;
  const label = why ? 'Why it works' : 'Start small';

  return (
    <View
      style={[
        s.teaser,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[s.teaserLabel, { color: colors.text.tertiary }]}>
        {label}
      </Text>
      <Text
        numberOfLines={3}
        style={[s.teaserText, { color: colors.text.primary }]}
      >
        {text}
      </Text>
    </View>
  );
}

export const TemplateReadRowTeaser = memo(TemplateReadRowTeaserImpl);
