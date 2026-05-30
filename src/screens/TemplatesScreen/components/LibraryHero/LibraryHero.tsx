import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Sun } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { iconSizes } from '../../../../theme/iconSizes';
import { SearchBar } from '../SearchBar';
import { SessionProgressPill } from '../SessionProgressPill';
import { HeroBackdrop } from './components/HeroBackdrop';
import { HeroCopy } from './components/HeroCopy';
import type { LibraryHeroProps } from './LibraryHero.types';

const HERO_TITLE = 'Choose your next transformation';
const HERO_SUBTITLE =
  'Pick an outcome, then start with one small habit that moves it forward.';
const SUN_COLOR = 'rgb(251, 146, 60)';

export function LibraryHero({
  onSearchChange,
  onSearchClear,
  searchQuery,
  sessionImportCount,
}: LibraryHeroProps) {
  const { colors } = useThemeColors();

  return (
    <View style={[s.hero, { backgroundColor: colors.background }]}>
      <HeroBackdrop />
      <Animated.View entering={FadeInDown.delay(0).duration(240)} style={s.topRow}>
        <Sun color={SUN_COLOR} size={iconSizes.medium} strokeWidth={2.2} />
        {sessionImportCount > 0 ? <SessionProgressPill count={sessionImportCount} /> : null}
      </Animated.View>
      <HeroCopy subtitle={HERO_SUBTITLE} title={HERO_TITLE} />
      <Animated.View entering={FadeInDown.delay(240).duration(280)}>
        <SearchBar
          inputHint='Find an outcome or habit'
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
    overflow: 'hidden',
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
    position: 'relative',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: iconSizes.large,
  },
});
