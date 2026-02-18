/**
 * Onboarding Screen — 3-screen carousel shown once after first sign-up.
 * Sets AsyncStorage flag to prevent re-showing.
 */

import { useCallback } from 'react';
import { Dimensions, FlatList, Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme/ThemeContext';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { BottomNavigation } from './BottomNavigation';
import { styles } from './OnboardingScreen.styles';
import { visualStyles as vs } from './onboarding.visuals.styles';
import { PAGES } from './onboarding.data';
import { useOnboardingHandlers } from './useOnboardingHandlers';
import type { PageData } from './onboarding.data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function OnboardingScreenContent({ onComplete }: { onComplete: () => void }) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const shouldReduceMotion = useReducedMotion();
  const h = useOnboardingHandlers(onComplete);

  const renderPage = useCallback(
    ({ item }: { item: PageData }) => (
      <View style={[styles.page, { width: SCREEN_WIDTH }]}>
        <View style={vs.visualContainer}>
          <item.Visual reduceMotion={!!shouldReduceMotion} />
        </View>
        <Animated.Text
          entering={
            shouldReduceMotion
              ? undefined
              : FadeInUp.delay(200).springify().damping(18)
          }
          style={vs.title}
        >
          {item.title}
        </Animated.Text>
        <Animated.Text
          entering={
            shouldReduceMotion
              ? undefined
              : FadeInUp.delay(350).springify().damping(18)
          }
          style={vs.subtitle}
        >
          {item.subtitle}
        </Animated.Text>
      </View>
    ),
    [shouldReduceMotion]
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
          onPress={h.handleSkip}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </Animated.View>

      <FlatList
        ref={h.flatListRef}
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
        viewabilityConfig={h.viewabilityConfig}
        onViewableItemsChanged={h.onViewableItemsChanged}
      />

      <BottomNavigation
        currentIndex={h.currentIndex}
        isLastPage={h.isLastPage}
        isLoading={h.isLoading}
        shouldReduceMotion={shouldReduceMotion}
        onComplete={h.handleComplete}
        onNext={h.handleNext}
      />
    </View>
  );
}

export { ONBOARDING_KEY } from './onboarding.data';

export function OnboardingScreen(props: { onComplete: () => void }) {
  return (
    <ScreenErrorBoundary screenName='Onboarding'>
      <OnboardingScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
