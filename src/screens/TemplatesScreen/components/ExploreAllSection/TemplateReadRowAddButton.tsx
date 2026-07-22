/**
 * Circular Add / Added toggle for the Habit Browser card. Green "+" to add,
 * a tinted check once imported. Success haptic + bounce come from the shared
 * useImportBounce hook, so behavior stays in lockstep with ListCardAddButton.
 */

import { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius } from '../../../../theme/spacing';
import { useImportBounce } from '../../views/TemplateListCard/useImportBounce';
import { triggerHaptic } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TemplateReadRowAddButtonProps {
  isImported: boolean;
  isImporting: boolean;
  name: string;
  onImport: () => void;
}

function TemplateReadRowAddButtonImpl({
  isImported,
  isImporting,
  name,
  onImport,
}: TemplateReadRowAddButtonProps) {
  const { colors } = useThemeColors();
  const animatedStyle = useImportBounce(isImported);
  const bg = isImported ? colors.status.successLight : colors.status.success;

  return (
    <AnimatedPressable
      accessibilityLabel={isImported ? `${name} added` : `Add ${name} habit`}
      accessibilityRole='button'
      disabled={isImported || isImporting}
      style={[s.button, { backgroundColor: bg }, animatedStyle]}
      onPress={(event) => {
        event?.stopPropagation?.();
        void triggerHaptic('selection');
        onImport();
      }}
    >
      {isImporting ? (
        <ActivityIndicator color={colors.text.inverse} size='small' />
      ) : isImported ? (
        <Check color={colors.status.successText} size={26} strokeWidth={3} />
      ) : (
        <Text style={[s.plus, { color: colors.text.inverse }]}>+</Text>
      )}
    </AnimatedPressable>
  );
}

export const TemplateReadRowAddButton = memo(TemplateReadRowAddButtonImpl);

const s = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    flexShrink: 0,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  plus: { fontSize: 30, fontWeight: '600', lineHeight: 34 },
});
