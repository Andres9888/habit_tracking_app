/**
 * Compact inline pill add button with bounce animation.
 */

import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check, Plus } from 'lucide-react-native';
import { useBrowserPalette } from '../../browserPalette';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography, fontWeights } from '../../../../theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import { useImportBounce } from './useImportBounce';
import type { ListCardAddButtonProps } from './TemplateListCard.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ListCardAddButton({
  isImported,
  isImporting,
  name,
  onImport,
}: ListCardAddButtonProps) {
  const palette = useBrowserPalette();
  const { animatedStyle, onPressIn, onPressOut } = useImportBounce(isImported);
  const bg = isImported ? palette.addedBg : palette.addBg;
  const fg = isImported ? palette.addedFg : palette.addFg;

  return (
    <AnimatedPressable
      accessibilityLabel={isImported ? `${name} added` : `Add ${name} habit`}
      accessibilityRole='button'
      disabled={isImported || isImporting}
      hitSlop={8}
      style={[s.button, { backgroundColor: bg }, animatedStyle]}
      onPress={(event) => {
        event?.stopPropagation?.();
        void triggerHaptic('selection');
        onImport();
      }}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      {isImporting ? (
        <ActivityIndicator color={fg} size='small' />
      ) : isImported ? (
        <>
          <Check color={fg} size={14} strokeWidth={3} />
          <Text style={[s.label, { color: fg }]}>Added</Text>
        </>
      ) : (
        <>
          <Plus color={fg} size={14} strokeWidth={3} />
          <Text style={[s.label, { color: fg }]}>Add</Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const s = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: spacing.xs,
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  label: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
  },
});
