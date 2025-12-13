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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAppTheme } from '../theme';
import Button from './Button/Button';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface TemplateCardProps {
  /** Template ID */
  id: string;

  /** Template name */
  name: string;

  /** Template description */
  description: string;

  /** Template icon/emoji */
  icon: string;

  /** Template icon background color */
  iconColor: string;

  /** Scientific reference citation */
  scientificReference: string;

  /** Optional scientific link */
  scientificLink?: string;

  /** Optional YouTube video link */
  youtubeLink?: string;

  /** Category badge */
  category?: string;

  /** Popularity score (optional) */
  popularityScore?: number;

  /** Is this a premium template? */
  isPremium?: boolean;

  /** Does user have access to premium? */
  hasAccess?: boolean;

  /** Is this a new template? */
  isNew?: boolean;

  /** Optional frequency label */
  frequency?: string;

  /** On import handler */
  onImport: () => void;

  /** On preview handler (tap card) */
  onPreview?: () => void;

  /** On upgrade handler (for premium templates) */
  onUpgrade?: () => void;

  /** Should preview CTA render */
  showPreviewCTA?: boolean;

  /** Loading flag for import mutation */
  isImporting?: boolean;

  /** Animation index for staggered entrance */
  animationIndex?: number;

  /** Custom style */
  style?: ViewStyle;
}

export function TemplateCard({
  id,
  name,
  description,
  icon,
  iconColor,
  scientificReference,
  scientificLink,
  youtubeLink,
  category,
  popularityScore,
  isPremium = false,
  hasAccess = true,
  isNew = false,
  frequency,
  onImport,
  onPreview,
  onUpgrade,
  showPreviewCTA = true,
  isImporting = false,
  animationIndex = 0,
  style,
}: TemplateCardProps) {
  const theme = useAppTheme();
  const isLocked = isPremium && !hasAccess;

  // Animation values
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);
  const pressScale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.06);

  // Entrance animation
  useEffect(() => {
    const delay = animationIndex * 80;
    cardOpacity.value = withDelay(
      delay,
      withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) })
    );
    cardTranslateY.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 120 })
    );
  }, [animationIndex]);

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

  // Generate tinted background color (3% opacity of accent)
  const tintedBackground = `${iconColor}08`;

  return (
    <AnimatedPressable
      accessible
      accessibilityHint="Tap to preview, or tap Import Habit to add to your habits"
      accessibilityLabel={`${name} template. ${description}`}
      accessibilityRole="button"
      style={[
        styles.card,
        {
          backgroundColor: tintedBackground,
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
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: iconColor }]} />

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

            {isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
            )}

            {popularityScore && popularityScore >= 90 && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularEmoji}>🔥</Text>
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
        {(formattedFrequency || scientificLink || youtubeLink || popularityScore) && (
          <View style={styles.metadataRow}>
            {formattedFrequency && (
              <View style={[styles.metadataPill, { borderColor: `${iconColor}30` }]}>
                <Text
                  style={[
                    theme.custom.typography.caption,
                    styles.metadataText,
                  ]}
                >
                  ⏱️ {formattedFrequency}
                </Text>
              </View>
            )}

            {scientificLink && (
              <View style={[styles.metadataPill, { borderColor: `${iconColor}30` }]}>
                <Text
                  style={[
                    theme.custom.typography.caption,
                    styles.metadataText,
                  ]}
                >
                  🔗 Research
                </Text>
              </View>
            )}

            {youtubeLink && (
              <View style={[styles.metadataPill, { borderColor: '#FF000030' }]}>
                <Text
                  style={[
                    theme.custom.typography.caption,
                    styles.metadataText,
                  ]}
                >
                  ▶️ Video
                </Text>
              </View>
            )}

            {typeof popularityScore === 'number' && (
              <View style={[styles.metadataPill, { borderColor: `${iconColor}30` }]}>
                <Text
                  style={[
                    theme.custom.typography.caption,
                    styles.metadataText,
                  ]}
                >
                  {popularityScore >= 90 ? '🔥 Popular' : '⭐ Trusted'}
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
          <Button
            accessibilityLabel={`Import ${name} habit`}
            disabled={isLocked}
            loading={isImporting}
            onPress={handleImportPress}
            size="medium"
            style={[
              styles.importButton,
              { backgroundColor: isLocked ? '#9ca3af' : iconColor },
            ]}
            variant="primary"
          >
            {isLocked ? 'Unlock with Pro' : 'Import Habit'}
          </Button>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  accentBar: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    left: 0,
    position: 'absolute',
    bottom: 0,
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
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  categoryBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  content: {
    padding: 20,
    paddingLeft: 20,
  },
  footer: {
    gap: 8,
    marginTop: 16,
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
    shadowOffset: { width: 0, height: 0 },
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
  newBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '600',
  },
  popularBadge: {
    marginLeft: 'auto',
  },
  popularEmoji: {
    fontSize: 18,
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
});

export default TemplateCard;
