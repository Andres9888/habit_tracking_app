/**
 * LibraryHero — the Guide intake. Warm gradient header that opens with
 * a question, struggle chips as the answer, and search as the escape hatch.
 */

import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import { ProblemChips } from '../ProblemChips';
import { SearchBar } from '../SearchBar';
import { HeroBackdrop } from './components/HeroBackdrop';
import type { LibraryHeroProps } from './LibraryHero.types';

const DEFAULT_TITLE = 'What do you want to change?';
const DEFAULT_SUBTITLE = 'Pick a struggle — we’ll give you a proven way in.';

export function LibraryHero({
  heroSubtitle,
  heroTitle,
  importedStepCounts,
  isCompressed = false,
  onSearchChange,
  onSearchClear,
  onSelectGoal,
  searchQuery,
  selectedGoalId,
}: LibraryHeroProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const title = heroTitle ?? DEFAULT_TITLE;
  const subtitle = heroSubtitle ?? DEFAULT_SUBTITLE;

  return (
    <View style={[s.hero, { paddingTop: insets.top + spacing.md }]}>
      <HeroBackdrop />
      <Animated.View entering={FadeInDown.delay(80).duration(280)}>
        <Text
          accessibilityRole='header'
          numberOfLines={2}
          style={[s.title, { color: colors.text.primary }]}
        >
          {title}
        </Text>
        {isCompressed ? null : (
          <Animated.Text
            entering={FadeInDown.duration(200)}
            exiting={FadeOut.duration(160)}
            style={[s.subtitle, { color: colors.text.secondary }]}
          >
            {subtitle}
          </Animated.Text>
        )}
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(160).duration(280)}>
        <ProblemChips
          importedStepCounts={importedStepCounts}
          selectedGoalId={selectedGoalId}
          onSelectGoal={onSelectGoal}
        />
      </Animated.View>
      {isCompressed ? null : (
        <Animated.View
          entering={FadeInDown.delay(240).duration(280)}
          exiting={FadeOut.duration(160)}
        >
          <SearchBar
            inputHint='Or search any habit…'
            value={searchQuery}
            onChangeText={onSearchChange}
            onClear={onSearchClear}
          />
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  hero: {
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    gap: spacing.md,
    overflow: 'hidden',
    paddingBottom: 0,
    paddingHorizontal: spacing.base,
    position: 'relative',
  },
  subtitle: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
    paddingRight: spacing['2xl'],
  },
  title: {
    ...typography.heading1,
    fontSize: 26,
    lineHeight: 33,
    paddingRight: spacing['2xl'],
  },
});
