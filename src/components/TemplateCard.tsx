/**
 * TemplateCard Component
 * Based on UX Specification Section 2.1 (Templates Tab)
 *
 * Purpose: Display habit template with description, science reference, and import button
 * Includes: Template name, description, icon, color preview, scientific citation, import CTA
 * Usage: Templates screen list
 */

import React from 'react';
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
} from 'react-native-reanimated';
import { useAppTheme } from '../theme';
import Button from './Button';
import * as Haptics from 'expo-haptics';
import { Eye } from 'lucide-react-native';

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
  style,
}: TemplateCardProps) {
  const theme = useAppTheme();
  const cardScale = useSharedValue(1);
  const isLocked = isPremium && !hasAccess;

  const frequencyLabels: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    custom: 'Custom',
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
    health_fitness: 'Health & Fitness',
    mindfulness: 'Mindfulness',
    morning_routine: 'Morning Routine',
    productivity: 'Productivity',
  };

  // Animation: Scale on press
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handlePressIn = () => {
    cardScale.value = withSpring(0.98, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handlePressOut = () => {
    cardScale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handleCardPress = () => {
    if (onPreview) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPreview();
    }
  };

  const handleImportPress = (e: any) => {
    // Prevent card press when import button is tapped
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

  return (
    <AnimatedPressable
      accessible
      accessibilityHint='Tap to preview, or tap import to add to your habits'
      accessibilityLabel={`${name} template. ${description}`}
      accessibilityRole='button'
      style={[
        styles.card,
        {
          backgroundColor: '#ffffff',
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
          opacity: isLocked ? 0.75 : 1,
        },
        animatedStyle,
        style,
      ]}
      onPress={handleCardPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Card Content */}
      <View style={styles.content}>
        {/* Header: Icon + Category Badge */}
        <View style={styles.header}>
          {/* Icon with color background */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: iconColor + '20', // 20% opacity
                borderRadius: 12,
              },
            ]}
          >
            <Text style={styles.icon}>{icon}</Text>
          </View>

          <View style={styles.badgeRow}>
            {category && (
              <View
                style={[
                  styles.categoryBadge,
                  {
                    backgroundColor: '#f3f4f6',
                    borderRadius: 8,
                  },
                ]}
              >
                <Text
                  style={[
                    theme.custom.typography.caption,
                    { color: '#6b7280', fontWeight: '500' },
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
            { color: '#101727', marginTop: 12, fontWeight: '600' },
          ]}
        >
          {name}
        </Text>

        {(formattedFrequency || scientificLink || popularityScore) && (
          <View style={styles.metadataRow}>
            {formattedFrequency && (
              <View style={styles.metadataPill}>
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
              <View style={styles.metadataPill}>
                <Text
                  style={[
                    theme.custom.typography.caption,
                    styles.metadataText,
                  ]}
                >
                  🔗 Research link
                </Text>
              </View>
            )}

            {typeof popularityScore === 'number' && (
              <View style={styles.metadataPill}>
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
            { color: '#6b7280', marginTop: 8, lineHeight: 20 },
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
              borderRadius: 8,
              marginTop: 12,
              borderWidth: 1,
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
            Research: {scientificReference}
          </Text>
        </View>

        {/* Import Button */}
        <View style={styles.footer}>
          <Button
            accessibilityLabel={`Import ${name} template`}
            size='medium'
            style={styles.importButton}
            variant='primary'
            loading={isImporting}
            disabled={isLocked}
            onPress={handleImportPress}
          >
            {isLocked ? 'Unlock with Pro' : 'Import Template'}
          </Button>

          {onPreview && showPreviewCTA && (
            <Button
              accessibilityLabel={`Preview ${name} template`}
              icon={<Eye color={theme.custom.colors.primary[500]} size={16} />}
              iconPosition='left'
              size='medium'
              style={styles.previewButton}
              textStyle={{ fontSize: 15 }}
              variant='ghost'
              onPress={handleCardPress}
            >
              Preview
            </Button>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 8,
    overflow: 'hidden',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 6,
  },
  categoryBadge: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  content: {
    padding: 20,
  },
  footer: {
    marginTop: 16,
    gap: 8,
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
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  importButton: {
    width: '100%',
  },
  metadataPill: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
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
    fontSize: 20,
  },
  previewButton: {
    alignSelf: 'flex-start',
  },
  scienceBox: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  scienceIcon: {
    fontSize: 16,
  },
});

export default TemplateCard;
