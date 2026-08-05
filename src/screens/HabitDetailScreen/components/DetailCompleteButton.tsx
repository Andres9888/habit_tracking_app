/**
 * DetailCompleteButton — the "Complete today" bar inside the hero.
 *
 * 'onBand' (the hero's tone, per the Habit Flow Prototype) is a filled green
 * block with cream ink: the single loudest thing on the screen. 'onSurface'
 * keeps the older outlined treatment for use on a cream card.
 *
 * Both tones animate rest → done, though the hero swaps in HeroCheckInCard once
 * today is logged, so the done state is mostly a safety net there.
 */
import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { durations } from '../../../theme/animations';
import { typography } from '../../../theme/typography';
import { withAlpha } from '../../../theme/colors';
import { useThemeColors } from '../../../theme';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { BAND_FG, useInsightPalette } from '../insightPalette';
import { useDetailCompleteButtonAnimation } from './DetailCompleteButton.hooks';
import { styles } from './DetailCompleteButton.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedText = Animated.createAnimatedComponent(Text);

interface DetailCompleteButtonProps {
  disabled?: boolean;
  isCompletedToday: boolean;
  /** 'onSurface' (default) sits on a cream card; 'onBand' on the hero wash. */
  tone?: 'onSurface' | 'onBand';
  onPress: () => void;
}

export function DetailCompleteButton({
  disabled = false,
  isCompletedToday,
  tone = 'onSurface',
  onPress,
}: DetailCompleteButtonProps) {
  const { colors } = useThemeColors();
  const palette = useInsightPalette();
  const reduceMotion = useReduceMotion();
  const onBand = tone === 'onBand';
  const green = onBand ? palette.ctaGreen : colors.primary[700];
  const { checkStyle, containerStyle, labelStyle, pressHandlers, wellStyle } =
    useDetailCompleteButtonAnimation(isCompletedToday, {
      doneBg: green,
      doneText: BAND_FG,
      restBg: onBand ? green : colors.card,
      restBorder: onBand ? green : colors.primary[600],
      restText: onBand ? BAND_FG : colors.primary[700],
      wellDoneBg: BAND_FG,
      wellRestBg: withAlpha(BAND_FG, 0),
      wellRestRing: withAlpha(onBand ? BAND_FG : colors.primary[600], 0.55),
    });

  const labelEnter = reduceMotion
    ? undefined
    : FadeIn.duration(durations.quick);
  const labelExit = reduceMotion
    ? undefined
    : FadeOut.duration(durations.quick);
  const label = isCompletedToday ? 'Done today' : 'Complete today';

  return (
    <AnimatedPressable
      accessibilityLabel={
        isCompletedToday ? 'Done today, tap to undo' : 'Complete today'
      }
      accessibilityRole='button'
      accessibilityState={{ checked: isCompletedToday }}
      className='flex-row items-center'
      disabled={disabled}
      style={[
        containerStyle,
        onBand ? styles.bandContainer : styles.container,
        { opacity: disabled ? 0.6 : 1 },
      ]}
      onPress={onPress}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      <Animated.View style={[styles.well, wellStyle]}>
        <Animated.View style={checkStyle}>
          <Check color={green} size={15} strokeWidth={3} />
        </Animated.View>
      </Animated.View>
      <AnimatedText
        key={isCompletedToday ? 'done' : 'pending'}
        entering={labelEnter}
        exiting={labelExit}
        maxFontSizeMultiplier={2}
        style={[
          typography.body,
          styles.label,
          labelStyle,
          onBand ? styles.bandLabel : null,
        ]}
      >
        {label}
      </AnimatedText>
      <View style={styles.wellBalance} />
    </AnimatedPressable>
  );
}
