import { ActivityIndicator, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface SubmitButtonProps {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled?: boolean;
  onPress: () => void;
}

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
