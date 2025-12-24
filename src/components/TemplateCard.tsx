/**
 * TemplateCard Component
 * Enhanced design with accent bar, color tint, and icon glow
 *
 * Purpose: Display habit template with rich visual personality
 * Features: Left accent bar, tinted background, glowing icon, scientific citation
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  type ViewStyle,
} from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
  Easing,
  FadeInUp,
  FadeIn,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { useAppTheme } from '../theme';
import { useReduceMotion } from '../hooks/useReduceMotion';
import Button from './Button/Button';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface TemplateCardProps {
  /** Animation index for staggered entrance */
  animationIndex?: number;

  /** Category badge */
  category?: string;

  /** Enable scroll reveal animation (cards animate in when entering viewport) */
  enableScrollReveal?: boolean;

  /** Template description */
  description: string;

  /** Optional frequency label */
  frequency?: string;

  /** Does user have access to premium? */
  hasAccess?: boolean;

  /** Template icon/emoji */
  icon: string;

  /** Template icon background color */
  iconColor: string;

  /** Template ID */
  id: string;

  /** Has been successfully imported */
  isImported?: boolean;

  /** Loading flag for import mutation */
  isImporting?: boolean;

  /** Is this a premium template? */
  isPremium?: boolean;

  /** Template name */
  name: string;

  /** On import handler */
  onImport: () => void;

  /** On preview handler (tap card) */
  onPreview?: () => void;

  /** On upgrade handler (for premium templates) */
  onUpgrade?: () => void;

  /** Popularity score (optional) */
  popularityScore?: number;

  /** Optional scientific link */
  scientificLink?: string;

  /** Scientific reference citation */
  scientificReference: string;

  /** Should preview CTA render */
  showPreviewCTA?: boolean;

  /** Custom style */
  style?: ViewStyle;

  /** Optional YouTube video link */
  youtubeLink?: string;
}

/** Default fallback color when iconColor is missing or invalid */
const DEFAULT_ICON_COLOR = '#6b7280';

export function TemplateCard({
  animationIndex = 0,
  category,
  description,
  enableScrollReveal = false,
  frequency,
  hasAccess = true,
  icon,
  iconColor: iconColorProp,
  id,
  isImported = false,
  isImporting = false,
  isPremium = false,
  name,
  onImport,
  onPreview,
  onUpgrade,
  popularityScore,
  scientificLink,
  scientificReference,
  showPreviewCTA = true,
  style,
  youtubeLink,
}: TemplateCardProps) {
  const theme = useAppTheme();
  const reducedMotion = useReduceMotion();
  const isLocked = isPremium && !hasAccess;

  // Ensure iconColor is valid - fallback to neutral gray if missing or empty
  const iconColor =
    iconColorProp && iconColorProp.trim() !== ''
      ? iconColorProp
      : DEFAULT_ICON_COLOR;

  // Animation values - skip entrance animation if animationIndex is 0
  const skipAnimation = animationIndex === 0;
  const cardOpacity = useSharedValue(skipAnimation ? 1 : 0);
  const cardTranslateY = useSharedValue(skipAnimation ? 0 : 20);
  const pressScale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.06);

  // Success glow animation
  const successGlow = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);

  // Entrance animation (only if animationIndex > 0)
  useEffect(() => {
    if (skipAnimation) return;
    const delay = animationIndex * 80;
    cardOpacity.value = withDelay(
      delay,
      withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) })
    );
    cardTranslateY.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 120 })
    );

    // Cleanup animations on unmount
    return () => {
      cancelAnimation(cardOpacity);
      cancelAnimation(cardTranslateY);
    };
  }, [animationIndex, skipAnimation, cardOpacity, cardTranslateY]);

  // Success glow animation when imported
  useEffect(() => {
    if (isImported) {
      // Animate checkmark appearing
      checkmarkScale.value = withSpring(1, { damping: 8, stiffness: 150 });
      // Animate glow effect - flash green then fade out
      if (!reducedMotion) {
        successGlow.value = withSequence(
          withTiming(0.6, { duration: 200 }),
          withTiming(0, { duration: 800 })
        );
      }
    } else {
      checkmarkScale.value = 0;
      successGlow.value = 0;
    }

    // Cleanup animations on unmount
    return () => {
      cancelAnimation(checkmarkScale);
      cancelAnimation(successGlow);
    };
  }, [isImported, checkmarkScale, successGlow, reducedMotion]);

  const frequencyLabels: Record<string, string> = {
    custom: 'Custom',
    daily: 'Daily',
    weekly: 'Weekly',
  };
  const formattedFrequency = frequency
    ? frequencyLabels[frequency] ||
      frequency
        .split('_')
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ')
    : undefined;

  // Category display names
  const categoryLabels: Record<string, string> = {
    andrew_huberman: 'Andrew Huberman',
    creativity: 'Creativity',
    financial: 'Financial',
    health_fitness: 'Health & Fitness',
    learning: 'Learning',
    mindfulness: 'Mindfulness',
    morning_routine: 'Morning Routine',
    productivity: 'Productivity',
    sleep: 'Sleep',
    social: 'Social',
  };

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { translateY: cardTranslateY.value },
      { scale: pressScale.value },
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: shadowOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: successGlow.value,
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: checkmarkScale.value,
    transform: [{ scale: checkmarkScale.value }],
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
    shadowOpacity.value = withTiming(0.12, { duration: 120 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    shadowOpacity.value = withTiming(0.06, { duration: 200 });
  };

  const handleCardPress = () => {
    if (onPreview) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPreview();
    }
  };

  const handleImportPress = (e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (isLocked && onUpgrade) {
      onUpgrade();
      return;
    }

    if (!isLocked) {
      onImport();
    }
  };

  // Card background - use white per mock spec (previously used tinted background)
  const cardBackground = '#fff';

  // Scroll reveal animation - slides up and fades in when entering viewport
  // Using FadeInUp for a subtle, smooth entrance as cards scroll into view
  const scrollRevealAnimation = reducedMotion
    ? FadeIn.duration(0) // Instant appearance for reduced motion
    : FadeInUp.duration(350).springify().damping(18).stiffness(120);

  // Wrap card in animated container for scroll reveal
  const cardContent = (
    <AnimatedPressable
      accessible
      accessibilityHint='Tap to preview, or tap Import Habit to add to your habits'
      accessibilityLabel={`${name} template. ${description}`}
      accessibilityRole='button'
      style={[
        styles.card,
        {
          backgroundColor: cardBackground,
          opacity: isLocked ? 0.75 : 1,
        },
        containerStyle,
        shadowStyle,
        style,
      ]}
      onPress={handleCardPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Success glow overlay */}
      <Animated.View
        pointerEvents='none'
        style={[styles.glowOverlay, { backgroundColor: '#22c55e' }, glowStyle]}
      />

      {/* Left accent bar - green when imported */}
      <View
        style={[
          styles.accentBar,
          { backgroundColor: isImported ? '#22c55e' : iconColor },
        ]}
      />

      {/* Card Content */}
      <View style={styles.content}>
        {/* Header: Icon + Category Badge */}
        <View style={styles.header}>
          {/* Icon with glow effect */}
          <View style={styles.iconWrapper}>
            <View
              style={[
                styles.iconGlow,
                {
                  backgroundColor: iconColor,
                  shadowColor: iconColor,
                },
              ]}
            />
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: `${iconColor}25`,
                },
              ]}
            >
              <Text style={styles.icon}>{icon}</Text>
            </View>
          </View>

          <View style={styles.badgeRow}>
            {category && (
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: `${iconColor}15` },
                ]}
              >
                <Text
                  style={[
                    theme.custom.typography.caption,
                    { color: '#4b5563', fontWeight: '600' },
                  ]}
                >
                  {categoryLabels[category] || category}
                </Text>
              </View>
            )}

            {isPremium && (
              <View style={styles.inlinePremiumBadge}>
                <Text style={styles.inlinePremiumText}>Premium</Text>
              </View>
            )}
          </View>
        </View>

        {/* Template Name */}
        <Text
          numberOfLines={1}
          style={[
            theme.custom.typography.heading3,
            { color: '#101727', fontWeight: '700', marginTop: 14 },
          ]}
        >
          {name}
        </Text>

        {/* Metadata pills */}
        {(formattedFrequency ||
          scientificLink ||
          youtubeLink ||
          popularityScore) && (
          <View style={styles.metadataRow}>
            {formattedFrequency && (
              <View
                style={[styles.metadataPill, { borderColor: `${iconColor}30` }]}
              >
                <Text
                  style={[theme.custom.typography.caption, styles.metadataText]}
                >
                  ⏱️ {formattedFrequency}
                </Text>
              </View>
            )}

            {scientificLink && (
              <View
                style={[styles.metadataPill, { borderColor: `${iconColor}30` }]}
              >
                <Text
                  style={[theme.custom.typography.caption, styles.metadataText]}
                >
                  🔗 Research
                </Text>
              </View>
            )}

            {youtubeLink && (
              <View style={[styles.metadataPill, { borderColor: '#FF000030' }]}>
                <Text
                  style={[theme.custom.typography.caption, styles.metadataText]}
                >
                  ▶️ Video
                </Text>
              </View>
            )}

            {typeof popularityScore === 'number' && (
              <View
                style={[styles.metadataPill, { borderColor: `${iconColor}30` }]}
              >
                <Text
                  style={[theme.custom.typography.caption, styles.metadataText]}
                >
                  {popularityScore >= 90 ? 'Popular' : '⭐ Trusted'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Description */}
        <Text
          numberOfLines={3}
          style={[
            theme.custom.typography.bodySmall,
            { color: '#4b5563', lineHeight: 20, marginTop: 10 },
          ]}
        >
          {description}
        </Text>

        {/* Scientific Reference */}
        <View
          style={[
            styles.scienceBox,
            {
              backgroundColor: '#f0fdf4',
              borderColor: '#bbf7d0',
            },
          ]}
        >
          <Text style={styles.scienceIcon}>🔬</Text>
          <Text
            numberOfLines={2}
            style={[
              theme.custom.typography.caption,
              {
                color: '#166534',
                flex: 1,
                lineHeight: 16,
              },
            ]}
          >
            {scientificReference}
          </Text>
        </View>

        {/* Import Button */}
        <View style={styles.footer}>
          {isImported ? (
            <Animated.View style={[styles.successButton, checkmarkStyle]}>
              <Check color='#fff' size={18} strokeWidth={3} />
              <Text style={styles.successButtonText}>Added to Habits</Text>
            </Animated.View>
          ) : (
            <Button
              accessibilityLabel={`Import ${name} habit`}
              disabled={isLocked}
              loading={isImporting}
              size='medium'
              style={[
                styles.importButton,
                { backgroundColor: isLocked ? '#9ca3af' : iconColor },
              ]}
              variant='primary'
              onPress={handleImportPress}
            >
              {isLocked ? 'Unlock with Pro' : 'Import Habit'}
            </Button>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );

  // Return with scroll reveal wrapper if enabled
  if (enableScrollReveal) {
    return (
      <Animated.View entering={scrollRevealAnimation}>
        {cardContent}
      </Animated.View>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  accentBar: {
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  badgeRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    marginHorizontal: 20,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  categoryBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  content: {
    padding: 16,
    paddingLeft: 16,
  },
  footer: {
    gap: 8,
    marginTop: 16,
  },
  glowOverlay: {
    borderRadius: 16,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    fontSize: 28,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  iconGlow: {
    borderRadius: 28,
    height: 56,
    opacity: 0.2,
    position: 'absolute',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    width: 56,
  },
  iconWrapper: {
    position: 'relative',
  },
  importButton: {
    width: '100%',
  },
  inlinePremiumBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  inlinePremiumText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  metadataPill: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  metadataText: {
    color: '#4b5563',
  },
  scienceBox: {
    alignItems: 'flex-start',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    padding: 12,
  },
  scienceIcon: {
    fontSize: 14,
  },
  successButton: {
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default TemplateCard;
