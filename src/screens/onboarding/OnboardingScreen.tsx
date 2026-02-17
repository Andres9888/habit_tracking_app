/**
 * Onboarding Screen — Animated Redesign
 *
 * 3-screen flow:
 * 1. "Build chains, not habits" — animated chain links growing
 * 2. "Track your way" — habit card with swipe gesture demo
 * 3. "Stay motivated" — streak counter ticking up
 *
 * Features: Reanimated 60fps animations, skip button, progress dots, dark mode.
 */

import { useThemeColors } from '../../theme/ThemeContext';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeSetBoolean } from '@/utils/storage';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ONBOARDING_KEY = '@chainday_onboarding_complete';

// ─── Screen 1: Chain Links Growing ──────────────────────────────────

const CHAIN_COUNT = 7;

function ChainLinkAnimated({
  index,
  reduceMotion,
  color,
}: {
  index: number;
  reduceMotion: boolean;
  color: string;
}) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(index % 2 === 0 ? -15 : 15);

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      return;
    }
    scale.value = withDelay(
      300 + index * 120,
      withSpring(1, { damping: 12, stiffness: 180 })
    );
    rotation.value = withDelay(
      300 + index * 120,
      withSpring(index % 2 === 0 ? -5 : 5, { damping: 14, stiffness: 120 })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.chainLink,
        { backgroundColor: color },
        animStyle,
      ]}
    >
      <View style={styles.chainLinkHole} />
    </Animated.View>
  );
}

function ChainGrowingVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const { colors } = useThemeColors();
  const chainColors = [
    colors.primary[600],
    colors.primary[400],
    colors.primary[500],
    colors.primary[700],
    colors.primary[600],
    colors.primary[400],
    colors.primary[500],
  ];

  // Pulsing glow on the last link
  const glowOpacity = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    glowOpacity.value = withDelay(
      300 + CHAIN_COUNT * 120 + 200,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.15, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.chainContainer}>
      {Array.from({ length: CHAIN_COUNT }).map((_, i) => (
        <View key={i} style={{ position: 'relative' }}>
          <ChainLinkAnimated
            index={i}
            reduceMotion={reduceMotion}
            color={chainColors[i % chainColors.length]}
          />
          {i === CHAIN_COUNT - 1 && !reduceMotion && (
            <Animated.View
              style={[
                styles.chainLinkGlow,
                { backgroundColor: colors.primary[400] },
                glowStyle,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
}

// ─── Screen 2: Habit Card with Swipe Gesture Demo ───────────────────

function SwipeGestureVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const { colors, isDark } = useThemeColors();
  const cardX = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const handOpacity = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      checkScale.value = 1;
      return;
    }

    // Animate: hand appears, swipes card right, checkmark appears, resets
    const runSwipeLoop = () => {
      handOpacity.value = withDelay(
        600,
        withTiming(1, { duration: 300 })
      );
      cardX.value = withDelay(
        1000,
        withSequence(
          withTiming(80, { duration: 500, easing: Easing.out(Easing.cubic) }),
          withDelay(400, withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) }))
        )
      );
      checkScale.value = withDelay(
        1500,
        withSequence(
          withSpring(1.2, { damping: 10, stiffness: 200 }),
          withSpring(1, { damping: 15, stiffness: 200 }),
          withDelay(800, withTiming(0, { duration: 200 }))
        )
      );
      handOpacity.value = withDelay(
        2400,
        withTiming(0, { duration: 200 })
      );
    };

    runSwipeLoop();
    const interval = setInterval(runSwipeLoop, 3200);
    return () => clearInterval(interval);
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardX.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const handStyle = useAnimatedStyle(() => ({
    opacity: handOpacity.value,
  }));

  return (
    <View style={styles.swipeContainer}>
      <Animated.View
        style={[
          styles.habitCard,
          {
            backgroundColor: isDark ? colors.card : '#FFFFFF',
            borderColor: isDark ? colors.cardBorder : '#E5E7EB',
          },
          cardStyle,
        ]}
      >
        <View style={styles.habitCardContent}>
          <Text style={styles.habitCardEmoji}>🧘</Text>
          <View style={styles.habitCardText}>
            <Text style={[styles.habitCardTitle, { color: colors.text.primary }]}>
              Morning Meditation
            </Text>
            <Text style={[styles.habitCardSub, { color: colors.text.secondary }]}>
              10 min · Daily
            </Text>
          </View>
          <Animated.View
            style={[
              styles.checkCircle,
              { backgroundColor: colors.primary[600] },
              checkStyle,
            ]}
          >
            <Text style={styles.checkMark}>✓</Text>
          </Animated.View>
        </View>

        {/* Swipe hint strip */}
        <View
          style={[
            styles.swipeStrip,
            { backgroundColor: colors.primary[400] },
          ]}
        />
      </Animated.View>

      {/* Animated hand */}
      <Animated.View style={[styles.swipeHand, handStyle]}>
        <Text style={styles.handEmoji}>👆</Text>
      </Animated.View>

      {/* Arrow hints */}
      <View style={styles.arrowHints}>
        <Text style={[styles.arrowText, { color: colors.text.secondary }]}>
          ← swipe →
        </Text>
      </View>
    </View>
  );
}

// ─── Screen 3: Streak Counter Ticking Up ────────────────────────────

function StreakCounterVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const { colors, isDark } = useThemeColors();
  const [count, setCount] = useState(0);
  const counterScale = useSharedValue(1);
  const flameScale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      setCount(42);
      return;
    }

    let current = 0;
    const target = 42;
    const interval = setInterval(() => {
      current++;
      setCount(current);

      // Bounce on each tick
      counterScale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 12, stiffness: 200 })
      );

      if (current >= target) {
        clearInterval(interval);
        // Big celebration bounce
        flameScale.value = withSequence(
          withSpring(1.4, { damping: 6, stiffness: 200 }),
          withSpring(1, { damping: 10, stiffness: 150 })
        );
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const counterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: counterScale.value }],
  }));

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  return (
    <View style={styles.streakContainer}>
      <Animated.Text style={[styles.streakFlame, flameStyle]}>
        🔥
      </Animated.Text>
      <Animated.View style={counterStyle}>
        <Text
          style={[
            styles.streakNumber,
            { color: colors.primary[600] },
          ]}
        >
          {count}
        </Text>
      </Animated.View>
      <Text style={[styles.streakLabel, { color: colors.text.secondary }]}>
        day streak
      </Text>

      {/* Mini calendar row */}
      <Animated.View
        entering={reduceMotion ? undefined : FadeInUp.delay(2200).springify().damping(18)}
        style={styles.miniCalendar}
      >
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
          <View key={i} style={styles.miniDay}>
            <View
              style={[
                styles.miniDot,
                {
                  backgroundColor:
                    i <= 5
                      ? colors.primary[500]
                      : isDark
                        ? colors.gray[300]
                        : '#E5E7EB',
                },
              ]}
            />
            <Text
              style={[
                styles.miniDayLabel,
                { color: colors.text.secondary },
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

// ─── Page Data ───────────────────────────────────────────────────────

interface PageData {
  id: string;
  title: string;
  subtitle: string;
  Visual: (props: { reduceMotion: boolean }) => React.JSX.Element;
}

const PAGES: PageData[] = [
  {
    id: 'chains',
    title: 'Build chains,\nnot habits',
    subtitle:
      'Every day you show up adds a link. Watch your chain grow — and never want to break it.',
    Visual: ChainGrowingVisual,
  },
  {
    id: 'track',
    title: 'Track your way',
    subtitle:
      'Swipe to complete, tap to explore. Your habits, your rhythm — we just make it feel effortless.',
    Visual: SwipeGestureVisual,
  },
  {
    id: 'streaks',
    title: 'Stay motivated',
    subtitle:
      'Watch your streak climb and feel the momentum build. Consistency is your superpower.',
    Visual: StreakCounterVisual,
  },
];

// ─── Dot Indicators ──────────────────────────────────────────────────

function DotIndicators({ currentIndex }: { currentIndex: number }) {
  const { colors } = useThemeColors();
  return (
    <View
      accessible
      accessibilityLabel={`Page ${currentIndex + 1} of ${PAGES.length}`}
      accessibilityRole="tablist"
      style={styles.dotsContainer}
    >
      {PAGES.map((_, i) => (
        <Animated.View
          key={i}
          accessibilityLabel={`Page ${i + 1}${i === currentIndex ? ', current' : ''}`}
          accessibilityRole="tab"
          accessibilityState={{ selected: i === currentIndex }}
          style={[
            styles.dot,
            {
              backgroundColor:
                i === currentIndex ? colors.primary[600] : colors.gray[300],
              width: i === currentIndex ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

interface OnboardingScreenProps {
  onComplete: () => void;
}

function OnboardingScreenContent({ onComplete }: OnboardingScreenProps) {
  const { colors, isDark } = useThemeColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const shouldReduceMotion = useReducedMotion();

  const handleComplete = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    void Haptics.impactAsync(ImpactFeedbackStyle.Medium);
    try {
      await safeSetBoolean(ONBOARDING_KEY, true);
      onComplete();
    } catch (error) {
      if (__DEV__) {
        console.error('[OnboardingScreen] Failed to save completion state:', error);
      }
      onComplete();
    } finally {
      setIsLoading(false);
    }
  }, [onComplete, isLoading]);

  const handleSkip = useCallback(() => {
    void Haptics.impactAsync(ImpactFeedbackStyle.Light);
    void handleComplete();
  }, [handleComplete]);

  const handleNext = useCallback(() => {
    void Haptics.impactAsync(ImpactFeedbackStyle.Light);
    if (currentIndex < PAGES.length - 1) {
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: currentIndex + 1,
      });
    }
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const isLastPage = currentIndex === PAGES.length - 1;

  const renderPage = useCallback(
    ({ item }: { item: PageData }) => (
      <View style={[styles.page, { width: SCREEN_WIDTH }]}>
        <View style={styles.visualContainer}>
          <item.Visual reduceMotion={!!shouldReduceMotion} />
        </View>
        <Animated.Text
          entering={
            shouldReduceMotion
              ? undefined
              : FadeInUp.delay(200).springify().damping(18)
          }
          style={[styles.title, { color: colors.text.primary }]}
        >
          {item.title}
        </Animated.Text>
        <Animated.Text
          entering={
            shouldReduceMotion
              ? undefined
              : FadeInUp.delay(350).springify().damping(18)
          }
          style={[styles.subtitle, { color: colors.text.secondary }]}
        >
          {item.subtitle}
        </Animated.Text>
      </View>
    ),
    [shouldReduceMotion, colors]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip button */}
      <Animated.View
        entering={shouldReduceMotion ? undefined : FadeIn.delay(600)}
        style={[styles.skipContainer, { top: insets.top + 12 }]}
      >
        <Pressable
          accessibilityLabel="Skip onboarding"
          accessibilityRole="button"
          hitSlop={24}
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={[styles.skipText, { color: colors.text.secondary }]}>
            Skip
          </Text>
        </Pressable>
      </Animated.View>

      {/* Pages */}
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        bounces={false}
        data={PAGES}
        getItemLayout={(_, index) => ({
          index,
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
        })}
        keyExtractor={(item) => item.id}
        renderItem={renderPage}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      {/* Bottom section */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 32 }]}>
        <DotIndicators currentIndex={currentIndex} />

        {isLastPage ? (
          <Animated.View
            entering={
              shouldReduceMotion
                ? undefined
                : FadeInDown.springify().damping(18)
            }
          >
            <Pressable
              accessibilityLabel="Get started"
              accessibilityRole="button"
              disabled={isLoading}
              style={[
                styles.ctaButton,
                { backgroundColor: colors.primary[600] },
                isLoading && styles.ctaButtonDisabled,
              ]}
              onPress={() => void handleComplete()}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.ctaText}>Let's Go →</Text>
              )}
            </Pressable>
          </Animated.View>
        ) : (
          <Pressable
            accessibilityLabel="Next onboarding page"
            accessibilityRole="button"
            style={[
              styles.nextButton,
              { backgroundColor: colors.primary[600] },
            ]}
            onPress={handleNext}
          >
            <Text style={styles.nextText}>Next</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  arrowHints: {
    alignItems: 'center',
    marginTop: 16,
  },
  arrowText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 2,
  },
  bottomContainer: {
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 32,
  },
  chainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  chainLink: {
    alignItems: 'center',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    width: 38,
  },
  chainLinkGlow: {
    borderRadius: 20,
    bottom: -4,
    left: -4,
    position: 'absolute',
    right: -4,
    top: -4,
  },
  chainLinkHole: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
    height: 32,
    width: 18,
  },
  checkCircle: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  ctaButton: {
    borderRadius: 12,
    elevation: 4,
    paddingHorizontal: 48,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  dot: {
    borderRadius: 4,
    height: 8,
  },
  dotsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  habitCard: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: 280,
  },
  habitCardContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  habitCardEmoji: {
    fontSize: 32,
  },
  habitCardSub: {
    fontSize: 13,
  },
  habitCardText: {
    flex: 1,
    gap: 2,
  },
  habitCardTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  handEmoji: {
    fontSize: 32,
  },
  miniCalendar: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  miniDay: {
    alignItems: 'center',
    gap: 6,
  },
  miniDayLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  miniDot: {
    borderRadius: 8,
    height: 16,
    width: 16,
  },
  nextButton: {
    borderRadius: 12,
    elevation: 4,
    paddingHorizontal: 48,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  page: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  skipContainer: {
    position: 'absolute',
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: 17,
    fontWeight: '500',
  },
  streakContainer: {
    alignItems: 'center',
    gap: 4,
  },
  streakFlame: {
    fontSize: 48,
  },
  streakLabel: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  streakNumber: {
    fontSize: 72,
    fontWeight: '800',
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  swipeContainer: {
    alignItems: 'center',
  },
  swipeHand: {
    bottom: -20,
    position: 'absolute',
    right: 20,
  },
  swipeStrip: {
    height: 4,
    width: '100%',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  visualContainer: {
    alignItems: 'center',
    height: 280,
    justifyContent: 'center',
    marginBottom: 40,
  },
});

export { ONBOARDING_KEY };

export function OnboardingScreen(props: OnboardingScreenProps) {
  return (
    <ScreenErrorBoundary screenName="Onboarding">
      <OnboardingScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
