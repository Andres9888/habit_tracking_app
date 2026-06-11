/**
 * ScienceDoorPill — tappable citation pill that opens habit details.
 * The labeled door to the science card on the preview page.
 */

import { Pressable, Text } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { getScienceDoorLabel } from '../MinimalTemplateRow/templateMeta';
import { styles as s } from './ScienceDoorPill.styles';

interface ScienceDoorPillProps {
  onPress: (template: Doc<'templates'>) => void;
  template: Doc<'templates'>;
}

export function ScienceDoorPill({ onPress, template }: ScienceDoorPillProps) {
  const label = getScienceDoorLabel(template);

  return (
    <Pressable
      accessibilityLabel={`Why ${template.name} works`}
      accessibilityRole='button'
      hitSlop={4}
      style={s.pill}
      onPress={(event) => {
        event.stopPropagation();
        onPress(template);
      }}
    >
      <Text numberOfLines={1} style={s.label}>
        {label}
      </Text>
    </Pressable>
  );
}
