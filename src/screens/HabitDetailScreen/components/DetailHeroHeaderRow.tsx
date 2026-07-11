/** DetailHeroHeaderRow — centered stack (icon above serif name) atop the hero
 *  card, matching the poster read of the streak centerpiece below it. Total
 *  lives in the encouragement line (DetailHeroMomentum). */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../theme/typography';
import { MAX_FONT_SIZE_MULTIPLIER_STRICT } from '../../../utils/accessibility/textScaling';
import type { Habit } from '../HabitDetailScreen.types';
import { getHabitDisplayName } from './DetailHero.utils';
import { DetailHeroIcon } from './DetailHeroIcon';

interface DetailHeroHeaderRowProps {
  habit: Habit;
  isCompletedToday: boolean;
}

export function DetailHeroHeaderRow({
  habit,
  isCompletedToday,
}: DetailHeroHeaderRowProps) {
  const { colors } = useThemeColors();
  const habitName = getHabitDisplayName(habit);

  return (
    <View
      className='items-center'
      style={{
        gap: spacing.sm,
        paddingBottom: spacing.sm,
        paddingHorizontal: spacing.base,
        paddingTop: spacing.base,
      }}
    >
      {habit.icon ? (
        <DetailHeroIcon
          color={habit.color ?? habit.iconColor}
          icon={habit.icon}
          isCompletedToday={isCompletedToday}
        />
      ) : null}

      <Text
        accessibilityLabel={`Habit: ${habitName}`}
        accessibilityRole='header'
        maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
        numberOfLines={1}
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 19,
          fontWeight: fontWeights.bold,
          letterSpacing: -0.2,
          textAlign: 'center',
        }}
      >
        {habitName}
      </Text>
    </View>
  );
}
