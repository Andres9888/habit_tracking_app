/**
 * Suggestion Pill Component
 * Clickable pill for quick habit selection
 */

import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface SuggestionPillProps {
  label: string;
  onPress: () => void;
  delay?: number;
  testID?: string;
}

const SECONDARY_COLOR = '#2C2825';
const NEUTRAL_BG = 'rgba(138, 132, 125, 0.1)';

export function SuggestionPill({
  label,
  onPress,
  delay = 0,
  testID,
}: SuggestionPillProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 240, easing: Easing.out(Easing.ease) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 240, easing: Easing.out(Easing.ease) })
    );
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 120, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.ease) });
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        testID={testID}
        style={styles.container}
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: NEUTRAL_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: SECONDARY_COLOR,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
});

export default SuggestionPill;
