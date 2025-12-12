/**
 * Template Science Modal Component
 * Displays detailed scientific research and backing for habit templates
 *
 * Features:
 * - Full-screen modal with template details
 * - Beautiful hero section with gradient backdrop
 * - Scientific research section with citations
 * - YouTube video link section
 * - Tappable research links
 * - Polished visual design with depth and hierarchy
 * - Delightful micro-animations
 * - Parallax scrolling effects
 * - Scroll-based header animation
 * - Pull-to-dismiss gesture
 * - Confetti celebration
 * - Skeleton loading state
 * - Reading time estimate
 * - Share functionality
 * - Enhanced accessibility
 */

import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Linking,
  StyleSheet,
  Share,
  AccessibilityInfo,
  Dimensions,
  Platform,
} from 'react-native';
import { ScrollView, PanGestureHandler } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedGestureHandler,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  X,
  ExternalLink,
  Clock,
  Sparkles,
  BookOpen,
  Play,
  Share2,
  Flame,
  Timer,
} from 'lucide-react-native';
import Modal from './Modal';
import Button from './Button/Button';
import { useAppTheme } from '../theme';
import type { Doc } from '../../convex/_generated/dataModel';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DISMISS_THRESHOLD = 150;

interface TemplateScienceModalProps {
  isLoading?: boolean;
  onClose: () => void;
  onUseTemplate: () => void;
  template: Doc<'templates'> | null;
  visible: boolean;
}

// Skeleton component for loading state
const SkeletonBox = ({
  height,
  width,
  style,
  borderRadius = 8,
}: {
  borderRadius?: number;
  height: number;
  style?: object;
  width: number | string;
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          backgroundColor: '#E5E7EB',
          borderRadius,
          height,
          width,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

// Confetti particle component
const ConfettiParticle = ({
  color,
  delay,
  startX
}: {
  color: string;
  delay: number;
  startX: number;
}) => {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 8 }));
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT * 0.4, { duration: 2000, easing: Easing.out(Easing.quad) })
    );
    translateX.value = withDelay(
      delay,
      withTiming(startX + (Math.random() - 0.5) * 200, { duration: 2000 })
    );
    rotate.value = withDelay(
      delay,
      withTiming(Math.random() * 720 - 360, { duration: 2000 })
    );
    opacity.value = withDelay(
      delay + 1500,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

// Animated border component for citation box
const AnimatedBorderBox = ({
  children,
  baseColor,
  style,
}: {
  baseColor: string;
  children: React.ReactNode;
  style?: object;
}) => {
  const borderProgress = useSharedValue(0);

  useEffect(() => {
    borderProgress.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolate(
      borderProgress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [0, 1, 0, 1, 0]
    );
    return {
      borderColor: borderColor > 0.5 ? `${baseColor}40` : '#E5E7EB',
    };
  });

  return (
    <Animated.View style={[styles.citationBox, animatedBorderStyle, style]}>
      {children}
    </Animated.View>
  );
};

export default function TemplateScienceModal({
  isLoading = false,
  onClose,
  onUseTemplate,
  template,
  visible,
}: TemplateScienceModalProps) {
  const theme = useAppTheme();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  // Check for screen reader
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );
    return () => subscription.remove();
  }, []);

  // Animation values
  const heroOpacity = useSharedValue(0);
  const heroScale = useSharedValue(0.9);
  const iconGlowScale = useSharedValue(1);
  const iconGlowOpacity = useSharedValue(0.25);
  const card1Progress = useSharedValue(0);
  const card2Progress = useSharedValue(0);
  const card3Progress = useSharedValue(0);
  const footerProgress = useSharedValue(0);
  const closeButtonScale = useSharedValue(1);
  const linkButtonScale = useSharedValue(1);
  const youtubeButtonScale = useSharedValue(1);
  const shareButtonScale = useSharedValue(1);
  const backButtonScale = useSharedValue(1);

  // Scroll-based animations
  const scrollY = useSharedValue(0);
  const headerTitleOpacity = useSharedValue(0);

  // Pull-to-dismiss
  const translateY = useSharedValue(0);
  const dismissProgress = useSharedValue(0);

  // Calculate reading time
  const readingTime = useMemo(() => {
    if (!template) return 0;
    const text = `${template.name} ${template.description} ${template.scientificReference} ${getWhyItWorksText(template)}`;
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200); // Average reading speed
    return Math.max(1, minutes);
  }, [template]);

  // Reset and trigger animations when modal becomes visible
  useEffect(() => {
    if (visible && template) {
      // Reset values
      heroOpacity.value = 0;
      heroScale.value = 0.9;
      card1Progress.value = 0;
      card2Progress.value = 0;
      card3Progress.value = 0;
      footerProgress.value = 0;
      translateY.value = 0;
      dismissProgress.value = 0;
      scrollY.value = 0;
      headerTitleOpacity.value = 0;
      setShowConfetti(false);

      // Hero entrance
      heroOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
      heroScale.value = withSpring(1, { damping: 18, stiffness: 100 });

      // Staggered card entrances
      card1Progress.value = withDelay(150, withSpring(1, { damping: 20, stiffness: 90 }));
      card2Progress.value = withDelay(250, withSpring(1, { damping: 20, stiffness: 90 }));
      card3Progress.value = withDelay(350, withSpring(1, { damping: 20, stiffness: 90 }));

      // Footer entrance
      footerProgress.value = withDelay(450, withSpring(1, { damping: 20, stiffness: 90 }));

      // Icon glow pulse animation (continuous)
      iconGlowScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      iconGlowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.35, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.2, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      // Announce to screen reader
      if (isScreenReaderEnabled && template) {
        AccessibilityInfo.announceForAccessibility(
          `Template details opened for ${template.name}. ${template.description}. Estimated reading time: ${readingTime} minute${readingTime > 1 ? 's' : ''}.`
        );
      }
    }
  }, [visible, template, isScreenReaderEnabled, readingTime]);

  // Scroll handler for parallax and header animation
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      // Show header title after scrolling past hero
      headerTitleOpacity.value = interpolate(
        event.contentOffset.y,
        [80, 150],
        [0, 1],
        Extrapolation.CLAMP
      );
    },
  });

  // Pull-to-dismiss gesture handler
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startY: number }) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      // Only allow downward drag when at top of scroll
      if (scrollY.value <= 0 && event.translationY > 0) {
        translateY.value = ctx.startY + event.translationY * 0.5;
        dismissProgress.value = interpolate(
          translateY.value,
          [0, DISMISS_THRESHOLD],
          [0, 1],
          Extrapolation.CLAMP
        );
      }
    },
    onEnd: () => {
      if (translateY.value > DISMISS_THRESHOLD) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
        runOnJS(handleClose)();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
        dismissProgress.value = withSpring(0);
      }
    },
  });

  // Animated styles
  const heroAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [
      { scale: heroScale.value },
      // Parallax effect - hero moves slower than scroll
      { translateY: interpolate(scrollY.value, [0, 200], [0, 50], Extrapolation.CLAMP) },
    ],
  }));

  const iconGlowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconGlowOpacity.value,
    transform: [{ scale: iconGlowScale.value }],
  }));

  const card1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: card1Progress.value,
    transform: [
      { translateY: interpolate(card1Progress.value, [0, 1], [30, 0]) },
    ],
  }));

  const card2AnimatedStyle = useAnimatedStyle(() => ({
    opacity: card2Progress.value,
    transform: [
      { translateY: interpolate(card2Progress.value, [0, 1], [30, 0]) },
    ],
  }));

  const card3AnimatedStyle = useAnimatedStyle(() => ({
    opacity: card3Progress.value,
    transform: [
      { translateY: interpolate(card3Progress.value, [0, 1], [30, 0]) },
    ],
  }));

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: footerProgress.value,
    transform: [
      { translateY: interpolate(footerProgress.value, [0, 1], [20, 0]) },
    ],
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    borderBottomColor: interpolate(
      scrollY.value,
      [0, 50],
      [0, 1]
    ) > 0.5 ? '#E5E7EB' : 'transparent',
  }));

  const headerTitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerTitleOpacity.value,
    transform: [
      { scale: interpolate(headerTitleOpacity.value, [0, 1], [0.9, 1]) },
    ],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: interpolate(dismissProgress.value, [0, 1], [1, 0.8]),
  }));

  const closeButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeButtonScale.value }],
  }));

  const linkButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: linkButtonScale.value }],
  }));

  const youtubeButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: youtubeButtonScale.value }],
  }));

  const shareButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shareButtonScale.value }],
  }));

  const backButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backButtonScale.value }],
  }));

  // Dismiss indicator style
  const dismissIndicatorStyle = useAnimatedStyle(() => ({
    opacity: dismissProgress.value,
    transform: [
      { scale: interpolate(dismissProgress.value, [0, 1], [0.8, 1]) },
    ],
  }));

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  const handleLinkPress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (template?.scientificLink) {
      const canOpen = await Linking.canOpenURL(template.scientificLink);
      if (canOpen) {
        await Linking.openURL(template.scientificLink);
      }
    }
  }, [template?.scientificLink]);

  const handleYoutubePress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (template?.youtubeLink) {
      const canOpen = await Linking.canOpenURL(template.youtubeLink);
      if (canOpen) {
        await Linking.openURL(template.youtubeLink);
      }
    }
  }, [template?.youtubeLink]);

  const handleShare = useCallback(async () => {
    if (!template) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await Share.share({
        message: `Check out this habit template: "${template.name}"\n\n${template.description}\n\n🔬 Scientific backing: ${template.scientificReference}`,
        title: `${template.name} - Habit Template`,
      });
    } catch (error) {
      console.error('Error sharing template:', error);
    }
  }, [template]);

  const handleUseTemplate = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowConfetti(true);

    // Delay the actual action to show confetti
    setTimeout(() => {
      onUseTemplate();
    }, 800);
  }, [onUseTemplate]);

  // Press handlers for button feedback
  const createPressHandlers = (scaleValue: Animated.SharedValue<number>, scale = 0.95) => ({
    onPressIn: () => {
      scaleValue.value = withSpring(scale, { damping: 15, stiffness: 200 });
    },
    onPressOut: () => {
      scaleValue.value = withSpring(1, { damping: 15, stiffness: 200 });
    },
  });

  // Generate gradient colors based on template's icon color
  const baseColor = template?.iconColor || '#6366F1';
  const gradientColors = [
    `${baseColor}15`,
    `${baseColor}08`,
    '#FAFAF9',
  ] as const;

  // Confetti colors
  const confettiColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];

  // Render skeleton loading state
  if (isLoading || !template) {
    return (
      <Modal
        disableBackdropClose={false}
        variant='fullScreen'
        visible={visible}
        onClose={onClose}
      >
        <View style={styles.container}>
          {/* Skeleton Header */}
          <View style={styles.header}>
            <SkeletonBox borderRadius={20} height={40} width={40} />
            <SkeletonBox borderRadius={8} height={20} width={120} />
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            style={styles.content}
          >
            {/* Skeleton Hero */}
            <View style={styles.skeletonHero}>
              <SkeletonBox borderRadius={28} height={96} width={96} />
              <SkeletonBox borderRadius={8} height={32} style={{ marginTop: 20 }} width={200} />
              <View style={styles.skeletonPillRow}>
                <SkeletonBox borderRadius={20} height={32} width={100} />
                <SkeletonBox borderRadius={20} height={32} width={80} />
              </View>
            </View>

            {/* Skeleton Cards */}
            <View style={styles.skeletonCard}>
              <View style={styles.skeletonCardHeader}>
                <SkeletonBox borderRadius={12} height={36} width={36} />
                <SkeletonBox borderRadius={8} height={20} width={150} />
              </View>
              <SkeletonBox borderRadius={8} height={16} width="100%" />
              <SkeletonBox borderRadius={8} height={16} style={{ marginTop: 8 }} width="90%" />
              <SkeletonBox borderRadius={8} height={16} style={{ marginTop: 8 }} width="70%" />
            </View>

            <View style={styles.skeletonCard}>
              <View style={styles.skeletonCardHeader}>
                <SkeletonBox borderRadius={12} height={36} width={36} />
                <SkeletonBox borderRadius={8} height={20} width={150} />
              </View>
              <SkeletonBox borderRadius={16} height={120} width="100%" />
              <SkeletonBox borderRadius={16} height={100} style={{ marginTop: 16 }} width="100%" />
            </View>
          </ScrollView>

          {/* Skeleton Footer */}
          <View style={styles.skeletonFooter}>
            <SkeletonBox borderRadius={12} height={52} width="100%" />
            <SkeletonBox borderRadius={8} height={40} style={{ marginTop: 8 }} width="100%" />
          </View>
        </View>
      </Modal>
    );
  }

  const isPopular = (template.popularityScore ?? 0) >= 80;

  return (
    <Modal
      disableBackdropClose={false}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
    >
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.container, containerAnimatedStyle]}>
          {/* Pull-to-dismiss indicator */}
          <Animated.View style={[styles.dismissIndicator, dismissIndicatorStyle]}>
            <View style={styles.dismissPill} />
            <Text style={styles.dismissText}>Release to close</Text>
          </Animated.View>

          {/* Header with scroll-based animation */}
          <Animated.View style={[styles.header, headerAnimatedStyle]}>
            <AnimatedPressable
              accessibilityHint="Double tap to close this modal"
              accessibilityLabel='Close template details'
              accessibilityRole='button'
              style={[styles.closeButton, closeButtonAnimatedStyle]}
              onPress={handleClose}
              {...createPressHandlers(closeButtonScale, 0.9)}
            >
              <X color='#374151' size={22} strokeWidth={2.5} />
            </AnimatedPressable>

            {/* Animated header title that appears on scroll */}
            <Animated.View style={headerTitleAnimatedStyle}>
              <Text
                numberOfLines={1}
                style={[
                  styles.headerTitle,
                  { fontFamily: theme.custom.fontFamilies.primary.text },
                ]}
              >
                {template.name}
              </Text>
            </Animated.View>

            {/* Share button */}
            <AnimatedPressable
              accessibilityHint="Share this template with others"
              accessibilityLabel='Share template'
              accessibilityRole='button'
              style={[styles.shareButton, shareButtonAnimatedStyle]}
              onPress={handleShare}
              {...createPressHandlers(shareButtonScale, 0.9)}
            >
              <Share2 color='#374151' size={20} strokeWidth={2.5} />
            </AnimatedPressable>
          </Animated.View>

          {/* Scrollable Content */}
          <AnimatedScrollView
            contentContainerStyle={styles.contentContainer}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            style={styles.content}
          >
            {/* Hero Section with Gradient & Parallax */}
            <LinearGradient
              colors={gradientColors}
              style={styles.heroGradient}
            >
              <Animated.View
                accessible
                accessibilityLabel={`${template.name} template. Category: ${template.category.replace('_', ' ')}. Frequency: ${template.frequency}. ${isPopular ? 'This is a popular template.' : ''}`}
                accessibilityRole="header"
                style={[styles.templateHeader, heroAnimatedStyle]}
              >
                {/* Icon with animated glow effect */}
                <View style={styles.iconWrapper}>
                  <Animated.View
                    style={[
                      styles.iconGlow,
                      {
                        backgroundColor: baseColor,
                        shadowColor: baseColor,
                      },
                      iconGlowAnimatedStyle,
                    ]}
                  />
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${baseColor}20` },
                    ]}
                  >
                    <Text style={styles.iconText}>{template.icon}</Text>
                  </View>

                  {/* Popularity badge */}
                  {isPopular && (
                    <View style={styles.popularBadge}>
                      <Flame color="#FF6B35" fill="#FF6B35" size={14} />
                    </View>
                  )}
                </View>

                <Text
                  style={[
                    styles.templateName,
                    { fontFamily: theme.custom.fontFamilies.primary.text },
                  ]}
                >
                  {template.name}
                </Text>

                {/* Category & Frequency Pills */}
                <View style={styles.pillRow}>
                  <View style={[styles.categoryBadge, { backgroundColor: `${baseColor}18` }]}>
                    <Sparkles color={baseColor} size={12} strokeWidth={2.5} />
                    <Text style={[styles.categoryText, { color: baseColor }]}>
                      {template.category.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </Text>
                  </View>
                  <View style={styles.frequencyPill}>
                    <Clock color='#6B7280' size={12} strokeWidth={2.5} />
                    <Text style={styles.frequencyPillText}>
                      {template.frequency.charAt(0).toUpperCase() + template.frequency.slice(1)}
                    </Text>
                  </View>
                  {/* Reading time pill */}
                  <View style={styles.readingTimePill}>
                    <Timer color='#6B7280' size={12} strokeWidth={2.5} />
                    <Text style={styles.readingTimePillText}>
                      {readingTime} min read
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </LinearGradient>

            {/* About Section Card - Animated */}
            <Animated.View
              accessible
              accessibilityLabel={`About this habit: ${template.description}`}
              style={[styles.sectionCard, card1AnimatedStyle]}
            >
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconBadge, { backgroundColor: '#F0F9FF' }]}>
                  <BookOpen color='#0EA5E9' size={16} strokeWidth={2} />
                </View>
                <Text
                  style={[
                    styles.sectionTitle,
                    { fontFamily: theme.custom.fontFamilies.primary.text },
                  ]}
                >
                  About This Habit
                </Text>
              </View>
              <Text
                style={[
                  styles.descriptionText,
                  { fontFamily: theme.custom.fontFamilies.primary.text },
                ]}
              >
                {template.description}
              </Text>
            </Animated.View>

            {/* YouTube Video Section (if available) */}
            {template.youtubeLink && (
              <Animated.View style={[styles.sectionCard, card2AnimatedStyle]}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIconBadge, { backgroundColor: '#FEE2E2' }]}>
                    <Play color='#DC2626' fill='#DC2626' size={16} />
                  </View>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { fontFamily: theme.custom.fontFamilies.primary.text },
                    ]}
                  >
                    Watch & Learn
                  </Text>
                </View>

                <AnimatedPressable
                  accessibilityHint="Opens YouTube video in your browser"
                  accessibilityLabel={`Watch video about ${template.name} on YouTube`}
                  accessibilityRole='link'
                  style={[styles.youtubeButton, youtubeButtonAnimatedStyle]}
                  onPress={handleYoutubePress}
                  {...createPressHandlers(youtubeButtonScale, 0.97)}
                >
                  <LinearGradient
                    colors={['#FF0000', '#CC0000']}
                    end={{ x: 1, y: 1 }}
                    start={{ x: 0, y: 0 }}
                    style={styles.youtubeGradient}
                  >
                    <Play color='#FFFFFF' fill='#FFFFFF' size={24} />
                  </LinearGradient>
                  <View style={styles.youtubeTextContainer}>
                    <Text style={styles.youtubeTitle}>Video Explanation</Text>
                    <Text style={styles.youtubeSubtitle}>Watch on YouTube</Text>
                  </View>
                  <ExternalLink color='#DC2626' size={18} />
                </AnimatedPressable>
              </Animated.View>
            )}

            {/* Scientific Research Section - Animated */}
            <Animated.View
              accessible
              accessibilityLabel={`Scientific backing: ${template.scientificReference}. Why this habit works: ${getWhyItWorksText(template)}`}
              style={[styles.sectionCard, template.youtubeLink ? card3AnimatedStyle : card2AnimatedStyle]}
            >
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconBadge, { backgroundColor: '#F0FDF4' }]}>
                  <Text style={styles.sectionIconEmoji}>🔬</Text>
                </View>
                <Text
                  style={[
                    styles.sectionTitle,
                    { fontFamily: theme.custom.fontFamilies.primary.text },
                  ]}
                >
                  Scientific Backing
                </Text>
              </View>

              {/* Research Citation Box with animated border */}
              <AnimatedBorderBox baseColor={baseColor}>
                <View style={styles.citationHeader}>
                  <View style={styles.citationDot} />
                  <Text
                    style={[
                      styles.citationLabel,
                      { fontFamily: theme.custom.fontFamilies.primary.text },
                    ]}
                  >
                    Research Citation
                  </Text>
                </View>
                <Text
                  style={[
                    styles.citationText,
                    { fontFamily: theme.custom.fontFamilies.primary.text },
                  ]}
                >
                  "{template.scientificReference}"
                </Text>

                {/* Research Link - Animated */}
                {template.scientificLink && (
                  <AnimatedPressable
                    accessibilityHint="Opens research paper in your browser"
                    accessibilityLabel='Read the full research paper'
                    accessibilityRole='link'
                    style={[styles.linkButton, linkButtonAnimatedStyle]}
                    onPress={handleLinkPress}
                    {...createPressHandlers(linkButtonScale, 0.97)}
                  >
                    <ExternalLink color='#3B82F6' size={16} strokeWidth={2.5} />
                    <Text
                      style={[
                        styles.linkText,
                        { fontFamily: theme.custom.fontFamilies.primary.text },
                      ]}
                    >
                      Read Full Research Paper
                    </Text>
                  </AnimatedPressable>
                )}
              </AnimatedBorderBox>

              {/* Why It Works - Quote Style */}
              <View
                accessible
                accessibilityRole="text"
                style={styles.whyItWorksContainer}
              >
                <View style={styles.whyItWorksHeader}>
                  <Text style={styles.whyItWorksEmoji}>💡</Text>
                  <Text
                    style={[
                      styles.whyItWorksTitle,
                      { fontFamily: theme.custom.fontFamilies.primary.text },
                    ]}
                  >
                    Why This Habit Works
                  </Text>
                </View>
                <Text
                  style={[
                    styles.whyItWorksText,
                    { fontFamily: theme.custom.fontFamilies.primary.text },
                  ]}
                >
                  {getWhyItWorksText(template)}
                </Text>
              </View>
            </Animated.View>

            {/* Bottom spacer for footer */}
            <View style={styles.bottomSpacer} />
          </AnimatedScrollView>

          {/* Frosted Footer - Animated */}
          <LinearGradient
            colors={['rgba(250, 250, 249, 0)', 'rgba(250, 250, 249, 1)', 'rgba(250, 250, 249, 1)']}
            style={styles.footerGradient}
          >
            <Animated.View style={[styles.footer, footerAnimatedStyle]}>
              <Button
                accessibilityHint="Creates a new habit based on this template"
                accessibilityLabel={`Use ${template.name} template`}
                fullWidth
                size='large'
                style={[styles.useButton, { backgroundColor: baseColor }]}
                variant='primary'
                onPress={handleUseTemplate}
              >
                Use This Template
              </Button>
              <AnimatedPressable
                accessibilityLabel='Go back to templates list'
                accessibilityRole='button'
                style={[styles.backButton, backButtonAnimatedStyle]}
                onPress={handleClose}
                {...createPressHandlers(backButtonScale, 0.95)}
              >
                <Text style={styles.backButtonText}>Back to Templates</Text>
              </AnimatedPressable>
            </Animated.View>
          </LinearGradient>

          {/* Confetti celebration */}
          {showConfetti && (
            <View pointerEvents="none" style={styles.confettiContainer}>
              {confettiColors.flatMap((color, colorIndex) =>
                Array.from({ length: 8 }).map((_, i) => (
                  <ConfettiParticle
                    key={`${colorIndex}-${i}`}
                    color={color}
                    delay={i * 50}
                    startX={-100 + (colorIndex * 50) + (i * 30)}
                  />
                ))
              )}
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  );
}

/**
 * Helper function to generate "Why It Works" text based on template data
 */
function getWhyItWorksText(template: Doc<'templates'>): string {
  const category = template.category;
  const name = template.name.toLowerCase();

  if (name.includes('meditation') || name.includes('mindfulness')) {
    return 'Regular meditation practice has been shown to reduce stress hormones, improve emotional regulation, and increase gray matter density in brain regions associated with learning and memory. Even brief daily sessions create lasting neurological changes.';
  }

  if (name.includes('water') || name.includes('hydration')) {
    return 'Proper hydration is essential for cognitive function, physical performance, and metabolic processes. Morning hydration is particularly important as the body is naturally dehydrated after 7-8 hours of sleep, and starting the day with water helps restore optimal function.';
  }

  if (
    name.includes('exercise') ||
    name.includes('workout') ||
    name.includes('fitness')
  ) {
    return 'Regular physical activity triggers the release of endorphins, improves cardiovascular health, strengthens muscles and bones, and enhances cognitive function. The cumulative effect of consistent exercise leads to significant improvements in both physical and mental well-being.';
  }

  if (name.includes('gratitude') || name.includes('journal')) {
    return 'Gratitude practices rewire the brain to focus on positive experiences, which improves mood, increases life satisfaction, and strengthens social relationships. Regular journaling creates a lasting shift in psychological well-being by training attention toward positive aspects of life.';
  }

  if (
    name.includes('sleep') ||
    name.includes('sunlight') ||
    name.includes('sunrise')
  ) {
    return 'Light exposure, particularly natural sunlight in the morning, is the primary zeitgeber (time-giver) for the circadian system. It helps regulate cortisol awakening response, improves alertness, mood, and sets the stage for better sleep quality at night.';
  }

  if (category === 'productivity') {
    return 'Research demonstrates that structured work approaches reduce decision fatigue, minimize distractions, and optimize cognitive resources. By establishing clear boundaries and focused work periods, productivity increases while mental exhaustion decreases.';
  }

  return 'Scientific research has consistently demonstrated the effectiveness of this habit pattern. Regular practice leads to measurable improvements in the targeted area through both physiological adaptations and behavioral reinforcement mechanisms.';
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 120,
  },
  categoryBadge: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  citationBox: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 16,
    padding: 18,
  },
  citationDot: {
    backgroundColor: '#10B981',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  citationHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  citationLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  citationText: {
    color: '#374151',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  confettiParticle: {
    borderRadius: 4,
    height: 12,
    position: 'absolute',
    width: 12,
  },
  container: {
    backgroundColor: '#FAFAF9',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  descriptionText: {
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 26,
  },
  dismissIndicator: {
    alignItems: 'center',
    left: 0,
    paddingVertical: 8,
    position: 'absolute',
    right: 0,
    top: -50,
    zIndex: 100,
  },
  dismissPill: {
    backgroundColor: '#9CA3AF',
    borderRadius: 3,
    height: 5,
    marginBottom: 8,
    width: 40,
  },
  dismissText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    gap: 8,
    paddingBottom: 34,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  footerGradient: {
    bottom: 0,
    left: 0,
    paddingTop: 24,
    position: 'absolute',
    right: 0,
  },
  frequencyPill: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  frequencyPillText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'rgba(250, 250, 249, 0.98)',
    borderBottomColor: 'transparent',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    zIndex: 10,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    maxWidth: 200,
  },
  heroGradient: {
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 28,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  iconGlow: {
    borderRadius: 48,
    height: 96,
    opacity: 0.25,
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    width: 96,
  },
  iconText: {
    fontSize: 48,
  },
  iconWrapper: {
    marginBottom: 20,
    position: 'relative',
  },
  linkButton: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  linkText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  pillRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 16,
  },
  popularBadge: {
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderRadius: 12,
    borderWidth: 1,
    bottom: -4,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: -4,
    width: 28,
  },
  readingTimePill: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  readingTimePillText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sectionIconBadge: {
    alignItems: 'center',
    borderRadius: 12,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  sectionIconEmoji: {
    fontSize: 18,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  shareButton: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 20,
    padding: 20,
  },
  skeletonCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  skeletonFooter: {
    backgroundColor: '#FAFAF9',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    paddingBottom: 34,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  skeletonHero: {
    alignItems: 'center',
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  skeletonPillRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  templateHeader: {
    alignItems: 'center',
  },
  templateName: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  useButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  whyItWorksContainer: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  whyItWorksEmoji: {
    fontSize: 18,
  },
  whyItWorksHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  whyItWorksText: {
    color: '#166534',
    fontSize: 15,
    lineHeight: 24,
  },
  whyItWorksTitle: {
    color: '#15803D',
    fontSize: 15,
    fontWeight: '700',
  },
  youtubeButton: {
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  youtubeGradient: {
    alignItems: 'center',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  youtubeSubtitle: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },
  youtubeTextContainer: {
    flex: 1,
  },
  youtubeTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
});
