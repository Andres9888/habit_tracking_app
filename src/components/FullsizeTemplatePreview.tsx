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
 * - Smooth entrance/exit animations with choreographed reveal
 * - Success state with confetti and animated checkmark
 * - Full reduced motion accessibility support:
 *   - Instant transitions for all entrance animations
 *   - Instant success state appearance (no glow/bounce/confetti)
 *   - Disabled haptic feedback
 *   - Instant button press feedback (no spring animations)
 *
 * Based on: template-fullsize-preview-spec.md
 */

import React, { useEffect, useCallback, useRef } from 'react';
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
  withRepeat,
  Easing,
  interpolate,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ExternalLink, Clock, Sparkles, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ConfettiCannon from 'react-native-confetti-cannon';

import Modal from './Modal';
import Button from './Button/Button';
import { useAppTheme } from '../theme';
import { useReduceMotion } from '../hooks/useReduceMotion';
import type { Doc, Id } from '../../convex/_generated/dataModel';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/** Confetti colors - celebratory green variants matching success theme */
const CONFETTI_COLORS = [
  '#86EFAC', // Light green
  '#34D399', // Primary 400
  '#22c55e', // Success green (matching button)
  '#10B981', // Primary 500
  '#059669', // Primary 600
  '#F59E0B', // Gold accent
];

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
  const confettiRef = useRef<ConfettiCannon>(null);

  // Animation values - Base entrance
  const backdropOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(100);
  const contentOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.8);
  const iconGlowScale = useSharedValue(1);
  const iconGlowOpacity = useSharedValue(0.25);
  const closeButtonScale = useSharedValue(1);
  const importButtonScale = useSharedValue(1);
  const customizeButtonScale = useSharedValue(1);

  // Choreographed reveal animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const pillsOpacity = useSharedValue(0);
  const pillsTranslateY = useSharedValue(15);
  const descriptionOpacity = useSharedValue(0);
  const descriptionTranslateY = useSharedValue(15);
  const scienceBoxOpacity = useSharedValue(0);
  const scienceBoxTranslateY = useSharedValue(20);
  const scienceBoxScale = useSharedValue(0.95);
  const footerOpacity = useSharedValue(0);
  const footerTranslateY = useSharedValue(30);
  const closeButtonOpacity = useSharedValue(0);

  // Success animation values
  const successGlow = useSharedValue(0);
  const successGlowScale = useSharedValue(1);
  const checkmarkScale = useSharedValue(0);
  const checkmarkRotation = useSharedValue(-30);
  const successButtonGlow = useSharedValue(0);
  const successIconBounce = useSharedValue(0);

  // Ensure iconColor is valid
  const iconColor = template?.iconColor && template.iconColor.trim() !== ''
    ? template.iconColor
    : DEFAULT_ICON_COLOR;

  // Animation entrance with choreographed reveal
  useEffect(() => {
    if (visible && template) {
      // Reset all values
      backdropOpacity.value = 0;
      contentTranslateY.value = 100;
      contentOpacity.value = 0;
      iconScale.value = 0.8;
      successGlow.value = 0;
      checkmarkScale.value = 0;
      titleOpacity.value = 0;
      titleTranslateY.value = 20;
      pillsOpacity.value = 0;
      pillsTranslateY.value = 15;
      descriptionOpacity.value = 0;
      descriptionTranslateY.value = 15;
      scienceBoxOpacity.value = 0;
      scienceBoxTranslateY.value = 20;
      scienceBoxScale.value = 0.95;
      footerOpacity.value = 0;
      footerTranslateY.value = 30;
      closeButtonOpacity.value = 0;

      if (reducedMotion) {
        // Instant transitions for reduced motion users
        backdropOpacity.value = 0.5;
        contentTranslateY.value = 0;
        contentOpacity.value = 1;
        iconScale.value = 1;
        titleOpacity.value = 1;
        titleTranslateY.value = 0;
        pillsOpacity.value = 1;
        pillsTranslateY.value = 0;
        descriptionOpacity.value = 1;
        descriptionTranslateY.value = 0;
        scienceBoxOpacity.value = 1;
        scienceBoxTranslateY.value = 0;
        scienceBoxScale.value = 1;
        footerOpacity.value = 1;
        footerTranslateY.value = 0;
        closeButtonOpacity.value = 1;
      } else {
        // Phase 1: Backdrop fade in (0-200ms)
        backdropOpacity.value = withTiming(0.5, { duration: 200 });

        // Phase 2: Content container slide up + fade (starts at 0ms, 300ms duration)
        contentTranslateY.value = withSpring(0, { damping: 22, stiffness: 300 });
        contentOpacity.value = withTiming(1, { duration: 300 });

        // Phase 3: Close button fade in (delay 100ms)
        closeButtonOpacity.value = withDelay(
          100,
          withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) })
        );

        // Phase 4: Icon scale bounce (delay 150ms)
        iconScale.value = withDelay(
          150,
          withSpring(1, { damping: 12, stiffness: 150 })
        );

        // Icon glow pulse animation (delay 250ms)
        iconGlowScale.value = withDelay(
          250,
          withSpring(1.15, { damping: 10, stiffness: 80 })
        );

        // Phase 5: Title reveal (delay 220ms)
        titleOpacity.value = withDelay(
          220,
          withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) })
        );
        titleTranslateY.value = withDelay(
          220,
          withSpring(0, { damping: 18, stiffness: 200 })
        );

        // Phase 6: Metadata pills reveal (delay 300ms)
        pillsOpacity.value = withDelay(
          300,
          withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) })
        );
        pillsTranslateY.value = withDelay(
          300,
          withSpring(0, { damping: 18, stiffness: 200 })
        );

        // Phase 7: Description reveal (delay 380ms)
        descriptionOpacity.value = withDelay(
          380,
          withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) })
        );
        descriptionTranslateY.value = withDelay(
          380,
          withSpring(0, { damping: 18, stiffness: 200 })
        );

        // Phase 8: Science box reveal (delay 460ms)
        scienceBoxOpacity.value = withDelay(
          460,
          withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
        );
        scienceBoxTranslateY.value = withDelay(
          460,
          withSpring(0, { damping: 16, stiffness: 180 })
        );
        scienceBoxScale.value = withDelay(
          460,
          withSpring(1, { damping: 14, stiffness: 150 })
        );

        // Phase 9: Footer reveal (delay 540ms)
        footerOpacity.value = withDelay(
          540,
          withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
        );
        footerTranslateY.value = withDelay(
          540,
          withSpring(0, { damping: 16, stiffness: 180 })
        );
      }
    }
  }, [visible, template, reducedMotion]);

  // Trigger haptic feedback on success (called from animation callback)
  const triggerSuccessHaptic = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  // Trigger confetti on success
  const triggerConfetti = useCallback(() => {
    if (confettiRef.current && !reducedMotion) {
      confettiRef.current.start();
    }
  }, [reducedMotion]);

  // Success animation when imported
  useEffect(() => {
    if (isImported) {
      if (reducedMotion) {
        // Instant appearance for reduced motion users
        checkmarkScale.value = 1;
        checkmarkRotation.value = 0;
        successGlow.value = 0.4;
        successGlowScale.value = 1;
        successButtonGlow.value = 0;
        successIconBounce.value = 0;
      } else {
        // Phase 1: Initial haptic and confetti (0ms)
        triggerSuccessHaptic();
        triggerConfetti();

        // Phase 2: Full-screen green pulse effect (0-200ms)
        successGlow.value = withSequence(
          withTiming(0.5, { duration: 150, easing: Easing.out(Easing.ease) }),
          withTiming(0.2, { duration: 300, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) })
        );

        // Phase 3: Glow scale pulse outward (0-400ms)
        successGlowScale.value = withSequence(
          withTiming(1.3, { duration: 200, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
        );

        // Phase 4: Checkmark bounce in with rotation (100ms delay)
        checkmarkScale.value = withDelay(
          100,
          withSpring(1, { damping: 6, stiffness: 180, mass: 0.8 })
        );
        checkmarkRotation.value = withDelay(
          100,
          withSpring(0, { damping: 10, stiffness: 150 })
        );

        // Phase 5: Success button pulsing glow (200ms delay, repeats 2x)
        successButtonGlow.value = withDelay(
          200,
          withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0.3, { duration: 300 }),
            withTiming(0.8, { duration: 200 }),
            withTiming(0.4, { duration: 400 })
          )
        );

        // Phase 6: Icon subtle bounce (300ms delay)
        successIconBounce.value = withDelay(
          300,
          withSequence(
            withSpring(-3, { damping: 8, stiffness: 300 }),
            withSpring(0, { damping: 12, stiffness: 200 })
          )
        );
      }
    } else {
      // Reset all success animations
      checkmarkScale.value = 0;
      checkmarkRotation.value = -30;
      successGlow.value = 0;
      successGlowScale.value = 1;
      successButtonGlow.value = 0;
      successIconBounce.value = 0;
    }
  }, [isImported, reducedMotion, triggerSuccessHaptic, triggerConfetti]);

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

  // Choreographed reveal animated styles
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const pillsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pillsOpacity.value,
    transform: [{ translateY: pillsTranslateY.value }],
  }));

  const descriptionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: descriptionOpacity.value,
    transform: [{ translateY: descriptionTranslateY.value }],
  }));

  const scienceBoxAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scienceBoxOpacity.value,
    transform: [
      { translateY: scienceBoxTranslateY.value },
      { scale: scienceBoxScale.value },
    ],
  }));

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
    transform: [{ translateY: footerTranslateY.value }],
  }));

  const closeButtonAnimatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: closeButtonOpacity.value,
  }));

  const successGlowStyle = useAnimatedStyle(() => ({
    opacity: successGlow.value,
    transform: [{ scale: successGlowScale.value }],
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkmarkScale.value,
    transform: [
      { scale: checkmarkScale.value },
      { rotate: `${checkmarkRotation.value}deg` },
    ],
  }));

  const successButtonGlowStyle = useAnimatedStyle(() => ({
    opacity: successButtonGlow.value,
  }));

  const successIconBounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: successIconBounce.value }],
  }));

  // Press handlers for button feedback
  // Skips animation for users with reduced motion enabled
  const createPressHandlers = (scaleValue: SharedValue<number>, scale = 0.96) => ({
    onPressIn: () => {
      if (reducedMotion) {
        scaleValue.value = scale;
      } else {
        scaleValue.value = withSpring(scale, { damping: 15, stiffness: 200 });
      }
    },
    onPressOut: () => {
      if (reducedMotion) {
        scaleValue.value = 1;
      } else {
        scaleValue.value = withSpring(1, { damping: 15, stiffness: 200 });
      }
    },
  });

  const handleClose = useCallback(() => {
    if (!reducedMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  }, [onClose, reducedMotion]);

  const handleImport = useCallback(() => {
    if (!template || isImporting || isImported) return;
    if (!reducedMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onImport(template._id);
  }, [template, isImporting, isImported, onImport, reducedMotion]);

  const handleCustomize = useCallback(() => {
    if (!template) return;
    if (!reducedMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onCustomize(template);
  }, [template, onCustomize, reducedMotion]);

  const handleResearchPress = useCallback(async () => {
    if (!template?.scientificLink) return;
    if (!reducedMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const canOpen = await Linking.canOpenURL(template.scientificLink);
    if (canOpen) {
      await Linking.openURL(template.scientificLink);
    }
  }, [template?.scientificLink, reducedMotion]);

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
        <Animated.View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : 12 }, closeButtonAnimatedOpacityStyle]}>
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
        </Animated.View>

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

              {/* Title with choreographed animation */}
              <Animated.Text
                style={[
                  styles.templateName,
                  { fontFamily: theme.custom.fontFamilies.primary.text },
                  titleAnimatedStyle,
                ]}
              >
                {template.name}
              </Animated.Text>

              {/* Metadata Pills Row with choreographed animation */}
              <Animated.View style={pillsAnimatedStyle}>
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
              </Animated.View>
            </View>
          </LinearGradient>

          {/* Description with choreographed animation */}
          <Animated.View style={[styles.descriptionSection, descriptionAnimatedStyle]}>
            <Text
              style={[
                styles.descriptionText,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              {template.description}
            </Text>
          </Animated.View>

          {/* Science Box with choreographed animation */}
          <Animated.View style={[styles.scienceBox, scienceBoxAnimatedStyle]}>
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
          </Animated.View>

          {/* Bottom spacer for footer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Footer with dual CTA and choreographed animation */}
        <Animated.View style={[styles.footerGradientWrapper, footerAnimatedStyle]}>
          <LinearGradient
            colors={['rgba(250, 250, 249, 0)', 'rgba(250, 250, 249, 1)', 'rgba(250, 250, 249, 1)']}
            style={styles.footerGradient}
          >
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            {/* Primary CTA: Import This Habit */}
            {isImported ? (
              <View style={styles.successButtonWrapper}>
                {/* Pulsing glow behind success button */}
                <Animated.View
                  style={[
                    styles.successButtonGlow,
                    successButtonGlowStyle,
                  ]}
                  pointerEvents="none"
                />
                <Animated.View style={[styles.successButton, checkmarkAnimatedStyle]}>
                  <Animated.View style={successIconBounceStyle}>
                    <Check color="#fff" size={22} strokeWidth={3} />
                  </Animated.View>
                  <Text style={styles.successButtonText}>Added!</Text>
                </Animated.View>
              </View>
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

        {/* Confetti Animation - Only when imported and reduce motion is disabled */}
        {isImported && !reducedMotion && (
          <View style={styles.confettiContainer} pointerEvents="none">
            <ConfettiCannon
              ref={confettiRef}
              fadeOut
              autoStart={false}
              colors={CONFETTI_COLORS}
              count={60}
              explosionSpeed={250}
              fallSpeed={2500}
              origin={{ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.4 }}
            />
          </View>
        )}
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
  footerGradientWrapper: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  footerGradient: {
    paddingTop: 24,
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
  successButtonWrapper: {
    position: 'relative',
  },
  successButtonGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 24,
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  successButton: {
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 10,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#15803d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});
