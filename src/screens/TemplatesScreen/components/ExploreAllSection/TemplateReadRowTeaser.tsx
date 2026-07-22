/**
 * "START SMALL" box — the laughably-easy floor version of the habit
 * (BJ Fogg / Atomic Habits). Recessed tonal panel; hidden when the template
 * has no start-small version.
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
  const text = item.startSmallVersion?.trim();
  if (!text) return null;

  return (
    <View style={[s.startBox, { backgroundColor: colors.card }]}>
      <Text style={[s.startLabel, { color: colors.text.tertiary }]}>
        Start small
      </Text>
      <Text
        numberOfLines={3}
        style={[s.startText, { color: colors.text.primary }]}
      >
        {text}
      </Text>
    </View>
  );
}

export const TemplateReadRowTeaser = memo(TemplateReadRowTeaserImpl);
