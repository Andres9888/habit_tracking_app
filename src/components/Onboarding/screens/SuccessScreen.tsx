/**
 * Success Screen
 * Screen 3: "Your chain begins."
 */

import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChainVisual } from '../components/ChainVisual';
import { ProgressDots } from '../components/ProgressDots';
import type { SuccessScreenProps } from '../types';

const DOMINANT_BG = '#FAF8F5';
const SECONDARY_TEXT = '#2C2825';
const NEUTRAL_TEXT = '#8A847D';
const ACCENT_COLOR = '#D4654A';
const ENTRY_DURATION = 240;
const STAGGER_DELAY = 60;

export function SuccessScreen({ onComplete }: SuccessScreenProps) {
  const insets = useSafeAreaInsets();
  const buttonScale = useSharedValue(1);

  const headlineOpacity = useSharedValue(0);
  const headlineTranslateY = useSharedValue(16);
  const visualOpacity = useSharedValue(0);
  const visualScale = useSharedValue(0.8);
  const subtextOpacity = useSharedValue(0);
  const subtextTranslateY = useSharedValue(16);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(16);

  useEffect(() => {
    headlineOpacity.value = withDelay(
      0,
      withTiming(1, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );
    headlineTranslateY.value = withDelay(
      0,
      withTiming(0, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );

    visualOpacity.value = withDelay(
      STAGGER_DELAY,
      withTiming(1, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );
    visualScale.value = withDelay(
      STAGGER_DELAY,
      withTiming(1, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );

    subtextOpacity.value = withDelay(
      STAGGER_DELAY * 2,
      withTiming(1, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );
    subtextTranslateY.value = withDelay(
      STAGGER_DELAY * 2,
      withTiming(0, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );

    buttonOpacity.value = withDelay(
      STAGGER_DELAY * 3,
      withTiming(1, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );
    buttonTranslateY.value = withDelay(
      STAGGER_DELAY * 3,
      withTiming(0, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );
  }, []);

  const headlineStyle = useAnimatedStyle(() => ({
    opacity: headlineOpacity.value,
    transform: [{ translateY: headlineTranslateY.value }],
  }));

  const visualStyle = useAnimatedStyle(() => ({
    opacity: visualOpacity.value,
    transform: [{ scale: visualScale.value }],
  }));

  const subtextStyle = useAnimatedStyle(() => ({
    opacity: subtextOpacity.value,
    transform: [{ translateY: subtextTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }, { scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.96, { duration: 120, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.ease) });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 32 }]}>
      <ProgressDots currentScreen={2} />

      <View style={styles.contentSection}>
        <Animated.Text style={[styles.headline, headlineStyle]}>
          Your chain begins.
        </Animated.Text>

        <Animated.View style={[styles.visualContainer, visualStyle]}>
          <ChainVisual isSingle={true} />
        </Animated.View>

        <Animated.Text style={[styles.subtext, subtextStyle]}>
          Day 1 starts now.
        </Animated.Text>
      </View>

      <Animated.View style={[styles.actionSection, buttonStyle]}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={1}
          onPress={onComplete}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          testID="begin-streak-button"
        >
          <Text style={styles.primaryButtonText}>Begin your streak</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionSection: {
    paddingBottom: 80,
  },
  container: {
    backgroundColor: DOMINANT_BG,
    flex: 1,
    paddingHorizontal: 24,
  },
  contentSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headline: {
    color: SECONDARY_TEXT,
    fontSize: 38,
    fontWeight: '600',
    letterSpacing: -0.02 * 38,
    lineHeight: 38 * 1.2,
    marginBottom: 48,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: ACCENT_COLOR,
    borderRadius: 12,
    elevation: 2,
    height: 56,
    justifyContent: 'center',
    shadowColor: SECONDARY_TEXT,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 16 * 0.01,
  },
  subtext: {
    color: NEUTRAL_TEXT,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 16 * 0.005,
    lineHeight: 16 * 1.5,
    marginTop: 32,
    textAlign: 'center',
  },
  visualContainer: {
    marginVertical: 32,
  },
});

export default SuccessScreen;
