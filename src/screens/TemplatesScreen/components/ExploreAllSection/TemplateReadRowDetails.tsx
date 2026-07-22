/**
 * Outlined "Details ›" pill on the Habit Browser card. Opens the detail view
 * — a second, explicit affordance beside the tappable card header.
 */

import { memo, useState } from 'react';
import { Pressable, Text } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
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
  const { colors, isDark } = useThemeColors();
  const [pressed, setPressed] = useState(false);
  // White pill on the warm card (design); raised overlay in dark mode where
  // white would glare. Pressed dims toward the recessed surface.
  const fill = isDark ? 'rgba(255,255,255,0.07)' : '#FFFFFF';

  return (
    <Pressable
      accessibilityLabel={`View details for ${item.name}`}
      accessibilityRole='button'
      hitSlop={8}
      style={[
        s.detailsPill,
        {
          backgroundColor: pressed ? colors.card : fill,
          borderColor: colors.cardBorder,
        },
      ]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={(event) => {
        event?.stopPropagation?.();
        onPreview(item);
      }}
    >
      <Text style={[s.detailsText, { color: colors.text.secondary }]}>
        Details
      </Text>
      <DetailsChevron />
    </Pressable>
  );
}

export const TemplateReadRowDetails = memo(TemplateReadRowDetailsImpl);
