/**
 * Onboarding Screen Component
 * 3-screen carousel shown once after first sign-up.
 * Screens: Chain visualization, Strength meter, Templates grid.
 * Sets AsyncStorage flag to prevent re-showing.
 */
/* eslint-disable max-lines, max-lines-per-function */

import { useThemeColors } from '../../theme/ThemeContext';
import { colors } from '../../theme/colors';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ONBOARDING_KEY = '@chainday_onboarding_complete';

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
  const { colors } = useThemeColors();
  const chainColors = [
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
        {
          backgroundColor: chainColors[index % chainColors.length],
          transform: [{ rotate: '0deg' }], // Uniform rotation (placeholder for future alternating style)
        },
      ]}
    >
      <View style={styles.chainLinkInner} />
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
  const { colors } = useThemeColors();
  const { t } = useTranslation();
  const stages = [
    t('onboarding.strengthStages.starting'),
    t('onboarding.strengthStages.building'),
    t('onboarding.strengthStages.growing'),
    t('onboarding.strengthStages.strong'),
    t('onboarding.strengthStages.automatic'),
  ];
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
                backgroundColor: interpolateColor(i / 4, colors.primary),
                opacity: 0.15 + i * 0.2125,
                width: `${20 + i * 20}%`,
              },
            ]}
          />
          <Text
            style={[
              styles.strengthLabel,
              i === 4 && styles.strengthLabelActive,
            ]}
          >
            {stage}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

function interpolateColor(t: number, primary: Record<number, string>): string {
  if (t < 0.5) return primary[400];
  if (t < 0.75) return primary[600];
  return primary[700];
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
  Visual: (props: { reduceMotion: boolean }) => React.JSX.Element;
}

function useOnboardingPages(): PageData[] {
  const { t } = useTranslation();
  return [
    {
      id: 'chain',
      subtitle: t('onboarding.chainSubtitle'),
      title: t('onboarding.dontBreakTheChain'),
      Visual: ChainVisualization,
    },
    {
      id: 'strength',
      subtitle: t('onboarding.scienceSubtitle'),
      title: t('onboarding.scienceBacked'),
      Visual: StrengthMeter,
    },
    {
      id: 'templates',
      subtitle: t('onboarding.templatesSubtitle'),
      title: t('onboarding.readyMadeTemplates'),
      Visual: TemplateGrid,
    },
  ];
}

// ─── Dot Indicators ──────────────────────────────────────────────────

function DotIndicators({ currentIndex }: { currentIndex: number }) {
  const { colors } = useThemeColors();
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
  const { colors } = useThemeColors();
  const { t } = useTranslation();
  const PAGES = useOnboardingPages();
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip button */}
      <Animated.View
        entering={shouldReduceMotion ? undefined : FadeIn.delay(600)}
        style={[styles.skipContainer, { top: insets.top + 12 }]}
      >
        <Pressable
          accessibilityLabel={t('onboarding.skipOnboarding')}
          accessibilityRole='button'
          hitSlop={24}
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>{t('common.skip')}</Text>
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
                : FadeInDown.springify().damping(18)
            }
          >
            <Pressable
              accessibilityLabel={t('onboarding.letsStart')}
              accessibilityRole='button'
              disabled={isLoading}
              style={[styles.ctaButton, isLoading && styles.ctaButtonDisabled]}
              onPress={() => void handleComplete()}
            >
              {isLoading ? (
                <ActivityIndicator color='#FFFFFF' />
              ) : (
                <Text style={styles.ctaText}>
                  {t('onboarding.letsStart')}
                </Text>
              )}
            </Pressable>
          </Animated.View>
        ) : (
          <Pressable
            accessibilityLabel={t('common.next')}
            accessibilityRole='button'
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextText}>{t('common.next')}</Text>
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
    paddingBottom: 60,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 36,
    width: 20,
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
  strengthBar: {
    backgroundColor: colors.primary[600],
    borderRadius: 8,
    height: 32,
  },
  strengthContainer: {
    gap: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  strengthLabel: {
    color: '#57534e',
    fontSize: 13,
    fontWeight: '500',
  },
  strengthLabelActive: {
    color: colors.primary[700],
    fontWeight: '700',
  },
  strengthRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 17,
    lineHeight: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  templateEmoji: {
    fontSize: 22,
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
    backgroundColor: '#F0FDF4',
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

export function OnboardingScreen(props: OnboardingScreenProps) {
  return (
    <ScreenErrorBoundary screenName="Onboarding">
      <OnboardingScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
