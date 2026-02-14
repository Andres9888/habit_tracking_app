/**
 * Onboarding Screen Component
 * 3-screen carousel shown once after first sign-up.
 * Screens: Chain visualization, Strength meter, Templates grid.
 * Sets AsyncStorage flag to prevent re-showing.
 *
 * Polish: dark mode, animated dot indicators, smooth spring transitions,
 * compelling copy, progress text, skip option, leads to first habit creation.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
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
  useAnimatedStyle,
  useReducedMotion,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColors } from '../../theme/ThemeContext';
import type { SemanticColors } from '../../theme/darkColors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ONBOARDING_KEY = '@chainday_onboarding_complete';

const SPRING_CONFIG = { damping: 18, stiffness: 200 };

// ─── Chain Visualization ─────────────────────────────────────────────

function ChainLink({
  delay,
  index,
  reduceMotion,
  colors,
}: {
  delay: number;
  index: number;
  reduceMotion: boolean;
  colors: SemanticColors;
}) {
  const linkColors = [
    colors.primary[600],
    colors.primary[700],
    colors.primary[400],
    colors.primary[700],
    colors.primary[600],
    colors.primary[400],
    colors.primary[700],
  ];
  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.delay(delay).springify().damping(18)
      }
      style={[
        styles.chainLink,
        { backgroundColor: linkColors[index % linkColors.length] },
      ]}
    >
      <View
        style={[
          styles.chainLinkInner,
          { backgroundColor: colors.background },
        ]}
      />
    </Animated.View>
  );
}

function ChainVisualization({
  reduceMotion,
  colors,
}: {
  reduceMotion: boolean;
  colors: SemanticColors;
}) {
  return (
    <View style={styles.chainContainer}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ChainLink
          key={i}
          colors={colors}
          delay={400 + i * 120}
          index={i}
          reduceMotion={reduceMotion}
        />
      ))}
    </View>
  );
}

// ─── Strength Meter ──────────────────────────────────────────────────

function StrengthMeter({
  reduceMotion,
  colors,
}: {
  reduceMotion: boolean;
  colors: SemanticColors;
}) {
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
                  .damping(18)
          }
          style={styles.strengthRow}
        >
          <View
            style={[
              styles.strengthBar,
              {
                backgroundColor: interpolateColor(i / 4, colors),
                opacity: 0.2 + i * 0.2,
                width: `${20 + i * 20}%`,
              },
            ]}
          />
          <Text
            style={[
              styles.strengthLabel,
              { color: colors.text.secondary },
              i === 4 && { color: colors.primary[600], fontWeight: '700' },
            ]}
          >
            {stage}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

function interpolateColor(t: number, colors: SemanticColors): string {
  if (t < 0.5) return colors.primary[400];
  if (t < 0.75) return colors.primary[600];
  return colors.primary[700];
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

function TemplateGrid({
  reduceMotion,
  colors,
}: {
  reduceMotion: boolean;
  colors: SemanticColors;
}) {
  return (
    <View style={styles.templateGrid}>
      {TEMPLATE_ICONS.map((emoji, i) => (
        <Animated.View
          key={i}
          entering={
            reduceMotion
              ? undefined
              : FadeIn.delay(300 + i * 60)
                  .springify()
                  .damping(18)
          }
          style={[
            styles.templateItem,
            { backgroundColor: colors.primary[100] },
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
  Visual: (props: {
    reduceMotion: boolean;
    colors: SemanticColors;
  }) => React.JSX.Element;
}

const PAGES: PageData[] = [
  {
    id: 'chain',
    subtitle:
      'Every day you show up, your chain grows stronger. Miss a day and you start over. Simple — but powerful.',
    title: "Don't Break the Chain",
    Visual: ChainVisualization,
  },
  {
    id: 'strength',
    subtitle:
      'Habits start fragile. After 21 days they become routine. After 66 days? Automatic. We track every stage.',
    title: 'Watch Habits Get Stronger',
    Visual: StrengthMeter,
  },
  {
    id: 'templates',
    subtitle:
      'Pick from 200+ science-backed templates or create your own. Most people start with just one.',
    title: 'Start Small, Win Big',
    Visual: TemplateGrid,
  },
];

// ─── Animated Dot Indicator ──────────────────────────────────────────

function AnimatedDot({
  index,
  currentIndex,
  colors,
}: {
  index: number;
  currentIndex: number;
  colors: SemanticColors;
}) {
  const isActive = index === currentIndex;

  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(isActive ? 24 : 8, SPRING_CONFIG),
    backgroundColor: isActive ? colors.primary[600] : colors.gray[300],
    opacity: withSpring(isActive ? 1 : 0.5, SPRING_CONFIG),
  }));

  return (
    <Animated.View
      accessibilityLabel={`Page ${index + 1}${isActive ? ', current' : ''}`}
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      style={[styles.dot, animatedStyle]}
    />
  );
}

function DotIndicators({
  currentIndex,
  colors,
}: {
  currentIndex: number;
  colors: SemanticColors;
}) {
  return (
    <View
      accessible
      accessibilityLabel={`Page ${currentIndex + 1} of ${PAGES.length}`}
      accessibilityRole='tablist'
      style={styles.dotsContainer}
    >
      {PAGES.map((_, i) => (
        <AnimatedDot
          key={i}
          colors={colors}
          currentIndex={currentIndex}
          index={i}
        />
      ))}
    </View>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const shouldReduceMotion = useReducedMotion();
  const { colors, isDark } = useThemeColors();

  const handleComplete = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    void Haptics.impactAsync(ImpactFeedbackStyle.Medium);
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
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
          <item.Visual
            colors={colors}
            reduceMotion={!!shouldReduceMotion}
          />
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
          accessibilityLabel='Skip onboarding'
          accessibilityRole='button'
          hitSlop={24}
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={[styles.skipText, { color: colors.text.tertiary }]}>
            Skip
          </Text>
        </Pressable>
      </Animated.View>

      {/* Step counter */}
      <Animated.View
        entering={shouldReduceMotion ? undefined : FadeIn.delay(600)}
        style={[styles.stepContainer, { top: insets.top + 18 }]}
      >
        <Text style={[styles.stepText, { color: colors.text.tertiary }]}>
          {currentIndex + 1} of {PAGES.length}
        </Text>
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
      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: Math.max(insets.bottom, 24) + 24 },
        ]}
      >
        <DotIndicators colors={colors} currentIndex={currentIndex} />

        {isLastPage ? (
          <Animated.View
            entering={
              shouldReduceMotion
                ? undefined
                : FadeInDown.springify().damping(18)
            }
          >
            <Pressable
              accessibilityLabel='Get started building your first habit'
              accessibilityRole='button'
              disabled={isLoading}
              style={[
                styles.ctaButton,
                { backgroundColor: colors.primary[600] },
                isLoading && styles.ctaButtonDisabled,
              ]}
              onPress={() => void handleComplete()}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.text.inverse} />
              ) : (
                <Text
                  style={[styles.ctaText, { color: colors.text.inverse }]}
                >
                  Create Your First Habit →
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
              { backgroundColor: colors.primary[600] },
            ]}
            onPress={handleNext}
          >
            <Text style={[styles.nextText, { color: colors.text.inverse }]}>
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
    gap: 24,
    paddingHorizontal: 32,
  },
  chainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: -4,
  },
  chainLink: {
    alignItems: 'center',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    marginHorizontal: -2,
    width: 36,
  },
  chainLinkInner: {
    borderRadius: 12,
    height: 36,
    width: 20,
  },
  container: {
    flex: 1,
  },
  ctaButton: {
    borderRadius: 12,
    elevation: 4,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  ctaText: {
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
  nextButton: {
    borderRadius: 12,
    elevation: 4,
    paddingHorizontal: 48,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  nextText: {
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
  stepContainer: {
    alignItems: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  stepText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  strengthBar: {
    borderRadius: 8,
    height: 32,
  },
  strengthContainer: {
    gap: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  strengthLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  strengthRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  templateEmoji: {
    fontSize: 28,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    width: 280,
  },
  templateItem: {
    alignItems: 'center',
    borderRadius: 16,
    elevation: 2,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: 56,
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
