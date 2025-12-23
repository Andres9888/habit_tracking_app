import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

interface SuccessOverlayProps {
  visible: boolean;
  onAnimationComplete?: () => void;
}

export function SuccessOverlay({
  visible,
  onAnimationComplete,
}: SuccessOverlayProps) {
  // Animation values
  const overlayOpacity = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);
  const checkmarkOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  useEffect(() => {
    if (visible) {
      // Animate overlay fade in
      overlayOpacity.value = withTiming(1, { duration: 300 });

      // Ring animation - expands outward
      ringScale.value = withDelay(
        100,
        withSequence(
          withSpring(1.2, { damping: 8, stiffness: 100 }),
          withTiming(1.5, { duration: 400 }),
        )
      );
      ringOpacity.value = withDelay(
        100,
        withSequence(
          withTiming(0.5, { duration: 200 }),
          withTiming(0, { duration: 400 }),
        )
      );

      // Checkmark animation - bounces in
      checkmarkScale.value = withDelay(
        200,
        withSpring(1, { damping: 10, stiffness: 150 })
      );
      checkmarkOpacity.value = withDelay(200, withTiming(1, { duration: 200 }));

      // Text animation - slides up and fades in
      textOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));
      textTranslateY.value = withDelay(
        400,
        withSpring(0, { damping: 12, stiffness: 100 })
      );

      // Complete animation callback
      if (onAnimationComplete) {
        const timer = setTimeout(() => {
          onAnimationComplete();
        }, 1500);
        return () => clearTimeout(timer);
      }
    } else {
      // Reset values when not visible
      overlayOpacity.value = 0;
      checkmarkScale.value = 0;
      checkmarkOpacity.value = 0;
      ringScale.value = 0;
      ringOpacity.value = 0;
      textOpacity.value = 0;
      textTranslateY.value = 20;
    }
  }, [visible, onAnimationComplete]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
    opacity: checkmarkOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.overlay, overlayStyle]}
      accessible={true}
      accessibilityLabel="Sign in successful"
      accessibilityRole="alert"
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {/* Expanding ring */}
          <Animated.View style={[styles.ring, ringStyle]} />
          {/* Checkmark */}
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

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#10b981', // green-500
  },
  checkmark: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981', // green-500
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 40,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  successText: {
    marginTop: 24,
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a', // slate-900
    letterSpacing: 0.5,
  },
});
