/**
 * Labeled Add / Added pill for the Habit Browser card. Green "+ Add" to add,
 * a tinted "✓ Added" once imported. Success haptic + bounce come from the
 * shared useImportBounce hook, so behavior stays in lockstep with
 * ListCardAddButton.
 */

import { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import { useBrowserPalette } from '../../browserPalette';
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
  const palette = useBrowserPalette();
  const animatedStyle = useImportBounce(isImported);
  const bg = isImported ? palette.addedBg : palette.addBg;
  const fg = isImported ? palette.addedFg : palette.textInverse;

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
        <ActivityIndicator color={fg} size='small' />
      ) : isImported ? (
        <>
          <Check color={fg} size={18} strokeWidth={3} />
          <Text style={[s.label, { color: fg }]}>Added</Text>
        </>
      ) : (
        <Text style={[s.label, { color: fg }]}>+ Add</Text>
      )}
    </AnimatedPressable>
  );
}

export const TemplateReadRowAddButton = memo(TemplateReadRowAddButtonImpl);

const s = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    flexShrink: 0,
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  label: { fontSize: 16, fontWeight: fontWeights.bold },
});
