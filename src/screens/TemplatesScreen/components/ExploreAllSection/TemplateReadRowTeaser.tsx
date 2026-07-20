/**
 * Always-on "Start small" teaser box, per the habit-library mock. Falls back
 * to the "Why it works" lead when a habit has no start-small tip so the box
 * stays populated. Full science lives in the detail view.
 */

import { Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowTeaserProps {
  item: Doc<'templates'>;
}

export function TemplateReadRowTeaser({ item }: TemplateReadRowTeaserProps) {
  const { colors } = useThemeColors();
  const startSmall = item.startSmallVersion ?? null;
  const text = startSmall ?? item.lead ?? item.evidence ?? null;
  if (!text) return null;
  const label = startSmall ? 'Start small' : 'Why it works';

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
