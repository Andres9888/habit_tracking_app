/**
 * LibraryHero — warm transformation-first header: gradient backdrop, sun,
 * serif title, search, and a one-line research trust mark. Compact so
 * goal cards stay above the fold.
 */

import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Sun } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { iconSizes } from '../../../../theme/iconSizes';
import { typography } from '../../../../theme/typography';
import { SearchBar } from '../SearchBar';
import { HeroBackdrop } from './components/HeroBackdrop';
import type { LibraryHeroProps } from './LibraryHero.types';

const HERO_TITLE = 'Choose your next transformation';
const HERO_SUBTITLE =
  'Pick an outcome, then start with one small habit that moves it forward.';
const TRUST_LINE = '🔬 Every habit in here is research-backed.';
const SUN_COLOR = 'rgb(251, 146, 60)';

export function LibraryHero({
  onSearchChange,
  onSearchClear,
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
      <Animated.View entering={FadeInDown.delay(180).duration(280)}>
        <SearchBar
          inputHint='Find an outcome or habit'
          value={searchQuery}
          onChangeText={onSearchChange}
          onClear={onSearchClear}
        />
        <Text style={[s.trust, { color: colors.text.secondary }]}>
          {TRUST_LINE}
        </Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  hero: {
    gap: spacing.md,
    overflow: 'hidden',
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    position: 'relative',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  subtitle: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
    maxWidth: 300,
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
  trust: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
});
