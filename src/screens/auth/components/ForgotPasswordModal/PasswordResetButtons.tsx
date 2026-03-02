/** PasswordResetButtons - OPTIMIZED: Better shadows, press states */
import { ActivityIndicator, Text, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { springs } from '@/theme/animations';

interface PasswordResetButtonsProps {
  email: string;
  isLoading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PasswordResetButtons({
  email,
  isLoading,
  onSubmit,
  onCancel,
}: PasswordResetButtonsProps) {
  const isDisabled = isLoading || !email.trim();
  const scale = useSharedValue(1);
  const { colors } = useThemeColors();
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className='gap-3'>
      <AnimatedPressable
        accessibilityHint='Sends password reset instructions to your email'
        accessibilityLabel='Send reset email'
        accessibilityRole='button'
        accessibilityState={{ busy: isLoading, disabled: isDisabled }}
        className={`items-center rounded-2xl py-4 ${isDisabled ? 'opacity-40' : ''}`}
        disabled={isDisabled}
        style={[
          { backgroundColor: colors.gray[900] },
          animatedStyle,
          {
            shadowColor: '#1c1917',
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
          },
        ]}
        onPress={onSubmit}
        onPressIn={() => {
          scale.value = withSpring(0.97, springs.button);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, springs.button);
        }}
      >
        {isLoading ? (
          <ActivityIndicator color='#ffffff' size='small' />
        ) : (
          <Text className='text-[17px] font-semibold text-white'>
            Send reset email
          </Text>
        )}
      </AnimatedPressable>
      <Pressable
        accessibilityHint='Closes this dialog without sending reset email'
        accessibilityLabel='Cancel password reset'
        accessibilityRole='button'
        className='items-center rounded-2xl border py-4'
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
        disabled={isLoading}
        onPress={onCancel}
      >
        <Text className='text-[17px] font-semibold text-stone-700'>Cancel</Text>
      </Pressable>
    </View>
  );
}
