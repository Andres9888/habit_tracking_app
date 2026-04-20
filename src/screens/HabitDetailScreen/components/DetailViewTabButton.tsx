/**
 * DetailViewTabButton - Individual tab button with horizontal layout.
 * Icon + label side-by-side. Haptic tap + press-scale on non-active press,
 * respecting reduced motion.
 */

import { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { LucideIcon } from 'lucide-react-native';
import { useThemeColors } from '@/theme';
import { typography, fontWeights } from '@/theme/typography';
import { iconSizes } from '@/theme/iconSizes';
import { springs } from '@/theme/animations';
import { triggerHaptic } from '@/utils/haptics';

export type DetailView = 'calendar' | 'strength' | 'goal';

interface DetailViewTabButtonProps {
  accentColor: string;
  activeView: DetailView;
  icon: LucideIcon;
  label: string;
  reduceMotion: boolean;
  view: DetailView;
  onPress: (view: DetailView) => void;
}

export function DetailViewTabButton({
  accentColor,
  activeView,
  icon: Icon,
  label,
  reduceMotion,
  view,
  onPress,
}: DetailViewTabButtonProps) {
  const { colors } = useThemeColors();
  const isActive = activeView === view;
  const foreground = isActive ? accentColor : colors.text.secondary;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (!reduceMotion) scale.value = withSpring(0.96, springs.button);
  }, [reduceMotion, scale]);

  const handlePressOut = useCallback(() => {
    if (!reduceMotion) scale.value = withSpring(1, springs.button);
  }, [reduceMotion, scale]);

  const handlePress = useCallback(() => {
    if (isActive) return;
    triggerHaptic('tap');
    onPress(view);
  }, [isActive, onPress, view]);

  return (
    <Animated.View className='flex-1' style={animatedStyle}>
      <Pressable
        accessibilityHint={`Shows the ${label.toLowerCase()} view`}
        accessibilityLabel={`${label} tab`}
        accessibilityRole='tab'
        accessibilityState={{ selected: isActive }}
        className='flex-row items-center justify-center gap-1.5 py-2.5'
        hitSlop={{ bottom: 6, top: 6 }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Icon
          color={foreground}
          size={iconSizes.small}
          strokeWidth={isActive ? 2.5 : 2}
        />
        <Text
          style={{
            ...typography.caption,
            color: foreground,
            fontSize: 14,
            fontWeight: isActive ? fontWeights.semibold : fontWeights.medium,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
