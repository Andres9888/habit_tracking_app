/** Habit name + schedule subtitle + reminder cue for the hero header. */
import { Clock } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { iconSizes } from '../../../theme/iconSizes';
import { fontFamilies, fontWeights, typography } from '../../../theme/typography';
import { MAX_FONT_SIZE_MULTIPLIER_STRICT } from '../../../utils/accessibility/textScaling';

interface DetailHeroHeaderMetaProps {
  habitName: string;
  reminder?: string;
  subtitle?: string;
}

export function DetailHeroHeaderMeta({
  habitName,
  reminder,
  subtitle,
}: DetailHeroHeaderMetaProps) {
  const { colors } = useThemeColors();

  return (
    <View className='min-w-0 flex-1' style={{ paddingTop: 2 }}>
      <Text
        accessibilityLabel={`Habit: ${habitName}`}
        accessibilityRole='header'
        maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
        numberOfLines={2}
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 20,
          fontWeight: fontWeights.bold,
          letterSpacing: -0.4,
          lineHeight: 24,
        }}
      >
        {habitName}
      </Text>

      {subtitle ? (
        <Text
          maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
          numberOfLines={2}
          style={{
            ...typography.caption,
            color: colors.text.secondary,
            fontWeight: fontWeights.medium,
            marginTop: 3,
          }}
        >
          {subtitle}
        </Text>
      ) : null}

      {reminder ? (
        <View
          accessibilityLabel={reminder}
          className='flex-row items-center'
          style={{ gap: 5, marginTop: 6 }}
        >
          <Clock
            color={colors.text.tertiary}
            size={iconSizes.micro + 2}
            strokeWidth={2}
          />
          <Text
            maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
            numberOfLines={1}
            style={{
              color: colors.text.tertiary,
              fontSize: 12,
              fontWeight: fontWeights.semibold,
              letterSpacing: 0.12,
            }}
          >
            {reminder}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
