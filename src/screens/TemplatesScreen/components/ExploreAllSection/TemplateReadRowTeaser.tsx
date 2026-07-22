/**
 * "START SMALL" box — the laughably-easy floor version of the habit
 * (BJ Fogg / Atomic Habits). Recessed tonal panel; hidden when the template
 * has no start-small version.
 */

import { memo } from 'react';
import { Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useBrowserPalette } from '../../browserPalette';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowTeaserProps {
  item: Doc<'templates'>;
}

function TemplateReadRowTeaserImpl({ item }: TemplateReadRowTeaserProps) {
  const palette = useBrowserPalette();
  const text = item.startSmallVersion?.trim();
  if (!text) return null;

  return (
    <View style={[s.startBox, { backgroundColor: palette.startSmallBg }]}>
      <Text style={[s.startLabel, { color: palette.textTertiary }]}>
        Start small
      </Text>
      <Text
        numberOfLines={3}
        style={[s.startText, { color: palette.textPrimary }]}
      >
        {text}
      </Text>
    </View>
  );
}

export const TemplateReadRowTeaser = memo(TemplateReadRowTeaserImpl);
