/**
 * AddButton — circular 1-tap import button with animated state transitions
 */

import { useEffect } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Check, Plus } from 'lucide-react-native';
import { colors } from '../../../../theme/colors';
import { addButtonStyles as abs } from './TrendingCard.styles';
import type { AddButtonProps } from './TrendingCard.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AddButton({
  isImported,
  isImporting,
  name,
  onImport,
}: AddButtonProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isImported) {
      scale.value = withSpring(1.2, { damping: 12, stiffness: 300 });
      const timeout = setTimeout(() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 300 });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isImported, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const label = isImported ? `${name} added` : `Add ${name}`;
  const iconColor = isImported ? colors.primary[600] : '#FFFFFF';
  const iconSize = 16;

  return (
    <AnimatedPressable
      accessible
      accessibilityLabel={label}
      accessibilityRole='button'
      disabled={isImporting || isImported}
      hitSlop={4}
      style={[
        abs.button,
        isImported ? abs.imported : abs.default,
        animatedStyle,
      ]}
      onPress={onImport}
    >
      {isImporting ? (
        <ActivityIndicator color='#FFFFFF' size={iconSize} />
      ) : isImported ? (
        <Check color={iconColor} size={iconSize} strokeWidth={3} />
      ) : (
        <Plus color={iconColor} size={iconSize} strokeWidth={2.5} />
      )}
    </AnimatedPressable>
  );
}
