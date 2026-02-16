/**
 * SplashTransition Component
 *
 * Handles the smooth transition from the native splash screen to the app content.
 * Features:
 * - Fade animation from splash to app (no white flash)
 * - Waits for critical resources before transitioning
 * - Branded animation with subtle scale effect
 * - Supports both light and dark modes
 */

import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';

interface SplashTransitionProps {
  children: React.ReactNode;
  /** Called when app is ready to show (fonts loaded, auth checked, etc.) */
  isReady: boolean;
}

export function SplashTransition({ children, isReady }: SplashTransitionProps) {
  const [isSplashHidden, setIsSplashHidden] = useState(false);
  const colorScheme = useColorScheme();
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.95);

  // Match splash background colors from app.json
  const splashBackgroundColor = colorScheme === 'dark' ? '#047857' : '#059669';

  useEffect(() => {
    if (isReady) {
      // Start fade-in animation
      fadeAnim.value = withTiming(1, { duration: 280 });
      scaleAnim.value = withSequence(
        withTiming(1, { duration: 280 }),
        withTiming(1, { duration: 0 }, () => {
          // Hide native splash screen after animation completes
          runOnJS(hideSplash)();
        })
      );
    }
  }, [isReady]);

  const hideSplash = async () => {
    await SplashScreen.hideAsync();
    setIsSplashHidden(true);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }],
    };
  });

  // Show splash screen color until we're ready
  if (!isReady) {
    return (
      <View style={[styles.container, { backgroundColor: splashBackgroundColor }]}>
        {/* Empty view matching splash background */}
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
