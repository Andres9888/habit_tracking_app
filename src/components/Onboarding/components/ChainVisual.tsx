/**
 * Chain Visual Component
 * Animated chain links for onboarding screens
 * Warm minimalism: 7 links with sequential illumination
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface ChainLinkProps {
  isActive: boolean;
  delay: number;
  isGlowing?: boolean;
}

const ACCENT_COLOR = '#D4654A';
const INACTIVE_COLOR = 'rgba(138, 132, 125, 0.3)';

function ChainLink({ isActive, delay, isGlowing = false }: ChainLinkProps) {
  const opacity = useSharedValue(0.3);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      opacity.value = withDelay(
        delay,
        withTiming(1, { duration: 320, easing: Easing.out(Easing.ease) })
      );
    } else {
      opacity.value = withTiming(0.3, { duration: 200 });
    }

    if (isGlowing) {
      glowOpacity.value = withSequence(
        withDelay(delay, withTiming(0.4, { duration: 280 })),
        withTiming(0, { duration: 280 })
      );
    }
  }, [isActive, isGlowing, delay, opacity, glowOpacity]);

  const linkStyle = useAnimatedStyle(() => ({
    backgroundColor: isActive ? ACCENT_COLOR : INACTIVE_COLOR,
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.linkWrapper}>
      <Animated.View style={[styles.glow, glowStyle]} />
      <View style={styles.linkConnector} />
      <Animated.View style={[styles.link, linkStyle]} />
      <View style={styles.linkConnector} />
    </View>
  );
}

interface ChainVisualProps {
  highlightIndex?: number;
  isSingle?: boolean;
  animateEntry?: boolean;
}

export function ChainVisual({
  highlightIndex = 3,
  isSingle = false,
  animateEntry = true,
}: ChainVisualProps) {
  if (isSingle) {
    return (
      <View style={styles.singleContainer}>
        <ChainLink isActive={true} delay={0} isGlowing={true} />
      </View>
    );
  }

  const links = Array.from({ length: 7 }, (_, i) => ({
    isActive: i === highlightIndex,
    delay: animateEntry ? i * 320 : 0,
  }));

  return (
    <View style={styles.container}>
      {links.map((link, index) => (
        <ChainLink
          key={index}
          isActive={link.isActive}
          delay={link.delay}
          isGlowing={link.isActive}
        />
      ))}
    </View>
  );
}

const LINK_WIDTH = 32;
const LINK_HEIGHT = 48;
const CONNECTOR_WIDTH = 8;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    paddingHorizontal: 24,
  },
  glow: {
    position: 'absolute',
    width: LINK_WIDTH + 16,
    height: LINK_HEIGHT + 16,
    borderRadius: 20,
    backgroundColor: ACCENT_COLOR,
    opacity: 0,
    left: CONNECTOR_WIDTH - 8,
    top: -8,
  },
  link: {
    width: LINK_WIDTH,
    height: LINK_HEIGHT,
    borderRadius: 12,
  },
  linkConnector: {
    width: CONNECTOR_WIDTH,
    height: 12,
    backgroundColor: 'rgba(138, 132, 125, 0.15)',
  },
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  singleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChainVisual;
