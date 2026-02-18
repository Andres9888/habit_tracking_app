/**
 * @file OnboardingScreen.tsx
 * @description 3-screen onboarding carousel shown once after first sign-up.
 *
 * ## Architecture
 * - **Carousel**: Horizontal `FlatList` with paging, 3 pages (Chain, Strength, Templates).
 * - **Persistence**: Sets `@chainday_onboarding_complete` in AsyncStorage to prevent re-showing.
 * - **Animations**: All entrance animations use Reanimated's `springify().damping(18)` with
 *   staggered delays. Respects `useReducedMotion` for accessibility.
 * - **Error boundary**: Wrapped in `ScreenErrorBoundary` so a crash here never blocks the app.
 * - **Component Extraction**: `ChainVisualization`, `StrengthMeter`, `TemplateGrid`, and
 *   `DotIndicators` are now in separate files under `./components/`.
 *
 * ## State Flow
 * ```
 * [Page 0: Chain] → Next → [Page 1: Strength] → Next → [Page 2: Templates] → "Get Started" → onComplete()
 *                                                                                ↑
 *                                                 Skip button (any page) ────────┘
 * ```
 */
/* eslint-disable max-lines-per-function */

import { useThemeColors } from '../../theme/ThemeContext';
import { colors } from '../../theme/colors';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useCallback, useRef, useState } from 'react';
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
  FadeIn,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeSetBoolean } from '@/utils/storage';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import {
  ChainVisualization,
  StrengthMeter,
  TemplateGrid,
  DotIndicators,
} from './components';

/** Static screen width — used for FlatList page sizing and `getItemLayout`. */
const { width: SCREEN_WIDTH } = Dimensions.get('window');

/** AsyncStorage key that gates whether onboarding has been completed. */
const ONBOARDING_KEY = '@chainday_onboarding_complete';

// ── Page Data ────────────────────────────────────────────────────────

/** Shape of a single onboarding page configuration. */
interface PageData {
  id: string;
  title: string;
  subtitle: string;
  /** React component rendered in the visual area above the title. */
  Visual: (props: { reduceMotion: boolean }) => React.JSX.Element;
}

/**
 * Static page definitions for the onboarding carousel.
 * Order here determines swipe order. Adding a page is as simple as
 * appending an entry (dot indicators and navigation adapt automatically).
 */
const PAGES: PageData[] = [
  {
    id: 'chain',
    subtitle:
      'Complete your habits daily and watch your chain grow — every link counts.',
    title: "Don't Break the Chain",
    Visual: ChainVisualization,
  },
  {
    id: 'strength',
    subtitle:
      'Your habits get stronger over time — backed by behavioral science.',
    title: 'Science-Backed Strength',
    Visual: StrengthMeter,
  },
  {
    id: 'templates',
    subtitle:
      'Pick from science-backed templates or create your own in seconds.',
    title: '200+ Ready-Made Templates',
    Visual: TemplateGrid,
  },
];

// ── Main Component ───────────────────────────────────────────────────

/** Props for the onboarding screen. */
interface OnboardingScreenProps {
  /** Called when the user completes or skips onboarding. */
  onComplete: () => void;
}

/**
 * Core onboarding screen content (unwrapped from error boundary).
 *
 * ## State
 * - `currentIndex` — Tracks which page is visible (driven by `onViewableItemsChanged`).
 * - `isLoading`    — Guards the "Get Started" button to prevent double-taps.
 *
 * ## Key Behaviors
 * - **Skip** fires `handleComplete` from any page.
 * - **Next** programmatically scrolls the FlatList to the next page.
 * - **Get Started** (last page only) persists the completion flag, then calls `onComplete`.
 * - If AsyncStorage write fails, we still call `onComplete` (user is not blocked).
 */
function OnboardingScreenContent({ onComplete }: OnboardingScreenProps) {
  const { colors } = useThemeColors();

  // ── State ────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const shouldReduceMotion = useReducedMotion();

  // ── Handlers ─────────────────────────────────────────────────────

  /**
   * Marks onboarding as complete in AsyncStorage, then navigates away.
   * Guarded by `isLoading` to prevent duplicate invocations.
   * On storage failure, still proceeds — the user may see onboarding
   * again on next launch, but that's an acceptable degradation.
   */
  const handleComplete = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    void Haptics.impactAsync(ImpactFeedbackStyle.Medium);
    try {
      // Mark onboarding as complete in AsyncStorage
      await safeSetBoolean(ONBOARDING_KEY, true);
      onComplete();
    } catch (error) {
      // If storage fails, still proceed to avoid blocking user
      // They might see onboarding again on next launch, but that's acceptable
      if (__DEV__) {
        console.error(
          '[OnboardingScreen] Failed to save completion state:',
          error
        );
      }
      onComplete();
    } finally {
      setIsLoading(false);
    }
  }, [onComplete, isLoading]);

  /**
   * Skip button handler — triggers light haptic and completes onboarding immediately.
   */
  const handleSkip = useCallback(() => {
    void Haptics.impactAsync(ImpactFeedbackStyle.Light);
    void handleComplete();
  }, [handleComplete]);

  /**
   * Advances the FlatList to the next page (no-op on the last page).
   */
  const handleNext = useCallback(() => {
    void Haptics.impactAsync(ImpactFeedbackStyle.Light);
    if (currentIndex < PAGES.length - 1) {
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: currentIndex + 1,
      });
    }
  }, [currentIndex]);

  /**
   * FlatList viewability callback — updates `currentIndex` when
   * a new page becomes ≥50% visible (see `viewabilityConfig`).
   */
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  /** 50% coverage threshold triggers a page change. */
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const isLastPage = currentIndex === PAGES.length - 1;

  // ── Render Helpers ───────────────────────────────────────────────

  /**
   * Renders a single onboarding page: visual component + title + subtitle.
   * Memoized with `useCallback` since `shouldReduceMotion` is the only dep.
   */
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
          style={styles.title}
        >
          {item.title}
        </Animated.Text>
        <Animated.Text
          entering={
            shouldReduceMotion
              ? undefined
              : FadeInUp.delay(350).springify().damping(18)
          }
          style={styles.subtitle}
        >
          {item.subtitle}
        </Animated.Text>
      </View>
    ),
    [shouldReduceMotion]
  );

  // ── Render ───────────────────────────────────────────────────────

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip button — positioned absolutely in the top-right, always visible */}
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
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </Animated.View>

      {/* Horizontal paging carousel */}
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

      {/* Bottom section: dot indicators + action button */}
      <View style={styles.bottomContainer}>
        <DotIndicators currentIndex={currentIndex} />

        {isLastPage ? (
          <Animated.View
            entering={
              shouldReduceMotion
                ? undefined
                : FadeInUp.springify().damping(18)
            }
          >
            <Pressable
              accessibilityLabel="Get started building your first habit"
              accessibilityRole="button"
              disabled={isLoading}
              style={[styles.ctaButton, isLoading && styles.ctaButtonDisabled]}
              onPress={() => void handleComplete()}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.ctaText}>
                  Let's Build Your First Habit →
                </Text>
              )}
            </Pressable>
          </Animated.View>
        ) : (
          <Pressable
            accessibilityLabel="Next onboarding page"
            accessibilityRole="button"
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextText}>Next</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bottomContainer: {
    alignItems: 'center',
    gap: 24,
    paddingBottom: 60,
    paddingHorizontal: 32,
  },
  container: {
    backgroundColor: '#FAF8F5',
    flex: 1,
  },
  ctaButton: {
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    elevation: 4,
    paddingHorizontal: 32,
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
  nextButton: {
    backgroundColor: colors.primary[600],
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
    color: '#6B7280',
    fontSize: 17,
    fontWeight: '500',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 17,
    lineHeight: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  title: {
    color: colors.primary[700],
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

/**
 * Public export — wraps {@link OnboardingScreenContent} in an error boundary.
 * If the onboarding screen crashes, the boundary catches it and the user
 * can still proceed (the app won't be stuck on a white screen).
 */
export function OnboardingScreen(props: OnboardingScreenProps) {
  return (
    <ScreenErrorBoundary screenName="Onboarding">
      <OnboardingScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
