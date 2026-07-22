/**
 * Outlined "Details ›" pill on the Habit Browser card. Opens the detail view
 * — a second, explicit affordance beside the tappable card header.
 */

import { memo, useState } from 'react';
import { Pressable, Text } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { browserPalette } from '../../browserPalette';
import { DetailsChevron } from '../DetailsChevron';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowDetailsProps {
  item: Doc<'templates'>;
  onPreview: (template: Doc<'templates'>) => void;
}

function TemplateReadRowDetailsImpl({
  item,
  onPreview,
}: TemplateReadRowDetailsProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      accessibilityLabel={`View details for ${item.name}`}
      accessibilityRole='button'
      hitSlop={8}
      style={[
        s.detailsPill,
        {
          backgroundColor: pressed
            ? browserPalette.startSmallBg
            : browserPalette.detailsFill,
          borderColor: browserPalette.border,
        },
      ]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={(event) => {
        event?.stopPropagation?.();
        onPreview(item);
      }}
    >
      <Text style={[s.detailsText, { color: browserPalette.textSecondary }]}>
        Details
      </Text>
      <DetailsChevron />
    </Pressable>
  );
}

export const TemplateReadRowDetails = memo(TemplateReadRowDetailsImpl);
