/**
 * Compact inline pill add button with bounce animation.
 */

import { useEffect } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { springs } from '../../../../theme/animations';
import { triggerHaptic } from '@/utils/haptics';
import { s } from './ListCardAddButton.styles';
import type { ListCardAddButtonProps } from './TemplateListCard.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ListCardAddButton({
  isImported,
  isImporting,
  name,
  size = 'compact',
  onImport,
}: ListCardAddButtonProps) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isImported) {
      void triggerHaptic('success');
      scale.value = withSpring(1.08, springs.responsive);
      const timeout = setTimeout(() => {
        scale.value = withSpring(1, springs.responsive);
      }, 120);
      return () => clearTimeout(timeout);
    }
  }, [isImported, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const isRegular = size === 'regular';
  const lblStyle = [s.label, isRegular && s.labelRegular];

  return (
    <AnimatedPressable
      accessibilityLabel={isImported ? `${name} added` : `Add ${name} habit`}
      accessibilityRole='button'
      disabled={isImported || isImporting}
      style={[
        s.button,
        isRegular && s.buttonRegular,
        {
          backgroundColor: isImported
            ? colors.primary[100]
            : colors.primary[600],
        },
        // Duolingo press-depth: hard 3px underledge on the active regular CTA.
        isRegular && !isImported && { shadowColor: colors.primary[700] },
        isRegular && !isImported && s.buttonRegularShadow,
        animatedStyle,
      ]}
      onPress={(event) => {
        event?.stopPropagation?.();
        void triggerHaptic('selection');
        onImport();
      }}
    >
      {isImporting ? (
        <ActivityIndicator color={colors.text.inverse} size='small' />
      ) : isImported ? (
        <>
          <Check
            color={colors.primary[700]}
            size={iconSizes.small}
            strokeWidth={3}
          />
          <Text style={[lblStyle, { color: colors.primary[700] }]}>Added</Text>
        </>
      ) : (
        <Text style={[lblStyle, { color: colors.text.inverse }]}>
          {isRegular ? 'Add habit' : '+ Add'}
        </Text>
      )}
    </AnimatedPressable>
  );
}
