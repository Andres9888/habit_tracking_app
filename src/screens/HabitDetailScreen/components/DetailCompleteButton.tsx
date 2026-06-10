/** DetailCompleteButton - Full-width complete-today toggle under the hero. */
import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { springs } from '../../../theme/animations';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { useThemeColors } from '../../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Button-only dimensions with no shared token equivalent. */
const INDICATOR_SIZE = 24;
const PRESS_SCALE = 0.98;

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
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const indicator = {
    alignItems: 'center' as const,
    borderRadius: borderRadius.full,
    height: INDICATOR_SIZE,
    justifyContent: 'center' as const,
    width: INDICATOR_SIZE,
    ...(isCompletedToday
      ? { backgroundColor: colors.text.inverse }
      : { borderColor: colors.text.inverse, borderWidth: 2, opacity: 0.7 }),
  };

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
      style={[
        animatedStyle,
        {
          backgroundColor: isCompletedToday
            ? colors.status.success
            : colors.text.primary,
          borderRadius: borderRadius.large,
          gap: spacing.sm + spacing.xs,
          marginHorizontal: spacing.base + spacing.xs,
          marginTop: spacing.base,
          opacity: disabled ? 0.6 : 1,
          paddingVertical: spacing.base - 2,
        },
      ]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(PRESS_SCALE, { duration: 80 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, springs.button);
      }}
    >
      <View style={indicator}>
        {isCompletedToday ? (
          <Check color={colors.status.success} size={15} strokeWidth={3.5} />
        ) : null}
      </View>
      <Text
        style={{
          ...typography.body,
          color: colors.text.inverse,
          fontWeight: fontWeights.semibold,
        }}
      >
        {isCompletedToday ? 'Completed Today' : 'Complete Today'}
      </Text>
    </AnimatedPressable>
  );
}
