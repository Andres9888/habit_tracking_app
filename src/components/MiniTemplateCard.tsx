/**
 * MiniTemplateCard Component
 * Compact template card for horizontal scrolling previews within category sections
 */

import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import { Check, ChevronRight, FlaskConical, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useReduceMotion } from '../hooks/useReduceMotion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  subtitle: _subtitle,
  hasResearch,
  scientificReference: _scientificReference,
  onPress,
  onImport,
  isImporting,
  isImported,
}: MiniTemplateCardProps) {
  const reducedMotion = useReduceMotion();

  // Ensure iconColor is valid - fallback to neutral gray if missing or empty
  const iconColor =
    iconColorProp && iconColorProp.trim() !== ''
      ? iconColorProp
      : DEFAULT_ICON_COLOR;

  // Card press animations
  const pressScale = useSharedValue(1);
  const pressRotation = useSharedValue(0);
  const shadowElevation = useSharedValue(3);

  // Import button pulse animation
  const buttonPulse = useSharedValue(1);

  // Success checkmark animation
  const checkmarkScale = useSharedValue(0);
  const successGlow = useSharedValue(0);

  // Chevron hover animation
  const chevronTranslate = useSharedValue(0);

  // Science badge pulse animation
  const scienceBadgePulse = useSharedValue(1);

  // Pulse animation for science badge (subtle attention-getter)
  useEffect(() => {
    if (reducedMotion || !hasResearch || isImported) {
      // Stop animation when imported or reduced motion
      cancelAnimation(scienceBadgePulse);
      scienceBadgePulse.value = 1;
      return;
    }

    // Subtle pulse animation (opacity 0.6 to 1.0)
    scienceBadgePulse.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // infinite
      true
    );

    return () => {
      cancelAnimation(scienceBadgePulse);
    };
  }, [scienceBadgePulse, reducedMotion, hasResearch, isImported]);

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
    elevation: shadowElevation.value,
    shadowOpacity: interpolate(shadowElevation.value, [3, 8], [0.08, 0.15]),
    transform: [
      { scale: pressScale.value },
      { rotate: `${pressRotation.value}deg` },
    ],
  }));

  const importButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonPulse.value }],
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: checkmarkScale.value,
    transform: [{ scale: checkmarkScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: successGlow.value,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: chevronTranslate.value }],
  }));

  const scienceBadgeStyle = useAnimatedStyle(() => ({
    opacity: scienceBadgePulse.value,
  }));

  const handlePressIn = () => {
    if (reducedMotion) {
      pressScale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    } else {
      pressScale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      shadowElevation.value = withTiming(8, { duration: 100 });
      pressRotation.value = withSpring(-0.5, { damping: 20, stiffness: 400 });
      chevronTranslate.value = withSpring(2, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    if (!reducedMotion) {
      shadowElevation.value = withTiming(3, { duration: 150 });
      pressRotation.value = withSpring(0, { damping: 15, stiffness: 300 });
      chevronTranslate.value = withSpring(0, { damping: 15, stiffness: 300 });
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
      accessibilityRole='button'
      style={[
        styles.card,
        { backgroundColor: `${iconColor}08` },
        animatedCardStyle,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Success glow overlay */}
      <Animated.View
        pointerEvents='none'
        style={[styles.glowOverlay, { backgroundColor: '#22c55e' }, glowStyle]}
      />

      {/* Left accent */}
      <View
        style={[
          styles.accent,
          { backgroundColor: isImported ? '#22c55e' : iconColor },
        ]}
      />

      {/* Top row: Icon + Chevron */}
      <View style={styles.topRow}>
        <View style={styles.iconWrapper}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${iconColor}20` },
            ]}
          >
            <Text style={styles.icon}>{icon}</Text>
          </View>
          {/* Science badge on icon corner */}
          {hasResearch && (
            <Animated.View
              accessibilityLabel='Science-backed habit'
              style={[styles.scienceBadge, scienceBadgeStyle]}
            >
              <FlaskConical color='#fff' size={10} strokeWidth={2.5} />
            </Animated.View>
          )}
        </View>
        {/* Chevron indicator - tap to view details */}
        <Animated.View
          accessibilityLabel='View details'
          style={[styles.chevronContainer, chevronStyle]}
        >
          <ChevronRight color='#a8a29e' size={16} strokeWidth={2.5} />
        </Animated.View>
      </View>

      {/* Title */}
      <Text numberOfLines={1} style={styles.name}>
        {name}
      </Text>

      {/* Description */}
      {description && (
        <Text numberOfLines={2} style={styles.description}>
          {description}
        </Text>
      )}

      {/* Import button - absolute positioned at bottom-right */}
      {onImport && (
        <Animated.View style={[styles.importButtonWrapper, importButtonStyle]}>
          <Pressable
            accessible
            accessibilityLabel={
              isImported ? `${name} added` : `Add ${name} habit`
            }
            accessibilityRole='button'
            disabled={isImporting || isImported}
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            style={[
              styles.importButton,
              { backgroundColor: isImported ? '#22c55e' : iconColor },
            ]}
            onPress={handleImport}
          >
            {isImporting ? (
              <ActivityIndicator color='#fff' size={12} />
            ) : isImported ? (
              <Animated.View
                style={[styles.checkmarkContainer, checkmarkStyle]}
              >
                <Check color='#fff' size={14} strokeWidth={3} />
                <Text style={styles.importButtonText}>Added</Text>
              </Animated.View>
            ) : (
              <>
                <Plus color='#fff' size={14} strokeWidth={3} />
                <Text style={styles.importButtonText}>Add</Text>
              </>
            )}
          </Pressable>
        </Animated.View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  accent: {
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  card: {
    borderRadius: 16,
    elevation: 3,
    flexDirection: 'column',
    marginRight: 12,
    minHeight: 150,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingLeft: 18,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    width: 200,
  },
  checkmarkContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  chevronContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 8,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  description: {
    color: '#78716c',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 36,
  },
  glowOverlay: {
    borderRadius: 16,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  icon: {
    fontSize: 22,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  iconWrapper: {
    position: 'relative',
  },
  importButton: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  importButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  importButtonWrapper: {
    bottom: 14,
    position: 'absolute',
    right: 14,
  },
  name: {
    color: '#1c1917',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 6,
  },
  scienceBadge: {
    alignItems: 'center',
    backgroundColor: '#10b981',
    borderRadius: 9,
    bottom: -4,
    height: 18,
    justifyContent: 'center',
    position: 'absolute',
    right: -4,
    width: 18,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default MiniTemplateCard;
