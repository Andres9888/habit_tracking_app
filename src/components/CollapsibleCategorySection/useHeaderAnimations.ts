/**
 * CollapsibleCategorySection Header Animations Hook
 */

import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface UseHeaderAnimationsParams {
  isExpanded: boolean;
  reducedMotion: boolean;
  onToggle: () => void;
}

export function useHeaderAnimations({
  isExpanded,
  reducedMotion,
  onToggle,
}: UseHeaderAnimationsParams) {
  const headerScale = useSharedValue(1);
  const iconBounce = useSharedValue(0);
  const iconScale = useSharedValue(1);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: headerScale.value ?? 1 }],
    };
  });

  const chevronAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { rotate: withTiming(isExpanded ? '0deg' : '-90deg', { duration: 200 }) },
      ],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateY: iconBounce.value ?? 0 }, { scale: iconScale.value ?? 1 }],
    };
  });

  const handleHeaderPressIn = () => {
    headerScale.value = withSpring(0.98, { damping: 18, stiffness: 150 });
  };

  const handleHeaderPressOut = () => {
    headerScale.value = withSpring(1, { damping: 18, stiffness: 150 });
  };

  const handleHeaderPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Trigger icon bounce when expanding (not collapsing)
    if (!isExpanded && !reducedMotion) {
      iconBounce.value = withSequence(
        withSpring(-4, { damping: 8, stiffness: 300 }),
        withSpring(0, { damping: 12, stiffness: 200 })
      );
      iconScale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );
    }

    onToggle();
  };

  return {
    chevronAnimatedStyle,
    handleHeaderPress,
    handleHeaderPressIn,
    handleHeaderPressOut,
    headerAnimatedStyle,
    iconAnimatedStyle,
  };
}
