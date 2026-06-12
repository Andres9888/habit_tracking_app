/**
 * ScienceDoorPill — tappable citation pill that opens habit details.
 * The labeled door to the science card on the preview page.
 */

import { Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { triggerHaptic } from '@/utils/haptics';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { getScienceDoorLabel } from '../HabitTemplateCard';
import { styles as s } from './ScienceDoorPill.styles';

interface ScienceDoorPillProps {
  onPress: (template: Doc<'templates'>) => void;
  template: Doc<'templates'>;
}

export function ScienceDoorPill({ onPress, template }: ScienceDoorPillProps) {
  const { colors } = useThemeColors();
  const label = getScienceDoorLabel(template);

  return (
    <AnimatedPressable
      accessibilityLabel={`Why ${template.name} works`}
      accessibilityRole='button'
      hitSlop={4}
      style={[
        s.pill,
        {
          backgroundColor: colors.status.infoLight,
          borderColor: colors.status.infoText,
        },
      ]}
      onPress={(event) => {
        event?.stopPropagation?.();
        void triggerHaptic('selection');
        onPress(template);
      }}
    >
      <Text
        numberOfLines={1}
        style={[s.label, { color: colors.status.infoText }]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
