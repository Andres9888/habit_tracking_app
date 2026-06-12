/** DetailCompleteButton - Full-width complete-today toggle under the hero. */
import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { durations } from '../../../theme/animations';
import { fontWeights, typography } from '../../../theme/typography';
import { useThemeColors } from '../../../theme';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { useDetailCompleteButtonAnimation } from './DetailCompleteButton.hooks';
import { styles } from './DetailCompleteButton.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DetailCompleteButtonProps {
  disabled?: boolean;
  isCompletedToday: boolean;
  onPress: () => void;
}

export function DetailCompleteButton({
  disabled = false,
  isCompletedToday,
  onPress,
}: DetailCompleteButtonProps) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const {
    burstStyle,
    checkStyle,
    circleStyle,
    containerStyle,
    filledCircleStyle,
    pressHandlers,
  } = useDetailCompleteButtonAnimation(isCompletedToday, {
    primaryBg: colors.text.primary,
    successBg: colors.status.success,
  });

  const labelEnter = reduceMotion ? undefined : FadeIn.duration(durations.quick);
  const labelExit = reduceMotion ? undefined : FadeOut.duration(durations.quick);

  return (
    <AnimatedPressable
      accessibilityLabel={
        isCompletedToday
          ? 'Completed today, tap to undo'
          : 'Mark complete for today'
      }
      accessibilityRole='button'
      className='flex-row items-center justify-center'
      disabled={disabled}
      style={[containerStyle, styles.container, { opacity: disabled ? 0.6 : 1 }]}
      onPress={onPress}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      <View style={styles.indicatorWrap}>
        <Animated.View
          style={[burstStyle, styles.burstRing, { borderColor: colors.text.inverse }]}
        />
        <Animated.View
          style={[circleStyle, styles.ring, { borderColor: colors.text.inverse }]}
        />
        <Animated.View
          style={[
            filledCircleStyle,
            styles.filledCircle,
            { backgroundColor: colors.text.inverse },
          ]}
        >
          <Animated.View style={checkStyle}>
            <Check color={colors.status.success} size={15} strokeWidth={3.5} />
          </Animated.View>
        </Animated.View>
      </View>
      <Animated.Text
        key={isCompletedToday ? 'done' : 'pending'}
        entering={labelEnter}
        exiting={labelExit}
        style={{
          ...typography.body,
          color: colors.text.inverse,
          fontWeight: fontWeights.semibold,
        }}
      >
        {isCompletedToday ? 'Completed Today' : 'Complete Today'}
      </Animated.Text>
    </AnimatedPressable>
  );
}
