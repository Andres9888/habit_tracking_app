/**
 * Onboarding Screen Component
 * 3-screen carousel shown once after first sign-up.
 * Screens: Chain visualization, Strength meter, Templates grid.
 * Sets AsyncStorage flag to prevent re-showing.
 */
/* eslint-disable max-lines, max-lines-per-function */

import { useThemeColors } from '../../theme/ThemeContext';
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
  FadeInDown,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeSetBoolean } from '@/utils/storage';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';

import { useThemeColors } from '../../theme/ThemeContext';
import { colors as coreColors } from '../../theme/colors';
import { typography, fontWeights } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { springs, durations } from '../../theme/animations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ONBOARDING_KEY = '@chainday_onboarding_complete';

// Chain link colors use the primary palette
const CHAIN_COLORS = [
  coreColors.primary[600],
  coreColors.primary[700],
  coreColors.primary[500],
  coreColors.primary[700],
  coreColors.primary[600],
  coreColors.primary[500],
  coreColors.primary[700],
];

// ─── Chain Visualization ─────────────────────────────────────────────

function ChainLink({
  delay,
  index,
  reduceMotion,
}: {
  delay: number;
  index: number;
  reduceMotion: boolean;
}) {
  const theme = useThemeColors();
  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.delay(delay)
              .springify()
              .damping(springs.button.damping)
      }
      style={[
        styles.chainLink,
        {
          backgroundColor: CHAIN_COLORS[index % CHAIN_COLORS.length],
        },
      ]}
    >
      <View
        style={[
          styles.chainLinkInner,
          { backgroundColor: theme.text.inverse },
        ]}
      />
    </Animated.View>
  );
}

function ChainVisualization({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <View style={styles.chainContainer}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ChainLink
          key={i}
          delay={400 + i * 120}
          index={i}
          reduceMotion={reduceMotion}
        />
      ))}
    </View>
  );
}

// ─── Strength Meter ──────────────────────────────────────────────────

function StrengthMeter({ reduceMotion }: { reduceMotion: boolean }) {
  const theme = useThemeColors();
  const stages = ['Starting', 'Building', 'Growing', 'Strong', 'Automatic'];
  return (
    <View style={styles.strengthContainer}>
      {stages.map((stage, i) => (
        <Animated.View
          key={stage}
          entering={
            reduceMotion
              ? undefined
              : FadeInDown.delay(400 + i * 200)
                  .springify()
                  .damping(springs.button.damping)
          }
          style={styles.strengthRow}
        >
          <View
            style={[
              styles.strengthBar,
              {
                backgroundColor: interpolateColor(i / 4, colors.primary),
                opacity: 0.15 + i * 0.2125,
                width: `${20 + i * 20}%`,
              },
            ]}
          />
          <Text
            style={[
              styles.strengthLabel,
              { color: theme.text.secondary },
              i === 4 && {
                color: theme.primary[700],
                fontWeight: fontWeights.bold,
              },
            ]}
          >
            {stage}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

function interpolateColor(t: number): string {
  if (t < 0.5) return coreColors.primary[500];
  if (t < 0.75) return coreColors.primary[600];
  return coreColors.primary[700];
}

// ─── Template Grid ───────────────────────────────────────────────────

const TEMPLATE_ICONS = [
  '🧘',
  '💧',
  '📖',
  '🏃',
  '😴',
  '🥗',
  '✍️',
  '🧠',
  '💊',
  '🎯',
  '🌅',
  '🏋️',
];

function TemplateGrid({ reduceMotion }: { reduceMotion: boolean }) {
  const theme = useThemeColors();
  return (
    <View style={styles.templateGrid}>
      {TEMPLATE_ICONS.map((emoji, i) => (
        <Animated.View
          key={i}
          entering={
            reduceMotion
              ? undefined
              : FadeIn.delay(300 + i * durations.stagger)
                  .springify()
                  .damping(springs.button.damping)
          }
          style={[
            styles.templateItem,
            {
              backgroundColor: theme.primary[100],
            },
            shadows.card,
          ]}
        >
          <Text style={styles.templateEmoji}>{emoji}</Text>
        </Animated.View>
      ))}
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
    id: 'chain',
    subtitle: 'Complete your habits daily and watch your chain grow — every link counts.',
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
    subtitle: 'Pick from science-backed templates or create your own in seconds.',
    title: '200+ Ready-Made Templates',
    Visual: TemplateGrid,
  },
];

// ─── Dot Indicators ──────────────────────────────────────────────────

function DotIndicators({ currentIndex }: { currentIndex: number }) {
  const theme = useThemeColors();
  return (
    <View
      accessible
      accessibilityLabel={`Page ${currentIndex + 1} of ${PAGES.length}`}
      accessibilityRole='tablist'
      style={styles.dotsContainer}
    >
      {PAGES.map((_, i) => (
        <Animated.View
          key={i}
          accessibilityLabel={`Page ${i + 1}${i === currentIndex ? ', current' : ''}`}
          accessibilityRole='tab'
          accessibilityState={{ selected: i === currentIndex }}
          style={[
            styles.dot,
            {
              backgroundColor:
                i === currentIndex
                  ? theme.primary[600]
                  : theme.gray[300],
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
  const { colors } = useThemeColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const shouldReduceMotion = useReducedMotion();
  const theme = useThemeColors();

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
              : FadeInUp.delay(200)
                  .springify()
                  .damping(springs.button.damping)
          }
          style={[styles.title, { color: theme.primary[700] }]}
        >
          {item.title}
        </Animated.Text>
        <Animated.Text
          entering={
            shouldReduceMotion
              ? undefined
              : FadeInUp.delay(350)
                  .springify()
                  .damping(springs.button.damping)
          }
          style={[styles.subtitle, { color: theme.text.secondary }]}
        >
          {item.subtitle}
        </Animated.Text>
      </View>
    ),
    [shouldReduceMotion, theme]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Skip button */}
      <Animated.View
        entering={shouldReduceMotion ? undefined : FadeIn.delay(600)}
        style={[styles.skipContainer, { top: insets.top + spacing.md }]}
      >
        <Pressable
          accessibilityLabel='Skip onboarding'
          accessibilityRole='button'
          hitSlop={spacing.lg}
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={[styles.skipText, { color: theme.text.tertiary }]}>
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
      <View style={styles.bottomContainer}>
        <DotIndicators currentIndex={currentIndex} />

        {isLastPage ? (
          <Animated.View
            entering={
              shouldReduceMotion
                ? undefined
                : FadeInDown.springify()
                    .damping(springs.button.damping)
            }
          >
            <Pressable
              accessibilityLabel='Get started building your first habit'
              accessibilityRole='button'
              disabled={isLoading}
              style={[
                styles.ctaButton,
                { backgroundColor: theme.primary[600] },
                shadows.floatingActionButton,
                isLoading && styles.ctaButtonDisabled,
              ]}
              onPress={() => void handleComplete()}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.text.inverse} />
              ) : (
                <Text
                  style={[styles.ctaText, { color: theme.text.inverse }]}
                >
                  Let's Build Your First Habit →
                </Text>
              )}
            </Pressable>
          </Animated.View>
        ) : (
          <Pressable
            accessibilityLabel='Next onboarding page'
            accessibilityRole='button'
            style={[
              styles.nextButton,
              { backgroundColor: theme.primary[600] },
              shadows.floatingActionButton,
            ]}
            onPress={handleNext}
          >
            <Text style={[styles.nextText, { color: theme.text.inverse }]}>
              Next
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bottomContainer: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingBottom: 60,
    paddingHorizontal: spacing.xl,
  },
  chainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: -4,
  },
  chainLink: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    height: 52,
    justifyContent: 'center',
    marginHorizontal: -2,
    width: 36,
  },
  chainLinkInner: {
    borderRadius: borderRadius.medium,
    height: 36,
    width: 20,
  },
  container: {
    flex: 1,
  },
  ctaButton: {
    borderRadius: borderRadius.button,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    ...typography.button,
    fontSize: 17,
  },
  dot: {
    borderRadius: borderRadius.xs,
    height: 8,
  },
  dotsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  nextButton: {
    borderRadius: borderRadius.button,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.base,
  },
  nextText: {
    ...typography.button,
    fontSize: 17,
  },
  page: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  skipContainer: {
    position: 'absolute',
    right: spacing.lg,
    zIndex: 10,
  },
  skipText: {
    ...typography.body,
    fontSize: 17,
    fontWeight: fontWeights.medium,
  },
  strengthBar: {
    borderRadius: borderRadius.small,
    height: 32,
  },
  strengthContainer: {
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    width: '100%',
  },
  strengthLabel: {
    ...typography.caption,
  },
  strengthRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  subtitle: {
    ...typography.body,
    fontSize: 17,
    lineHeight: 24,
    paddingHorizontal: spacing.base,
    textAlign: 'center',
  },
  templateEmoji: {
    fontSize: 28,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
    justifyContent: 'center',
    width: 280,
  },
  templateItem: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  title: {
    ...typography.displayLarge,
    fontSize: 34,
    marginBottom: spacing.md,
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
