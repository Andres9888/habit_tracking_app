/**
 * LibraryHero — compact library header: small serif title, one-line
 * subtitle, and search. Keeps templates visible above the fold.
 */

import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import { SearchBar } from '../SearchBar';
import type { LibraryHeroProps } from './LibraryHero.types';

const HERO_TITLE = 'Library';
const HERO_SUBTITLE = 'Start with one small habit.';

export function LibraryHero({
  onSearchChange,
  onSearchClear,
  searchQuery,
}: LibraryHeroProps) {
  const { colors } = useThemeColors();

  return (
    <View style={[s.hero, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInDown.delay(0).duration(240)}>
        <Text
          accessibilityRole='header'
          style={[s.title, { color: colors.text.primary }]}
        >
          {HERO_TITLE}
        </Text>
        <Text style={[s.subtitle, { color: colors.text.secondary }]}>
          {HERO_SUBTITLE}
        </Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(120).duration(280)}>
        <SearchBar
          inputHint='Find a habit'
          value={searchQuery}
          onChangeText={onSearchChange}
          onClear={onSearchClear}
        />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  hero: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
  },
  subtitle: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  title: {
    ...typography.heading1,
  },
});
