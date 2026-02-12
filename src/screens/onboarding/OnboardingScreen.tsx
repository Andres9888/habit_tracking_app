/**
 * OnboardingScreen
 *
 * 3-screen carousel shown once after first sign-up.
 * Screens: Chain visualization, Strength meter, Templates grid.
 * Sets AsyncStorage flag to prevent re-showing.
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
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ONBOARDING_KEY = '@chainday_onboarding_complete';

const SPRING_CONFIG = { damping: 18, stiffness: 120 };

// ─── Chain Visualization ─────────────────────────────────────────────

function ChainLink({ delay, index }: { delay: number; index: number }) {
  const colors = ['#059669', '#047857', '#10B981', '#047857', '#059669', '#10B981', '#047857'];
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={[
        styles.chainLink,
        {
          backgroundColor: colors[index % colors.length],
          transform: [{ rotate: index % 2 === 0 ? '0deg' : '0deg' }],
        },
      ]}
    >
      <View style={styles.chainLinkInner} />
    </Animated.View>
  );
}

function ChainVisualization() {
  return (
    <View style={styles.chainContainer}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ChainLink key={i} delay={400 + i * 120} index={i} />
      ))}
    </View>
  );
}

// ─── Strength Meter ──────────────────────────────────────────────────

function StrengthMeter() {
  const stages = ['Starting', 'Building', 'Growing', 'Strong', 'Automatic'];
  return (
    <View style={styles.strengthContainer}>
      {stages.map((stage, i) => (
        <Animated.View
          key={stage}
          entering={FadeInDown.delay(400 + i * 200)
            .springify()
            .damping(18)}
          style={styles.strengthRow}
        >
          <View
            style={[
              styles.strengthBar,
              {
                width: `${20 + i * 20}%`,
                backgroundColor: interpolateColor(i / 4),
                opacity: 0.15 + i * 0.2125,
              },
            ]}
          />
          <Text style={[styles.strengthLabel, i === 4 && styles.strengthLabelActive]}>
            {stage}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

function interpolateColor(t: number): string {
  // Green gradient from light to deep
  if (t < 0.5) return '#10B981';
  if (t < 0.75) return '#059669';
  return '#047857';
}

// ─── Template Grid ───────────────────────────────────────────────────

const TEMPLATE_ICONS = [
  '🧘', '💧', '📖', '🏃',
  '😴', '🥗', '✍️', '🧠',
  '💊', '🎯', '🌅', '🏋️',
];

function TemplateGrid() {
  return (
    <View style={styles.templateGrid}>
      {TEMPLATE_ICONS.map((emoji, i) => (
        <Animated.View
          key={i}
          entering={FadeIn.delay(300 + i * 60)
            .springify()
            .damping(18)}
          style={styles.templateItem}
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
  Visual: () => React.JSX.Element;
}

const PAGES: PageData[] = [
  {
    id: 'chain',
    title: "Don't Break the Chain",
    subtitle: 'Complete your habits daily to build unbreakable chains',
    Visual: ChainVisualization,
  },
  {
    id: 'strength',
    title: 'Science-Backed Strength',
    subtitle:
      'Your habits get stronger over time — backed by behavioral science research',
    Visual: StrengthMeter,
  },
  {
    id: 'templates',
    title: '200+ Templates to Start',
    subtitle: 'Choose from science-backed habit templates or create your own',
    Visual: TemplateGrid,
  },
];

// ─── Dot Indicators ──────────────────────────────────────────────────

function DotIndicators({ currentIndex }: { currentIndex: number }) {
  return (
    <View style={styles.dotsContainer}>
      {PAGES.map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i === currentIndex ? '#059669' : '#D1D5DB',
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

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

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
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isLastPage = currentIndex === PAGES.length - 1;

  const renderPage = useCallback(
    ({ item }: { item: PageData }) => (
      <View style={[styles.page, { width: SCREEN_WIDTH }]}>
        <View style={styles.visualContainer}>
          <item.Visual />
        </View>
        <Animated.Text
          entering={FadeInUp.delay(200).springify().damping(18)}
          style={styles.title}
        >
          {item.title}
        </Animated.Text>
        <Animated.Text
          entering={FadeInUp.delay(350).springify().damping(18)}
          style={styles.subtitle}
        >
          {item.subtitle}
        </Animated.Text>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <Animated.View
        entering={FadeIn.delay(600)}
        style={[styles.skipContainer, { top: insets.top + 12 }]}
      >
        <Pressable
          onPress={handleSkip}
          hitSlop={16}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </Animated.View>

      {/* Pages */}
      <FlatList
        ref={flatListRef}
        data={PAGES}
        renderItem={renderPage}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Bottom section */}
      <View style={styles.bottomContainer}>
        <DotIndicators currentIndex={currentIndex} />

        {isLastPage ? (
          <Animated.View entering={FadeInDown.springify().damping(18)}>
            <Pressable
              style={[styles.ctaButton, isLoading && styles.ctaButtonDisabled]}
              onPress={() => void handleComplete()}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Get started building your first habit"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.ctaText}>Let's Build Your First Habit →</Text>
              )}
            </Pressable>
          </Animated.View>
        ) : (
          <Pressable
            style={styles.nextButton}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="Next onboarding page"
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
  container: {
    flex: 1,
    backgroundColor: '#faf9f7',
  },
  skipContainer: {
    position: 'absolute',
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: 17,
    color: '#6B7280',
    fontWeight: '500',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  visualContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#047857',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  bottomContainer: {
    paddingBottom: 60,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  nextText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ctaButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Chain styles
  chainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: -4,
  },
  chainLink: {
    width: 36,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: -2,
  },
  chainLinkInner: {
    width: 20,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  // Strength styles
  strengthContainer: {
    width: '100%',
    gap: 12,
    paddingHorizontal: 16,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  strengthBar: {
    height: 32,
    borderRadius: 8,
    backgroundColor: '#059669',
  },
  strengthLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  strengthLabelActive: {
    color: '#047857',
    fontWeight: '700',
  },
  // Template styles
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    width: 280,
  },
  templateItem: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  templateEmoji: {
    fontSize: 28,
  },
});

export { ONBOARDING_KEY };
