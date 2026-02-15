import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface SubmitButtonProps {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled?: boolean;
  onPress: () => void;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SubmitButton({
  label,
  loadingLabel,
  isLoading,
  disabled = false,
  onPress,
  testID,
}: SubmitButtonProps) {
  const { colors } = useThemeColors();
  const isDisabled = isLoading || disabled;
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reduceMotion) {
      scale.value = withSpring(0.97, { damping: 18, stiffness: 240 });
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      scale.value = withSpring(1, { damping: 18, stiffness: 240 });
    }
  };

  return (
    <AnimatedPressable
      accessibilityHint='Double tap to submit this form'
      accessibilityLabel={isLoading ? loadingLabel : label}
      accessibilityRole='button'
      accessibilityState={{ busy: isLoading, disabled: isDisabled }}
      testID={testID}
      className={`mt-4 flex-row items-center justify-center rounded-2xl py-4 shadow-lg ${
        isDisabled ? 'opacity-40' : ''
      }`}
      disabled={isDisabled}
      style={[
        animatedStyle,
        {
          backgroundColor: colors.text.primary,
          shadowColor: colors.text.primary,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        },
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        className='text-[17px] font-semibold'
        style={{ color: colors.text.inverse }}
      >
        {isLoading ? loadingLabel : label}
      </Text>
      <View className='ml-2 w-5 items-center justify-center'>
        {isLoading ? (
          <ActivityIndicator color={colors.text.inverse} size='small' />
        ) : (
          <Text className='text-lg' style={{ color: colors.text.inverse }}>
            →
          </Text>
        )}
      </View>
    </AnimatedPressable>
  );
}
