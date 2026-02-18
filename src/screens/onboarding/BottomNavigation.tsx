/**
 * BottomNavigation — CTA and Next buttons at the bottom of onboarding.
 */

import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { DotIndicators } from './DotIndicators';
import { styles } from './OnboardingScreen.styles';

interface BottomNavigationProps {
  currentIndex: number;
  isLastPage: boolean;
  isLoading: boolean;
  shouldReduceMotion: boolean | null;
  onComplete: () => Promise<void>;
  onNext: () => void;
}

export function BottomNavigation({
  currentIndex,
  isLastPage,
  isLoading,
  shouldReduceMotion,
  onComplete,
  onNext,
}: BottomNavigationProps) {
  return (
    <View style={styles.bottomContainer}>
      <DotIndicators currentIndex={currentIndex} />
      {isLastPage ? (
        <Animated.View
          entering={
            shouldReduceMotion ? undefined : FadeInDown.springify().damping(18)
          }
        >
          <Pressable
            accessibilityLabel='Get started building your first habit'
            accessibilityRole='button'
            disabled={isLoading}
            style={[styles.ctaButton, isLoading && styles.ctaButtonDisabled]}
            onPress={() => void onComplete()}
          >
            {isLoading ? (
              <ActivityIndicator color='#FFFFFF' />
            ) : (
              <Text style={styles.ctaText}>Let's Build Your First Habit →</Text>
            )}
          </Pressable>
        </Animated.View>
      ) : (
        <Pressable
          accessibilityLabel='Next onboarding page'
          accessibilityRole='button'
          style={styles.nextButton}
          onPress={onNext}
        >
          <Text style={styles.nextText}>Next</Text>
        </Pressable>
      )}
    </View>
  );
}
