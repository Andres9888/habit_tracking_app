import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { styles } from './styles';
import type { SuccessOverlayProps } from './types';
import { useSuccessOverlayAnimations } from './useSuccessOverlayAnimations';

/**
 * SuccessOverlay - Animated success feedback overlay
 *
 * Displays a full-screen success animation with:
 * - Expanding ring effect
 * - Bouncing checkmark icon
 * - Slide-up "Welcome back!" text
 * - Auto-callback after 1.5s for navigation
 */
export function SuccessOverlay({
  visible,
  onAnimationComplete,
}: SuccessOverlayProps) {
  const { overlayStyle, checkmarkStyle, ringStyle, textStyle } =
    useSuccessOverlayAnimations(visible, onAnimationComplete);

  if (!visible) return null;

  return (
    <Animated.View
      accessible
      accessibilityLabel='Sign in successful'
      accessibilityRole='alert'
      style={[styles.overlay, overlayStyle]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Animated.View style={[styles.ring, ringStyle]} />
          <Animated.View style={[styles.checkmark, checkmarkStyle]}>
            <Text style={styles.checkmarkText}>✓</Text>
          </Animated.View>
        </View>
        <Animated.Text style={[styles.successText, textStyle]}>
          Welcome back!
        </Animated.Text>
      </View>
    </Animated.View>
  );
}
