/**
 * SeeAllButton — shared pressable for section "See all" links.
 */

import { StyleSheet, Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography } from '../../../../theme/typography';

interface SeeAllButtonProps {
  accessibilityLabel: string;
  label?: string;
  testID?: string;
  onPress: () => void;
}

export function SeeAllButton({
  accessibilityLabel,
  label = 'See all',
  testID,
  onPress,
}: SeeAllButtonProps) {
  const { colors } = useThemeColors();

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      animationConfig={{ pressScale: 0.97 }}
      hitSlop={8}
      onPress={() => {
        void triggerHaptic('tap');
        onPress();
      }}
    >
      <Text style={[s.label, { color: colors.primary[600] }]}>{label}</Text>
    </AnimatedPressable>
  );
}

const s = StyleSheet.create({
  label: { ...typography.bodySmall, fontWeight: '600' },
});
