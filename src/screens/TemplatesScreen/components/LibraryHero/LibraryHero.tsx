/**
 * LibraryHero — the Guide intake. Warm gradient header that opens with
 * a question, struggle chips as the answer, and search as the escape hatch.
 */

import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { ProblemChips } from '../ProblemChips';
import { SearchBar } from '../SearchBar';
import { useLibraryHeroAnimations } from './LibraryHero.animations';
import { libraryHeroStyles as s } from './LibraryHero.styles';
import { HeroBackdrop } from './components/HeroBackdrop';
import type { LibraryHeroProps } from './LibraryHero.types';

const DEFAULT_TITLE = 'What do you want to change?';
const DEFAULT_SUBTITLE = "Pick a struggle — we'll give you a proven way in.";

export function LibraryHero({
  heroSubtitle,
  heroTitle,
  isCompressed = false,
  onSearchChange,
  onSearchClear,
  onSelectGoal,
  searchQuery,
  selectedGoalId,
}: LibraryHeroProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const animations = useLibraryHeroAnimations();
  const title = heroTitle ?? DEFAULT_TITLE;
  const subtitle = heroSubtitle ?? DEFAULT_SUBTITLE;

  return (
    <View style={[s.hero, { paddingTop: insets.top + spacing.md }]}>
      <HeroBackdrop />
      <Animated.View entering={animations.titleEnter} layout={animations.layout}>
        <Text
          accessibilityRole='header'
          numberOfLines={2}
          style={[s.title, { color: colors.text.primary }]}
        >
          {title}
        </Text>
        {isCompressed ? null : (
          <Animated.Text
            entering={animations.subtitleEnter}
            exiting={animations.subtitleExit}
            layout={animations.layout}
            style={[s.subtitle, { color: colors.text.secondary }]}
          >
            {subtitle}
          </Animated.Text>
        )}
      </Animated.View>
      <Animated.View entering={animations.chipsEnter} layout={animations.layout}>
        <ProblemChips
          selectedGoalId={selectedGoalId}
          onSelectGoal={onSelectGoal}
        />
      </Animated.View>
      {isCompressed ? null : (
        <Animated.View
          entering={animations.searchEnter}
          exiting={animations.searchExit}
          layout={animations.layout}
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
