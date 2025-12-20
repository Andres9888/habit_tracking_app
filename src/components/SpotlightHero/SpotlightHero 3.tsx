/**
 * SpotlightHero Component
 * Featured template showcase with gradient background and premium visual treatment
 *
 * Purpose: Highlight a curated template at the top of the Templates screen
 * Features: Gradient background using template accent color, shimmer effect, dual CTAs
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Sparkles, ArrowRight, FlaskConical } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../theme';
import type { Doc } from '../../../convex/_generated/dataModel';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SpotlightHeroProps {
  /** Featured template to display */
  template: Doc<'templates'>;
  /** Handler for preview action */
  onPreview: () => void;
  /** Handler for import action */
  onImport: () => void;
  /** Loading state for import */
  isImporting?: boolean;
  /** Animation delay for staggered entrance */
  animationDelay?: number;
}

export const SpotlightHero: React.FC<SpotlightHeroProps> = ({
  template,
  onPreview,
  onImport,
  isImporting = false,
  animationDelay = 0,
}) => {
  const theme = useAppTheme();

  // Animation values
  const cardScale = useSharedValue(0.95);
  const cardOpacity = useSharedValue(0);
  const shimmerPosition = useSharedValue(-1);
  const pressScale = useSharedValue(1);

  // Entrance animation
  useEffect(() => {
    cardOpacity.value = withDelay(
      animationDelay,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
    );
    cardScale.value = withDelay(
      animationDelay,
      withSpring(1, { damping: 15, stiffness: 100 })
    );

    // Shimmer animation - subtle and periodic
    shimmerPosition.value = withDelay(
      animationDelay + 600,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withDelay(4000, withTiming(-1, { duration: 0 }))
        ),
        -1,
        false
      )
    );
  }, [animationDelay]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { scale: cardScale.value * pressScale.value },
    ],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shimmerPosition.value,
          [-1, 1],
          [-300, 300]
        ),
      },
    ],
    opacity: interpolate(
      shimmerPosition.value,
      [-1, -0.5, 0, 0.5, 1],
      [0, 0.3, 0.5, 0.3, 0]
    ),
  }));

  // Generate gradient colors from template's iconColor
  const baseColor = template.iconColor;
  const gradientColors = [
    `${baseColor}35`, // 20% opacity
    `${baseColor}18`, // 10% opacity
    `${baseColor}08`, // 5% opacity
  ] as const;

  // Handlers
  const handlePressIn = () => {
    pressScale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePreview = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPreview();
  };

  const handleImport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onImport();
  };

  return (
    <AnimatedPressable
      accessible
      accessibilityHint="Tap to preview this featured template"
      accessibilityLabel={`Spotlight: ${template.name}`}
      accessibilityRole="button"
      style={[styles.container, containerStyle]}
      onPress={handlePreview}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <LinearGradient
        colors={gradientColors}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.gradient}
      >
        {/* Shimmer overlay */}
        <Animated.View style={[styles.shimmer, shimmerStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
            end={{ x: 1, y: 0.5 }}
            start={{ x: 0, y: 0.5 }}
            style={styles.shimmerGradient}
          />
        </Animated.View>

        {/* Spotlight badge */}
        <View style={styles.badge}>
          <Sparkles color="#ffffff" size={14} strokeWidth={2.5} />
          <Text style={styles.badgeText}>SPOTLIGHT</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Icon with glow */}
          <View style={styles.iconWrapper}>
            <View
              style={[
                styles.iconGlow,
                { backgroundColor: template.iconColor, shadowColor: template.iconColor },
              ]}
            />
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${template.iconColor}30` },
              ]}
            >
              <Text style={styles.icon}>{template.icon}</Text>
            </View>
          </View>

          {/* Text content */}
          <View style={styles.textContent}>
            <Text
              numberOfLines={1}
              style={[
                styles.title,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              {template.name}
            </Text>

            <Text
              numberOfLines={2}
              style={[
                styles.description,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              {template.description}
            </Text>

            {/* Research indicator */}
            {template.scientificLink && (
              <View style={styles.researchRow}>
                <FlaskConical color="#166534" size={14} strokeWidth={2} />
                <Text style={styles.researchText}>
                  Backed by peer-reviewed research
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <Pressable
            accessibilityLabel="Preview template"
            style={styles.previewButton}
            onPress={handlePreview}
          >
            <Text style={styles.previewButtonText}>Preview</Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Import template"
            disabled={isImporting}
            style={[
              styles.importButton,
              { backgroundColor: template.iconColor },
              isImporting && styles.importButtonDisabled,
            ]}
            onPress={handleImport}
          >
            <Text style={styles.importButtonText}>
              {isImporting ? 'Importing...' : 'Import Habit'}
            </Text>
            {!isImporting && (
              <ArrowRight color="#ffffff" size={16} strokeWidth={2.5} />
            )}
          </Pressable>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  container: {
    borderRadius: 20,
    marginBottom: 16,
    marginHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  description: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  gradient: {
    overflow: 'hidden',
    padding: 20,
  },
  icon: {
    fontSize: 32,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 16,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  iconGlow: {
    borderRadius: 32,
    height: 64,
    opacity: 0.3,
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    width: 64,
  },
  iconWrapper: {
    position: 'relative',
  },
  importButton: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  importButtonDisabled: {
    opacity: 0.6,
  },
  importButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  previewButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  previewButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
  researchRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  researchText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
  },
  shimmer: {
    height: '200%',
    left: 0,
    position: 'absolute',
    top: '-50%',
    width: 100,
  },
  shimmerGradient: {
    flex: 1,
    width: 100,
  },
  textContent: {
    flex: 1,
  },
  title: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default SpotlightHero;
