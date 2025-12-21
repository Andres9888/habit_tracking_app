/**
 * FullsizeTemplatePreview Component
 * A fullsize preview modal for template cards that showcases templates at their most visually impactful
 *
 * Features:
 * - Large 96x96 hero icon with glow effect
 * - Rich context display (science, description, frequency)
 * - Metadata pills row (frequency, category, duration)
 * - Science box with expandable research link
 * - Dual CTA footer (Import + Customize)
 * - Smooth entrance/exit animations
 * - Reduced motion support
 *
 * Based on: template-fullsize-preview-spec.md
 */

import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
  ScrollView,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  Easing,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ExternalLink, Clock, Sparkles, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Modal from './Modal';
import Button from './Button/Button';
import { useAppTheme } from '../theme';
import { useReduceMotion } from '../hooks/useReduceMotion';
import type { Doc, Id } from '../../convex/_generated/dataModel';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Default fallback color when iconColor is missing or invalid */
const DEFAULT_ICON_COLOR = '#6b7280';

export interface FullsizeTemplatePreviewProps {
  /** Template to preview */
  template: Doc<'templates'> | null;
  /** Modal visibility */
  visible: boolean;
  /** Close handler */
  onClose: () => void;
  /** Direct import handler (skips customization) */
  onImport: (templateId: Id<'templates'>) => void;
  /** Customize handler (opens existing TemplatePreviewModal) */
  onCustomize: (template: Doc<'templates'>) => void;
  /** Loading state for import */
  isImporting?: boolean;
  /** Has been successfully imported */
  isImported?: boolean;
}

export default function FullsizeTemplatePreview({
  template,
  visible,
  onClose,
  onImport,
  onCustomize,
  isImporting = false,
  isImported = false,
}: FullsizeTemplatePreviewProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReduceMotion();

  // Animation values
  const backdropOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(100);
  const contentOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.8);
  const iconGlowScale = useSharedValue(1);
  const iconGlowOpacity = useSharedValue(0.25);
  const closeButtonScale = useSharedValue(1);
  const importButtonScale = useSharedValue(1);
  const customizeButtonScale = useSharedValue(1);

  // Success animation values
  const successGlow = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);

  // Ensure iconColor is valid
  const iconColor = template?.iconColor && template.iconColor.trim() !== ''
    ? template.iconColor
    : DEFAULT_ICON_COLOR;

  // Animation entrance
  useEffect(() => {
    if (visible && template) {
      // Reset values
      backdropOpacity.value = 0;
      contentTranslateY.value = 100;
      contentOpacity.value = 0;
      iconScale.value = 0.8;
      successGlow.value = 0;
      checkmarkScale.value = 0;

      if (reducedMotion) {
        backdropOpacity.value = 0.5;
        contentTranslateY.value = 0;
        contentOpacity.value = 1;
        iconScale.value = 1;
      } else {
        // Backdrop fade in (200ms)
        backdropOpacity.value = withTiming(0.5, { duration: 200 });

        // Content slide up + fade (300ms, spring damping 22)
        contentTranslateY.value = withSpring(0, { damping: 22, stiffness: 300 });
        contentOpacity.value = withTiming(1, { duration: 300 });

        // Icon scale bounce (delay 100ms)
        iconScale.value = withDelay(
          100,
          withSpring(1, { damping: 12, stiffness: 150 })
        );

        // Icon glow pulse animation (continuous)
        iconGlowScale.value = withDelay(
          200,
          withSpring(1.15, { damping: 10, stiffness: 80 })
        );
      }
    }
  }, [visible, template, reducedMotion]);

  // Success animation when imported
  useEffect(() => {
    if (isImported) {
      // Animate checkmark appearing
      checkmarkScale.value = withSpring(1, { damping: 8, stiffness: 150 });
      // Animate glow effect - pulse green
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
  }, [isImported, reducedMotion]);

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const iconGlowStyle = useAnimatedStyle(() => ({
    opacity: iconGlowOpacity.value,
    transform: [{ scale: iconGlowScale.value }],
  }));

  const closeButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeButtonScale.value }],
  }));

  const importButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: importButtonScale.value }],
  }));

  const customizeButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: customizeButtonScale.value }],
  }));

  const successGlowStyle = useAnimatedStyle(() => ({
    opacity: successGlow.value,
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkmarkScale.value,
    transform: [{ scale: checkmarkScale.value }],
  }));

  // Press handlers for button feedback
  const createPressHandlers = (scaleValue: SharedValue<number>, scale = 0.96) => ({
    onPressIn: () => {
      scaleValue.value = withSpring(scale, { damping: 15, stiffness: 200 });
    },
    onPressOut: () => {
      scaleValue.value = withSpring(1, { damping: 15, stiffness: 200 });
    },
  });

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  const handleImport = useCallback(() => {
    if (!template || isImporting || isImported) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onImport(template._id);
  }, [template, isImporting, isImported, onImport]);

  const handleCustomize = useCallback(() => {
    if (!template) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCustomize(template);
  }, [template, onCustomize]);

  const handleResearchPress = useCallback(async () => {
    if (!template?.scientificLink) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const canOpen = await Linking.canOpenURL(template.scientificLink);
    if (canOpen) {
      await Linking.openURL(template.scientificLink);
    }
  }, [template?.scientificLink]);

  if (!template) return null;

  // Generate gradient colors based on template's icon color
  const gradientColors = [
    `${iconColor}15`,
    `${iconColor}08`,
    '#FAFAF9',
  ] as const;

  // Format frequency display
  const frequencyLabels: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    custom: 'Custom',
  };
  const formattedFrequency = frequencyLabels[template.frequency] || template.frequency;

  // Format category display
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
  const formattedCategory = categoryLabels[template.category] || template.category;

  return (
    <Modal
      disableBackdropClose={isImporting}
      variant="fullScreen"
      visible={visible}
      onClose={handleClose}
    >
      <Animated.View style={[styles.container, contentStyle]}>
        {/* Success glow overlay */}
        <Animated.View
          style={[styles.successGlowOverlay, { backgroundColor: '#22c55e' }, successGlowStyle]}
          pointerEvents="none"
        />

        {/* Header with close button */}
        <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : 12 }]}>
          <AnimatedPressable
            accessible
            accessibilityLabel="Close preview"
            accessibilityRole="button"
            accessibilityHint="Double tap to close this preview"
            style={[styles.closeButton, closeButtonStyle]}
            onPress={handleClose}
            {...createPressHandlers(closeButtonScale, 0.9)}
          >
            <X color="#374151" size={22} strokeWidth={2.5} />
          </AnimatedPressable>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Hero Section with Gradient */}
          <LinearGradient colors={gradientColors} style={styles.heroGradient}>
            <View style={styles.heroContent}>
              {/* Large Icon with Glow (96x96) */}
              <Animated.View style={[styles.iconWrapper, iconAnimatedStyle]}>
                <Animated.View
                  style={[
                    styles.iconGlow,
                    {
                      backgroundColor: iconColor,
                      shadowColor: iconColor,
                    },
                    iconGlowStyle,
                  ]}
                />
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${iconColor}20` },
                  ]}
                >
                  <Text style={styles.iconText}>{template.icon}</Text>
                </View>
              </Animated.View>

              {/* Title */}
              <Text
                style={[
                  styles.templateName,
                  { fontFamily: theme.custom.fontFamilies.primary.text },
                ]}
              >
                {template.name}
              </Text>

              {/* Metadata Pills Row */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pillsContainer}
              >
                {/* Frequency Pill */}
                <View style={[styles.metadataPill, { backgroundColor: `${iconColor}10`, borderColor: `${iconColor}20` }]}>
                  <Clock color={iconColor} size={14} strokeWidth={2} />
                  <Text style={[styles.metadataPillText, { color: iconColor }]}>
                    {formattedFrequency}
                  </Text>
                </View>

                {/* Category Pill */}
                <View style={[styles.metadataPill, { backgroundColor: `${iconColor}10`, borderColor: `${iconColor}20` }]}>
                  <Sparkles color={iconColor} size={14} strokeWidth={2} />
                  <Text style={[styles.metadataPillText, { color: iconColor }]}>
                    {formattedCategory}
                  </Text>
                </View>

                {/* Duration Pill (estimated) */}
                <View style={[styles.metadataPill, { backgroundColor: `${iconColor}10`, borderColor: `${iconColor}20` }]}>
                  <Text style={[styles.metadataPillText, { color: iconColor }]}>
                    ⏱️ 5-10 min
                  </Text>
                </View>
              </ScrollView>
            </View>
          </LinearGradient>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text
              style={[
                styles.descriptionText,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              {template.description}
            </Text>
          </View>

          {/* Science Box */}
          <View style={styles.scienceBox}>
            <View style={styles.scienceHeader}>
              <Text style={styles.scienceIcon}>🔬</Text>
              <Text
                style={[
                  styles.scienceLabel,
                  { fontFamily: theme.custom.fontFamilies.primary.text },
                ]}
              >
                SCIENCE BEHIND THIS HABIT
              </Text>
            </View>
            <View style={styles.scienceDivider} />
            <Text
              style={[
                styles.scienceQuote,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              "{template.scientificReference}"
            </Text>

            {/* Research Link Button */}
            {template.scientificLink && (
              <AnimatedPressable
                accessible
                accessibilityLabel="Read research paper"
                accessibilityRole="link"
                accessibilityHint="Opens the research paper in your browser"
                style={styles.researchLinkButton}
                onPress={handleResearchPress}
              >
                <ExternalLink color="#3B82F6" size={16} strokeWidth={2} />
                <Text style={styles.researchLinkText}>Read Research</Text>
              </AnimatedPressable>
            )}
          </View>

          {/* Bottom spacer for footer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Footer with dual CTA */}
        <LinearGradient
          colors={['rgba(250, 250, 249, 0)', 'rgba(250, 250, 249, 1)', 'rgba(250, 250, 249, 1)']}
          style={styles.footerGradient}
        >
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            {/* Primary CTA: Import This Habit */}
            {isImported ? (
              <Animated.View style={[styles.successButton, checkmarkAnimatedStyle]}>
                <Check color="#fff" size={20} strokeWidth={3} />
                <Text style={styles.successButtonText}>Added!</Text>
              </Animated.View>
            ) : (
              <AnimatedPressable
                accessible
                accessibilityLabel={`Import ${template.name} habit`}
                accessibilityRole="button"
                disabled={isImporting}
                style={[
                  styles.importButton,
                  { backgroundColor: iconColor },
                  isImporting && { opacity: 0.6 },
                  importButtonStyle,
                ]}
                onPress={handleImport}
                {...createPressHandlers(importButtonScale)}
              >
                <Text style={styles.importButtonText}>
                  {isImporting ? 'Importing...' : 'Import This Habit'}
                </Text>
              </AnimatedPressable>
            )}

            {/* Secondary CTA: Customize First */}
            {!isImported && (
              <AnimatedPressable
                accessible
                accessibilityLabel="Customize habit before importing"
                accessibilityRole="button"
                disabled={isImporting}
                style={[styles.customizeLink, customizeButtonStyle]}
                onPress={handleCustomize}
                {...createPressHandlers(customizeButtonScale, 0.98)}
              >
                <Text style={styles.customizeLinkText}>Customize First →</Text>
              </AnimatedPressable>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAF9',
    flex: 1,
  },
  successGlowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  heroGradient: {
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  heroContent: {
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 20,
    position: 'relative',
  },
  iconGlow: {
    borderRadius: 48,
    height: 96,
    opacity: 0.3,
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    width: 96,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 24,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  iconText: {
    fontSize: 48,
  },
  templateName: {
    color: '#101727',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 16,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 4,
  },
  metadataPill: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  metadataPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  descriptionText: {
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  scienceBox: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderRadius: 16,
    borderWidth: 2,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
  },
  scienceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  scienceIcon: {
    fontSize: 20,
  },
  scienceLabel: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scienceDivider: {
    backgroundColor: '#bbf7d0',
    height: 1,
    marginBottom: 12,
  },
  scienceQuote: {
    color: '#166534',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  researchLinkButton: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  researchLinkText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 140,
  },
  footerGradient: {
    bottom: 0,
    left: 0,
    paddingTop: 24,
    position: 'absolute',
    right: 0,
  },
  footer: {
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  importButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  importButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  successButton: {
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 8,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  successButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  customizeLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  customizeLinkText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
});
