/**
 * ScienceDoorPill — tappable citation pill that opens the science detail.
 * The labeled door to the "why it works" card; deep-links straight to the
 * science section (SPEC_05). Tinted with the template's per-category accent.
 */

import { Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { triggerHaptic } from '@/utils/haptics';
import { scienceTheme } from '@/components/FullsizeTemplatePreview/components/science/scienceTheme';
import { withAlpha } from '@/theme/colors/alpha';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { getScienceDoorLabel } from '../HabitTemplateCard';
import { styles as s } from './ScienceDoorPill.styles';

interface ScienceDoorPillProps {
  onPress: (template: Doc<'templates'>) => void;
  template: Doc<'templates'>;
}

export function ScienceDoorPill({ onPress, template }: ScienceDoorPillProps) {
  const { colors, isDark } = useThemeColors();
  const label = getScienceDoorLabel(template);
  // Per-category science accent in light; a legible green on dark surfaces.
  const accent = isDark ? colors.primary[500] : scienceTheme(template).accent;

  return (
    <AnimatedPressable
      accessibilityLabel={`Why ${template.name} works`}
      accessibilityRole='button'
      hitSlop={4}
      style={[
        s.pill,
        {
          backgroundColor: withAlpha(accent, isDark ? 0.16 : 0.1),
          borderColor: withAlpha(accent, isDark ? 0.32 : 0.24),
        },
      ]}
      onPress={(event) => {
        event?.stopPropagation?.();
        void triggerHaptic('selection');
        onPress(template);
      }}
    >
      <Text numberOfLines={1} style={[s.label, { color: accent }]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}
