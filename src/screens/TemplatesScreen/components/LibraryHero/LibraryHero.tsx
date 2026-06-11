/**
 * LibraryHero — the Guide intake. Warm gradient header that opens with
 * a question ("What do you want to change?"), struggle chips as the
 * answer, and search as the escape hatch.
 */

import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Sun } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { iconSizes } from '../../../../theme/iconSizes';
import { typography } from '../../../../theme/typography';
import { ProblemChips } from '../ProblemChips';
import { SearchBar } from '../SearchBar';
import { HeroBackdrop } from './components/HeroBackdrop';
import type { LibraryHeroProps } from './LibraryHero.types';

const HERO_TITLE = 'What do you want to change?';
const HERO_SUBTITLE = 'Pick a struggle — we’ll give you a proven way in.';
const SUN_COLOR = 'rgb(251, 146, 60)';

export function LibraryHero({
  onSearchChange,
  onSearchClear,
  onSelectGoal,
  searchQuery,
}: LibraryHeroProps) {
  const { colors } = useThemeColors();

  return (
    <View style={s.hero}>
      <HeroBackdrop />
      <Animated.View
        entering={FadeInDown.delay(0).duration(240)}
        style={s.topRow}
      >
        <Sun color={SUN_COLOR} size={iconSizes.medium} strokeWidth={2.2} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(80).duration(280)}>
        <Text
          accessibilityRole='header'
          numberOfLines={2}
          style={[s.title, { color: colors.text.primary }]}
        >
          {HERO_TITLE}
        </Text>
        <Text style={[s.subtitle, { color: colors.text.secondary }]}>
          {HERO_SUBTITLE}
        </Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(160).duration(280)}>
        <ProblemChips onSelectGoal={onSelectGoal} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(240).duration(280)}>
        <SearchBar
          inputHint='Or search any habit…'
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
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    gap: spacing.md,
    overflow: 'hidden',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    position: 'relative',
  },
  subtitle: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },
  title: {
    ...typography.heading1,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minHeight: iconSizes.medium,
  },
});
