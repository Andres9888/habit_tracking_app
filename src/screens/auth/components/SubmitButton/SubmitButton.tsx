import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface SubmitButtonProps {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SubmitButton({
  label,
  loadingLabel,
  isLoading,
  disabled = false,
  onPress,
}: SubmitButtonProps) {
  const isDisabled = isLoading || disabled;
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reduceMotion) {
      scale.value = withSpring(0.97, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      scale.value = withSpring(1, { damping: 15 });
    }
  };

  return (
    <AnimatedPressable
      accessibilityLabel={isLoading ? loadingLabel : label}
      accessibilityRole='button'
      accessibilityState={{ busy: isLoading, disabled: isDisabled }}
      className={`mt-4 flex-row items-center justify-center rounded-[14px] border border-emerald-500 bg-emerald-500 py-4 shadow-lg shadow-emerald-500/20 ${
        isDisabled ? 'opacity-40' : ''
      }`}
      disabled={isDisabled}
      style={animatedStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text className='text-[15px] font-semibold tracking-[3px] text-white'>
        {isLoading ? loadingLabel : label}
      </Text>
      <View className='ml-2 w-5 items-center justify-center'>
        {isLoading ? (
          <ActivityIndicator color='#FFFFFF' size='small' />
        ) : (
          <Text className='text-white'>→</Text>
        )}
      </View>
    </AnimatedPressable>
  );
}
