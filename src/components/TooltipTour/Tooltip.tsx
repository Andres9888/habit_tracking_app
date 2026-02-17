/**
 * Tooltip Component
 * 
 * Individual tooltip bubble with message, arrow, and dismiss interaction.
 * Follows Chain Day design system: SF Pro typography, emerald green accents,
 * smooth animations with springify().damping(18), 16px border radius.
 */

import { useEffect } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useThemeColors, useIsDark } from '../../theme/ThemeContext';
import { colors as designColors } from '../../theme/colors';

interface TooltipProps {
  /** The tooltip message */
  message: string;
  /** Position on screen */
  position: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  /** Arrow placement */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Called when user taps to dismiss */
  onDismiss: () => void;
}

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 90,
  mass: 0.8,
};

export function Tooltip({ message, position, placement = 'top', onDismiss }: TooltipProps) {
  const { colors } = useThemeColors();
  const isDark = useIsDark();
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Entrance animation
    scale.value = withSpring(1, SPRING_CONFIG);
    opacity.value = withTiming(1, { duration: 280 });
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const backgroundColor = isDark ? '#1f2937' : '#047857'; // gray-800 dark, primary-700 light
  const textColor = '#FFFFFF';
  const arrowColor = backgroundColor;

  return (
    <Animated.View
      entering={FadeIn.duration(280)}
      exiting={FadeOut.duration(200)}
      pointerEvents="box-none"
      style={[
        styles.container,
        position,
      ]}
    >
      <Pressable onPress={onDismiss}>
        <Animated.View
          style={[
            styles.bubble,
            { backgroundColor },
            animatedStyle,
          ]}
        >
          {/* Arrow */}
          {placement === 'top' && (
            <View style={[styles.arrow, styles.arrowTop, { borderTopColor: arrowColor }]} />
          )}
          {placement === 'bottom' && (
            <View style={[styles.arrow, styles.arrowBottom, { borderBottomColor: arrowColor }]} />
          )}
          {placement === 'left' && (
            <View style={[styles.arrow, styles.arrowLeft, { borderLeftColor: arrowColor }]} />
          )}
          {placement === 'right' && (
            <View style={[styles.arrow, styles.arrowRight, { borderRightColor: arrowColor }]} />
          )}

          <Text style={[styles.text, { color: textColor }]}>
            {message}
          </Text>
          
          <Text style={[styles.hint, { color: textColor, opacity: 0.7 }]}>
            Tap to continue
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
    maxWidth: 280,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  text: {
    fontSize: 17, // Body size from design system
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 6,
  },
  hint: {
    fontSize: 13, // Caption size from design system
    lineHeight: 18,
    fontWeight: '500',
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
  arrowTop: {
    top: -8,
    left: '50%',
    marginLeft: -8,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowBottom: {
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowLeft: {
    left: -8,
    top: '50%',
    marginTop: -8,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  arrowRight: {
    right: -8,
    top: '50%',
    marginTop: -8,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});
