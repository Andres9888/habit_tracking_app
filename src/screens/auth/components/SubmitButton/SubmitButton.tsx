import { ActivityIndicator, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

/**
 * Props for the SubmitButton component
 */
interface SubmitButtonProps {
  /** Button text in normal state */
  label: string;
  /** Button text during loading state */
  loadingLabel: string;
  /** Whether the button is in loading state */
  isLoading: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Callback when button is pressed */
  onPress: () => void;
}

/**
 * SubmitButton - Primary action button with animations and loading state
 *
 * Features:
 * - Press animation with spring physics (scale 0.98)
 * - Loading state with ActivityIndicator
 * - Disabled state with 40% opacity
 * - Arrow icon in normal state
 * - Shadow when enabled
 * - Full accessibility support
 *
 * @example
 * <SubmitButton
 *   label="SIGN IN"
 *   loadingLabel="SIGNING IN..."
 *   isLoading={isLoading}
 *   disabled={!isValid}
 *   onPress={handleSubmit}
 * />
 */
export function SubmitButton({
  label,
  loadingLabel,
  isLoading,
  disabled = false,
  onPress,
}: SubmitButtonProps) {
  const isDisabled = isLoading || disabled;
  const scale = useSharedValue(1);

  // Press animation with gesture handler
  const gesture = Gesture.Tap()
    .enabled(!isDisabled)
    .onBegin(() => {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    })
    .onEnd(() => {
      onPress();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[animatedStyle]}
        className={`mt-4 rounded-3xl border border-slate-900 bg-slate-900 py-4 ${
          isDisabled ? 'opacity-40' : 'shadow-md shadow-slate-900/20'
        }`}
        accessible={true}
        accessibilityRole='button'
        accessibilityLabel={isLoading ? loadingLabel : label}
        accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      >
        <View className='flex-row items-center justify-center gap-2'>
          {isLoading ? (
            <>
              <ActivityIndicator size='small' color='#ffffff' />
              <Text className='text-[13px] font-bold tracking-[3px] text-white'>
                {loadingLabel}
              </Text>
            </>
          ) : (
            <>
              <Text className='text-[13px] font-bold tracking-[3px] text-white'>
                {label}
              </Text>
              <Text className='text-lg text-white'>→</Text>
            </>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
