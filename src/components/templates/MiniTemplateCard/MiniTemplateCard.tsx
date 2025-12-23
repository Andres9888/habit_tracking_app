/**
 * MiniTemplateCard Component
 * Compact template card for horizontal scrolling previews within category sections
 */

import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useReduceMotion } from '../hooks/useReduceMotion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export interface MiniTemplateCardProps {
  /** Template icon/emoji */
  icon: string;
  /** Template icon background color */
  iconColor: string;
  /** Template name */
  name: string;
  /** Template description */
  description?: string;
  /** Short description or frequency */
  subtitle?: string;
  /** Has scientific backing */
  hasResearch?: boolean;
  /** Scientific reference text */
  scientificReference?: string;
  /** Tap handler for preview */
  onPress: () => void;
  /** Import handler */
  onImport?: () => void;
  /** Is currently importing */
  isImporting?: boolean;
  /** Has been successfully imported */
  isImported?: boolean;
}

/** Default fallback color when iconColor is missing or invalid */
const DEFAULT_ICON_COLOR = '#6b7280';

export function MiniTemplateCard({
  icon,
  iconColor: iconColorProp,
  name,
  description,
  subtitle,
  hasResearch,
  scientificReference,
  onPress,
  onImport,
  isImporting,
  isImported,
}: MiniTemplateCardProps) {
  const reducedMotion = useReduceMotion();

  // Ensure iconColor is valid - fallback to neutral gray if missing or empty
  const iconColor = iconColorProp && iconColorProp.trim() !== '' ? iconColorProp : DEFAULT_ICON_COLOR;

  // Card press animations
  const pressScale = useSharedValue(1);
  const pressRotation = useSharedValue(0);
  const shadowElevation = useSharedValue(3);

  // Import button pulse animation
  const buttonPulse = useSharedValue(1);

  // Success checkmark animation
  const checkmarkScale = useSharedValue(0);
  const successGlow = useSharedValue(0);

  // Research badge shimmer animation
  const shimmerTranslate = useSharedValue(-120);

  // Shimmer animation for research badge (subtle attention-getter)
  useEffect(() => {
    if (reducedMotion || !hasResearch) return;

    shimmerTranslate.value = withRepeat(
      withTiming(120, { duration: 2000, easing: Easing.linear }),
      -1, // infinite
      false // don't reverse, reset to start
    );

    return () => {
      cancelAnimation(shimmerTranslate);
    };
  }, [shimmerTranslate, reducedMotion, hasResearch]);

  // Subtle pulse animation for import button (draws attention)
  useEffect(() => {
    if (reducedMotion || isImporting || isImported || !onImport) return;

    buttonPulse.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // infinite
      true
    );

    return () => {
      cancelAnimation(buttonPulse);
    };
  }, [buttonPulse, reducedMotion, isImporting, isImported, onImport]);

  // Success animation when imported
  useEffect(() => {
    if (isImported) {
      // Animate checkmark appearing
      checkmarkScale.value = withSpring(1, { damping: 8, stiffness: 150 });
      // Animate glow effect
      successGlow.value = withSequence(
        withTiming(0.6, { duration: 200 }),
        withTiming(0, { duration: 800 })
      );
      // Stop pulse
      cancelAnimation(buttonPulse);
      buttonPulse.value = 1;
    } else {
      checkmarkScale.value = 0;
      successGlow.value = 0;
    }
  }, [isImported, checkmarkScale, successGlow, buttonPulse]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pressScale.value },
      { rotate: `${pressRotation.value}deg` },
    ],
    shadowOpacity: interpolate(shadowElevation.value, [3, 8], [0.08, 0.15]),
    elevation: shadowElevation.value,
  }));

  const importButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonPulse.value }],
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
    opacity: checkmarkScale.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: successGlow.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value }],
  }));

  const handlePressIn = () => {
    if (reducedMotion) {
      pressScale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    } else {
      pressScale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      shadowElevation.value = withTiming(8, { duration: 100 });
      pressRotation.value = withSpring(-0.5, { damping: 20, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    if (!reducedMotion) {
      shadowElevation.value = withTiming(3, { duration: 150 });
      pressRotation.value = withSpring(0, { damping: 15, stiffness: 300 });
    }
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleImport = () => {
    if (isImporting || isImported || !onImport) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onImport();
  };

  return (
    <AnimatedPressable
      accessible
      accessibilityLabel={`${name} template`}
      accessibilityRole="button"
      style={[styles.card, { backgroundColor: `${iconColor}08` }, animatedCardStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Success glow overlay */}
      <Animated.View
        style={[
          styles.glowOverlay,
          { backgroundColor: '#22c55e' },
          glowStyle,
        ]}
        pointerEvents="none"
      />

      {/* Left accent */}
      <View style={[styles.accent, { backgroundColor: isImported ? '#22c55e' : iconColor }]} />

      {/* Header row with icon and name */}
      <View style={styles.headerRow}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          {subtitle && (
            <Text numberOfLines={1} style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
        {/* Import button */}
        {onImport && (
          <Animated.View style={importButtonStyle}>
            <Pressable
              accessible
              accessibilityLabel={isImported ? `${name} added` : `Add ${name} habit`}
              accessibilityRole="button"
              disabled={isImporting || isImported}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={[
                styles.importButton,
                { backgroundColor: isImported ? '#22c55e' : iconColor },
              ]}
              onPress={handleImport}
            >
              {isImporting ? (
                <ActivityIndicator color="#fff" size={12} />
              ) : isImported ? (
                <Animated.View style={[styles.checkmarkContainer, checkmarkStyle]}>
                  <Check color="#fff" size={14} strokeWidth={3} />
                  <Text style={styles.importButtonText}>Added</Text>
                </Animated.View>
              ) : (
                <>
                  <Plus color="#fff" size={14} strokeWidth={3} />
                  <Text style={styles.importButtonText}>Add</Text>
                </>
              )}
            </Pressable>
          </Animated.View>
        )}
      </View>

      {/* Description */}
      {description && (
        <Text numberOfLines={2} style={styles.description}>
          {description}
        </Text>
      )}

      {/* Research badge with shimmer effect */}
      {hasResearch && (
        <View style={[styles.researchBadge, { backgroundColor: `${iconColor}15` }]}>
          {/* Shimmer overlay */}
          {!reducedMotion && (
            <AnimatedLinearGradient
              colors={['#00000000', `${iconColor}20`, '#00000000']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.shimmerOverlay, shimmerStyle]}
            />
          )}
          <Text style={styles.researchIcon}>🔬</Text>
          <Text numberOfLines={1} style={[styles.researchText, { color: iconColor }]}>
            {scientificReference ? scientificReference.split(' ').slice(0, 3).join(' ') + '...' : 'Research-backed'}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    minHeight: 140,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: 14,
    paddingHorizontal: 14,
    paddingLeft: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  headerContent: {
    flex: 1,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  importButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  checkmarkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101727',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: '#4b5563',
    marginBottom: 10,
    flex: 1,
  },
  researchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    overflow: 'hidden', // Required for shimmer to be clipped within badge bounds
    position: 'relative', // Required for shimmer absolute positioning
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60, // Width of the shimmer highlight
    left: 0,
  },
  researchIcon: {
    fontSize: 10,
  },
  researchText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default MiniTemplateCard;
