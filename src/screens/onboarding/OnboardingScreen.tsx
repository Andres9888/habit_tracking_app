/* eslint-disable max-lines */
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors } from '../../theme/ThemeContext';
import { DotIndicators } from './DotIndicators';
import { styles } from './OnboardingScreen.styles';
import { PAGES, type PageData } from './onboarding.data';
import { useOnboardingHandlers } from './useOnboardingHandlers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STEP_CTA_LABELS = [
  'See the Science \u2192',
  'Browse Templates \u2192',
] as const;
interface OnboardingScreenProps {
  onComplete: () => void;
}

function OnboardingScreenContent({ onComplete }: OnboardingScreenProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const shouldReduceMotion = useReducedMotion();
  const {
    currentIndex,
    flatListRef,
    handleComplete,
    handleNext,
    handleSkip,
    isLastPage,
    isLoading,
    onViewableItemsChanged,
    viewabilityConfig,
  } = useOnboardingHandlers(onComplete);

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
          style={[styles.title, { color: colors.primary[700] }]}
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
    [colors, shouldReduceMotion]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          <Text style={[styles.skipText, { color: colors.text.secondary }]}>
            I'll explore later
          </Text>
        </Pressable>
      </Animated.View>
      <FlatList
        ref={flatListRef}
        bounces={false}
        data={PAGES}
        getItemLayout={(_, index) => ({
          index,
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
        })}
        horizontal
        keyExtractor={(item) => item.id}
        pagingEnabled
        renderItem={renderPage}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      <View style={styles.bottomContainer}>
        <DotIndicators currentIndex={currentIndex} />
        {isLastPage ? (
          <Animated.View
            entering={
              shouldReduceMotion ? undefined : FadeInUp.springify().damping(18)
            }
          >
            <Pressable
              accessibilityLabel='Get started building your first habit'
              accessibilityRole='button'
              disabled={isLoading}
              style={[
                styles.actionButton,
                { backgroundColor: colors.primary[600] },
                isLoading && styles.ctaButtonDisabled,
              ]}
              onPress={() => {
                void handleComplete();
              }}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.text.inverse} />
              ) : (
                <Text
                  style={[styles.actionText, { color: colors.text.inverse }]}
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
              styles.actionButton,
              { backgroundColor: colors.primary[600] },
            ]}
            onPress={handleNext}
          >
            <Text style={[styles.actionText, { color: colors.text.inverse }]}>
              {STEP_CTA_LABELS[currentIndex] ?? 'Next'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function OnboardingScreen(props: OnboardingScreenProps) {
  return (
    <ScreenErrorBoundary screenName='Onboarding'>
      <OnboardingScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
