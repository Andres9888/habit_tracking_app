/** Sticky complete dock — appears when the hero CTA scrolls away (OD mock). */
import { View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../theme';
import { durations, enterEasing } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { DetailCompleteButton } from './DetailCompleteButton';

interface DetailStickyDockProps {
  isCompletedToday: boolean;
  isToggling: boolean;
  visible: boolean;
  onCompletePress: () => void;
}

export function DetailStickyDock({
  isCompletedToday,
  isToggling,
  visible,
  onCompletePress,
}: DetailStickyDockProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();

  if (!visible) return null;

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.duration(durations.standard).easing(enterEasing)
      }
      exiting={reduceMotion ? undefined : FadeOutDown.duration(durations.quick)}
      pointerEvents='box-none'
      style={{
        bottom: 0,
        left: 0,
        paddingBottom: Math.max(insets.bottom, spacing.base),
        paddingHorizontal: spacing.base,
        paddingTop: spacing.md,
        position: 'absolute',
        right: 0,
        zIndex: 20,
      }}
    >
      {/* Soft fade into parchment so the dock doesn’t hard-cut content */}
      <View
        pointerEvents='none'
        style={{
          backgroundColor: colors.background,
          height: 28,
          left: 0,
          opacity: 0.92,
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      />
      <DetailCompleteButton
        disabled={isToggling}
        isCompletedToday={isCompletedToday}
        onPress={onCompletePress}
      />
    </Animated.View>
  );
}
