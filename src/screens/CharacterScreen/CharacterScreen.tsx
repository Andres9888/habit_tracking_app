import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useHabitData } from '../../features/habits/hooks/useHabitData';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { ScreenHeader } from '../../components/ScreenHeader';
import { CharacterScreenSkeleton } from '../../components/SkeletonLoader';
import { durations, enterEasing } from '../../theme/animations';
import { useThemeColors } from '../../theme/ThemeContext';
import { spacing } from '../../theme/spacing';
import {
  AchievementsSection,
  AttributesSection,
  CharacterCard,
  StatsSection,
} from './components';
import {
  buildCharacterData,
  buildDateRange,
  type HabitLike,
  type TrackingLike,
} from './characterData.helpers';
import type { CharacterScreenProps } from './types';

function CharacterScreenContent({ onBack }: CharacterScreenProps) {
  const dateRange = useMemo(() => buildDateRange(), []);
  const { habits, isHabitsLoading, tracking } = useHabitData(dateRange);
  const characterData = useMemo(
    () => buildCharacterData(habits as HabitLike[], tracking as TrackingLike[]),
    [habits, tracking]
  );
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();

  // Show the skeleton during the initial Convex fetch; otherwise buildCharacterData([])
  // flashes a fake level-1 "Getting Started" character before real data lands.
  if (isHabitsLoading) {
    return <CharacterScreenSkeleton reduceMotion={reduceMotion} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scroll}>
        <ScreenHeader title='Character' onBack={onBack} />
        <View style={styles.content}>
          <Animated.View
            entering={FadeInDown.delay(durations.enter + durations.stagger)
              .duration(durations.enter)
              .easing(enterEasing)}
          >
            <CharacterCard data={characterData} />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(durations.emphasis)
              .duration(durations.enter)
              .easing(enterEasing)}
          >
            <AttributesSection attributes={characterData.attributes} />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(durations.emphasis + durations.stagger)
              .duration(durations.enter)
              .easing(enterEasing)}
          >
            <StatsSection stats={characterData.stats} />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(
              durations.emphasis + 2 * durations.stagger
            )
              .duration(durations.enter)
              .easing(enterEasing)}
          >
            <AchievementsSection
              achievements={characterData.recentAchievements}
            />
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function CharacterScreen({ onBack }: CharacterScreenProps) {
  return (
    <ScreenErrorBoundary screenName='Character' onGoBack={onBack}>
      <CharacterScreenContent onBack={onBack} />
    </ScreenErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
  scroll: {
    flex: 1,
  },
});
